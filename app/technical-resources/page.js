import { InnerHero, PageFrame } from '../components/SiteChrome';

const resources = [
  ['description', 'Product Selection', 'Use flange type, nominal size, pressure class, material and quantity to describe your requirement.'],
  ['straighten', 'Drawing Checklist', 'Include key dimensions, bolt-hole pattern, facing, bore, material and applicable standard.'],
  ['fact_check', 'Inspection Workflow', 'Material, dimensions, surface condition and final order checks are reviewed before shipment.'],
  ['local_shipping', 'Packing & Delivery', 'Finished stainless steel flanges are protected for handling and international transport.']
];

export default function TechnicalResourcesPage() {
  return (
    <PageFrame active="resources">
      <InnerHero eyebrow="TECHNICAL RESOURCES" title="Clear information for a smoother flange order" text="Use these practical checkpoints to prepare an RFQ, compare flange standards and communicate the details your project needs." image="/images/spectrometer.jpg" imageAlt="Material inspection with a spectrometer" />
      <section className="section-pad resources-section"><div className="container"><div className="section-title centered"><h2>Buyer Resources</h2><span /></div><div className="resource-grid">{resources.map(([icon,title,text]) => <article className="resource-card" key={title}><span className="material-symbols-outlined capability-icon">{icon}</span><h3>{title}</h3><p>{text}</p><a href="mailto:sales@lpflange.com?subject=Technical%20Question">Ask our team <span className="material-symbols-outlined">arrow_forward</span></a></article>)}</div></div></section>
      <section className="section-pad resource-checklist"><div className="container checklist-grid"><div><h2>What to include in your RFQ</h2><p>The more complete the specification, the faster we can confirm a practical quotation.</p></div><ol><li><b>01</b><span>Flange type and applicable standard</span></li><li><b>02</b><span>Material grade and pressure requirement</span></li><li><b>03</b><span>Size, dimensions and facing details</span></li><li><b>04</b><span>Quantity, packing and delivery destination</span></li></ol></div></section>
    </PageFrame>
  );
}
