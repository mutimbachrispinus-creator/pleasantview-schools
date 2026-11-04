'use client';
import { useEffect } from 'react';

export default function ScrollReveal() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. HELPER: WRAP TEXT NODES INTO WORD SPANS FOR GRADUAL WORD ILLUMINATION
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
      } else if (node.nodeType === 1 && !node.classList.contains('scroll-word') && !node.classList.contains('no-word-split')) {
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

    // Initialize all containers with .scroll-word-reveal
    const setupWordRevealContainers = () => {
      // Target explicitly designated containers as well as editorial text blocks across the portal
      const containers = document.querySelectorAll(
        '.scroll-word-reveal:not([data-words-ready]), .text-component p:not([data-words-ready]), .director-content p:not([data-words-ready]), .director-quote:not([data-words-ready]), .subpage-body p:not([data-words-ready]):not(.custom-form p):not(.subpage-nav-bar p)'
      );
      containers.forEach(container => {
        container.setAttribute('data-words-ready', 'true');
        container.classList.add('scroll-word-reveal');
        wrapWordsInNode(container);
      });
    };

    setupWordRevealContainers();

    // 2. SCROLL DRIVEN WORD ILLUMINATION (Apple & St Andrew's Turi Signature Experience)
    let animationFrameId = null;

    const updateWordIllumination = () => {
      const containers = document.querySelectorAll('.scroll-word-reveal[data-words-ready="true"]');
      const windowHeight = window.innerHeight || 800;

      containers.forEach(container => {
        const rect = container.getBoundingClientRect();
        // Trigger range: starts illuminating when top is at 88% of window, fully illuminated when bottom reaches 20%
        const triggerStart = windowHeight * 0.88;
        const triggerEnd = windowHeight * 0.22;
        const totalDistance = rect.height + (triggerStart - triggerEnd);
        const scrolledDistance = triggerStart - rect.top;
        const rawProgress = totalDistance > 0 ? scrolledDistance / totalDistance : 0;
        const progress = Math.min(Math.max(rawProgress, 0), 1);

        const words = container.querySelectorAll('.scroll-word');
        const totalWords = words.length;
        if (totalWords === 0) return;

        // Multiply by 1.15 so the paragraph is fully lit slightly before user finishes scrolling past it
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

    const onScrollOrResize = () => {
      if (animationFrameId) return;
      animationFrameId = requestAnimationFrame(() => {
        updateWordIllumination();
        animationFrameId = null;
      });
    };

    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize, { passive: true });

    // Initial pass to illuminate elements already above the fold
    updateWordIllumination();

    // 3. INTERSECTION OBSERVER FOR BLOCK & HEADING ENTRANCES (.reveal-on-scroll)
    let observer = null;
    if ('IntersectionObserver' in window) {
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
          rootMargin: '0px 0px -30px 0px',
          threshold: 0.1
        }
      );

      // Automatically observe designated elements and major headings across the portal
      const observeElements = () => {
        const elements = document.querySelectorAll(
          '.reveal-on-scroll:not(.is-revealed), .text-component h2:not(.is-revealed), .text-component .lead-badge:not(.is-revealed), .four-pillars-section h2:not(.is-revealed), .pillar-card:not(.is-revealed), .at-a-glance-card:not(.is-revealed), .program-card:not(.is-revealed), .overview-card:not(.is-revealed)'
        );
        elements.forEach(el => {
          el.classList.add('reveal-on-scroll');
          // If already in top viewport, reveal immediately
          const b = el.getBoundingClientRect();
          if (b.top < window.innerHeight * 0.95) {
            el.classList.add('is-revealed');
          } else {
            observer.observe(el);
          }
        });
      };

      observeElements();

      // Mutation observer to handle newly mounted components or dynamic routes
      const mutationObserver = new MutationObserver(() => {
        setupWordRevealContainers();
        observeElements();
        updateWordIllumination();
      });

      mutationObserver.observe(document.body, { childList: true, subtree: true });

      return () => {
        window.removeEventListener('scroll', onScrollOrResize);
        window.removeEventListener('resize', onScrollOrResize);
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        if (observer) observer.disconnect();
        mutationObserver.disconnect();
      };
    }

    return () => {
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return null;
}
