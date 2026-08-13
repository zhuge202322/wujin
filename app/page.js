import HeroCarousel from './components/HeroCarousel';
import { SiteFooter, SiteHeader } from './components/SiteChrome';
import { applicationFocus, capabilities, companyIntro, proofPoints } from './content/homepage';

const productTiles = [
  ['Threaded Flanges', 'stitch-product-3.jpg'],
  ['Weld Neck Flanges', 'stitch-product-2.jpg'],
  ['Blind Flanges', 'stitch-product-1.jpg'],
  ['Custom Flanges', 'stitch-product-4.jpg'],
  ['Large Diameter Flanges', 'stock-2.jpg'],
  ['Tube Sheet Components', 'custom-flange.jpg']
];

const process = [
  ['01', 'Requirement Review', 'Type, material, standard, dimensions and quantity are clarified before production.'],
  ['02', 'Material & Machining', 'CNC and numerical control equipment machine components to the agreed specification.'],
  ['03', 'Inspection', 'Key dimensions, surface condition and order requirements are checked through production.'],
  ['04', 'Packing & Delivery', 'Finished flanges are protected and prepared for international shipment.']
];

export default function Home() {
  return (
    <>
      <SiteHeader active="home" />
      <main>
        <HeroCarousel />

        <section className="proof-rail">
          <div className="container proof-rail-inner">{proofPoints.map((point) => <span key={point.value}><b>{point.value}</b>{point.label}</span>)}<a href="/about"><b>About LP</b><i className="material-symbols-outlined">arrow_forward</i></a></div>
        </section>

        <section className="section-pad home-intro">
          <div className="container intro-grid">
            <div><p className="section-tag">{companyIntro.label}</p><h2>{companyIntro.heading}</h2></div>
            <div className="intro-copy"><p className="company-name">{companyIntro.name}</p>{companyIntro.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}<a className="text-link" href={companyIntro.href}>{companyIntro.linkLabel} <span className="material-symbols-outlined">arrow_forward</span></a></div>
          </div>
        </section>

        <section className="capabilities section-pad" id="capabilities">
          <div className="container"><div className="section-heading-row"><div><p className="section-tag">CORE CAPABILITIES</p><h2>Production, process and inspection in one manufacturing system.</h2></div><a href="/custom-machining">View Production Capability <span className="material-symbols-outlined">arrow_forward</span></a></div><div className="capability-grid three-column">{capabilities.map((item) => <article className="capability-card numbered-capability" key={item.title}><span className="capability-number">{item.number}</span><span className="material-symbols-outlined capability-icon">{item.icon}</span><h3>{item.title}</h3><p>{item.text}</p><a href={item.href}>{item.linkLabel} <span className="material-symbols-outlined">arrow_forward</span></a></article>)}</div></div>
        </section>

        <section className="section-pad product-showcase" id="products">
          <div className="container"><div className="section-heading-row"><div><p className="section-tag">PRODUCT FAMILIES</p><h2>One manufacturing base. A broader flange range.</h2><p>Standard, special and drawing-based stainless steel components for industrial connection systems.</p></div><a href="/products">Browse all products <span className="material-symbols-outlined">arrow_forward</span></a></div><div className="featured-product-grid">{productTiles.map(([name, image]) => <a href="/products" className="featured-product" key={name}><div><img src={`/images/${image}`} alt={name} /></div><span>{name}</span><i className="material-symbols-outlined">arrow_forward</i></a>)}</div></div>
        </section>

        <section className="applications section-pad" id="industries">
          <div className="container"><div className="section-heading-row"><div><p className="section-tag">{applicationFocus.label}</p><h2>{applicationFocus.title}</h2><p>{applicationFocus.text}</p></div></div><div className="applications-grid"><div className="applications-scenes">{applicationFocus.scenes.map((scene) => <figure key={scene.title}><img src={scene.image} alt={scene.alt} /><figcaption>{scene.title}</figcaption></figure>)}</div><div className="application-list">{applicationFocus.industries.map((industry) => <div key={industry.title}><span className="material-symbols-outlined">{industry.icon}</span><span><b>{industry.title}</b><small>{industry.text}</small></span></div>)}</div></div></div>
        </section>

        <section className="workflow section-pad" id="workflow"><div className="container workflow-content"><div className="workflow-heading"><p className="section-tag light">QUALITY IN THE PROCESS</p><h2>From Drawing Review to Final Shipment</h2><p>Every order moves through defined checks so the finished product is aligned with its drawing and requirement.</p></div><div className="workflow-grid">{process.map(([number,title,text]) => <article key={number}><span className="workflow-number">{number}</span><h3>{title}</h3><p>{text}</p></article>)}</div></div><span className="material-symbols-outlined workflow-mark">precision_manufacturing</span></section>

        <section className="section-pad standards-evidence"><div className="container evidence-grid"><div><p className="section-tag">STANDARDS & QUALITY</p><h2>Specifications are not an afterthought.</h2><p>Share your applicable standard and critical order details. We support ASME / ANSI, GB, DIN, EN 1092-1, JIS, BS and API requirements.</p><a className="primary-button" href="/standards">See standards and quality</a></div><div className="evidence-list"><div><span className="material-symbols-outlined">verified</span><b>Material review</b><p>Confirm material requirements before machining.</p></div><div><span className="material-symbols-outlined">straighten</span><b>Dimension checks</b><p>Review critical size and connection details.</p></div><div><span className="material-symbols-outlined">science</span><b>Inspection planning</b><p>Align inspection points with order needs.</p></div><div><span className="material-symbols-outlined">inventory_2</span><b>Protective packing</b><p>Prepare finished products for delivery.</p></div></div></div></section>

        <section className="delivery section-pad"><div className="container"><div className="section-title centered"><p className="section-tag">ORDER PROGRESSION</p><h2>From enquiry to shipment.</h2><span /></div><div className="delivery-grid"><div><b>01</b><h3>Share your requirement</h3><p>Send the type, standard, material, dimensions and quantity.</p></div><div><b>02</b><h3>Confirm the specification</h3><p>We clarify drawings, inspection points and delivery details.</p></div><div><b>03</b><h3>Produce and inspect</h3><p>CNC machining and order checks keep the batch consistent.</p></div><div><b>04</b><h3>Pack for delivery</h3><p>Protective packing prepares finished flanges for shipment.</p></div></div></div></section>

        <section className="cta section-pad precision-grid"><div className="cta-inner"><p className="section-tag">START A CONVERSATION</p><h2>Ready to source your next flange order?</h2><p>Send your drawings or technical specifications for a detailed flange quotation. Our team can support material, standard, size and production requirement discussions.</p><div className="button-row centered-buttons"><a className="primary-button large" href="mailto:sales@lpflange.com?subject=Flange%20Drawing%20and%20Specifications"><span className="material-symbols-outlined">upload_file</span>Upload specifications</a><a className="light-button" href="mailto:sales@lpflange.com"><span className="material-symbols-outlined">mail</span>Contact sales</a></div></div></section>
      </main>
      <SiteFooter />
    </>
  );
}
