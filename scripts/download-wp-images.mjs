#!/usr/bin/env node
/**
 * Downloads all remote WordPress images referenced in site-content.json
 * to public/images/wp-uploads/, preserving the uploads/ subdirectory structure.
 * Then rewrites all URLs in site-content.json to local paths.
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DATA_FILE = path.join(ROOT, 'data', 'site-content.json');
const OUTPUT_DIR = path.join(ROOT, 'public', 'images', 'wp-uploads');

const WP_PREFIX = 'https://thefashionsessions.com/wp-content/uploads/';
const LOCAL_PREFIX = '/images/wp-uploads/';

// Extract all unique URLs from the entire JSON
function extractUrls(jsonStr) {
  const regex = /https?:\/\/thefashionsessions\.com\/wp-content\/uploads\/[^\s"'<>)\\]+/g;
  const matches = jsonStr.match(regex) || [];
  return [...new Set(matches)];
}

// Download a single file with retry
function downloadFile(url, destPath, retries = 3) {
  return new Promise((resolve, reject) => {
    const dir = path.dirname(destPath);
    fs.mkdirSync(dir, { recursive: true });

    // Skip if already downloaded
    if (fs.existsSync(destPath) && fs.statSync(destPath).size > 0) {
      resolve('skipped');
      return;
    }

    const protocol = url.startsWith('https') ? https : http;
    const doRequest = (attempt) => {
      protocol.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          // Follow redirect
          downloadFile(res.headers.location, destPath, retries).then(resolve).catch(reject);
          return;
        }
        if (res.statusCode !== 200) {
          if (attempt < retries) {
            setTimeout(() => doRequest(attempt + 1), 1000 * attempt);
            return;
          }
          reject(new Error(`HTTP ${res.statusCode} for ${url}`));
          return;
        }
        const stream = fs.createWriteStream(destPath);
        res.pipe(stream);
        stream.on('finish', () => { stream.close(); resolve('downloaded'); });
        stream.on('error', (err) => { fs.unlinkSync(destPath); reject(err); });
      }).on('error', (err) => {
        if (attempt < retries) {
          setTimeout(() => doRequest(attempt + 1), 1000 * attempt);
        } else {
          reject(err);
        }
      });
    };
    doRequest(1);
  });
}

async function main() {
  console.log('Reading site-content.json...');
  let jsonStr = fs.readFileSync(DATA_FILE, 'utf8');
  const urls = extractUrls(jsonStr);
  console.log(`Found ${urls.length} unique image URLs to download.`);

  // Download in batches of 10 concurrent
  const BATCH_SIZE = 10;
  let downloaded = 0;
  let skipped = 0;
  let failed = 0;
  const failures = [];

  for (let i = 0; i < urls.length; i += BATCH_SIZE) {
    const batch = urls.slice(i, i + BATCH_SIZE);
    const results = await Promise.allSettled(
      batch.map(url => {
        const relativePath = url.replace(/https?:\/\/thefashionsessions\.com\/wp-content\/uploads\//, '');
        const destPath = path.join(OUTPUT_DIR, relativePath);
        return downloadFile(url, destPath);
      })
    );

    results.forEach((r, idx) => {
      if (r.status === 'fulfilled') {
        if (r.value === 'skipped') skipped++;
        else downloaded++;
      } else {
        failed++;
        failures.push({ url: batch[idx], error: r.reason.message });
      }
    });

    // Progress
    const total = downloaded + skipped + failed;
    if (total % 50 === 0 || i + BATCH_SIZE >= urls.length) {
      console.log(`Progress: ${total}/${urls.length} (${downloaded} downloaded, ${skipped} skipped, ${failed} failed)`);
    }
  }

  console.log(`\nDownload complete: ${downloaded} downloaded, ${skipped} skipped, ${failed} failed`);
  if (failures.length > 0) {
    console.log('\nFailed URLs:');
    failures.forEach(f => console.log(`  ${f.url}: ${f.error}`));
  }

  // Rewrite all URLs in site-content.json
  console.log('\nRewriting URLs in site-content.json...');

  // Replace all occurrences of the WP uploads URL with local path
  // Handle both http and https variants
  jsonStr = jsonStr.replace(/https?:\/\/thefashionsessions\.com\/wp-content\/uploads\//g, LOCAL_PREFIX);

  fs.writeFileSync(DATA_FILE, jsonStr, 'utf8');
  console.log('Done! All image URLs have been rewritten to local paths.');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
