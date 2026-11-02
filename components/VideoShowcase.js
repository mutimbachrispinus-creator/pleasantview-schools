'use client';
import { useState } from 'react';

export default function VideoShowcase({ videos = [] }) {
  const [activeVideo, setActiveVideo] = useState(null);

  if (!videos || videos.length === 0) return null;

  // Convert standard YouTube watch/share URLs to embed URLs
  const getEmbedUrl = (url) => {
    if (!url) return '';
    if (url.includes('embed/')) return url;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}?autoplay=1&rel=0`;
    }
    return url;
  };

  return (
    <section className="video-showcase-section" style={{ background: '#071c3d', color: '#ffffff', padding: '80px 0' }}>
      <div className="wrapper">
        <div className="section-header" style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h5 style={{ color: 'var(--gold-accent)', letterSpacing: '2px' }}>DISCOVER PLEASANTVIEW IN MOTION</h5>
          <h2 style={{ color: '#ffffff', fontSize: 'clamp(28px, 3.2vw, 44px)', textTransform: 'uppercase' }}>
            Campus Life &amp; Video Tour
          </h2>
          <div className="gold-divider" />
          <p style={{ color: 'rgba(255,255,255,0.85)', maxWidth: '680px', margin: '0 auto', fontSize: '16px' }}>
            Experience the vibrant academic energy, modern science suites, championship sports, and warm Christian discipleship across our Githunguri campuses.
          </p>
        </div>

        {/* VIDEOS GRID */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '30px',
          marginBottom: '20px'
        }}>
          {videos.map(v => (
            <div
              key={v.id}
              style={{
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
                border: '1px solid rgba(255,255,255,0.1)',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.3s ease'
              }}
            >
              {/* VIDEO THUMBNAIL WITH PLAY OVERLAY */}
              <div
                onClick={() => setActiveVideo(v)}
                style={{
                  position: 'relative',
                  aspectRatio: '16 / 9',
                  backgroundImage: `url('${v.thumbnail || '/images/hero_science_lab.jpg'}')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(5,40,107,0.8) 100%)'
                }} />

                <span style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  background: 'var(--gold-accent)',
                  color: 'var(--dark-navy)',
                  fontWeight: 800,
                  fontSize: '11px',
                  padding: '3px 10px',
                  borderRadius: '20px',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  zIndex: 2
                }}>
                  {v.category || 'Featured Tour'}
                </span>

                {/* PLAY BUTTON PULSE */}
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'var(--gold-accent)',
                  color: 'var(--dark-navy)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '22px',
                  boxShadow: '0 0 25px rgba(224,168,46,0.8)',
                  position: 'relative',
                  zIndex: 2,
                  transition: 'transform 0.25s ease'
                }}>
                  <i className="fa-solid fa-play" style={{ marginLeft: '4px' }} />
                </div>
              </div>

              {/* VIDEO META */}
              <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h4 style={{ color: '#ffffff', fontSize: '18px', marginBottom: '8px', lineHeight: 1.3 }}>
                  {v.title}
                </h4>
                <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '13.5px', lineHeight: 1.6, flex: 1 }}>
                  {v.description || 'Watch our students, facilities, and campus culture.'}
                </p>
                <button
                  type="button"
                  onClick={() => setActiveVideo(v)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--gold-accent)',
                    fontWeight: 700,
                    fontSize: '13px',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: 0,
                    cursor: 'pointer',
                    marginTop: '15px'
                  }}
                >
                  <i className="fa-solid fa-circle-play" /> Play Video
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* MODAL LIGHTBOX PLAYER */}
        {activeVideo && (
          <div
            onClick={() => setActiveVideo(null)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.85)',
              backdropFilter: 'blur(8px)',
              zIndex: 99999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px'
            }}
          >
            <div
              onClick={e => e.stopPropagation()}
              style={{
                width: '100%',
                maxWidth: '920px',
                background: '#1E232A',
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: '0 20px 60px rgba(0,0,0,0.7)',
                border: '1px solid rgba(255,255,255,0.15)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', background: '#8B1E2D' }}>
                <h4 style={{ color: '#ffffff', margin: 0, fontSize: '16px' }}>{activeVideo.title}</h4>
                <button
                  type="button"
                  onClick={() => setActiveVideo(null)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#ffffff',
                    fontSize: '20px',
                    cursor: 'pointer'
                  }}
                >
                  <i className="fa-solid fa-xmark" />
                </button>
              </div>

              <div style={{ position: 'relative', aspectRatio: '16 / 9', background: '#000' }}>
                <iframe
                  src={getEmbedUrl(activeVideo.youtube_url)}
                  title={activeVideo.title}
                  style={{ width: '100%', height: '100%', border: 0 }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              <div style={{ padding: '20px 24px' }}>
                <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '14px', margin: 0 }}>
                  {activeVideo.description}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
