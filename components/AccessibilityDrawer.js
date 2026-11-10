'use client';
import { useState, useEffect } from 'react';

export default function AccessibilityDrawer({ phone = '+254 711 689 913', whatsappUrl = 'https://wa.me/254711689913' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [fontSize, setFontSize] = useState('normal'); // 'normal' | 'lg' | 'xl'
  const [highContrast, setHighContrast] = useState(false);
  const [dyslexicFont, setDyslexicFont] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  // Load preferences from localStorage on mount
  useEffect(() => {
    try {
      const savedFs = localStorage.getItem('pvs_a11y_fs') || 'normal';
      const savedHc = localStorage.getItem('pvs_a11y_hc') === 'true';
      const savedDf = localStorage.getItem('pvs_a11y_df') === 'true';
      const savedRm = localStorage.getItem('pvs_a11y_rm') === 'true';

      setFontSize(savedFs);
      setHighContrast(savedHc);
      setDyslexicFont(savedDf);
      setReduceMotion(savedRm);

      applyClasses(savedFs, savedHc, savedDf, savedRm);
    } catch (e) {
      // ignore in private browsing or disabled storage
    }
  }, []);

  const applyClasses = (fs, hc, df, rm) => {
    const root = document.documentElement;
    root.classList.remove('a11y-font-lg', 'a11y-font-xl');
    if (fs === 'lg') root.classList.add('a11y-font-lg');
    if (fs === 'xl') root.classList.add('a11y-font-xl');

    if (hc) root.classList.add('a11y-high-contrast');
    else root.classList.remove('a11y-high-contrast');

    if (df) root.classList.add('a11y-dyslexic');
    else root.classList.remove('a11y-dyslexic');

    if (rm) root.classList.add('a11y-reduce-motion');
    else root.classList.remove('a11y-reduce-motion');
  };

  const updateFontSize = (size) => {
    setFontSize(size);
    try { localStorage.setItem('pvs_a11y_fs', size); } catch (e) {}
    applyClasses(size, highContrast, dyslexicFont, reduceMotion);
  };

  const toggleHighContrast = () => {
    const next = !highContrast;
    setHighContrast(next);
    try { localStorage.setItem('pvs_a11y_hc', String(next)); } catch (e) {}
    applyClasses(fontSize, next, dyslexicFont, reduceMotion);
  };

  const toggleDyslexicFont = () => {
    const next = !dyslexicFont;
    setDyslexicFont(next);
    try { localStorage.setItem('pvs_a11y_df', String(next)); } catch (e) {}
    applyClasses(fontSize, highContrast, next, reduceMotion);
  };

  const toggleReduceMotion = () => {
    const next = !reduceMotion;
    setReduceMotion(next);
    try { localStorage.setItem('pvs_a11y_rm', String(next)); } catch (e) {}
    applyClasses(fontSize, highContrast, dyslexicFont, next);
  };

  const resetAll = () => {
    setFontSize('normal');
    setHighContrast(false);
    setDyslexicFont(false);
    setReduceMotion(false);
    try {
      localStorage.removeItem('pvs_a11y_fs');
      localStorage.removeItem('pvs_a11y_hc');
      localStorage.removeItem('pvs_a11y_df');
      localStorage.removeItem('pvs_a11y_rm');
    } catch (e) {}
    applyClasses('normal', false, false, false);
  };

  const openSearch = () => {
    setIsOpen(false);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('open-quick-search'));
    }
  };

  return (
    <>
      {/* FLOATING ACCESSIBILITY BUTTON */}
      <button
        type="button"
        className="accessibility-floating-btn"
        onClick={() => setIsOpen(true)}
        aria-label="Open Accessibility & Assistive Tools"
        title="Accessibility & Assistive Tools"
      >
        <i className="fa-solid fa-universal-access" />
      </button>

      {/* ACCESSIBILITY MODAL / DRAWER */}
      {isOpen && (
        <div
          className="a11y-backdrop"
          onClick={() => setIsOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Accessibility & Display Settings"
        >
          <div className="a11y-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="a11y-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div className="a11y-icon-badge">
                  <i className="fa-solid fa-universal-access" />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '18px', color: '#1E232A' }}>Accessibility &amp; Assist</h3>
                  <small style={{ color: '#64748b', fontSize: '12.5px' }}>Customize reading and viewing experience</small>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="a11y-close-btn"
                aria-label="Close accessibility options"
              >
                &times;
              </button>
            </div>

            <div className="a11y-body">
              {/* TEXT SIZING */}
              <div className="a11y-section">
                <span className="a11y-label">
                  <i className="fa-solid fa-text-height" /> Text Sizing
                </span>
                <div className="a11y-btn-group">
                  <button
                    type="button"
                    onClick={() => updateFontSize('normal')}
                    className={`a11y-toggle-btn ${fontSize === 'normal' ? 'active' : ''}`}
                  >
                    Default (100%)
                  </button>
                  <button
                    type="button"
                    onClick={() => updateFontSize('lg')}
                    className={`a11y-toggle-btn ${fontSize === 'lg' ? 'active' : ''}`}
                  >
                    Large (115%)
                  </button>
                  <button
                    type="button"
                    onClick={() => updateFontSize('xl')}
                    className={`a11y-toggle-btn ${fontSize === 'xl' ? 'active' : ''}`}
                  >
                    X-Large (130%)
                  </button>
                </div>
              </div>

              {/* HIGH CONTRAST */}
              <div className="a11y-row">
                <div>
                  <strong style={{ display: 'block', fontSize: '14.5px', color: '#1E232A' }}>
                    <i className="fa-solid fa-circle-half-stroke" style={{ marginRight: '6px', color: '#8B1E2D' }} /> High Contrast Mode
                  </strong>
                  <small style={{ color: '#64748b', fontSize: '12px' }}>Increases border and text distinction for readability</small>
                </div>
                <button
                  type="button"
                  onClick={toggleHighContrast}
                  className={`a11y-switch ${highContrast ? 'on' : ''}`}
                  aria-pressed={highContrast}
                >
                  <span className="switch-handle" />
                </button>
              </div>

              {/* DYSLEXIA FONT */}
              <div className="a11y-row">
                <div>
                  <strong style={{ display: 'block', fontSize: '14.5px', color: '#1E232A' }}>
                    <i className="fa-solid fa-font" style={{ marginRight: '6px', color: '#8B1E2D' }} /> Enhanced Legibility Font
                  </strong>
                  <small style={{ color: '#64748b', fontSize: '12px' }}>Uses highly legible clean letterforms</small>
                </div>
                <button
                  type="button"
                  onClick={toggleDyslexicFont}
                  className={`a11y-switch ${dyslexicFont ? 'on' : ''}`}
                  aria-pressed={dyslexicFont}
                >
                  <span className="switch-handle" />
                </button>
              </div>

              {/* REDUCED MOTION */}
              <div className="a11y-row">
                <div>
                  <strong style={{ display: 'block', fontSize: '14.5px', color: '#1E232A' }}>
                    <i className="fa-solid fa-person-walking" style={{ marginRight: '6px', color: '#8B1E2D' }} /> Reduce Motion
                  </strong>
                  <small style={{ color: '#64748b', fontSize: '12px' }}>Silences autoplay and large sliding animations</small>
                </div>
                <button
                  type="button"
                  onClick={toggleReduceMotion}
                  className={`a11y-switch ${reduceMotion ? 'on' : ''}`}
                  aria-pressed={reduceMotion}
                >
                  <span className="switch-handle" />
                </button>
              </div>

              {/* QUICK ASSIST ACTIONS */}
              <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px solid #e2e8f0' }}>
                <span className="a11y-label">
                  <i className="fa-solid fa-bolt" /> Quick Assistance
                </span>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '8px' }}>
                  <button
                    type="button"
                    onClick={openSearch}
                    className="a11y-action-btn"
                  >
                    <i className="fa-solid fa-magnifying-glass" /> Quick Search (⌘K)
                  </button>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="a11y-action-btn"
                    style={{ color: '#15803d' }}
                  >
                    <i className="fa-brands fa-whatsapp" /> WhatsApp Help
                  </a>
                </div>
              </div>
            </div>

            <div className="a11y-footer">
              <button
                type="button"
                onClick={resetAll}
                className="a11y-reset-btn"
              >
                Reset to Default
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="button button-gold"
                style={{ padding: '8px 18px', fontSize: '13px' }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
