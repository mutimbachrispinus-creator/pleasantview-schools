'use client';
import { useEffect } from 'react';

export default function ScrollReveal() {
  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            // Unobserve after revealing for optimal performance
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '0px 0px -40px 0px',
        threshold: 0.12
      }
    );

    const elements = document.querySelectorAll('.reveal-on-scroll:not(.is-revealed)');
    elements.forEach(el => observer.observe(el));

    // Handle dynamically mounted elements
    const mutationObserver = new MutationObserver(() => {
      const newElements = document.querySelectorAll('.reveal-on-scroll:not(.is-revealed)');
      newElements.forEach(el => observer.observe(el));
    });

    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  return null;
}
