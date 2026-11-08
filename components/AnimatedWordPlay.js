'use client';
import { useState, useEffect } from 'react';

/**
 * AnimatedWordPlay
 * High-class animated rotating word component for institutional school headlines.
 * Cycles smoothly through inspirational words with kinetic vertical slide & fade.
 */
export default function AnimatedWordPlay({
  words = ['Leaders', 'Innovators', 'Scholars', 'Champions', 'Visionaries'],
  interval = 2600,
  className = ''
}) {
  const [index, setIndex] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (!words || words.length <= 1) return;

    const timer = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setIndex(prev => (prev + 1) % words.length);
        setAnimating(false);
      }, 350); // halfway transition
    }, interval);

    return () => clearInterval(timer);
  }, [words, interval]);

  const currentWord = words[index] || words[0];

  return (
    <span
      className={`word-play-badge ${className}`}
      aria-label={currentWord}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        verticalAlign: 'middle',
        position: 'relative',
        overflow: 'hidden',
        minWidth: '120px',
        textAlign: 'center',
        padding: '3px 14px',
        borderRadius: '6px',
        background: 'linear-gradient(135deg, rgba(139,30,45,0.08), rgba(30,35,42,0.05))',
        border: '1px solid rgba(139,30,45,0.22)',
        boxShadow: '0 2px 10px rgba(139,30,45,0.05)',
        margin: '0 4px'
      }}
    >
      <span
        style={{
          display: 'inline-block',
          fontFamily: 'var(--font-serif, Cinzel, serif)',
          fontWeight: 800,
          letterSpacing: '1px',
          color: 'var(--primary-red, #8B1E2D)',
          transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
          transform: animating ? 'translateY(-14px) scale(0.95)' : 'translateY(0) scale(1)',
          opacity: animating ? 0 : 1,
          whiteSpace: 'nowrap'
        }}
      >
        {currentWord}
      </span>
    </span>
  );
}
