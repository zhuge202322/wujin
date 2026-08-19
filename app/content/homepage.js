export const heroSlides = [
  {
    media: 'product-collage',
    images: ['/images/stitch-product-1.jpg', '/images/stitch-product-2.jpg', '/images/stitch-product-3.jpg'],
    alt: 'Finished stainless steel flange products manufactured by LP Flange',
    kicker: 'STAINLESS STEEL FLANGE MANUFACTURER',
    title: 'Stainless Steel Flanges Manufacturer',
    text: 'Professional stainless steel flange supply for distributors, engineering companies and industrial projects worldwide.',
    advantages: ['Fast Delivery', 'Multiple Standards', 'Custom Solutions'],
    primaryLabel: 'Explore Products',
    primaryHref: '/products'
  },
  {
    media: 'warehouse-collage',
    images: ['/images/stock-1.jpg', '/images/stock-2.jpg', '/images/stock-3.jpg'],
    alt: 'LP Flange stainless steel flange warehouse stock',
    kicker: 'FAST DELIVERY',
    title: 'Large Stock Available',
    text: 'Ready-to-ship flanges with short lead time.',
    stock: '30 Million Stock',
    primaryLabel: 'View Product Range',
    primaryHref: '/products'
  },
  {
    image: '/images/factory-cnc.jpg',
    alt: 'LP Flange factory machinery and CNC production equipment',
    kicker: 'MULTIPLE STANDARDS',
    title: 'Flanges for Worldwide Standards & Applications',
    text: 'Stable supply for global industrial projects.',
    standards: 'ASME | ANSI | DIN | EN | JIS | BS | GB | API',
    capacity: '15 Tons / Day',
    capacityLabel: 'High Production Capacity',
    primaryLabel: 'View Production Capability',
    primaryHref: '/custom-machining'
  },
  {
    image: '/images/engineer-drawing.jpg',
    alt: 'Mechanical engineer reviewing a technical manufacturing drawing',
    kicker: 'CUSTOM SOLUTIONS',
    title: 'Any Standard, Any Size',
    text: 'Standard and customized flanges based on your requirements.',
    primaryLabel: 'Upload Drawing',
    primaryHref: 'mailto:sales@lpflange.com?subject=Upload%20Drawing%20for%20Flange%20RFQ'
  }
];

export const navigation = [
  { label: 'Home', href: '/', active: 'home' },
  { label: 'Products', href: '/products', active: 'products' },
  { label: 'Quality Inspection', href: '/standards#quality-process', active: 'standards' },
  { label: 'Applications', href: '/#industries', active: 'applications' },
  { label: 'About Us', href: '/about', active: 'about' }
];

export const headerCommands = [
  { label: 'Get a Quote', href: 'mailto:sales@lpflange.com?subject=Flange%20RFQ', variant: 'secondary' },
  { label: 'Upload Drawing', href: 'mailto:sales@lpflange.com?subject=Upload%20Drawing%20for%20Flange%20RFQ', icon: 'upload_file', variant: 'primary' }
];

export const proofPoints = [
  { value: '2016', label: 'Established' },
  { value: '2,000 m²', label: 'Factory Area' },
  { value: '30 Million', label: 'Stock' },
  { value: '15 Tons / Day', label: 'Daily Output' }
];

export const companyIntro = {
  label: 'STAINLESS STEEL FLANGE MANUFACTURER',
  heading: 'Professional Stainless Steel Flange Manufacturing',
  name: 'JIANGSU Longping Metal Products Co., Ltd.',
  paragraphs: [
    'JIANGSU Longping Metal Products Co., Ltd. specializes in stainless steel flange manufacturing for distributors, engineering companies and industrial projects worldwide.',
    'With stable production capacity, experienced machining capability and knowledge of international flange standards, we supply standard and customized flange solutions based on drawings, specifications and project requirements.'
  ],
  linkLabel: 'View Production Capability',
  href: '/custom-machining'
};

export const capabilities = [
  {
    number: '01',
    icon: 'settings_input_component',
    title: 'Standard Production',
    text: 'Manufacturing stainless steel flanges according to ASME, ANSI, DIN, EN, JIS and GB standards.',
    href: '/products',
    linkLabel: 'View Products'
  },
  {
    number: '02',
    icon: 'manufacturing',
    title: 'Production Process',
    text: 'A controlled production path from raw material and forging through CNC machining, inspection and packing.',
    href: '/custom-machining#production-flow',
    linkLabel: 'View Process'
  },
  {
    number: '03',
    icon: 'fact_check',
    title: 'Quality Inspection',
    text: 'Material, dimensional, surface and final checks aligned with the order specification.',
    href: '/standards#quality-process',
    linkLabel: 'View Inspection'
  }
];

