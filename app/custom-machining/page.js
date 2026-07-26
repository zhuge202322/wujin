import { InnerHero, PageFrame } from '../components/SiteChrome';

const steps = [
  ['01', 'Drawing review', 'We review the flange type, standard, dimensions, material and quantity before production.'],
  ['02', 'Material preparation', 'Stainless steel stock is prepared against the order specification and production plan.'],
  ['03', 'CNC machining', 'CNC and numerical control lathes form, drill and finish each component.'],
  ['04', 'Inspection & packing', 'Finished parts are checked, protected and prepared for global delivery.']
];

export default function CustomMachiningPage() {
  return (
    <PageFrame active="custom">
      <InnerHero eyebrow="CUSTOM MACHINING" title="From your drawing to a dependable flange" text="LP Flange combines stainless steel expertise with practical CNC and numerical control machining for standard and non-standard orders." image="/images/factory-cnc.jpg" imageAlt="CNC and numerical control lathes in the LP Flange workshop" />
      <section className="section-pad capability-detail"><div className="container"><div className="section-title centered"><h2>Capability Overview</h2><span /></div><div className="detail-grid"><article><span className="material-symbols-outlined capability-icon">settings_input_component</span><h3>Standard Processing</h3><p>We manufacture common stainless steel flange types to major international standards, supporting repeat batches and project quantities.</p><ul><li>ASME / ANSI, DIN, EN, JIS, BS, GB and API</li><li>Stainless steel flange production</li><li>Clear order and specification control</li></ul></article><article><span className="material-symbols-outlined capability-icon">architecture</span><h3>Non-Standard Custom</h3><p>Send dimensions, drawings or a sample requirement. Our team will confirm feasibility and production details before quotation.</p><ul><li>Drawing-to-production support</li><li>Flexible dimensions and quantities</li><li>Inspection matched to your order</li></ul></article></div></div></section>
      <section className="process-band section-pad"><div className="container"><h2>How a custom order moves</h2><div className="process-grid">{steps.map(([number,title,text]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>
      <section className="section-pad process-visual" id="production-flow">
        <div className="container process-visual-grid">
          <div className="process-visual-copy">
            <p className="section-tag">10-STEP MANUFACTURING FLOW</p>
            <h2>Every flange follows a controlled production path.</h2>
            <p>From stainless steel raw material and forging through CNC machining, drilling, cleaning and final inspection, each stage prepares the component for the next.</p>
            <div className="process-visual-points">
              <span><i className="material-symbols-outlined">precision_manufacturing</i>Forging and machining</span>
              <span><i className="material-symbols-outlined">fact_check</i>Inspection before packing</span>
              <span><i className="material-symbols-outlined">inventory_2</i>Protected for shipment</span>
            </div>
          </div>
          <figure className="process-visual-media">
            <a className="process-image-link" href="/images/process-flow-overview.png" target="_blank" rel="noreferrer" aria-label="Open the full-size ten-step manufacturing process diagram">
              <img src="/images/process-flow-overview.png" alt="LP Flange ten-step manufacturing process from raw material to packing" />
              <span className="material-symbols-outlined">open_in_full</span>
            </a>
            <figcaption>Raw material, cutting, forging, machining, CNC machining, drilling, cleaning, inspection and packing.</figcaption>
          </figure>
        </div>
      </section>
      <section className="section-pad custom-contact"><div className="container custom-contact-grid"><img src="/images/custom-flange.jpg" alt="LP Flange custom stainless steel flange examples" /><div><h2>Have a non-standard requirement?</h2><p>Share the flange drawing, standard, material, dimensions and expected quantity. We will respond with practical production feedback.</p><a className="primary-button" href="mailto:sales@lpflange.com?subject=Custom%20Machining%20Request">Send your drawing</a></div></div></section>
    </PageFrame>
  );
}
