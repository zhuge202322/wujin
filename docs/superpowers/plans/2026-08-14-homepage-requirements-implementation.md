# LP Flange Homepage Requirements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update the LP Flange homepage and header so all six groups in `网站修改要求.docx` are implemented exactly and remain responsive.

**Architecture:** Move homepage presentation strings and link targets into a small static data module so exact document requirements can be tested without rendering React. Keep `HeroCarousel` as the only client component, add a slide media variant for the three-image warehouse composition, and reuse the existing CSS design system for the revised proof rail, introduction, capability cards, and header actions.

**Tech Stack:** Next.js 15 App Router, React 19, CSS, Node.js built-in test runner, in-app browser QA.

---

### Task 1: Requirement Contract Tests

**Files:**
- Create: `app/content/homepage.js`
- Create: `tests/homepage-requirements.test.mjs`
- Modify: `package.json`

- [ ] **Step 1: Write the failing tests**

Create `tests/homepage-requirements.test.mjs` using `node:test`, `node:assert/strict`, and direct imports from `app/content/homepage.js`. Assert all of the following exact contracts:

```js
assert.equal(heroSlides[0].title, 'Stainless Steel Flanges Manufacturer');
assert.deepEqual(heroSlides[0].advantages, ['Fast Delivery', 'Multiple Standards', 'Custom Solutions']);
assert.equal(heroSlides[1].title, 'Large Stock Available');
assert.deepEqual(heroSlides[1].images, ['/images/stock-1.jpg', '/images/stock-2.jpg', '/images/stock-3.jpg']);
assert.equal(heroSlides[2].title, 'Flanges for Worldwide Standards & Applications');
assert.equal(heroSlides[2].standards, 'ASME | ANSI | DIN | EN | JIS | BS | GB | API');
assert.equal(heroSlides[2].capacity, '15 Tons / Day');
assert.equal(heroSlides[3].title, 'Any Standard, Any Size');
assert.equal(heroSlides[3].image, '/images/engineer-drawing.jpg');
assert.deepEqual(navigation.map(({ label }) => label), ['Home', 'Products', 'Quality Inspection', 'Applications', 'About Us']);
assert.deepEqual(headerCommands.map(({ label }) => label), ['Get a Quote', 'Upload Drawing']);
assert.deepEqual(proofPoints.map(({ value }) => value), ['2016', '2,000 m²', '30 Million', '15 Tons / Day']);
assert.equal(companyIntro.name, 'JIANGSU Longping Metal Products Co., Ltd.');
assert.equal(companyIntro.linkLabel, 'View Production Capability');
assert.deepEqual(capabilities.map(({ title }) => title), ['Standard Production', 'Production Process', 'Quality Inspection']);
assert.equal(capabilities[1].href, '/custom-machining#production-flow');
assert.equal(capabilities[2].href, '/standards#quality-process');
```

Add a package script:

```json
"test": "node --test tests/*.test.mjs"
```

- [ ] **Step 2: Run the tests and verify RED**

Run: `npm test`

Expected: FAIL because `app/content/homepage.js` does not exist.

- [ ] **Step 3: Create the minimal data module**

Create `app/content/homepage.js` exporting `heroSlides`, `navigation`, `headerCommands`, `proofPoints`, `companyIntro`, and `capabilities`. Include the exact Word copy and these destinations:

```js
export const navigation = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Quality Inspection', href: '/standards#quality-process' },
  { label: 'Applications', href: '/#industries' },
  { label: 'About Us', href: '/about' }
];
```

Use `media: 'warehouse-collage'` for slide two and include `images` with all three supplied stock images. Use `/images/flange-products.jpg` for slide one, `/images/factory-cnc.jpg` for slide three, and `/images/engineer-drawing.jpg` for slide four.

- [ ] **Step 4: Run the tests and verify GREEN**

Run: `npm test`

Expected: all homepage requirement tests PASS.

- [ ] **Step 5: Commit**

```bash
git add package.json app/content/homepage.js tests/homepage-requirements.test.mjs
git commit -m "test: define homepage revision contracts"
```

### Task 2: Hero Carousel And Engineer Asset

**Files:**
- Modify: `app/components/HeroCarousel.js`
- Modify: `app/globals.css`
- Create: `public/images/engineer-drawing.jpg`

- [ ] **Step 1: Download and inspect the engineer image**

Select one high-resolution, unbranded, non-watermarked photo showing a mechanical engineer reviewing a technical drawing. Save it as `public/images/engineer-drawing.jpg`. Confirm it is at least 1600px wide and inspect it with `view_image` before use.

- [ ] **Step 2: Render slides from `heroSlides`**

Import `heroSlides` from `app/content/homepage.js`. Remove the local `slides` array. Render slide one advantages, slide two stock proof, slide three standards/capacity, and slide four copy from the data module. Map each slide's `primaryHref` and `primaryLabel` directly instead of branching on the active index.

- [ ] **Step 3: Implement the warehouse collage**

For `media === 'warehouse-collage'`, render three full-bleed image layers in a stable collage container: one large image on the left and two stacked images on the right. All three images must have meaningful alt text and inherit the carousel's active/inactive state.

- [ ] **Step 4: Add responsive carousel styles**

Add `.carousel-media`, `.warehouse-collage`, `.carousel-advantages`, and `.carousel-facts` styles. Preserve the existing full-screen height, contrast overlay, control positions, animation timing, and reduced-motion behavior. On mobile, keep the proof labels within the viewport and avoid covering the carousel controls.

