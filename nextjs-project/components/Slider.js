'use client';
import { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';

export default function Slider({ slides = [], base = '' }) {
  const defaultImages = [
    '/images/banner_1_a.webp',
    '/images/banner_2_a.webp',
    '/images/banner_3_a.webp',
    '/images/banner_4_a.webp'
  ];

  const safeSlides = slides.length > 0 ? slides : [
    {
      image: '/images/banner_1_a.webp',
      headline: 'WELCOME TO PLEASANTVIEW SCHOOLS',
      sub: 'Competent · Confident · Compassionate — Our Aim is Victory',
      button_text: 'Explore Our Schools',
      button_link: '/#schools',
      button_alt_text: 'Book a Campus Tour',
      button_alt_link: '/contact#visit'
    },
    {
      image: '/images/banner_2_a.webp',
      headline: '24 YEARS OF ACADEMIC EXCELLENCE',
      sub: 'Consistently exceeding 390/500 KCPE mean scores and B+ KCSE performance',
      button_text: 'Our Academics',
      button_link: '/about#academics',
      button_alt_text: 'Admissions Desk',
      button_alt_link: '/contact'
    },
    {
      image: '/images/banner_3_a.webp',
      headline: 'HOLISTIC CHARACTER & MENTORSHIP',
      sub: 'Nurturing innovators, athletes, and leaders guided by strong Christian values',
      button_text: 'Campus Life',
      button_link: '/about#life',
      button_alt_text: 'Book a Campus Tour',
      button_alt_link: '/contact#visit'
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

      {/* ROTATED SIDE BUTTONS - Exactly like St Andrew's Turi */}
      <div className="hero-buttons">
        <Link className="hero-button light-blue" href={base ? base + '/visit' : '/contact#visit'}>
          <i className="fa-regular fa-calendar-check" /> Book A Visit
        </Link>
        <Link className="hero-button dark-blue" href={base ? base + '/contact' : '/contact'}>
          <i className="fa-solid fa-file-pen" /> Apply Now
        </Link>
      </div>

      <div className="wrapper" style={{ position: 'relative', zIndex: 12 }}>
        <div className="hero-content">
          <h5>OUR AIM IS VICTORY &bull; ESTABLISHED 1998</h5>
          <h1>{active.headline || 'WELCOME TO PLEASANTVIEW SCHOOLS'}</h1>
          <p>{active.sub || 'A 24-year history of providing quality lifelong education that prepares children for success inside and outside the classroom.'}</p>
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
