'use client';

import { useEffect, useState } from 'react';
import { heroSlides } from '../content/homepage';

function SlideMedia({ slide, active }) {
  if (slide.media === 'product-collage') {
    return (
      <div className={`carousel-media product-collage ${active ? 'is-active' : ''}`} aria-label={slide.alt}>
        {slide.images.map((image, index) => <img key={image} src={image} alt={`Finished stainless steel flange product view ${index + 1}`} />)}
      </div>
    );
  }

  if (slide.media === 'warehouse-collage') {
    return (
      <div className={`carousel-media warehouse-collage ${active ? 'is-active' : ''}`} aria-label={slide.alt}>
        {slide.images.map((image, index) => <img key={image} src={image} alt={`LP Flange warehouse stock view ${index + 1}`} />)}
      </div>
    );
  }

  return <img className={`carousel-image ${active ? 'is-active' : ''}`} src={slide.image} alt={slide.alt} />;
}

export default function HeroCarousel() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return undefined;
    const timer = window.setInterval(() => setActive((current) => (current + 1) % heroSlides.length), 6500);
    return () => window.clearInterval(timer);
  }, [paused]);

  const slide = heroSlides[active];
  const next = () => setActive((current) => (current + 1) % heroSlides.length);
  const previous = () => setActive((current) => (current - 1 + heroSlides.length) % heroSlides.length);

  return (
    <section className="hero-carousel" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} aria-label="LP Flange manufacturing highlights">
      {heroSlides.map((item, index) => <SlideMedia slide={item} active={index === active} key={item.title} />)}
      <div className="carousel-shade" />
      <div className="container carousel-inner">
        <div className="carousel-copy" key={slide.title}>
          <div className="carousel-kicker"><span className="material-symbols-outlined filled">precision_manufacturing</span>{slide.kicker}</div>
          <h1>{slide.title}</h1>
          <p>{slide.text}</p>
          {slide.advantages ? <div className="carousel-advantages">{slide.advantages.map((advantage) => <span key={advantage}>{advantage}</span>)}</div> : null}
          {slide.stock ? <div className="carousel-facts"><span><b>{slide.stock}</b><small>Ready for fast order response</small></span></div> : null}
          {slide.standards ? <div className="carousel-facts standards-facts"><span><b>{slide.standards}</b><small>Worldwide standards</small></span><span><b>{slide.capacity}</b><small>{slide.capacityLabel}</small></span></div> : null}
          <div className="button-row"><a className="carousel-primary" href={slide.primaryHref}>{slide.primaryLabel}</a><a className="carousel-secondary" href="mailto:sales@lpflange.com?subject=Flange%20RFQ">Talk to sales <span className="material-symbols-outlined">arrow_forward</span></a></div>
        </div>
        <div className="carousel-meta"><span>LP FLANGE / 0{active + 1}</span><span>{String(active + 1).padStart(2, '0')} / {String(heroSlides.length).padStart(2, '0')}</span></div>
        <div className="carousel-controls"><button onClick={previous} aria-label="Previous slide"><span className="material-symbols-outlined">arrow_back</span></button><div className="carousel-dots">{heroSlides.map((item, index) => <button className={index === active ? 'active' : ''} key={item.title} onClick={() => setActive(index)} aria-label={`Go to slide ${index + 1}`} />)}</div><button onClick={next} aria-label="Next slide"><span className="material-symbols-outlined">arrow_forward</span></button></div>
      </div>
    </section>
  );
}
