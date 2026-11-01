import Page from '@/components/Page';
import Link from 'next/link';
import { S } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'About Us | Pleasantview Schools' };

export default async function About() {
  const s = await S();

  return (
    <Page
      title="About Pleasantview Schools"
      subtitle="OUR HERITAGE & VISION"
      image="/images/banner_3_a.webp"
    >
      <span className="lead-badge">OUR FOUNDATION</span>
      <h2>A Legacy of Educational Eminence</h2>
      <div className="gold-divider" style={{ marginLeft: 0 }} />

      <p style={{ fontSize: '18px', lineHeight: 1.8, marginBottom: '25px', color: '#333' }}>
        Founded in 1998, Pleasant View Schools has grown from a visionary primary institution into one of the most respected private Christian-ethos school networks in Kenya. Situated amidst the scenic, peaceful highlands of Githunguri, Komothai Subcounty, Kiambu County, our campuses provide a serene sanctuary where learners thrive intellectually, spiritually, and socially.
      </p>

      <div style={{ background: 'var(--soft-bg)', padding: '30px', borderRadius: '4px', borderLeft: '4px solid var(--primary-navy)', margin: '30px 0' }}>
        <p style={{ fontSize: '16px', lineHeight: 1.7, color: '#444' }}>
          {s.about}
        </p>
      </div>

      <h3 id="vision" style={{ marginTop: '40px', marginBottom: '15px' }}>Vision, Mission &amp; Core Values</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', margin: '20px 0 35px' }}>
        <div style={{ background: 'var(--soft-bg)', padding: '24px', borderRadius: '4px', borderLeft: '4px solid var(--primary-navy)' }}>
          <h4 style={{ color: 'var(--primary-navy)', marginBottom: '8px' }}>Our Vision</h4>
          <p style={{ fontSize: '15px', color: '#555' }}>{s.vision}</p>
        </div>
        <div style={{ background: 'var(--soft-bg)', padding: '24px', borderRadius: '4px', borderLeft: '4px solid var(--medium-blue)' }}>
          <h4 style={{ color: 'var(--medium-blue)', marginBottom: '8px' }}>Our Mission</h4>
          <p style={{ fontSize: '15px', color: '#555' }}>{s.mission}</p>
        </div>
        <div style={{ background: 'var(--soft-bg)', padding: '24px', borderRadius: '4px', borderLeft: '4px solid var(--gold-accent)' }}>
          <h4 style={{ color: 'var(--gold-dark)', marginBottom: '8px' }}>Core Values &amp; Motto</h4>
          <p style={{ fontSize: '15px', color: '#555' }}>{s.values} — <em>&ldquo;{s.motto || 'Our Aim is Victory'}&rdquo;</em></p>
        </div>
      </div>

      <h3 id="legacy" style={{ marginTop: '40px', marginBottom: '15px' }}>24 Years of Academic Eminence</h3>
      <p style={{ lineHeight: 1.8, marginBottom: '20px', color: '#444' }}>
        Since our inaugural KCPE graduating class, Pleasantview has consistently maintained mean scores exceeding 390 out of 500 points, positioning us permanently among the top 10 academic institutions across Kiambu County. In 2016, answering the earnest appeal of our parent community, we established our celebrated Senior School, which achieved a historic mean grade of B+ in their maiden KCSE examinations.
      </p>

      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <Link href="/contact#visit" className="button button-secondary">
          Book a Guided Campus Tour
        </Link>
        <Link href="/contact" className="button button-gold" style={{ marginLeft: '15px' }}>
          Contact Admissions
        </Link>
      </div>
    </Page>
  );
}
