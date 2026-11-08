'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let isMutating = false;
    let animationFrameId = null;
    let panelObserver = null;
    let countObserver = null;
    let mutationObserver = null;

    // =========================================================================
    // 1. WORD PLAY ON SCROLL: PROGRESSIVE WORD TOKENIZER & ILLUMINATION
    // =========================================================================

    /**
     * Recursively wraps text node words in `<span class="scroll-word">word</span> `
     * while preserving all HTML tags (like <strong>, <em>, <a>).
     */
    const tokenizeTextNodes = (node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent;
        if (!text || !text.trim()) return;

        const words = text.split(/(\s+)/);
        const fragment = document.createDocumentFragment();

        words.forEach(token => {
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

        node.parentNode.replaceChild(fragment, node);
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        // Do not re-tokenize already processed words or interactive controls
        if (node.classList.contains('scroll-word') || node.tagName === 'SCRIPT' || node.tagName === 'STYLE') {
          return;
        }
        Array.from(node.childNodes).forEach(tokenizeTextNodes);
      }
    };

    const setupWordRevealContainers = () => {
      const containers = document.querySelectorAll('.scroll-word-reveal');
      if (!containers || containers.length === 0) return;

      isMutating = true;
      containers.forEach(container => {
        if (container.dataset.wordsSplit === 'true') return;
        tokenizeTextNodes(container);
        container.dataset.wordsSplit = 'true';
      });
      isMutating = false;
    };

    /**
     * Calculates scroll progress through `.scroll-word-reveal` containers
     * and sequentially lights up words matching the St Andrew's Turi signature.
     */
    const updateWordIllumination = () => {
      const containers = document.querySelectorAll('.scroll-word-reveal[data-words-split="true"]');
      if (!containers || containers.length === 0) return;

      const vh = window.innerHeight || 800;

      containers.forEach(container => {
        const rect = container.getBoundingClientRect();
        const words = container.querySelectorAll('.scroll-word');
        if (!words || words.length === 0) return;

        // Start revealing when container top enters bottom 88% of screen
        // Fully reveal by the time container top reaches upper 32% of screen
        const startY = vh * 0.88;
        const endY = vh * 0.32;

        if (rect.top <= endY) {
          // Fully in view / above viewport: all words lit
          words.forEach(w => {
            if (!w.classList.contains('is-lit')) w.classList.add('is-lit');
          });
        } else if (rect.top >= startY) {
          // Below viewport: all words unlit
          words.forEach(w => {
            if (w.classList.contains('is-lit')) w.classList.remove('is-lit');
          });
        } else {
          // In transition window: progressive sequential word illumination
          const progress = Math.min(1, Math.max(0, (startY - rect.top) / (startY - endY)));
          const litThreshold = Math.floor(progress * words.length);

          words.forEach((w, idx) => {
            if (idx <= litThreshold) {
              if (!w.classList.contains('is-lit')) w.classList.add('is-lit');
            } else {
              if (w.classList.contains('is-lit')) w.classList.remove('is-lit');
            }
          });
        }
      });
    };

    // =========================================================================
    // 2. COUNT PLAY ON SCROLL: INTERACTIVE SMOOTH NUMERICAL COUNTERS
    // =========================================================================

    const setupCountPlayOnScroll = () => {
      const countTargets = document.querySelectorAll(
        '.stat-num, [data-count], .at-a-glance-card .stat-num, .stat-card .stat-num'
      );
      if (!countTargets || countTargets.length === 0) return;

      if (!('IntersectionObserver' in window)) {
        // Fallback: leave static text intact
        return;
      }

      if (countObserver) countObserver.disconnect();

      countObserver = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const targetEl = entry.target;
              obs.unobserve(targetEl);

              if (targetEl.dataset.counted === 'true') return;
              targetEl.dataset.counted = 'true';

              const raw = (targetEl.dataset.targetVal || targetEl.textContent || '').trim();
              if (!raw) return;
              targetEl.dataset.targetVal = raw;

              // Parse prefix, number, and suffix: e.g. "600+" -> "", 600, "+"
              // e.g. "1:20" -> "1:", 20, ""
              // e.g. "100%" -> "", 100, "%"
              // e.g. "28" -> "", 28, ""
              const match = raw.match(/^([^\d]*?)(\d+(?:\.\d+)?)([^\d]*)$/);

              if (match) {
                const prefix = match[1] || '';
                const numStr = match[2];
                const suffix = match[3] || '';
                const targetNum = parseFloat(numStr);
                const isFloat = numStr.includes('.');
                const decimals = isFloat ? numStr.split('.')[1].length : 0;
                const duration = 1800; // 1.8s smooth duration
                const startTime = performance.now();

                targetEl.classList.add('is-counting');

                const animateCount = (now) => {
                  const elapsed = now - startTime;
                  const progress = Math.min(1, elapsed / duration);
                  // Smooth easeOutCubic: 1 - Math.pow(1 - progress, 3)
                  const ease = 1 - Math.pow(1 - progress, 3);
                  const currentVal = targetNum * ease;

                  targetEl.textContent = `${prefix}${currentVal.toFixed(decimals)}${suffix}`;

                  if (progress < 1) {
                    requestAnimationFrame(animateCount);
                  } else {
                    targetEl.textContent = raw; // Restore original exact string
                    targetEl.classList.remove('is-counting');
                    targetEl.classList.add('counted');
                  }
                };

                requestAnimationFrame(animateCount);
              } else {
                // Non-pure numeric values (e.g. "EE & ME1", "KCSE B+")
                // Provide high-class badge pulse & shine
                targetEl.classList.add('is-counting');
                setTimeout(() => {
                  targetEl.classList.remove('is-counting');
                  targetEl.classList.add('counted');
                }, 600);
              }
            }
          });
        },
        {
          rootMargin: '0px 0px -40px 0px',
          threshold: 0.15
        }
      );

      countTargets.forEach(el => {
        if (!el.dataset.targetVal) {
          el.dataset.targetVal = el.textContent.trim();
        }
        if (el.dataset.counted !== 'true') {
          countObserver.observe(el);
        }
      });
    };

    // =========================================================================
    // 3. SITE-WIDE PANEL & CARD TRANSITIONS
    // =========================================================================

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
        if (panelObserver) panelObserver.disconnect();

        panelObserver = new IntersectionObserver(
          entries => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                entry.target.classList.add('is-revealed');
                panelObserver.unobserve(entry.target);
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
          if (rect.top < windowHeight * 0.98 && rect.bottom > 0) {
            panel.classList.add('is-revealed');
          } else if (!panel.classList.contains('is-revealed')) {
            panelObserver.observe(panel);
          }
        });
      } else {
        panels.forEach(panel => panel.classList.add('is-revealed'));
      }
    };

    // =========================================================================
    // 4. EVENT BINDING WITH THROTTLED ANIMATION FRAME
    // =========================================================================

    const onScrollOrResize = () => {
      if (animationFrameId) return;
      animationFrameId = requestAnimationFrame(() => {
        updateWordIllumination();
        animationFrameId = null;
      });
    };

    // Initial Execution
    setupWordRevealContainers();
    setupPanelTransitions();
    setupCountPlayOnScroll();
    updateWordIllumination();

    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize, { passive: true });

    // Mutation Observer with Re-entrancy Safeguard for Dynamic Client Routing
    mutationObserver = new MutationObserver(() => {
      if (isMutating) return;
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(() => {
        setupWordRevealContainers();
        setupPanelTransitions();
        setupCountPlayOnScroll();
        updateWordIllumination();
        animationFrameId = null;
      });
    });

    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (panelObserver) panelObserver.disconnect();
      if (countObserver) countObserver.disconnect();
      if (mutationObserver) mutationObserver.disconnect();
    };
  }, [pathname]);

  return null;
}
