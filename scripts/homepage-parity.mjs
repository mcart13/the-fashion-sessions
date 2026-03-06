import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");

const LIVE_URL = process.env.LIVE_URL || "https://thefashionsessions.com/";
const LOCAL_URL = process.env.LOCAL_URL || "http://localhost:3101/";
const OUTPUT_DIR =
  process.env.PARITY_OUTPUT_DIR ||
  "/tmp/the-fashion-sessions-homepage-parity";

const VIEWPORT = { width: 1440, height: 900 };

const NORMALIZE_STYLE = `
  *, *::before, *::after {
    animation: none !important;
    transition: none !important;
    scroll-behavior: auto !important;
    caret-color: transparent !important;
  }
  html { scroll-behavior: auto !important; }
`;

const MASK_STYLE = `
  .shopthepost-widget,
  .ltkwidget-version-two,
  [id^="ltkwidget-version-two"],
  [class*="elfsight-app-"],
  .rs-adblock,
  iframe[src*="amazon-adsystem"],
  iframe[src*="rewardstyle"],
  script + .shopthepost-widget,
  .jet-popup,
  .jet-popup *[data-elfsight-app-lazy] {
    visibility: hidden !important;
  }
`;

const SECTION_CONFIG = {
  header: {
    clip: {
      x: 0,
      y: 0,
      width: VIEWPORT.width,
      height: 132,
    },
  },
  hero: {
    live: (page) =>
      page
        .getByText("WELCOME TO THE FASHION SESSIONS.", { exact: true })
        .first()
        .locator("xpath=ancestor::section[1]"),
    local: (page) =>
      page
        .getByText("WELCOME TO THE FASHION SESSIONS.", { exact: true })
        .first()
        .locator("xpath=ancestor::section[1]"),
  },
  quote: {
    anchorClip: {
      live: (page) =>
        page.getByText("FASHION RULES DON'T EXIST IN MY WORLD.", { exact: true }).last(),
      local: (page) =>
        page.getByText("FASHION RULES DON'T EXIST IN MY WORLD.", { exact: true }).first(),
      topPadding: 48,
      bottomPadding: 120,
    },
  },
  shop: {
    anchorClip: {
      live: (page) => page.getByText("shop my favorites", { exact: true }).last(),
      local: (page) => page.getByText("shop my favorites", { exact: true }).first(),
      topPadding: 56,
      bottomPadding: 240,
    },
  },
  posts: {
    live: (page) => page.locator("#home-posts").first(),
    local: (page) =>
      page
        .getByRole("heading", {
          name: "Time for a Fall Bra Refresh with Soma",
          exact: true,
        })
        .first()
        .locator("xpath=ancestor::section[1]"),
  },
  sidebar: {
    live: (page) =>
      page.getByText("Hi!", { exact: true }).first().locator(
        "xpath=ancestor::div[contains(@class,'elementor-column')][1]",
      ),
    local: (page) => page.locator("aside").first(),
  },
  newsletter: {
    anchorClip: {
      live: (page) =>
        page
          .getByText(
            "Sign up to receive my newsletter, and be the first to receive subscriber-only offers!",
            { exact: true },
          )
          .last(),
      local: (page) =>
        page
          .getByText(
            "Sign up to receive my newsletter, and be the first to receive subscriber-only offers!",
            { exact: true },
          )
          .first(),
      topPadding: 64,
      bottomPadding: 220,
    },
  },
  footer: {
    live: (page) => page.locator(".elementor-location-footer").first(),
    local: (page) => page.locator("footer").first(),
  },
};

