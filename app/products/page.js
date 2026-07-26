import { InnerHero, PageFrame } from '../components/SiteChrome';

const products = [
  ['Threaded Flanges', 'Stainless steel threaded flange', 'stitch-product-3.jpg', 'Machined threaded connections where welding is not preferred.', 'Standard flanges'],
  ['Weld Neck Flanges', 'Stainless steel weld neck flange', 'stitch-product-2.jpg', 'Long-hub geometry for stable, high-integrity connections.', 'Standard flanges'],
  ['Slip On Flanges', 'Stainless steel slip on flange', 'stitch-product-1.jpg', 'Practical flange connections for repeat industrial supply.', 'Standard flanges'],
  ['Blind Flanges', 'Stainless steel blind flange', 'stitch-product-1.jpg', 'For closing pipe ends, vessels and inspection openings.', 'Standard flanges'],
  ['Forged Flanges', 'Forged stainless steel flange inventory', 'stock-1.jpg', 'Durable forged flange solutions for industrial piping.', 'Standard flanges'],
  ['Large Diameter Flanges', 'Large diameter stainless steel flanges', 'stock-2.jpg', 'Heavy-duty flange supply for larger piping dimensions.', 'Standard flanges'],
  ['Socket Weld Flanges', 'Socket weld flange inventory', 'stock-3.jpg', 'Compact connections for small-bore pipework.', 'Standard flanges'],
  ['Lap Joint Flanges', 'Stainless steel lap joint flange', 'stitch-product-2.jpg', 'Loose flange arrangements for maintenance-friendly systems.', 'Other flanges'],
  ['Tube Sheet Flanges', 'Tube sheet stainless steel flange', 'custom-flange.jpg', 'Tube plate and drilled components made to your specification.', 'Other flanges'],
  ['Sight Glass Flanges', 'Stainless steel sight glass assembly', 'custom-flange.jpg', 'Visual inspection components for process lines and equipment.', 'Other flanges'],
  ['Custom Non-Standard Flanges', 'Custom engineered stainless steel flange', 'stitch-product-4.jpg', 'Non-standard dimensions manufactured from your drawing.', 'Custom solutions'],
  ['SAE & Special Flanges', 'Special stainless steel flange geometry', 'stitch-product-4.jpg', 'Special shapes and connection patterns reviewed by specification.', 'Custom solutions'],
  ['Threaded Pipe Fittings', 'Stainless threaded pipe fittings', 'stock-3.jpg', 'Threaded connection components for stainless steel pipework.', 'Pipework components'],
  ['Welded Pipe Fittings', 'Stainless welded pipe fittings', 'factory-cnc.jpg', 'Welded connection components supplied to project specification.', 'Pipework components'],
  ['Industrial Valves', 'Industrial stainless steel valve components', 'custom-flange.jpg', 'Valve and line components for industrial fluid systems.', 'Pipework components']
];

export default function ProductsPage() {
  return (
    <PageFrame active="products">
      <InnerHero
        eyebrow="STAINLESS STEEL FLANGE CATALOG"
        title="Flanges built for your connection requirements"
        text="Explore LP Flange products for distributors, contractors and industrial projects. Every category can be specified by standard, material, size and quantity."
        image="/images/stitch-product-1.jpg"
        imageAlt="Stainless steel blind flange product"
      />
      <section className="section-pad catalog-section">
        <div className="container">
          <div className="section-heading-row"><div><h2>Flange Production Line</h2><p>Standard and custom stainless steel connection solutions.</p></div><a href="mailto:sales@lpflange.com?subject=Product%20Catalog">Request product information <span className="material-symbols-outlined">arrow_forward</span></a></div>
          <nav className="product-category-nav" aria-label="Product categories"><a href="#standard-flanges">Standard Flanges <b>07</b></a><a href="#other-flanges">Other Flanges <b>03</b></a><a href="#custom-solutions">Custom Solutions <b>02</b></a><a href="#pipework-components">Pipework Components <b>03</b></a><a href="mailto:sales@lpflange.com?subject=Full%20Product%20List">Full product list <span className="material-symbols-outlined">arrow_forward</span></a></nav>
          <div className="catalog-grid">
            {products.map(([name, alt, image, text, category], index) => <a className="catalog-card" id={index === 0 ? 'standard-flanges' : index === 7 ? 'other-flanges' : index === 10 ? 'custom-solutions' : index === 12 ? 'pipework-components' : undefined} href={`mailto:sales@lpflange.com?subject=${encodeURIComponent(name)}%20RFQ`} key={name}><div className="catalog-image"><img src={`/images/${image}`} alt={alt} /></div><div className="catalog-card-copy"><small>{category}</small><h3>{name}</h3><p>{text}</p><span className="material-symbols-outlined">arrow_forward</span></div></a>)}
          </div>
        </div>
      </section>
      <section className="standards-strip section-pad" id="custom">
        <div className="container standards-strip-grid"><div><h2>Specify the standard.<br />We make it happen.</h2><p>ASME / ANSI, GB, DIN, EN 1092-1, JIS, BS and API requirements are supported. Send your drawing for a non-standard review.</p></div><div className="standards-list"><span>ASME / ANSI</span><span>DIN / EN 1092-1</span><span>JIS / BS / GB</span><span>API &amp; Custom Drawings</span></div></div>
      </section>
    </PageFrame>
  );
}