export const applicationFocus = {
  label: 'APPLICATION FOCUS',
  title: 'Stainless Steel Flanges for Industrial Applications',
  text: 'Reliable flange solutions for piping systems, equipment manufacturing and customized industrial projects.',
  scenes: [
    { title: 'Process Piping', image: '/images/factory-floor.jpg', alt: 'Industrial process piping and stainless steel pipework in a manufacturing facility' },
    { title: 'Equipment Builders', image: '/images/factory-cnc.jpg', alt: 'CNC equipment and machinery used for industrial equipment manufacturing' },
    { title: 'Water Treatment', image: '/images/factory-exterior.png', alt: 'Industrial treatment facility for stainless steel fluid-handling systems' },
    { title: 'Non-standard Projects', image: '/images/engineer-drawing.jpg', alt: 'Engineer reviewing a CAD drawing for a customized industrial flange project' }
  ],
  industries: [
    { icon: 'factory', title: 'Chemical & Process Industry', text: 'Flanges for corrosion-resistant piping systems.' },
    { icon: 'precision_manufacturing', title: 'Equipment Manufacturing', text: 'Components for machinery and skid systems.' },
    { icon: 'water_drop', title: 'Water Treatment', text: 'Stainless steel connections for fluid handling.' },
    { icon: 'architecture', title: 'Custom Engineering', text: 'Drawing-based flange manufacturing.' }
  ]
};

// Stable keys used by the admin image library. Public pages keep their source-code
// fallback until a later integration explicitly resolves these records at render time.
export const managedImageKeys = [
  { pageKey: 'home', sectionKey: 'hero-product-1', imageUrl: '/images/stitch-product-1.jpg', altText: 'Finished stainless steel flange products manufactured by LP Flange' },
  { pageKey: 'home', sectionKey: 'hero-product-2', imageUrl: '/images/stitch-product-2.jpg', altText: 'Finished stainless steel flange products manufactured by LP Flange' },
  { pageKey: 'home', sectionKey: 'hero-product-3', imageUrl: '/images/stitch-product-3.jpg', altText: 'Finished stainless steel flange products manufactured by LP Flange' },
  { pageKey: 'home', sectionKey: 'hero-stock-1', imageUrl: '/images/stock-1.jpg', altText: 'Stainless steel flange stock available for industrial supply' },
  { pageKey: 'home', sectionKey: 'hero-stock-2', imageUrl: '/images/stock-2.jpg', altText: 'Stainless steel flange stock available for industrial supply' },
  { pageKey: 'home', sectionKey: 'hero-stock-3', imageUrl: '/images/stock-3.jpg', altText: 'Stainless steel flange stock available for industrial supply' },
  { pageKey: 'home', sectionKey: 'hero-standards', imageUrl: '/images/factory-cnc.jpg', altText: 'LP Flange factory machinery and CNC production equipment' },
  { pageKey: 'home', sectionKey: 'hero-custom', imageUrl: '/images/engineer-drawing.jpg', altText: 'Mechanical engineer reviewing a technical manufacturing drawing' },
  { pageKey: 'home', sectionKey: 'applications-process-piping', imageUrl: '/images/factory-floor.jpg', altText: 'Industrial process piping and stainless steel pipework in a manufacturing facility' },
  { pageKey: 'home', sectionKey: 'applications-equipment-builders', imageUrl: '/images/factory-cnc.jpg', altText: 'CNC equipment and machinery used for industrial equipment manufacturing' },
  { pageKey: 'home', sectionKey: 'applications-water-treatment', imageUrl: '/images/factory-exterior.png', altText: 'Industrial treatment facility for stainless steel fluid-handling systems' },
  { pageKey: 'home', sectionKey: 'applications-non-standard', imageUrl: '/images/engineer-drawing.jpg', altText: 'Engineer reviewing a CAD drawing for a customized industrial flange project' },
  { pageKey: 'products', sectionKey: 'hero', imageUrl: '/images/stitch-product-1.jpg', altText: 'Stainless steel blind flange product' },
  { pageKey: 'about', sectionKey: 'hero', imageUrl: '/images/factory-exterior.png', altText: 'LP Flange factory exterior in Jiangsu, China' },
  { pageKey: 'about', sectionKey: 'factory-floor', imageUrl: '/images/factory-floor.jpg', altText: 'LP Flange production floor' },
  { pageKey: 'standards', sectionKey: 'hero', imageUrl: '/images/flange-products.jpg', altText: 'Stainless steel flange range' },
  { pageKey: 'standards', sectionKey: 'quality-inspection', imageUrl: '/images/spectrometer.jpg', altText: 'LP Flange material inspection' },
  { pageKey: 'standards', sectionKey: 'production-flow', imageUrl: '/images/process-flow-production.png', altText: 'LP Flange photographic production flow showing ten manufacturing and inspection stages' },
  { pageKey: 'custom-machining', sectionKey: 'hero', imageUrl: '/images/factory-cnc.jpg', altText: 'CNC and numerical control lathes in the LP Flange workshop' },
  { pageKey: 'custom-machining', sectionKey: 'production-flow', imageUrl: '/images/process-flow-overview.png', altText: 'LP Flange ten-step manufacturing process from raw material to packing' },
  { pageKey: 'custom-machining', sectionKey: 'custom-examples', imageUrl: '/images/custom-flange.jpg', altText: 'LP Flange custom stainless steel flange examples' },
  { pageKey: 'technical-resources', sectionKey: 'hero', imageUrl: '/images/spectrometer.jpg', altText: 'Material inspection with a spectrometer' },
  { pageKey: 'site', sectionKey: 'company-logo', imageUrl: '/images/lpflange-wordmark.png', altText: 'LP Flange - Longping Metal Products Co., Ltd.' }
];
