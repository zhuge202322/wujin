import { headerCommands, navigation } from '../content/homepage';

export function SiteHeader({ active }) {
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <a className="wordmark" href="/" aria-label="LP Flange home"><img src="/images/lpflange-wordmark.png" alt="LP Flange - Longping Metal Products Co., Ltd." /></a>
        <nav className="desktop-nav" aria-label="Main navigation">
          {navigation.map((item) => <a className={active === item.active ? 'active' : ''} href={item.href} key={item.label}>{item.label}</a>)}
        </nav>
        <div className="nav-actions">
          <a className="icon-button material-symbols-outlined" href="/products" aria-label="Search products">search</a>
          <span className="icon-button material-symbols-outlined" aria-label="English language" title="English">language</span>
          <div className="header-social" aria-label="Contact LP Flange">
            <a className="icon-button whatsapp-button" href="https://wa.me/8617826472173" aria-label="Contact LP Flange on WhatsApp" title="WhatsApp"><span aria-hidden="true">WA</span></a>
            <a className="icon-button material-symbols-outlined" href="mailto:sales@lpflange.com" aria-label="Email LP Flange">mail</a>
          </div>
          {headerCommands.map((command) => <a className={`quote-button ${command.variant === 'secondary' ? 'secondary-quote' : 'upload-drawing-button'}`} href={command.href} key={command.label}>{command.icon ? <span className="material-symbols-outlined">{command.icon}</span> : null}<span className="command-label">{command.label}</span></a>)}
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer>
      <div className="container footer-grid">
        <div className="footer-intro">
          <a className="footer-wordmark" href="/" aria-label="LP Flange home"><img src="/images/lpflange-wordmark.png" alt="LP Flange - Longping Metal Products Co., Ltd." /></a>
          <p>Stainless steel flange manufacturing for global industrial supply. Built for reliable connection.</p>
        </div>
        <div>
          <h3>Navigation</h3>
          <nav><a href="/products">Products</a><a href="/custom-machining">Capabilities</a><a href="/technical-resources">Quality Control</a><a href="/about">About Us</a></nav>
        </div>
        <div>
          <h3>Products &amp; Standards</h3>
          <nav><a href="/products">Standard Flanges</a><a href="/products#custom">Custom Flanges</a><a href="/standards">International Standards</a><a href="/technical-resources">Inspection Process</a></nav>
        </div>
        <div>
          <h3>Connect</h3>
          <div className="social-row">
            <a className="whatsapp-button" href="https://wa.me/8617826472173" aria-label="WhatsApp" title="WhatsApp"><span aria-hidden="true">WA</span></a>
            <a className="material-symbols-outlined" href="mailto:sales@lpflange.com" aria-label="Email">mail</a>
            <span className="material-symbols-outlined" aria-label="Jiangsu, China">location_on</span>
          </div>
          <p className="sales-line">Global Sales: +86 178 2647 2173</p>
        </div>
      </div>
      <div className="container footer-bottom">
        <p>&copy; 2026 Jiangsu Longping Metal Products Co., Ltd.</p>
        <div><span><i className="material-symbols-outlined">language</i> English (EN)</span><span><i className="material-symbols-outlined">public</i> Global Distribution</span></div>
      </div>
    </footer>
  );
}

export function InnerHero({ eyebrow, title, text, image, imageAlt, active }) {
  return (
    <section className="inner-hero precision-grid">
      <div className="container inner-hero-grid">
        <div className="inner-hero-copy">
          <div className="specialist-pill"><span className="material-symbols-outlined filled">precision_manufacturing</span>{eyebrow}</div>
          <h1>{title}</h1>
          <p>{text}</p>
          <div className="button-row"><a className="primary-button" href="mailto:sales@lpflange.com?subject=Flange%20RFQ">Get a Quote</a><a className="secondary-button" href="/products">View Products</a></div>
        </div>
        <div className="inner-hero-media"><div className="hero-shadow" /><img src={image} alt={imageAlt} /></div>
      </div>
    </section>
  );
}

export function PageFrame({ children, active }) {
  return <><SiteHeader active={active} /><main className="page-main">{children}<section className="shared-order-strip"><div className="container shared-order-grid"><div><p className="section-tag">ORDER SUPPORT</p><h2>Give every flange order a clearer start.</h2></div><div className="shared-order-points"><span><i className="material-symbols-outlined">description</i>Send drawings or dimensions</span><span><i className="material-symbols-outlined">fact_check</i>Confirm standards and inspection</span><span><i className="material-symbols-outlined">mail</i>Receive practical feedback</span></div><a className="primary-button" href="mailto:sales@lpflange.com?subject=Flange%20Inquiry">Send an RFQ</a></div></section><section className="shared-contact"><div className="container shared-contact-inner"><div><p className="section-tag light">LP FLANGE SALES</p><h2>Need a stainless steel flange partner?</h2></div><div><a href="mailto:sales@lpflange.com">sales@lpflange.com</a><span>+86 178 2647 2173</span></div><a className="carousel-secondary" href="mailto:sales@lpflange.com?subject=Flange%20RFQ">Contact sales <i className="material-symbols-outlined">arrow_forward</i></a></div></section></main><SiteFooter /></>;
}