- [ ] **Step 5: Verify tests and build**

Run: `npm test && npm run build`

Expected: tests PASS and all seven routes build successfully.

- [ ] **Step 6: Commit**

```bash
git add app/components/HeroCarousel.js app/globals.css public/images/engineer-drawing.jpg
git commit -m "feat: revise homepage hero carousel"
```

### Task 3: Header Navigation And Contact Actions

**Files:**
- Modify: `app/components/SiteChrome.js`
- Modify: `app/globals.css`

- [ ] **Step 1: Render the required navigation**

Import `navigation` and `headerCommands` from `app/content/homepage.js`. Map the five navigation items in the documented order. Determine active state from each item's `active` key so Products, Standards/Quality Inspection, and About Us still highlight correctly on inner pages.

- [ ] **Step 2: Keep quote and add drawing upload**

Render both commands:

```jsx
<a className="quote-button secondary-quote" href="mailto:sales@lpflange.com?subject=Flange%20RFQ">Get a Quote</a>
<a className="quote-button" href="mailto:sales@lpflange.com?subject=Upload%20Drawing%20for%20Flange%20RFQ">
  <span className="material-symbols-outlined">upload_file</span>Upload Drawing
</a>
```

- [ ] **Step 3: Add compact social links**

Add icon-only WhatsApp and email links beside the commands with accessible names. Retain search and language controls. Use the existing icon family and no manual SVGs.

- [ ] **Step 4: Fit the 80px header responsively**

Tighten desktop navigation gaps where needed. At the intermediate breakpoint hide quote text/actions before any overlap occurs. On mobile retain the logo, search, language, and one compact drawing-upload icon; verify no horizontal overflow.

- [ ] **Step 5: Run tests and build**

Run: `npm test && npm run build`

Expected: tests PASS and build succeeds.

- [ ] **Step 6: Commit**

```bash
git add app/components/SiteChrome.js app/globals.css
git commit -m "feat: update site navigation and header actions"
```

### Task 4: Homepage Proof, Company, And Capability Content

**Files:**
- Modify: `app/page.js`
- Modify: `app/globals.css`

- [ ] **Step 1: Replace proof rail values**

Import `proofPoints`, `companyIntro`, and `capabilities`. Map the four numeric proof points and add `About LP` as the fifth link. Use labels `Established`, `Factory Area`, `Stock`, and `Daily Output`.

- [ ] **Step 2: Replace the company introduction exactly**

Render:

```jsx
<p className="section-tag">STAINLESS STEEL FLANGE MANUFACTURER</p>
<h2>Professional Stainless Steel Flange Manufacturing</h2>
```

Then render the two exact company paragraphs from the data module and link `View Production Capability` to `/custom-machining`.

- [ ] **Step 3: Replace the capability modules**

Map the three numbered capability entries. Show `01`, `02`, and `03`, use the required descriptions, and use destination-specific labels: `View Products`, `View Process`, and `View Inspection`.

- [ ] **Step 4: Update homepage-only location wording**

Remove remaining `Taizhou` references from homepage-rendered content and replace them with `Jiangsu` where a location is shown. Do not rewrite unrelated inner-page company history in this task.

- [ ] **Step 5: Refine proof and card styling**

Ensure five proof items fit the desktop rail, capability numbers read clearly without decorative card nesting, and mobile stacking remains compact. Keep cards at 8px radius or less for the updated modules.

- [ ] **Step 6: Run tests and build**

Run: `npm test && npm run build`

Expected: tests PASS and build succeeds.

- [ ] **Step 7: Commit**

```bash
git add app/page.js app/globals.css
git commit -m "feat: align homepage content with company requirements"
```

### Task 5: Browser Verification And Final Regression

**Files:**
- Modify only if browser QA reveals a defect in `app/components/HeroCarousel.js`, `app/components/SiteChrome.js`, `app/page.js`, or `app/globals.css`

- [ ] **Step 1: Start or restart the requested server**

Run the Next.js development server on port `4011`. Confirm `/`, `/products`, `/standards#quality-process`, `/custom-machining#production-flow`, and `/about` return HTTP 200.

- [ ] **Step 2: Verify desktop homepage**

In the in-app browser at 1440x900, verify page identity, meaningful DOM, no framework overlay, no relevant console errors/warnings, and no horizontal overflow. Exercise next/previous carousel controls and confirm all four required titles and background treatments.

- [ ] **Step 3: Verify navigation and anchors**

Exercise `Products`, `Quality Inspection`, `Applications`, `About Us`, `Get a Quote`, and `Upload Drawing` contracts. For mail links, verify the `href` without triggering an external mail application. Confirm `Applications` reaches `#industries`, process links reach `#production-flow`, and quality links reach `#quality-process`.

- [ ] **Step 4: Verify mobile homepage**

At 390x844, verify the 80px header, logo/action separation, readable hero copy, carousel control stability, proof rail wrapping, capability module stacking, and zero horizontal overflow.

- [ ] **Step 5: Run final automated checks**

Run: `npm test && npm run build`

Expected: all tests PASS and production build succeeds without errors.

- [ ] **Step 6: Commit any QA fixes**

If QA changes were required:

```bash
git add app/components/HeroCarousel.js app/components/SiteChrome.js app/page.js app/globals.css
git commit -m "fix: resolve homepage responsive QA findings"
```

If no QA changes were required, do not create an empty commit.
