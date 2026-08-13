export const heroSlides = [
  {
    image: '/images/flange-products.jpg',
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
