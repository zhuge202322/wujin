# LP Flange Homepage Requirements Design

## Scope

Implement the six requirement groups in `网站修改要求.docx` while preserving the current Stitch-derived blue and gray industrial visual system. The work primarily changes the homepage hero, navigation, proof rail, company introduction, and three core capability modules. Existing product, quality, process, application, and about content remains available through the current routes and homepage anchors.

## Hero Carousel

The homepage keeps a four-slide full-screen carousel.

1. Finished flange products
   - Title: `Stainless Steel Flanges Manufacturer`
   - Supporting advantages: `Fast Delivery | Multiple Standards | Custom Solutions`
   - Background: finished stainless steel flange products
2. Stock and delivery
   - Title: `Large Stock Available`
   - Copy: `Ready-to-ship flanges with short lead time.`
   - Proof: `30 Million Stock`
   - Background: a composed warehouse presentation using supplied warehouse images 1-3, so the slide communicates stock depth rather than relying on one generic warehouse crop
3. Standards and production capacity
   - Title: `Flanges for Worldwide Standards & Applications`
   - Standards: `ASME | ANSI | DIN | EN | JIS | BS | GB | API`
   - Capacity: `15 Tons / Day`, `High Production Capacity`
   - Copy: `Stable supply for global industrial projects.`
   - Background: factory machinery
4. Drawing-based customization
   - Title: `Any Standard, Any Size`
   - Copy: `Standard and customized flanges based on your requirements.`
   - Background: a high-resolution image of an engineer reviewing a technical drawing

Each slide keeps a primary contextual action and a secondary sales contact action. The first slide uses a finished-product signal in the first viewport, and the existing carousel controls remain usable.

## Navigation And Header Actions

Desktop navigation becomes:

- Home -> `/`
- Products -> `/products`
- Quality Inspection -> `/standards#quality-process`
- Applications -> `/#industries`
- About Us -> `/about`

The existing search and language controls remain. Keep the `Get a Quote` command and add a separate `Upload Drawing` command with a drawing-focused email subject. A compact social-contact group is added beside the commands using familiar icons for WhatsApp and email.

## Proof Rail

The rail immediately below the hero becomes five concise proof points:

- `2016` Established
- `2,000 m²` Factory Area
- `30 Million` Stock
- `15 Tons / Day` Daily Output
- `About LP` linking to `/about`

Desktop presents the items in a single scan line. Tablet and mobile wrap them without horizontal overflow.

## Company Introduction

The two-column introduction uses:

- Label: `STAINLESS STEEL FLANGE MANUFACTURER`
- Heading: `Professional Stainless Steel Flange Manufacturing`
- Company name: `Jiangsu Longping Metal Products Co., Ltd.`
- First paragraph: `JIANGSU Longping Metal Products Co., Ltd. specializes in stainless steel flange manufacturing for distributors, engineering companies and industrial projects worldwide.`
- Second paragraph: `With stable production capacity, experienced machining capability and knowledge of international flange standards, we supply standard and customized flange solutions based on drawings, specifications and project requirements.`
- Link label: `View Production Capability`, linking to `/custom-machining`

All homepage references to the company location use `Jiangsu`, avoiding `Taizhou` where the requirement calls for a clearer geographic signal.

## Core Capability Modules

The homepage displays three numbered modules:

1. `Standard Production`
   - Copy references ASME, ANSI, DIN, EN, JIS, and GB standards.
   - Link: `/products`
2. `Production Process`
   - Copy summarizes controlled manufacturing from raw material to packing.
   - Link: `/custom-machining#production-flow`
3. `Quality Inspection`
   - Copy summarizes material, dimensional, surface, and final checks.
   - Link: `/standards#quality-process`

The cards use the existing capability component family, with clear `01`, `02`, and `03` identifiers and destination-specific action labels.

## Assets

Use existing supplied product, warehouse, and factory images where specified. Add one external high-resolution engineer-and-drawing image for slide four, downloaded into `public/images` so the production website does not depend on a third-party hotlink. The image must be unbranded, free of watermarks, and visually relevant to mechanical manufacturing.

## Responsive And Accessibility

- Preserve the fixed 80px header.
- Prevent navigation, social icons, and `Upload Drawing` from overlapping the logo.
- Keep carousel text readable against all four backgrounds.
- Ensure proof points and capability cards stack cleanly on mobile.
- Provide accurate image alt text and accessible names for icon-only actions.
- Respect existing reduced-motion behavior.

## Verification

- Add focused source-level tests for the exact required hero copy, navigation labels and destinations, proof metrics, Jiangsu company copy, and capability links.
- Run the tests before implementation to demonstrate the current site does not meet the document requirements.
- Run `npm run build` after implementation.
- Verify homepage desktop and mobile rendering in the in-app browser, including carousel interaction, no framework overlay, no relevant console warnings/errors, no horizontal overflow, and correct anchor navigation.
