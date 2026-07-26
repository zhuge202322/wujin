'use client';

import { useEffect, useState } from 'react';

const slides = [
  {
    image: '/images/factory-cnc.jpg',
    alt: 'CNC machining workshop at LP Flange',
    kicker: 'STAINLESS STEEL FLANGE MANUFACTURER',
    title: 'Precision flanges for demanding systems.',
    text: 'LP Flange supplies stainless steel flange components to international standards, with the production discipline and communication global buyers expect.',
    action: 'Explore products'
  },
  {
    image: '/images/stock-1.jpg',
    alt: 'Stainless steel flanges in the LP Flange stock area',
    kicker: 'STANDARD & PROJECT SUPPLY',
    title: 'The right connection, ready for the next step.',
    text: 'From repeat distributor orders to project-specific quantities, we keep product selection, dimensions and delivery details clear.',
    action: 'View product range'
  },
  {
    image: '/images/factory-floor.jpg',
    alt: 'Production floor with CNC equipment',
    kicker: 'CNC & NUMERICAL CONTROL MACHINING',
    title: 'A practical production partner for global trade.',
    text: 'Our Taizhou workshop supports stainless steel flange production with CNC equipment, order control and inspection at every critical stage.',
    action: 'See our capabilities'
  },
  {
    image: '/images/custom-flange.jpg',
    alt: 'Custom stainless steel flange examples',
    kicker: 'CUSTOM FLANGE PRODUCTION',
    title: 'Your drawing is where the conversation starts.',
    text: 'Send a drawing, sample or specification. We review special dimensions and help turn non-standard requirements into a manufacturable order.',
    action: 'Start a custom RFQ'
  }
];

export default function HeroCarousel() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return undefined;
    const timer = window.setInterval(() => setActive((current) => (current + 1) % slides.length), 6500);
    return () => window.clearInterval(timer);
  }, [paused]);

  const slide = slides[active];
  const next = () => setActive((current) => (current + 1) % slides.length);
  const previous = () => setActive((current) => (current - 1 + slides.length) % slides.length);

  return (
    <section className="hero-carousel" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} aria-label="LP Flange manufacturing highlights">
      {slides.map((item, index) => <img className={`carousel-image ${index === active ? 'is-active' : ''}`} key={item.image} src={item.image} alt={item.alt} />)}
      <div className="carousel-shade" />
      <div className="container carousel-inner">
        <div className="carousel-copy" key={slide.title}>
          <div className="carousel-kicker"><span className="material-symbols-outlined filled">precision_manufacturing</span>{slide.kicker}</div>
          <h1>{slide.title}</h1>
          <p>{slide.text}</p>
          <div className="button-row"><a className="carousel-primary" href={active === 2 ? '/custom-machining' : active === 3 ? 'mailto:sales@lpflange.com?subject=Custom%20Flange%20RFQ' : '/products'}>{slide.action}</a><a className="carousel-secondary" href="mailto:sales@lpflange.com?subject=Flange%20RFQ">Talk to sales <span className="material-symbols-outlined">arrow_forward</span></a></div>
        </div>
        <div className="carousel-meta"><span>LP FLANGE / 0{active + 1}</span><span>{String(active + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}</span></div>
        <div className="carousel-controls"><button onClick={previous} aria-label="Previous slide"><span className="material-symbols-outlined">arrow_back</span></button><div className="carousel-dots">{slides.map((item, index) => <button className={index === active ? 'active' : ''} key={item.image} onClick={() => setActive(index)} aria-label={`Go to slide ${index + 1}`} />)}</div><button onClick={next} aria-label="Next slide"><span className="material-symbols-outlined">arrow_forward</span></button></div>
      </div>
    </section>
  );
}