const STYLE_PROBES = {
  header: [
    {
      name: "logo",
      live: (page) => page.locator("header img").first(),
      local: (page) => page.locator("header img").first(),
    },
    {
      name: "nav-home",
      live: (page) => page.getByRole("link", { name: "Home" }).first(),
      local: (page) => page.getByRole("link", { name: "Home" }).first(),
    },
  ],
  hero: [
    {
      name: "title",
      live: (page) =>
        page.getByText("WELCOME TO THE FASHION SESSIONS.", { exact: true }).first(),
      local: (page) =>
        page.getByText("WELCOME TO THE FASHION SESSIONS.", { exact: true }).first(),
    },
    {
      name: "button",
      live: (page) => page.getByRole("link", { name: "Learn More" }).first(),
      local: (page) => page.getByRole("link", { name: "Learn More" }).first(),
    },
  ],
  quote: [
    {
      name: "title",
      live: (page) =>
        page.getByText("FASHION RULES DON'T EXIST IN MY WORLD.", { exact: true }).first(),
      local: (page) =>
        page.getByText("FASHION RULES DON'T EXIST IN MY WORLD.", { exact: true }).first(),
    },
  ],
  shop: [
    {
      name: "title",
      live: (page) => page.getByText("shop my favorites", { exact: true }).first(),
      local: (page) => page.getByText("shop my favorites", { exact: true }).first(),
    },
  ],
  posts: [
    {
      name: "first-title",
      live: (page) =>
        page.getByRole("link", { name: "Time for a Fall Bra Refresh with Soma" }).first(),
      local: (page) =>
        page.getByRole("link", { name: "Time for a Fall Bra Refresh with Soma" }).first(),
    },
    {
      name: "first-excerpt",
      live: (page) =>
        page
          .getByText("Refresh your top drawer for fall with Soma!", { exact: true })
          .first(),
      local: (page) =>
        page
          .getByText("This post was sponsored by Soma, but all opinions are my own.", {
            exact: false,
          })
          .first(),
    },
  ],
  sidebar: [
    {
      name: "hi-heading",
      live: (page) => page.getByText("Hi!", { exact: true }).first(),
      local: (page) => page.getByText("Hi!", { exact: true }).first(),
    },
    {
      name: "trending-heading",
      live: (page) => page.getByText("trending posts", { exact: true }).first(),
      local: (page) => page.getByText("trending posts", { exact: true }).first(),
    },
  ],
  newsletter: [
    {
      name: "title",
      live: (page) =>
        page
          .getByText(
            "Sign up to receive my newsletter, and be the first to receive subscriber-only offers!",
            { exact: true },
          )
          .first(),
      local: (page) =>
        page
          .getByText(
            "Sign up to receive my newsletter, and be the first to receive subscriber-only offers!",
            { exact: true },
          )
          .first(),
    },
  ],
  footer: [
    {
      name: "follow-along",
      live: (page) => page.getByText("follow along!", { exact: true }).first(),
      local: (page) => page.getByText("follow along!", { exact: true }).first(),
    },
    {
      name: "shops",
      live: (page) => page.getByRole("heading", { name: "Shops" }).last(),
      local: (page) => page.getByRole("heading", { name: "Shops" }).last(),
    },
  ],
};

