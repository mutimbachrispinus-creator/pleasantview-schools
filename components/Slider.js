'use client';
import { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';

export default function Slider({ slides = [], base = '' }) {
  const defaultImages = [
    '/images/banner_1_a.webp',
    '/images/banner_2_a.webp',
    '/images/banner_3_a.webp',
    '/images/hero_science_lab.jpg',
    '/images/hero_sports_field.jpg',
    '/images/hero_library_learning.jpg'
  ];

  const safeSlides = slides.length > 0 ? slides : [
    {
      image: '/images/hero_science_lab.jpg',
      headline: 'PLEASANT VIEW SCHOOLS',
      sub: 'Our Aim is Victory — Transforming Hearts, Minds, Bodies and Souls of Tomorrow’s Leaders',
      button_text: 'Discover More',
      button_link: '/#pillars',
      button_alt_text: 'Book A Visit',
      button_alt_link: '/contact#visit'
    },
    {
      image: '/images/hero_sports_field.jpg',
      headline: '24 YEARS OF ACADEMIC EXCELLENCE',
      sub: 'Outstanding KPSEA (EE — Exceeding Expectations) and KJSEA (ME1) distinction, with maiden KCSE B+ university transition',
      button_text: 'Our Academics',
      button_link: '/about#academics',
      button_alt_text: 'Admissions Desk',
      button_alt_link: '/contact'
    },
    {
      image: '/images/hero_library_learning.jpg',
      headline: 'HOLISTIC CHARACTER & MENTORSHIP',
      sub: 'Cultivating sportsmanship, physical resilience, teamwork, and Christian leadership on expansive green grounds',
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

  // Automatic slide background transitions (every 5 seconds)
  useEffect(() => {
    if (total <= 1 || isPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [total, isPaused, nextSlide]);

  // Touch swipe support on phones
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

  // Clean, robust headline strictly splitting PLEASANT VIEW
  const rawHeadline = String(active?.headline || '').trim();
  const activeHeadline = (rawHeadline || '24 YEARS OF ACADEMIC EXCELLENCE')
    .replace(/PLEASANTVIEW/g, 'PLEASANT VIEW')
    .replace(/Pleasantview/g, 'Pleasant View');
  const activeSub = String(active?.sub || '')
    .replace(/PLEASANTVIEW/g, 'PLEASANT VIEW')
    .replace(/Pleasantview/g, 'Pleasant View');

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
          <div className="hero-eyebrow">
            <span>ESTABLISHED 1998</span>
            <span className="hero-eyebrow-sep">&bull;</span>
            <span>GITHUNGURI, KIAMBU</span>
          </div>

          <h1 className="hero-main-title">
            {activeHeadline}
          </h1>

          <p className="hero-sub-text">
            {activeSub || 'Our Aim is Victory — Transforming Hearts, Minds, Bodies and Souls of Tomorrow’s Leaders.'}
          </p>

          <div className="hero-actions">
            <Link className="button button-gold hero-btn-main" href={primaryLink}>
              {primaryText} <i className="fa-solid fa-arrow-right-long" style={{ marginLeft: '8px' }} />
            </Link>
            <Link className="button hero-btn-sec" href={secondaryLink}>
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
