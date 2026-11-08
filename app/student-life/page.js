import Link from 'next/link';
import Page from '@/components/Page';
import { getYearsOfExistence, getLearnerTestimonials } from '@/lib/db';

export const metadata = {
  title: 'Student Life & Pastoral Care | Pleasant View Schools',
  description: 'Experience student life at Pleasant View Schools: Christian values, family-style boarding from Grade 4, leadership opportunities, morning devotions, and holistic mentorship in Githunguri, Kiambu County.'
};

export const dynamic = 'force-dynamic';

export default async function StudentLifePage() {
  const years = getYearsOfExistence();
  const learnerVoices = await getLearnerTestimonials().catch(() => []);

  const schedule = [
    { time: '6:00 AM', title: 'Rise & Morning Devotion', desc: 'Awakening with quiet personal reflection, hygiene, room tidying, and house prayer.' },
    { time: '7:00 AM', title: 'Hearty Highland Breakfast', desc: 'Freshly prepared hot tea, cocoa, milk, eggs, bread, and fruits in the central dining hall.' },
    { time: '7:45 AM', title: 'School Assembly & Praise', desc: 'Christian hymns, national anthem, leadership announcements, and inspirational message.' },
    { time: '8:15 AM – 1:00 PM', title: 'Morning Academic Blocks & STEM', desc: 'Intensive CBE competency sessions, science laboratory practicals, and collaborative projects.' },
    { time: '1:00 PM – 2:00 PM', title: 'Nutritious Hot Lunch & Social Rest', desc: 'Wholesome balanced hot meal, relaxation on green lawns, and peer camaraderie.' },
    { time: '2:00 PM – 3:30 PM', title: 'Afternoon Academic & Digital Sessions', desc: 'Languages, computer science, agriculture projects, and creative arts workshops.' },
    { time: '3:45 PM – 5:00 PM', title: 'Sports, Clubs & Physical Co-Curricular', desc: 'Football, athletics, volleyball, scouting, drama, debate, robotics, and music rehearsal.' },
    { time: '5:30 PM – 6:30 PM', title: 'Dinner & Evening Refreshment', desc: 'Nutritious dinner, evening fellowship, and transition back to boarding hostels.' },
    { time: '7:00 PM – 9:00 PM', title: 'Supervised Academic Prep', desc: 'Quiet individual study, homework completion, and teacher-guided revision clinics.' },
    { time: '9:30 PM', title: 'Night Prayers & Lights Out', desc: 'Dormitory fellowship, restful sleep, and security surveillance.' }
  ];

  return (
    <Page
      title="Student Life & Pastoral Care"
      subtitle="NURTURING HEARTS & CHARACTER"
      image="/images/gallery_8.webp"
    >
      <div style={{ width: '100%', padding: '0 0 60px' }}>
        {/* INTRODUCTORY SECTION */}
        <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 40px auto' }}>
          <span className="lead-badge">THE PLEASANT VIEW EXPERIENCE</span>
          <h2 style={{ fontSize: 'clamp(28px, 3.2vw, 44px)', margin: '8px 0 14px' }}>
            A Sanctuary Where Every Child Thrives
          </h2>
          <div className="gold-divider" style={{ margin: '0 auto 20px auto' }} />
          <p style={{ fontSize: '17px', color: '#4b5563', lineHeight: 1.8 }}>
            Education at Pleasant View Schools extends far beyond the classroom walls. We cultivate an uplifting community where learners discover their God-given gifts, forge lifelong friendships, and develop the moral strength to lead lives of purpose and victory.
          </p>
        </div>

        {/* PILLARS OF STUDENT LIFE */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
          margin: '35px 0 50px'
        }}>
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderTop: '4px solid var(--primary-red)', borderRadius: '10px', padding: '28px', boxShadow: '0 4px 18px rgba(0,0,0,0.04)' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '10px', background: 'rgba(139,30,45,0.1)', color: 'var(--primary-red)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', marginBottom: '16px' }}>
              <i className="fa-solid fa-cross" />
            </div>
            <h4 style={{ fontSize: '18px', color: 'var(--dark-grey)', marginBottom: '8px' }}>Christian Ethos &amp; Values</h4>
            <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.65, margin: 0 }}>
              Morning devotions, weekly chapel, and Christian Union fellowship reinforce core values of integrity, respect, empathy, and servant leadership.
            </p>
          </div>

          <div id="boarding" style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderTop: '4px solid var(--primary-red)', borderRadius: '10px', padding: '28px', boxShadow: '0 4px 18px rgba(0,0,0,0.04)' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '10px', background: 'rgba(139,30,45,0.1)', color: 'var(--primary-red)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', marginBottom: '16px' }}>
              <i className="fa-solid fa-house-chimney-window" />
            </div>
            <h4 style={{ fontSize: '18px', color: 'var(--dark-grey)', marginBottom: '8px' }}>Pastoral Boarding Life</h4>
            <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.65, margin: 0 }}>
              Available from Grade 4 upwards, our residential hostels provide loving parental care, structured revision prep, and warm community bonding.
            </p>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderTop: '4px solid var(--primary-red)', borderRadius: '10px', padding: '28px', boxShadow: '0 4px 18px rgba(0,0,0,0.04)' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '10px', background: 'rgba(139,30,45,0.1)', color: 'var(--primary-red)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', marginBottom: '16px' }}>
              <i className="fa-solid fa-users" />
            </div>
            <h4 style={{ fontSize: '18px', color: 'var(--dark-grey)', marginBottom: '8px' }}>Student Leadership Council</h4>
            <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.65, margin: 0 }}>
              Prefects, house captains, and student council delegates represent student perspectives, organizing inter-house events and mentoring younger peers.
            </p>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderTop: '4px solid var(--primary-red)', borderRadius: '10px', padding: '28px', boxShadow: '0 4px 18px rgba(0,0,0,0.04)' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '10px', background: 'rgba(139,30,45,0.1)', color: 'var(--primary-red)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', marginBottom: '16px' }}>
              <i className="fa-solid fa-heart-pulse" />
            </div>
            <h4 style={{ fontSize: '18px', color: 'var(--dark-grey)', marginBottom: '8px' }}>Health, Wellness &amp; Sanitarium</h4>
            <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.65, margin: 0 }}>
              A fully equipped on-campus sanitarium staffed by licensed nurses provides prompt medical care, health monitoring, and emotional wellbeing counsel.
            </p>
          </div>
        </div>

        {/* A DAY IN THE LIFE TIMELINE */}
        <div style={{ margin: '50px 0' }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <span className="lead-badge">ROUTINE &amp; STRUCTURE</span>
            <h3 style={{ fontSize: 'clamp(24px, 2.6vw, 34px)', color: 'var(--primary-navy)', margin: '6px 0' }}>
              A Day in the Life at Pleasant View
            </h3>
            <p style={{ color: '#64748b', fontSize: '15px' }}>
              A balanced, purposeful daily rhythm balancing disciplined study, physical activity, healthy nourishment, and spiritual peace.
            </p>
          </div>

          <div style={{ maxWidth: '820px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {schedule.map((s, idx) => (
              <div key={idx} style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderLeft: '4px solid var(--primary-red)',
                borderRadius: '8px',
                padding: '16px 22px',
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                flexWrap: 'wrap'
              }}>
                <div style={{
                  minWidth: '130px',
                  fontWeight: 800,
                  fontSize: '14px',
                  color: 'var(--primary-red)',
                  fontFamily: 'var(--font-serif)'
                }}>
                  {s.time}
                </div>
                <div style={{ flex: 1, minWidth: '220px' }}>
                  <strong style={{ display: 'block', fontSize: '15.5px', color: 'var(--dark-grey)', marginBottom: '2px' }}>
                    {s.title}
                  </strong>
                  <p style={{ fontSize: '13.5px', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* STUDENT VOICES SHOWCASE */}
        {learnerVoices.length > 0 && (
          <div style={{ margin: '60px 0 30px' }}>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <span className="lead-badge">IN THEIR OWN WORDS</span>
              <h3 style={{ fontSize: 'clamp(24px, 2.6vw, 34px)', color: 'var(--primary-navy)', margin: '6px 0' }}>
                Reflections from Our Scholars
              </h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
              {learnerVoices.map((l, idx) => (
                <div key={l.id || idx} style={{
                  background: '#ffffff',
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0',
                  padding: '24px',
                  boxShadow: '0 4px 18px rgba(0,0,0,0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
                      <img
                        src={l.photo_url || '/images/girls_high_school3.webp'}
                        alt={l.name}
                        style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary-red)', flexShrink: 0 }}
                      />
                      <div>
                        <h4 style={{ margin: 0, fontSize: '17px', color: 'var(--dark-grey)' }}>{l.name}</h4>
                        <span style={{ fontSize: '12px', color: 'var(--primary-red)', fontWeight: 700 }}>{l.grade_or_class}</span>
                      </div>
                    </div>
                    <p style={{ fontStyle: 'italic', fontSize: '14px', color: '#4b5563', lineHeight: 1.6, margin: 0 }}>
                      &ldquo;{l.comment}&rdquo;
                    </p>
                  </div>

                  {(l.favorite_subject || l.future_aspiration) && (
                    <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #f1f5f9', display: 'flex', gap: '8px', flexWrap: 'wrap', fontSize: '12px' }}>
                      {l.favorite_subject && (
                        <span style={{ background: 'rgba(139,30,45,0.08)', color: 'var(--primary-red)', padding: '3px 8px', borderRadius: '4px', fontWeight: 600 }}>
                          Subject: {l.favorite_subject}
                        </span>
                      )}
                      {l.future_aspiration && (
                        <span style={{ background: 'var(--soft-bg)', color: 'var(--dark-grey)', padding: '3px 8px', borderRadius: '4px', fontWeight: 600 }}>
                          Goal: {l.future_aspiration}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CALL TO ACTION */}
        <div style={{
          background: 'var(--soft-bg)',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          padding: '36px',
          textAlign: 'center',
          marginTop: '40px'
        }}>
          <h3 style={{ fontSize: '24px', color: 'var(--dark-grey)', marginBottom: '8px' }}>
            Give Your Child the Gift of a Nurturing School Home
          </h3>
          <p style={{ fontSize: '15px', color: '#64748b', maxWidth: '600px', margin: '0 auto 24px auto' }}>
            Come experience the warmth of our boarding houses and the energy of our highland campus. Book a campus tour today.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <Link href="/admissions#visit" className="button button-gold">
              <i className="fa-regular fa-calendar-check" style={{ marginRight: '8px' }} /> Schedule Campus Visit
            </Link>
            <Link href="/contact" className="button button-tertiary">
              Contact Admissions
            </Link>
          </div>
        </div>
      </div>
    </Page>
  );
}
