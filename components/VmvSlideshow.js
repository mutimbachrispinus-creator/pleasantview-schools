'use client';
import { useState } from 'react';

export default function VmvSlideshow({ vision, mission, values, motto }) {
  const [tab, setTab] = useState(0);

  const slides = [
    {
      label: 'Vision',
      heading: 'Our Vision',
      sub: 'OUR GUIDING PRINCIPLE',
      text: vision || 'Develop and fully exploit the academic potential of learners.',
      image: '/images/banner_4_a.webp'
    },
    {
      label: 'Mission',
      heading: 'Our Mission',
      sub: 'TRANSFORMING TOMORROW',
      text: mission || 'Equip learners with relevant skills and attitudes that will enable them face future challenges.',
      image: '/images/gallery_10.webp'
    },
    {
      label: 'Core Values',
      heading: 'Our Core Values',
      sub: 'CHARACTER & EXCELLENCE',
      text: `${values || 'Courage, Integrity, Compassion, Discipline and Academic Excellence.'} — “${motto || 'Our Aim is Victory'}”`,
      image: '/images/gallery_8.webp'
    }
  ];

  return (
    <section className="slideshow-section">
      {slides.map((s, idx) => (
        <div
          key={s.label}
          className={'vmv-slide' + (idx === tab ? ' active' : '')}
          style={{ backgroundImage: `url('${s.image}')` }}
        >
          <div className="vmv-overlay" />
          <div className="vmv-content">
            <h5>{s.sub}</h5>
            <h2>{s.heading}</h2>
            <h4>{s.text}</h4>
          </div>
        </div>
      ))}

      <div className="vmv-tabs">
        {slides.map((s, idx) => (
          <button
            key={s.label}
            className={'vmv-tab-btn' + (idx === tab ? ' active' : '')}
            onClick={() => setTab(idx)}
            type="button"
          >
            {s.label}
          </button>
        ))}
      </div>
    </section>
  );
}
