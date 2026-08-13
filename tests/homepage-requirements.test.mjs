import test from 'node:test';
import assert from 'node:assert/strict';

import {
  capabilities,
  companyIntro,
  headerCommands,
  heroSlides,
  navigation,
  proofPoints
} from '../app/content/homepage.js';

test('hero slides match the approved Word requirements', () => {
  assert.equal(heroSlides[0].title, 'Stainless Steel Flanges Manufacturer');
  assert.deepEqual(heroSlides[0].advantages, ['Fast Delivery', 'Multiple Standards', 'Custom Solutions']);
  assert.equal(heroSlides[1].title, 'Large Stock Available');
  assert.deepEqual(heroSlides[1].images, ['/images/stock-1.jpg', '/images/stock-2.jpg', '/images/stock-3.jpg']);
  assert.equal(heroSlides[2].title, 'Flanges for Worldwide Standards & Applications');
  assert.equal(heroSlides[2].standards, 'ASME | ANSI | DIN | EN | JIS | BS | GB | API');
  assert.equal(heroSlides[2].capacity, '15 Tons / Day');
  assert.equal(heroSlides[3].title, 'Any Standard, Any Size');
  assert.equal(heroSlides[3].image, '/images/engineer-drawing.jpg');
});

test('header, proof rail and company introduction match the approved requirements', () => {
  assert.deepEqual(navigation.map(({ label }) => label), ['Home', 'Products', 'Quality Inspection', 'Applications', 'About Us']);
  assert.deepEqual(headerCommands.map(({ label }) => label), ['Get a Quote', 'Upload Drawing']);
  assert.deepEqual(proofPoints.map(({ value }) => value), ['2016', '2,000 m²', '30 Million', '15 Tons / Day']);
  assert.equal(companyIntro.name, 'JIANGSU Longping Metal Products Co., Ltd.');
  assert.equal(companyIntro.linkLabel, 'View Production Capability');
});

test('capability modules link to products, process and inspection', () => {
  assert.deepEqual(capabilities.map(({ title }) => title), ['Standard Production', 'Production Process', 'Quality Inspection']);
  assert.equal(capabilities[0].href, '/products');
  assert.equal(capabilities[1].href, '/custom-machining#production-flow');
  assert.equal(capabilities[2].href, '/standards#quality-process');
});
