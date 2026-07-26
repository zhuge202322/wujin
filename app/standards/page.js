import { InnerHero, PageFrame } from '../components/SiteChrome';

const standards = ['ASME / ANSI', 'GB', 'DIN', 'EN 1092-1', 'JIS', 'BS', 'API'];
const quality = [['MATERIAL INSPECTION', 'Confirm incoming stainless steel material and order specification.'], ['DIMENSION INSPECTION', 'Check key dimensions, bores, bolt holes and facing details.'], ['PRESSURE TESTING', 'Support pressure testing requirements when specified for the order.'], ['SURFACE INSPECTION', 'Review finish, marks and visible surface condition before packing.'], ['FINAL INSPECTION', 'Complete the final order check before shipment.']];

export default function StandardsPage() {
  return (
    <PageFrame active="standards">
      <InnerHero eyebrow="STANDARDS & QUALITY" title="Manufactured to the standard your project specifies" text="LP Flange supports major flange standards and a clear inspection workflow for stainless steel products supplied to international buyers." image="/images/flange-products.jpg" imageAlt="Stainless steel flange range" />
      <section className="section-pad standards-page-section"><div className="container standards-page-grid"><div><h2>International Standards</h2><p>Tell us the standard shown on your drawing or purchase specification. We can also review non-standard flange requirements.</p></div><div className="standards-page-list">{standards.map((standard) => <span key={standard}><span className="material-symbols-outlined">check_circle</span>{standard}</span>)}</div></div></section>
      <section className="section-pad quality-page-band"><div className="container"><h2>Rigorous Production Workflow</h2><div className="quality-page-grid">{quality.map(([title,text],index) => <article key={title}><span className="quality-number">0{index + 1}</span><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>
      <section className="section-pad quality-note"><div className="container quality-note-grid"><img src="/images/spectrometer.jpg" alt="LP Flange material inspection" /><div><h2>Quality information for every order</h2><p>Inspection details, drawings and material requirements can be discussed before production so the finished order is aligned with your expectations.</p><a className="primary-button" href="mailto:sales@lpflange.com?subject=Quality%20Requirement">Ask about inspection</a></div></div></section>
      <section className="section-pad process-proof" id="quality-process">
        <div className="container">
          <div className="process-proof-heading">
            <div><p className="section-tag">PRODUCTION EVIDENCE</p><h2>See the process behind the inspection record.</h2></div>
            <p>The production route links material preparation, forging, precision machining, cleaning and spectrometer inspection before finished flanges are packed.</p>
          </div>
          <figure className="process-proof-media">
            <a className="process-image-link" href="/images/process-flow-production.png" target="_blank" rel="noreferrer" aria-label="Open the full-size photographic production flow">
              <img src="/images/process-flow-production.png" alt="LP Flange photographic production flow showing ten manufacturing and inspection stages" />
              <span className="material-symbols-outlined">open_in_full</span>
            </a>
            <figcaption>LP Flange production flow, documented from incoming raw material through final packing.</figcaption>
          </figure>
        </div>
      </section>
    </PageFrame>
  );
}
