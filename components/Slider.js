'use client';
import { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';

export default function Slider({ slides = [], base = '' }) {
  const defaultImages = [
    '/images/hero_science_lab.jpg',
    '/images/hero_sports_field.jpg',
    '/images/hero_library_learning.jpg'
  ];

  const safeSlides = slides.length > 0 ? slides : [
    {
      image: '/images/hero_science_lab.jpg',
      headline: 'PLEASANTVIEW SCHOOLS',
      sub: 'Transforming Hearts, Minds, Bodies and Souls of Tomorrow’s Leaders',
      button_text: 'Discover More',
      button_link: '/#pillars',
      button_alt_text: 'Book A Visit',
      button_alt_link: '/contact#visit'
    },
    {
      image: '/images/hero_sports_field.jpg',
      headline: 'HOLISTIC CHARACTER & ADVENTURE',
      sub: 'Cultivating sportsmanship, physical resilience, teamwork, and Christian leadership on expansive green grounds',
      button_text: 'Sports & Co-Curricular',
      button_link: '/about#sports',
      button_alt_text: 'Our Campuses',
      button_alt_link: '/#schools'
    },
    {
      image: '/images/hero_library_learning.jpg',
      headline: '24 YEARS OF ACADEMIC DISTINCTION',
      sub: 'A sterling track record exceeding 390/500 KCPE mean scores and B+ KCSE university transition feats',
      button_text: 'Academic Curriculum',
      button_link: '/about#academics',
      button_alt_text: 'Apply Now',
      button_alt_link: '/contact'
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const total = safeSlides.length;

  const nextSlide = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    setCurrentIndex(prev => (prev - 1 + total) % total);
  }, [total]);

  const goToSlide = (idx) => {
    setCurrentIndex(idx);
  };

  useEffect(() => {
    if (total <= 1 || isPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(timer);
  }, [total, isPaused, nextSlide]);

  // Touch swipe support
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  };

  const active = safeSlides[currentIndex] || safeSlides[0];
  const primaryText = active?.button_text || (base ? 'Apply for Admission' : 'Explore Our Schools');
  const primaryLink = active?.button_link || (base ? base + '/contact' : '/#schools');
  const secondaryText = active?.button_alt_text || 'Book a Campus Tour';
  const secondaryLink = active?.button_alt_link || (base ? base + '/visit' : '/contact#visit');

  return (
    <header
      className="hero"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-label="Campus Hero Carousel"
    >
      <div className="hero-bg-slider">
        {safeSlides.map((s, n) => {
          const bgImg = s.image || defaultImages[n % defaultImages.length];
          return (
            <div
              key={n}
              className={'hero-slide' + (n === currentIndex ? ' active' : '')}
              style={{ backgroundImage: `url('${bgImg}')` }}
              role="img"
              aria-label={s.headline || `Slide ${n + 1}`}
            />
          );
        })}
      </div>

      <div className="hero-overlay" />

      <div className="wrapper" style={{ position: 'relative', zIndex: 12 }}>
        <div className="hero-content">
          <span className="hero-lead-label">WELCOME TO</span>
          <h1 className="hero-main-title">
            {(active.headline || 'PLEASANTVIEW SCHOOLS').replace(/^WELCOME TO\s+/i, '')}
            <span className="hero-sub-title">GITHUNGURI &bull; KIAMBU</span>
          </h1>
          <p className="hero-sub-text">
            {active.sub || 'Transforming Hearts, Minds, Bodies and Souls — A 24-year legacy of academic distinction and Christian character.'}
          </p>

          {/* EXACT ST ANDREW'S TURI HIGHLIGHT LINK */}
          <div className="hero-discover-wrap">
            <Link className="hero-discover-link" href={primaryLink}>
              <span>DISCOVER MORE</span>
              <i className="fa-solid fa-arrow-right-long" />
            </Link>
          </div>

          <div className="hero-actions">
            <Link className="button button-primary" href={primaryLink}>
              {primaryText} <i className="fa-solid fa-arrow-right-long" style={{ marginLeft: '8px' }} />
            </Link>
            <Link className="button button-gold" href={secondaryLink}>
              {secondaryText}
            </Link>
          </div>
        </div>
      </div>

      {/* LUXURY CAROUSEL CONTROLS */}
      {total > 1 && (
        <>
          {/* Navigation Arrows */}
          <button
            type="button"
            className="hero-nav-arrow hero-nav-prev"
            onClick={prevSlide}
            aria-label="Previous Hero Slide"
          >
            <i className="fa-solid fa-chevron-left" />
          </button>
          <button
            type="button"
            className="hero-nav-arrow hero-nav-next"
            onClick={nextSlide}
            aria-label="Next Hero Slide"
          >
            <i className="fa-solid fa-chevron-right" />
          </button>

          {/* Bottom Indicators & Slide Counter */}
          <div className="hero-controls-bar">
            <div className="hero-counter">
              <span className="current-num">0{currentIndex + 1}</span>
              <span className="counter-divider">/</span>
              <span className="total-num">0{total}</span>
            </div>
            <div className="hero-indicators">
              {safeSlides.map((_, n) => (
                <button
                  key={n}
                  type="button"
                  className={'hero-dot' + (n === currentIndex ? ' active' : '')}
                  onClick={() => goToSlide(n)}
                  aria-label={`Jump to hero slide ${n + 1}`}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </header>
  );
}
