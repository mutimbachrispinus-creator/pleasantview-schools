'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { PICTORIAL_CATEGORIES, PICTORIAL_CATEGORY_META } from '@/lib/pictorial';

const SOURCE_LABELS = {
  news: 'Campus News',
  hero: 'Featured Highlight',
  leadership: 'Leadership',
  alumni: 'Alumni',
  learner: 'Student Voice',
  school: 'Campus Division',
  video: 'Video Highlight'
};

export default function PictorialGallery({
  photos = [],
  schools = [],
  initialCategory = 'All',
  initialSchool = '0',
  compact = false,
  maxCompactItems = 9,
  showSearch = false,
  showCampusFilter = false,
  fullPictorialHref = '/pictorial',
  fullPictorialLabel = 'Explore Full School Pictorial'
}) {
  const validPhotos = useMemo(
    () => (Array.isArray(photos) ? photos.filter(p => p && p.image) : []),
    [photos]
  );

  const [activeCategory, setActiveCategory] = useState(initialCategory || 'All');
  const [activeSchool, setActiveSchool] = useState(String(initialSchool || '0'));
  const [searchQuery, setSearchQuery] = useState('');
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  useEffect(() => {
    if (initialCategory) setActiveCategory(initialCategory);
  }, [initialCategory]);

  useEffect(() => {
    if (initialSchool != null) setActiveSchool(String(initialSchool));
  }, [initialSchool]);

  // Compute category counts after campus & search filtering so counts stay accurate
  const baseFilteredPhotos = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const schId = Number(activeSchool) || 0;

    return validPhotos.filter(p => {
      if (schId > 0 && Number(p.school_id) !== schId) {
        return false;
      }
      if (q) {
        const hay = `${p.title || ''} ${p.caption || ''} ${p.category || ''} ${p.school_name || ''}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [validPhotos, activeSchool, searchQuery]);

  const categoryTabs = useMemo(() => {
    const counts = {};
    for (const p of baseFilteredPhotos) {
      const c = p.category || 'Campus & Facilities';
      counts[c] = (counts[c] || 0) + 1;
    }

    const extraCategories = Object.keys(counts).filter(c => !PICTORIAL_CATEGORIES.includes(c));
    const allOrdered = [...PICTORIAL_CATEGORIES, ...extraCategories];

    const tabs = allOrdered
      .filter(cat => (!compact ? true : (counts[cat] || 0) > 0 || cat === activeCategory))
      .map(cat => ({
        name: cat,
        count: counts[cat] || 0,
        icon: PICTORIAL_CATEGORY_META[cat]?.icon || 'fa-solid fa-camera',
        badgeBg: PICTORIAL_CATEGORY_META[cat]?.badgeBg || 'rgba(139, 30, 45, 0.92)',
        description: PICTORIAL_CATEGORY_META[cat]?.description || ''
      }));

    return [
      {
        name: 'All',
        count: baseFilteredPhotos.length,
        icon: 'fa-solid fa-layer-group',
        badgeBg: 'var(--primary-navy)',
        description: 'All moments across laboratories, sports pitches, classrooms, boarding, and campus events'
      },
      ...tabs
    ];
  }, [baseFilteredPhotos, compact, activeCategory]);

  const filteredPhotos = useMemo(() => {
    if (!activeCategory || activeCategory === 'All') {
      return baseFilteredPhotos;
    }
    return baseFilteredPhotos.filter(p => (p.category || 'Campus & Facilities') === activeCategory);
  }, [baseFilteredPhotos, activeCategory]);

  const displayedPhotos = useMemo(() => {
    if (compact && maxCompactItems > 0) {
      return filteredPhotos.slice(0, maxCompactItems);
    }
    return filteredPhotos;
  }, [filteredPhotos, compact, maxCompactItems]);

  // Lightbox keyboard navigation
  useEffect(() => {
    if (lightboxIndex < 0) return undefined;
    const onKeyDown = e => {
      if (e.key === 'Escape') {
        setLightboxIndex(-1);
      } else if (e.key === 'ArrowRight') {
        setLightboxIndex(prev => (displayedPhotos.length ? (prev + 1) % displayedPhotos.length : -1));
      } else if (e.key === 'ArrowLeft') {
        setLightboxIndex(prev => (displayedPhotos.length ? (prev - 1 + displayedPhotos.length) % displayedPhotos.length : -1));
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [lightboxIndex, displayedPhotos.length]);

  const activeMeta = PICTORIAL_CATEGORY_META[activeCategory];
  const currentLightboxPhoto = lightboxIndex >= 0 && lightboxIndex < displayedPhotos.length ? displayedPhotos[lightboxIndex] : null;

  return (
    <div>
      {/* SEARCH & CAMPUS FILTER CONTROLS */}
      {(showSearch || (showCampusFilter && schools.length > 0)) && (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            marginBottom: '18px',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--soft-bg)',
            padding: '14px 16px',
            borderRadius: '8px',
            border: '1px solid #dde2ec'
          }}
        >
          {showSearch && (
            <div style={{ position: 'relative', flex: '1 1 260px' }}>
              <i
                className="fa-solid fa-magnifying-glass"
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#64748b',
                  fontSize: '13.5px'
                }}
              />
              <input
                type="search"
                value={searchQuery}
                onChange={e => {
                  setSearchQuery(e.target.value);
                  setLightboxIndex(-1);
                }}
                placeholder="Search pictorial (e.g. Science lab, football, boarding, choir, robotics)..."
                aria-label="Search school pictorial photos"
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 36px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  fontSize: '14px',
                  background: '#ffffff'
                }}
              />
            </div>
          )}

          {showCampusFilter && schools.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: '0 1 auto', flexWrap: 'wrap' }}>
              <label
                htmlFor="pictorial-campus-select"
                style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--primary-navy)', margin: 0 }}
              >
                <i className="fa-solid fa-school" style={{ color: 'var(--gold-accent)', marginRight: '6px' }} />
                Campus:
              </label>
              <select
                id="pictorial-campus-select"
                value={activeSchool}
                onChange={e => {
                  setActiveSchool(e.target.value);
                  setLightboxIndex(-1);
                }}
                style={{
                  padding: '9px 12px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  fontSize: '13.5px',
                  fontWeight: 600,
                  color: 'var(--primary-navy)'
                }}
              >
                <option value="0">All Campuses &amp; Group</option>
                {schools.map(s => (
                  <option key={s.id} value={String(s.id)}>
                    {String(s.name || '').replace(/pleasantview/gi, 'Pleasant View')}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      {/* CATEGORY FILTER TABS */}
      <div
        role="tablist"
        aria-label="Pictorial Categories"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          marginBottom: activeMeta?.description && !compact ? '12px' : '24px'
        }}
      >
        {categoryTabs.map(tab => {
          const isSelected = activeCategory === tab.name;
          return (
            <button
              key={tab.name}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => {
                setActiveCategory(tab.name);
                setLightboxIndex(-1);
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '7px',
                padding: '8px 14px',
                borderRadius: '999px',
                border: isSelected ? '1px solid var(--primary-red)' : '1px solid #d6dce8',
                background: isSelected ? 'var(--primary-red)' : '#ffffff',
                color: isSelected ? '#ffffff' : 'var(--primary-navy)',
                fontSize: '12.5px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: isSelected ? '0 4px 12px rgba(139,30,45,0.22)' : '0 1px 3px rgba(0,0,0,0.04)',
                transition: 'all 0.18s ease'
              }}
            >
              <i
                className={tab.icon}
                style={{
                  fontSize: '12px',
                  color: isSelected ? '#ffffff' : 'var(--primary-red)'
                }}
              />
              <span>{tab.name === 'All' ? 'All Photos' : tab.name}</span>
              <span
                style={{
                  background: isSelected ? 'rgba(255,255,255,0.22)' : '#eef2f7',
                  color: isSelected ? '#ffffff' : '#475569',
                  padding: '1px 7px',
                  borderRadius: '999px',
                  fontSize: '11px',
                  fontWeight: 800
                }}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ACTIVE CATEGORY SUBTITLE ON FULL PICTORIAL PAGE */}
      {!compact && activeMeta?.description && (
        <div
          style={{
            marginBottom: '22px',
            padding: '10px 14px',
            borderRadius: '6px',
            background: '#f8fafc',
            borderLeft: '3px solid var(--gold-accent)',
            fontSize: '13.5px',
            color: '#475569',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '8px'
          }}
        >
          <span>
            <strong style={{ color: 'var(--primary-navy)' }}>{activeCategory}:</strong> {activeMeta.description}
          </span>
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748b' }}>
            Showing {displayedPhotos.length} {displayedPhotos.length === 1 ? 'photo' : 'photos'}
          </span>
        </div>
      )}

      {/* PHOTO GRID */}
      {displayedPhotos.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '48px 20px',
            background: 'var(--soft-bg)',
            borderRadius: '10px',
            border: '1px dashed #cbd5e1'
          }}
        >
          <i className="fa-regular fa-images" style={{ fontSize: '32px', color: '#94a3b8', marginBottom: '10px' }} />
          <h4 style={{ margin: '0 0 6px', color: 'var(--primary-navy)' }}>No photos match this filter yet</h4>
          <p style={{ margin: '0 0 16px', fontSize: '14px', color: '#64748b' }}>
            New photos uploaded anywhere on the website automatically appear in their matching Pictorial category.
          </p>
          {(activeCategory !== 'All' || activeSchool !== '0' || searchQuery) && (
            <button
              type="button"
              onClick={() => {
                setActiveCategory('All');
                setActiveSchool('0');
                setSearchQuery('');
              }}
              className="button button-tertiary"
              style={{ padding: '8px 16px', fontSize: '13px' }}
            >
              Reset Filters &amp; View All Photos
            </button>
          )}
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '22px'
          }}
        >
          {displayedPhotos.map((p, idx) => {
            const cat = p.category || 'Campus & Facilities';
            const meta = PICTORIAL_CATEGORY_META[cat];
            const badgeBg = meta?.badgeBg || 'rgba(139, 30, 45, 0.92)';
            const badgeIcon = meta?.icon || 'fa-solid fa-camera';
            const cleanSchool = p.school_name ? String(p.school_name).replace(/pleasantview/gi, 'Pleasant View') : '';
            const sourceLabel = p.source_section && SOURCE_LABELS[p.source_section] ? SOURCE_LABELS[p.source_section] : '';

            return (
              <article
                key={`${p.id}-${p.image}`}
                onClick={() => setLightboxIndex(idx)}
                role="button"
                tabIndex={0}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setLightboxIndex(idx);
                  }
                }}
                style={{
                  background: '#ffffff',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  border: '1px solid #dde2ec',
                  boxShadow: '0 6px 20px rgba(0,0,0,0.05)',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                }}
              >
                <div style={{ position: 'relative', height: '235px', overflow: 'hidden', background: '#0f1d3a' }}>
                  <img
                    src={p.image}
                    alt={p.title || p.caption || cat || 'Pleasant View Pictorial'}
                    loading="lazy"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block'
                    }}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      background: badgeBg,
                      color: '#ffffff',
                      fontSize: '10.5px',
                      fontWeight: 800,
                      padding: '4px 10px',
                      borderRadius: '4px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.22)'
                    }}
                  >
                    <i className={badgeIcon} style={{ fontSize: '10px' }} />
                    {cat}
                  </span>

                  <span
                    aria-hidden="true"
                    title="Click to enlarge"
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      width: '30px',
                      height: '30px',
                      borderRadius: '50%',
                      background: 'rgba(15, 29, 58, 0.68)',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '11px'
                    }}
                  >
                    <i className="fa-solid fa-expand" />
                  </span>

                  {(cleanSchool || sourceLabel) && (
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '10px',
                        left: '12px',
                        right: '12px',
                        display: 'flex',
                        gap: '6px',
                        flexWrap: 'wrap'
                      }}
                    >
                      {cleanSchool && (
                        <span
                          style={{
                            background: 'rgba(15, 29, 58, 0.82)',
                            color: '#ffffff',
                            fontSize: '10.5px',
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: '3px'
                          }}
                        >
                          {cleanSchool}
                        </span>
                      )}
                      {sourceLabel && (
                        <span
                          style={{
                            background: 'rgba(255, 255, 255, 0.9)',
                            color: 'var(--primary-navy)',
                            fontSize: '10px',
                            fontWeight: 700,
                            padding: '2px 7px',
                            borderRadius: '3px'
                          }}
                        >
                          {sourceLabel}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {(p.title || p.caption) && (
                  <div style={{ padding: '15px 18px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    {p.title && (
                      <h4 style={{ margin: '0 0 6px', fontSize: '15.5px', color: 'var(--primary-navy)', lineHeight: 1.35 }}>
                        {p.title}
                      </h4>
                    )}
                    {p.caption && (
                      <p style={{ margin: 0, fontSize: '13.5px', color: '#555', lineHeight: 1.55 }}>
                        {p.caption}
                      </p>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}

      {/* COMPACT FOOTER CTA */}
      {compact && validPhotos.length > 0 && (
        <div style={{ marginTop: '28px', textAlign: 'center' }}>
          <Link
            href={
              activeCategory && activeCategory !== 'All'
                ? `${fullPictorialHref}?category=${encodeURIComponent(activeCategory)}`
                : fullPictorialHref
            }
            className="button button-gold"
            style={{ padding: '12px 26px', fontSize: '14px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            <i className="fa-solid fa-images" />
            <span>
              {fullPictorialLabel} ({validPhotos.length} {validPhotos.length === 1 ? 'Photo' : 'Photos'}) &rarr;
            </span>
          </Link>
        </div>
      )}

      {/* INTERACTIVE LIGHTBOX MODAL */}
      {currentLightboxPhoto && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={currentLightboxPhoto.title || 'Photo preview'}
          onClick={() => setLightboxIndex(-1)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(8, 15, 30, 0.92)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              maxWidth: '1040px',
              width: '100%',
              background: '#0f172a',
              borderRadius: '12px',
              overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.14)',
              boxShadow: '0 24px 60px rgba(0,0,0,0.65)',
              position: 'relative'
            }}
          >
            {/* TOP BAR */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 16px',
                background: 'rgba(15, 23, 42, 0.96)',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                color: '#ffffff',
                gap: '10px',
                flexWrap: 'wrap'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span
                  style={{
                    background: PICTORIAL_CATEGORY_META[currentLightboxPhoto.category]?.badgeBg || 'var(--primary-red)',
                    color: '#fff',
                    fontSize: '11px',
                    fontWeight: 800,
                    padding: '3px 10px',
                    borderRadius: '4px',
                    textTransform: 'uppercase'
                  }}
                >
                  {currentLightboxPhoto.category || 'Campus & Facilities'}
                </span>
                <span style={{ fontSize: '12.5px', color: '#94a3b8' }}>
                  {lightboxIndex + 1} of {displayedPhotos.length}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setLightboxIndex(-1)}
                aria-label="Close photo viewer"
                style={{
                  background: 'rgba(255,255,255,0.12)',
                  color: '#ffffff',
                  border: 0,
                  borderRadius: '6px',
                  padding: '6px 12px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                <i className="fa-solid fa-xmark" style={{ marginRight: '5px' }} />
                Close
              </button>
            </div>

            {/* IMAGE VIEWPORT */}
            <div
              style={{
                position: 'relative',
                background: '#020617',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '320px',
                maxHeight: '72vh'
              }}
            >
              <img
                src={currentLightboxPhoto.image}
                alt={currentLightboxPhoto.title || currentLightboxPhoto.caption || 'Pleasant View Pictorial'}
                style={{
                  maxWidth: '100%',
                  maxHeight: '72vh',
                  objectFit: 'contain',
                  display: 'block'
                }}
              />

              {displayedPhotos.length > 1 && (
                <>
                  <button
                    type="button"
                    aria-label="Previous photo"
                    onClick={() =>
                      setLightboxIndex(prev => (prev - 1 + displayedPhotos.length) % displayedPhotos.length)
                    }
                    style={{
                      position: 'absolute',
                      left: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      border: '1px solid rgba(255,255,255,0.25)',
                      background: 'rgba(15, 23, 42, 0.78)',
                      color: '#ffffff',
                      cursor: 'pointer',
                      fontSize: '15px'
                    }}
                  >
                    <i className="fa-solid fa-chevron-left" />
                  </button>
                  <button
                    type="button"
                    aria-label="Next photo"
                    onClick={() => setLightboxIndex(prev => (prev + 1) % displayedPhotos.length)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      border: '1px solid rgba(255,255,255,0.25)',
                      background: 'rgba(15, 23, 42, 0.78)',
                      color: '#ffffff',
                      cursor: 'pointer',
                      fontSize: '15px'
                    }}
                  >
                    <i className="fa-solid fa-chevron-right" />
                  </button>
                </>
              )}
            </div>

            {/* CAPTION FOOTER */}
            {(currentLightboxPhoto.title || currentLightboxPhoto.caption || currentLightboxPhoto.school_name) && (
              <div style={{ padding: '16px 20px', background: '#0f172a', color: '#f8fafc' }}>
                {currentLightboxPhoto.title && (
                  <h4 style={{ margin: '0 0 4px', fontSize: '17px', color: '#ffffff' }}>
                    {currentLightboxPhoto.title}
                  </h4>
                )}
                {currentLightboxPhoto.caption && (
                  <p style={{ margin: 0, fontSize: '14px', color: '#cbd5e1', lineHeight: 1.55 }}>
                    {currentLightboxPhoto.caption}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
