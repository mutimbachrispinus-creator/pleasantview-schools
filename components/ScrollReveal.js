'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let isMutating = false;
    let animationFrameId = null;
    let observer = null;
    let mutationObserver = null;

    // 1. ENSURE ALL PARAGRAPH CONTAINERS REMAIN CRISP & FULLY READABLE (NO WORD DIMMING)
    const setupWordRevealContainers = () => {
      const existingWords = document.querySelectorAll('.scroll-word');
      if (!existingWords || existingWords.length === 0) return;
      isMutating = true;
      existingWords.forEach(word => {
        word.classList.add('is-lit');
      });
      isMutating = false;
    };

    const updateWordIllumination = () => {
      // Keep all text at full 100% contrast & crispness at every scroll position
    };

    // 2. INTERSECTION OBSERVER FOR SITE-WIDE PANEL & CARD TRANSITIONS
    const setupPanelTransitions = () => {
      const panelSelectors = [
        '.panel-reveal',
        '.custom-form',
        '.contact-side-column > div',
        '.overview-card',
        '.pillar-card',
        '.division-card',
        '.testimonial-card',
        '.stat-card',
        '.metric-card',
        '.news-card',
        '.spotlight-card',
        '.at-a-glance-card',
        '.program-card',
        '.voices-card',
        '.review-card',
        '.campus-card',
        '.academic-card',
        '.leadership-card',
        '.alumni-card',
        '.reveal-on-scroll'
      ];

      const panels = document.querySelectorAll(panelSelectors.join(', '));
      const windowHeight = window.innerHeight || 800;

      if ('IntersectionObserver' in window) {
        if (observer) observer.disconnect();

        observer = new IntersectionObserver(
          entries => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                entry.target.classList.add('is-revealed');
                observer.unobserve(entry.target);
              }
            });
          },
          {
            rootMargin: '0px 0px -20px 0px',
            threshold: 0.02
          }
        );

        panels.forEach(panel => {
          panel.classList.add('panel-reveal');
          const rect = panel.getBoundingClientRect();
          // If already in or above viewport, reveal immediately without flicker
          if (rect.top < windowHeight * 0.98 && rect.bottom > 0) {
            panel.classList.add('is-revealed');
          } else if (!panel.classList.contains('is-revealed')) {
            observer.observe(panel);
          }
        });
      } else {
        panels.forEach(panel => panel.classList.add('is-revealed'));
      }
    };

    // 5. EVENT BINDING WITH THROTTLED ANIMATION FRAME
    const onScrollOrResize = () => {
      if (animationFrameId) return;
      animationFrameId = requestAnimationFrame(() => {
        updateWordIllumination();
        animationFrameId = null;
      });
    };

    // Run initial passes
    setupWordRevealContainers();
    setupPanelTransitions();
    updateWordIllumination();

    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize, { passive: true });

    // 6. MUTATION OBSERVER WITH RE-ENTRANCY SAFEGUARD
    mutationObserver = new MutationObserver((mutations) => {
      if (isMutating) return;
      // Debounce slight DOM adjustments
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(() => {
        setupWordRevealContainers();
        setupPanelTransitions();
        updateWordIllumination();
        animationFrameId = null;
      });
    });

    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (observer) observer.disconnect();
      if (mutationObserver) mutationObserver.disconnect();
    };
  }, [pathname]);

  return null;
}
