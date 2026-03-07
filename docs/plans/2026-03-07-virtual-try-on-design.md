# Virtual Try-On Feature Design

## Overview

A new `/try-on` page for The Fashion Sessions that lets visitors virtually try on Tracy's curated accessories (via live camera AR) and clothing (via AI-powered photo generation). Free for users; generation cost absorbed by the site.

## Page Structure

- **Route:** `/try-on`
- **Nav:** "Try On" link added to the site Header
- **Hero:** Cream background, Butler font heading, short description. Matches existing site style.
- **Tabs:** Two-tab interface below the hero: **Accessories** | **Clothing**
- **Design language:** Same fonts (Butler headings, Poppins body), colors (cream, tan, #282828 text, #EADFD2 buttons), and AnimateOnScroll treatment as the rest of the site.

## Accessories Tab (AR Camera)

### User Flow

1. User sees a grid of curated accessories (sunglasses, hats, jewelry) with thumbnails
2. User taps one to select it
3. Camera activates in a viewfinder area (browser requests camera permission)
4. Selected accessory overlays on their face in real-time via face landmark detection
5. "Capture" button saves a screenshot the user can download/share

### Tech

- **MediaPipe Face Mesh** - runs entirely in-browser, zero API cost
- Works on desktop webcam and mobile front camera
- Accessories are transparent PNGs positioned based on face landmarks (e.g., sunglasses anchor to eye positions, hats to forehead)

### Data

Each accessory has: name, thumbnail, overlay image (transparent PNG), category, and anchor point config (which face landmarks to attach to, scale, offset).

### Scope

Start with 3-5 items (sunglasses/hats) to prove the concept. Overlay PNGs need to be manually created or sourced.

## Clothing Tab (AI Try-On via Fashn.ai)

### User Flow

1. User sees a grid of curated clothing items (tops, dresses, outfits) with product photos
2. User selects an item
3. User uploads a full-body photo (drag-and-drop or file picker)
4. Validation: checks image size/format, shows preview
5. "Try It On" button fires the request. Loading indicator (~10-15 seconds)
6. Result image appears side-by-side with their original photo
7. User can download the result or try another item

### Tech

- **Next.js API route** at `/api/try-on` proxies the Fashn.ai call (API key stays server-side)
- **Fashn.ai VTON v1.6** endpoint: person image + garment image -> composited result
- Garment images stored in `/public/images/try-on/` (flat lay or mannequin product shots)

### Cost

- $0.075 per generation (Fashn.ai pay-as-you-go)
- Free for the end user

### Cost Guardrails

- **Client-side:** Max 5 try-ons per session (sessionStorage)
- **Server-side:** Daily cap of 200 generations/day. Returns a friendly "Try again tomorrow" message if exceeded.
- No user auth required

### Privacy

- Uploaded photos are sent to Fashn.ai for processing, NOT stored on the server
- Clear notice on the page: "Your photo is processed securely and not saved"

## Data Model

A single file `data/try-on-items.ts` with all curated items:

```ts
interface TryOnItem {
  id: string;
  name: string;
  thumbnail: string; // display image in the picker grid
  type: "accessory" | "clothing";
  category: string; // e.g., "sunglasses", "hats", "tops", "dresses"
  // Accessories only:
  overlayImage?: string; // transparent PNG for AR overlay
  anchor?: {
    landmarks: string; // e.g., "eyes", "forehead"
    scale: number;
    offsetX: number;
    offsetY: number;
  };
  // Clothing only:
  garmentImage?: string; // clean product image for Fashn.ai
}
```

## Mobile Experience

### Accessories Tab

- Camera viewfinder fills most of the screen width
- Accessory picker: horizontal scrollable row below the viewfinder
- Large capture button at the bottom, thumb-friendly

### Clothing Tab

- Upload area: large tap target ("Tap to upload your photo")
- Garment picker: 2-column scrollable grid
- Result: vertical stack (original on top, result below) instead of side-by-side

### Shared

- Tabs are full-width toggle buttons
- All touch targets meet 44px minimum
- Standard responsive Tailwind, no special mobile framework

## New Files

- `app/try-on/page.tsx` - main page (server component shell)
- `components/TryOnTabs.tsx` - client component with tab switching
- `components/AccessoryTryOn.tsx` - camera AR experience
- `components/ClothingTryOn.tsx` - upload + Fashn.ai experience
- `app/api/try-on/route.ts` - API proxy to Fashn.ai
- `data/try-on-items.ts` - curated product data
- `/public/images/try-on/` - garment and overlay images

## Modified Files

- `components/Header.tsx` - add "Try On" nav link

## Future Expansion

- Inline "Try This On" buttons on blog posts that deep-link to `/try-on?item=xyz`
- More curated items over time
- Social sharing of try-on results
