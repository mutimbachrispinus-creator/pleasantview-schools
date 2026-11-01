import Link from 'next/link';

export default function Page({ title, subtitle, image = '/images/banner_3_a.webp', children }) {
  return (
    <>
      <div className="subpage-hero" style={{ backgroundImage: `url('${image}')` }}>
        <div className="overlay" />
        <div className="subpage-hero-content">
          <h5>{subtitle || 'PLEASANTVIEW SCHOOLS'}</h5>
          <h1>{title}</h1>
        </div>
      </div>
      <section className="subpage-body">
        <div className="wrapper">
          <div style={{ maxWidth: '960px', margin: '0 auto' }}>
            {children}
          </div>
        </div>
      </section>
    </>
  );
}
