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

    // 1. ROBUST RECURSIVE WORD SPLITTER
    const wrapWordsInNode = (node) => {
      if (node.nodeType === 3) {
        // Text node
        const text = node.nodeValue;
        if (!text || !text.trim()) return null;
        const tokens = text.split(/(\s+)/);
        const fragment = document.createDocumentFragment();
        tokens.forEach(token => {
          if (!token) return;
          if (/^\s+$/.test(token)) {
            fragment.appendChild(document.createTextNode(token));
          } else {
            const span = document.createElement('span');
            span.className = 'scroll-word';
            span.textContent = token;
            fragment.appendChild(span);
          }
        });
        return fragment;
      } else if (node.nodeType === 1) {
        // Element node: skip if already wrapped or marked no-split
        if (node.classList.contains('scroll-word') || node.classList.contains('no-word-split')) {
          return null;
        }
        // Do not split inside form inputs, buttons, icons, or badges
        const tag = node.tagName.toLowerCase();
        if (['button', 'input', 'select', 'textarea', 'i', 'svg', 'code'].includes(tag)) {
          return null;
        }
        const children = Array.from(node.childNodes);
        children.forEach(child => {
          const replacement = wrapWordsInNode(child);
          if (replacement) {
            node.replaceChild(replacement, child);
          }
        });
      }
      return null;
    };

    // 2. SETUP WORD REVEAL CONTAINERS (Resilient against React Re-renders)
    const setupWordRevealContainers = () => {
      const selectors = [
        '.scroll-word-reveal',
        '.director-content p',
        '.director-quote',
        '.text-component p',
        '.subpage-body p:not(.custom-form p):not(.subpage-nav-bar p)',
        '.lead:not(.custom-form *)',
        '.section-intro',
        '.voices-quote',
        '.alumni-quote',
        '.head-message p'
      ];

      const containers = document.querySelectorAll(selectors.join(', '));
      if (!containers || containers.length === 0) return;

      isMutating = true;
      containers.forEach(container => {
        // Check if words are already wrapped
        const existingWords = container.querySelectorAll('.scroll-word');
        if (existingWords.length === 0 && container.textContent.trim().length > 0) {
          container.classList.add('scroll-word-reveal');
          wrapWordsInNode(container);
        }
      });
      isMutating = false;
    };

    // 3. CONTINUOUS SCROLL-LINKED WORD ILLUMINATION
    const updateWordIllumination = () => {
      const containers = document.querySelectorAll('.scroll-word-reveal');
      const windowHeight = window.innerHeight || 800;

      containers.forEach(container => {
        const rect = container.getBoundingClientRect();
        // Illuminates progressively as element enters viewport
        const triggerStart = windowHeight * 0.92;
        const triggerEnd = windowHeight * 0.18;
        const totalDistance = rect.height + (triggerStart - triggerEnd);
        const scrolledDistance = triggerStart - rect.top;
        const rawProgress = totalDistance > 0 ? scrolledDistance / totalDistance : 0;
        const linearProgress = Math.min(Math.max(rawProgress, 0), 1);
        // Smooth sine ease
        const progress = Math.sin((linearProgress * Math.PI) / 2);

        const words = container.querySelectorAll('.scroll-word');
        const totalWords = words.length;
        if (totalWords === 0) return;

        // Multiply by 1.15 to ensure paragraph is fully illuminated when centered
        const targetLitCount = Math.floor(progress * totalWords * 1.15);

        for (let i = 0; i < totalWords; i++) {
          if (i < targetLitCount) {
            if (!words[i].classList.contains('is-lit')) {
              words[i].classList.add('is-lit');
            }
          } else {
            if (words[i].classList.contains('is-lit')) {
              words[i].classList.remove('is-lit');
            }
          }
        }
      });
    };

    // 4. INTERSECTION OBSERVER FOR SITE-WIDE PANEL & CARD TRANSITIONS
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
        '.reveal-on-scroll'
      ];

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
            rootMargin: '0px 0px -40px 0px',
            threshold: 0.05
          }
        );

        const panels = document.querySelectorAll(panelSelectors.join(', '));
        const windowHeight = window.innerHeight || 800;

        panels.forEach(panel => {
          panel.classList.add('panel-reveal');
          const rect = panel.getBoundingClientRect();
          // If already in or above viewport, reveal immediately without flicker
          if (rect.top < windowHeight * 0.95 && rect.bottom > 0) {
            panel.classList.add('is-revealed');
          } else if (!panel.classList.contains('is-revealed')) {
            observer.observe(panel);
          }
        });
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
