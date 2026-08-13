import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

import {
  capabilities,
  companyIntro,
  headerCommands,
  heroSlides,
  applicationFocus,
  navigation,
  proofPoints
} from '../app/content/homepage.js';

test('hero slides match the approved Word requirements', () => {
  assert.equal(heroSlides[0].title, 'Stainless Steel Flanges Manufacturer');
  assert.equal(heroSlides[0].text, 'Professional stainless steel flange supply for distributors, engineering companies and industrial projects worldwide.');
  assert.deepEqual(heroSlides[0].advantages, ['Fast Delivery', 'Multiple Standards', 'Custom Solutions']);
  assert.equal(heroSlides[1].title, 'Large Stock Available');
  assert.equal(heroSlides[1].text, 'Ready-to-ship flanges with short lead time.');
  assert.equal(heroSlides[1].stock, '30 Million Stock');
  assert.deepEqual(heroSlides[1].images, ['/images/stock-1.jpg', '/images/stock-2.jpg', '/images/stock-3.jpg']);
  assert.equal(heroSlides[2].title, 'Flanges for Worldwide Standards & Applications');
  assert.equal(heroSlides[2].standards, 'ASME | ANSI | DIN | EN | JIS | BS | GB | API');
  assert.equal(heroSlides[2].capacity, '15 Tons / Day');
  assert.equal(heroSlides[2].capacityLabel, 'High Production Capacity');
  assert.equal(heroSlides[2].text, 'Stable supply for global industrial projects.');
  assert.equal(heroSlides[3].title, 'Any Standard, Any Size');
  assert.equal(heroSlides[3].image, '/images/engineer-drawing.jpg');
  assert.equal(heroSlides[3].text, 'Standard and customized flanges based on your requirements.');
  assert.match(heroSlides[3].alt, /engineer.*drawing/i);
});

test('header, proof rail and company introduction match the approved requirements', () => {
  assert.deepEqual(navigation.map(({ label }) => label), ['Home', 'Products', 'Quality Inspection', 'Applications', 'About Us']);
  assert.deepEqual(navigation.map(({ href }) => href), ['/', '/products', '/standards#quality-process', '/#industries', '/about']);
  assert.deepEqual(headerCommands.map(({ label }) => label), ['Get a Quote', 'Upload Drawing']);
  assert.equal(headerCommands[0].href, 'mailto:sales@lpflange.com?subject=Flange%20RFQ');
  assert.equal(headerCommands[1].href, 'mailto:sales@lpflange.com?subject=Upload%20Drawing%20for%20Flange%20RFQ');
  assert.deepEqual(proofPoints.map(({ value }) => value), ['2016', '2,000 m²', '30 Million', '15 Tons / Day']);
  assert.deepEqual(proofPoints.map(({ label }) => label), ['Established', 'Factory Area', 'Stock', 'Daily Output']);
  assert.equal(companyIntro.name, 'JIANGSU Longping Metal Products Co., Ltd.');
  assert.equal(companyIntro.label, 'STAINLESS STEEL FLANGE MANUFACTURER');
  assert.equal(companyIntro.heading, 'Professional Stainless Steel Flange Manufacturing');
  assert.deepEqual(companyIntro.paragraphs, [
    'JIANGSU Longping Metal Products Co., Ltd. specializes in stainless steel flange manufacturing for distributors, engineering companies and industrial projects worldwide.',
    'With stable production capacity, experienced machining capability and knowledge of international flange standards, we supply standard and customized flange solutions based on drawings, specifications and project requirements.'
  ]);
  assert.equal(companyIntro.linkLabel, 'View Production Capability');
  assert.equal(companyIntro.href, '/custom-machining');
});

test('capability modules link to products, process and inspection', () => {
  assert.deepEqual(capabilities.map(({ title }) => title), ['Standard Production', 'Production Process', 'Quality Inspection']);
  assert.equal(capabilities[0].href, '/products');
  assert.match(capabilities[0].text, /ASME, ANSI, DIN, EN, JIS and GB/);
  assert.equal(capabilities[1].href, '/custom-machining#production-flow');
  assert.match(capabilities[1].text, /raw material.*CNC machining.*inspection.*packing/i);
  assert.equal(capabilities[2].href, '/standards#quality-process');
  assert.match(capabilities[2].text, /Material, dimensional, surface and final checks/);
});

test('header contact controls use explicit accessible contact semantics', async () => {
  const source = await readFile(new URL('../app/components/SiteChrome.js', import.meta.url), 'utf8');
  assert.match(source, /whatsapp-button/);
  assert.match(source, /aria-label="Contact LP Flange on WhatsApp"/);
  assert.match(source, /aria-label="Email LP Flange"/);
});

test('application focus uses industrial scenes and non-linked industry descriptions', () => {
  assert.equal(applicationFocus.title, 'Stainless Steel Flanges for Industrial Applications');
  assert.equal(applicationFocus.text, 'Reliable flange solutions for piping systems, equipment manufacturing and customized industrial projects.');
  assert.deepEqual(applicationFocus.scenes.map(({ title }) => title), ['Process Piping', 'Equipment Builders', 'Water Treatment', 'Non-standard Projects']);
  assert.ok(applicationFocus.scenes.every(({ image, alt }) => image && alt && !image.includes('stock-')));
  assert.deepEqual(applicationFocus.industries.map(({ title }) => title), ['Chemical & Process Industry', 'Equipment Manufacturing', 'Water Treatment', 'Custom Engineering']);
  assert.deepEqual(applicationFocus.industries.map(({ text }) => text), [
    'Flanges for corrosion-resistant piping systems.',
    'Components for machinery and skid systems.',
    'Stainless steel connections for fluid handling.',
    'Drawing-based flange manufacturing.'
  ]);
});

test('homepage omits the removed production environment band', async () => {
  const source = await readFile(new URL('../app/page.js', import.meta.url), 'utf8');
  assert.doesNotMatch(source, /className="manufacturing-band"/);
  assert.doesNotMatch(source, /Machining capability that stays close to the specification\./);
});
