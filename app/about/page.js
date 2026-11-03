import Page from '@/components/Page';
import Link from 'next/link';
import { S } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'About Our Heritage, Mission & Christian Ethos' };

export default async function About() {
  const s = await S();

  return (
    <Page
      title="About Pleasant View Schools"
      subtitle="OUR HERITAGE & VISION"
      image="/images/banner_3_a.webp"
    >
      <span className="lead-badge" id="why-pleasantview">OUR FOUNDATION</span>
      <h2>A Legacy of Educational Eminence</h2>
      <div className="gold-divider" style={{ marginLeft: 0 }} />

      <p style={{ fontSize: '18px', lineHeight: 1.8, marginBottom: '25px', color: '#333' }}>
        Founded in 1998, Pleasant View Schools has grown from a visionary primary institution into one of the most respected private Christian-ethos day and boarding school networks in Kenya. Situated amidst the scenic, peaceful highlands of Githunguri, Komothai Subcounty, Kiambu County, our campuses provide a serene sanctuary where learners thrive intellectually, spiritually, and socially.
      </p>

      <div style={{ background: 'var(--soft-bg)', padding: '30px', borderRadius: '6px', borderLeft: '4px solid var(--primary-navy)', margin: '30px 0' }}>
        <p style={{ fontSize: '16px', lineHeight: 1.75, color: '#444', margin: 0 }}>
          {s.about}
        </p>
      </div>

      {/* VISION, MISSION & VALUES */}
      <h3 id="vision" style={{ marginTop: '45px', marginBottom: '15px' }}>Vision, Mission &amp; Core Values</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', margin: '20px 0 35px' }}>
        <div style={{ background: 'var(--soft-bg)', padding: '24px', borderRadius: '6px', borderLeft: '4px solid var(--primary-navy)' }}>
          <h4 style={{ color: 'var(--primary-navy)', marginBottom: '8px' }}>Our Vision</h4>
          <p style={{ fontSize: '15px', color: '#555', margin: 0 }}>{s.vision}</p>
        </div>
        <div style={{ background: 'var(--soft-bg)', padding: '24px', borderRadius: '6px', borderLeft: '4px solid var(--medium-blue)' }}>
          <h4 style={{ color: 'var(--medium-blue)', marginBottom: '8px' }}>Our Mission</h4>
          <p style={{ fontSize: '15px', color: '#555', margin: 0 }}>{s.mission}</p>
        </div>
        <div style={{ background: 'var(--soft-bg)', padding: '24px', borderRadius: '6px', borderLeft: '4px solid var(--gold-accent)' }}>
          <h4 style={{ color: 'var(--gold-dark)', marginBottom: '8px' }}>Core Values &amp; Motto</h4>
          <p style={{ fontSize: '15px', color: '#555', margin: 0 }}>{s.values} &mdash; <em>&ldquo;{s.motto || 'Our Aim is Victory'}&rdquo;</em></p>
        </div>
      </div>

      {/* 24 YEARS OF ACADEMIC EMINENCE */}
      <h3 id="legacy" style={{ marginTop: '45px', marginBottom: '15px' }}>24 Years of Academic Eminence</h3>
      <p style={{ lineHeight: 1.85, fontSize: '16px', marginBottom: '20px', color: '#444' }}>
        Across our 24-year academic journey, Pleasant View has consistently maintained distinguished scholastic performance, achieving an institutional average of <strong>EE (Exceeding Expectations)</strong> in KPSEA and <strong>ME1 (Meeting Expectations &ndash; Top Tier)</strong> in KJSEA, positioning our scholars permanently among the top 10 academic institutions across Kiambu County. In 2016, answering the earnest appeal of our parent community, we established our celebrated Senior School, which achieved a historic maiden mean grade of <strong>B+</strong> in KCSE examinations. As the 8-4-4 system concludes at the end of next year, our Senior School is dynamically transitioning into the <strong>Kenya Senior School Education Assessment (KSSEA)</strong>.
      </p>

      {/* CBC / CBE TRANSITION & STEM */}
      <h3 id="cbc" style={{ marginTop: '45px', marginBottom: '15px' }}>Transition to Competency Based Curriculum (CBC / CBE)</h3>
      <p style={{ lineHeight: 1.85, fontSize: '16px', marginBottom: '20px', color: '#444' }}>
        Pleasant View has seamlessly pioneered Kenya’s Competency Based Education framework across Early Years, Primary, and Junior Secondary (JSS) levels. With fully equipped Pre-Technical, Integrated Science, Agriculture, and Digital STEM hubs, our learners transition from theoretical rote memorization into real-world innovation, scientific inquiry, and ethical problem solving.
      </p>

      {/* CHRISTIAN ETHOS */}
      <h3 id="christian" style={{ marginTop: '45px', marginBottom: '15px' }}>Christian Ethos &amp; Spiritual Life</h3>
      <p style={{ lineHeight: 1.85, fontSize: '16px', marginBottom: '20px', color: '#444' }}>
        We are firmly grounded in Christian principles. Morning devotions, weekly pastoral mentoring, and Sunday chapel services cultivate spiritual maturity, compassion, humility, and servant leadership. We welcome pupils of diverse backgrounds, instilling biblical values that guide their moral compass throughout life.
      </p>

      {/* GROUNDS & ACCOMMODATION */}
      <h3 id="grounds-accommodation" style={{ marginTop: '45px', marginBottom: '15px' }}>Grounds, Boarding &amp; Modern Accommodation</h3>
      <div id="boarding">
        <p style={{ lineHeight: 1.85, fontSize: '16px', marginBottom: '20px', color: '#444' }}>
          Spread across scenic, serene acreage in Githunguri, Pleasant View offers modern boarding dormitories from Grade 4 upwards. Resident houseparents, dedicated matrons, 24/7 security, hot water showers, and nutritious dining ensure every child feels secure, comfortable, and cherished in a home-away-from-home setting.
        </p>
      </div>

      {/* POLICIES & INSPECTION REPORTS */}
      <h3 id="policies" style={{ marginTop: '45px', marginBottom: '15px' }}>School Policies, Inspection Reports &amp; Safeguarding</h3>
      <div style={{ background: '#ffffff', border: '1px solid #dde2ec', borderRadius: '6px', padding: '24px', margin: '20px 0 35px' }}>
        <p style={{ fontSize: '15px', color: '#555', lineHeight: 1.7, margin: '0 0 15px' }}>
          Pleasant View maintains strict adherence to Ministry of Education guidelines and international best practices for child safeguarding, health, sanitation, and data protection.
        </p>
        <ul style={{ lineHeight: 2, color: '#444', paddingLeft: '20px' }}>
          <li><i className="fa-solid fa-file-pdf" style={{ color: 'var(--gold-accent)', marginRight: '8px' }} /> <strong>Ministry Quality Assurance &amp; Standards Report:</strong> Rated Exemplary</li>
          <li><i className="fa-solid fa-shield-halved" style={{ color: 'var(--primary-navy)', marginRight: '8px' }} /> <strong>Child Safeguarding &amp; Anti-Bullying Charter:</strong> Zero tolerance policy</li>
          <li><i className="fa-solid fa-notes-medical" style={{ color: '#28a745', marginRight: '8px' }} /> <strong>Health &amp; Sanatorium Protocol:</strong> Resident nurse and certified clinic</li>
        </ul>
      </div>

      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <Link href="/contact#visit" className="button button-secondary">
          Book a Guided Campus Tour
        </Link>
        <Link href="/contact" className="button button-gold" style={{ marginLeft: '15px' }}>
          Contact Admissions Desk
        </Link>
      </div>
    </Page>
  );
}
