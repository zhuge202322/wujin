import { InnerHero, PageFrame } from '../components/SiteChrome';

export default function AboutPage() {
  return (
    <PageFrame active="about">
      <InnerHero eyebrow="ABOUT LP FLANGE" title="A practical manufacturing partner in Taizhou" text="Taizhou Longping Metal Products Co., Ltd. has focused on stainless steel flange production since 2016, serving global distributors and industrial buyers from Dainan Town, Jiangsu, China." image="/images/factory-exterior.png" imageAlt="LP Flange factory exterior in Taizhou, China" />
      <section className="section-pad about-company"><div className="container about-company-grid"><div><h2>Built around reliable communication and production</h2><p>Our team works with customers on flange standards, dimensions, materials, quantities and delivery requirements. The goal is straightforward: make the right component, document the important details and keep the order moving.</p><p>Our main products are stainless steel flanges, supported by CNC and numerical control lathes, inspection equipment and practical production experience.</p></div><div className="about-facts"><div><strong>2016</strong><span>Founded</span></div><div><strong>2,000 m²</strong><span>Factory area</span></div><div><strong>40</strong><span>Team members</span></div><div><strong>50M</strong><span>Annual capacity</span></div></div></div></section>
      <section className="section-pad factory-section"><div className="container factory-grid"><img src="/images/factory-floor.jpg" alt="LP Flange production floor" /><div><h2>Located in Dainan Town, Taizhou</h2><p>Taizhou is an established stainless steel and industrial manufacturing center in Jiangsu. From our factory, we coordinate production and international sales for customers who need responsive, specification-led supply.</p><a className="primary-button" href="mailto:sales@lpflange.com?subject=LP%20Flange%20Introduction">Talk to our team</a></div></div></section>
      <section className="section-pad about-contact precision-grid"><div className="container"><h2>Ready to work with LP Flange?</h2><p>sales@lpflange.com &nbsp; | &nbsp; +86 178 2647 2173 &nbsp; | &nbsp; www.lpflange.com</p><a className="primary-button" href="mailto:sales@lpflange.com?subject=Flange%20Inquiry">Start a conversation</a></div></section>
    </PageFrame>
  );
}