function safeFileName(value) {
  return value.replace(/[^a-z0-9-]+/gi, "-").toLowerCase();
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function closePopupIfPresent(page) {
  await page.waitForTimeout(2200);
  const selectors = [
    'button[aria-label="Close"]',
    ".jet-popup__close-button",
    ".dialog-close-button",
    ".elementor-icon-close",
  ];

  for (const selector of selectors) {
    const locator = page.locator(selector).first();
    if (await locator.isVisible().catch(() => false)) {
      await locator.click({ force: true }).catch(() => {});
      break;
    }
  }

  await page.keyboard.press("Escape").catch(() => {});
  await page.waitForTimeout(300);
}

async function preparePage(page, url) {
  console.log(`Preparing ${url}`);
  await page.setViewportSize(VIEWPORT);
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(2500);
  await page.addStyleTag({ content: NORMALIZE_STYLE });
  await closePopupIfPresent(page);
  await page.addStyleTag({ content: MASK_STYLE });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(250);
}

async function captureFullPage(page, siteName, variant, outDir) {
  const filePath = path.join(outDir, `${siteName}-homepage-${variant}.png`);
  await page.screenshot({ fullPage: true, path: filePath, type: "png" });
  return filePath;
}

async function captureSection(page, locator, filePath) {
  const target = locator;
  await target.waitFor({ state: "visible", timeout: 10000 });
  await target.scrollIntoViewIfNeeded().catch(() => {});
  await page.waitForTimeout(150);
  const box = await target.boundingBox();

  if (!box) {
    throw new Error(`Unable to capture section for ${filePath}`);
  }

  await page.screenshot({
    path: filePath,
    type: "png",
    clip: {
      x: Math.max(0, box.x),
      y: Math.max(0, box.y),
      width: Math.max(1, box.width),
      height: Math.max(1, box.height),
    },
  });
}

async function captureClip(page, clip, filePath) {
  await page.screenshot({
    path: filePath,
    type: "png",
    clip,
  });
}

async function captureAnchorClip(page, locator, options, filePath) {
  const target = locator.first();
  await target.waitFor({ state: "visible", timeout: 10000 });
  await target.scrollIntoViewIfNeeded().catch(() => {});
  await page.waitForTimeout(150);
  const box = await target.boundingBox();

  if (!box) {
    throw new Error(`Unable to capture anchor section for ${filePath}`);
  }

  const y = Math.max(0, box.y - options.topPadding);
  const height = Math.max(1, box.height + options.topPadding + options.bottomPadding);

  await page.screenshot({
    path: filePath,
    type: "png",
    clip: {
      x: 0,
      y,
      width: VIEWPORT.width,
      height,
    },
  });
}

async function getStyleSnapshot(locator) {
  const handle = await locator.first().elementHandle({ timeout: 5000 });

  if (!handle) {
    throw new Error("Style probe target not found");
  }

  return handle.evaluate((element) => {
    const computed = window.getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    return {
      rect: {
        width: Number(rect.width.toFixed(2)),
        height: Number(rect.height.toFixed(2)),
        top: Number(rect.top.toFixed(2)),
        left: Number(rect.left.toFixed(2)),
      },
      styles: {
        fontFamily: computed.fontFamily,
        fontSize: computed.fontSize,
        fontWeight: computed.fontWeight,
        lineHeight: computed.lineHeight,
        letterSpacing: computed.letterSpacing,
        paddingTop: computed.paddingTop,
        paddingRight: computed.paddingRight,
        paddingBottom: computed.paddingBottom,
        paddingLeft: computed.paddingLeft,
        marginTop: computed.marginTop,
        marginBottom: computed.marginBottom,
      },
    };
  });
}

async function comparePngs(livePath, localPath, diffPath) {
  const [liveBuffer, localBuffer] = await Promise.all([
    fs.readFile(livePath),
    fs.readFile(localPath),
  ]);

  const livePng = PNG.sync.read(liveBuffer);
  const localPng = PNG.sync.read(localBuffer);
  const width = Math.min(livePng.width, localPng.width);
  const height = Math.min(livePng.height, localPng.height);

  const liveCrop = new PNG({ width, height });
  const localCrop = new PNG({ width, height });
  PNG.bitblt(livePng, liveCrop, 0, 0, width, height, 0, 0);
  PNG.bitblt(localPng, localCrop, 0, 0, width, height, 0, 0);

  const diff = new PNG({ width, height });
  const diffPixels = pixelmatch(
    liveCrop.data,
    localCrop.data,
    diff.data,
    width,
    height,
    { threshold: 0.12 },
  );

  await fs.writeFile(diffPath, PNG.sync.write(diff));

  return {
    width,
    height,
    liveSize: { width: livePng.width, height: livePng.height },
    localSize: { width: localPng.width, height: localPng.height },
    diffPixels,
    diffRatio: Number((diffPixels / (width * height)).toFixed(4)),
  };
}

async function buildReport(pageLive, pageLocal, outDir) {
  const sections = {};

  for (const [name, config] of Object.entries(SECTION_CONFIG)) {
    console.log(`Capturing section: ${name}`);
    const livePath = path.join(outDir, `live-section-${safeFileName(name)}.png`);
    const localPath = path.join(outDir, `local-section-${safeFileName(name)}.png`);
    const diffPath = path.join(outDir, `diff-section-${safeFileName(name)}.png`);

    try {
      if (config.clip) {
        await captureClip(pageLive, config.clip, livePath);
        await captureClip(pageLocal, config.clip, localPath);
      } else if (config.anchorClip) {
        await captureAnchorClip(pageLive, config.anchorClip.live(pageLive), config.anchorClip, livePath);
        await captureAnchorClip(pageLocal, config.anchorClip.local(pageLocal), config.anchorClip, localPath);
      } else {
        const liveLocator = config.live(pageLive);
        const localLocator = config.local(pageLocal);
        await captureSection(pageLive, liveLocator, livePath);
        await captureSection(pageLocal, localLocator, localPath);
      }

      const metrics = await comparePngs(livePath, localPath, diffPath);
      const probes = [];

      for (const probe of STYLE_PROBES[name] || []) {
        console.log(`  Probe: ${name}/${probe.name}`);
        try {
          const liveProbe = await getStyleSnapshot(probe.live(pageLive));
          const localProbe = await getStyleSnapshot(probe.local(pageLocal));
          probes.push({
            name: probe.name,
            live: liveProbe,
            local: localProbe,
          });
        } catch (error) {
          probes.push({
            name: probe.name,
            error: error instanceof Error ? error.message : String(error),
          });
        }
      }

      sections[name] = {
        screenshots: {
          live: livePath,
          local: localPath,
          diff: diffPath,
        },
        metrics,
        probes,
      };
    } catch (error) {
      sections[name] = {
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  return sections;
}

async function main() {
  await ensureDir(OUTPUT_DIR);
  console.log(`Writing homepage parity outputs to ${OUTPUT_DIR}`);

  const browser = await chromium.launch({ headless: true });
  const livePage = await browser.newPage();
  const localPage = await browser.newPage();

  await preparePage(livePage, LIVE_URL);
  await preparePage(localPage, LOCAL_URL);

  const summary = {
    generatedAt: new Date().toISOString(),
    liveUrl: LIVE_URL,
    localUrl: LOCAL_URL,
    viewport: VIEWPORT,
    fullPage: {
      live: await captureFullPage(livePage, "live", "masked", OUTPUT_DIR),
      local: await captureFullPage(localPage, "local", "masked", OUTPUT_DIR),
    },
    sections: await buildReport(livePage, localPage, OUTPUT_DIR),
  };

  const reportPath = path.join(OUTPUT_DIR, "homepage-parity-report.json");
  await fs.writeFile(reportPath, JSON.stringify(summary, null, 2));

  console.log(`Homepage parity report written to ${reportPath}`);

  for (const [name, section] of Object.entries(summary.sections)) {
    if (section.metrics) {
      console.log(
        `${name}: diffRatio=${section.metrics.diffRatio} live=${section.metrics.liveSize.width}x${section.metrics.liveSize.height} local=${section.metrics.localSize.width}x${section.metrics.localSize.height}`,
      );
    } else {
      console.log(`${name}: error=${section.error}`);
    }
  }

  await browser.close();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
