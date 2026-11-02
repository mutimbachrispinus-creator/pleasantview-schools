import Page from '@/components/Page';
import Link from 'next/link';
import { getQuickLinks } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Quick Links | Pleasantview Schools' };

export default async function QuickLinksPage() {
  const quickLinks = await getQuickLinks();

  return (
    <Page
      title="Quick Links & Portals"
      subtitle="FAST ACCESS DIRECTORY"
      image="/images/banner_1_a.webp"
    >
      <div className="quick-link-content">
        <span className="lead-badge">ESSENTIAL RESOURCES</span>
        <h2>Pleasantview Schools &ndash; Quick Links Hub</h2>
        <div className="gold-divider" style={{ marginLeft: 0 }} />

        <p className="lead" style={{ fontSize: '17px', color: '#444', lineHeight: 1.7, marginBottom: '25px' }}>
          Direct access to term dates, boarding grounds, student policies, admissions guidelines, sports schedules, and institutional tenders.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', margin: '30px 0' }}>
          {quickLinks.map(l => (
            <Link
              key={l.id}
              href={l.url}
              style={{
                display: 'block',
                background: '#ffffff',
                border: '1px solid #dde2ec',
                borderRadius: '8px',
                padding: '24px',
                textDecoration: 'none',
                color: 'inherit',
                transition: 'all 0.25s ease'
              }}
              className="quick-link-card"
            >
              <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 800, color: 'var(--gold-dark)', background: 'var(--soft-bg)', padding: '3px 8px', borderRadius: '3px' }}>
                {l.category || 'Quick Link'}
              </span>
              <h3 style={{ fontSize: '18px', margin: '12px 0 8px', color: 'var(--primary-navy)' }}>
                {l.title}
              </h3>
              <p style={{ fontSize: '13.5px', color: '#666', margin: 0, lineHeight: 1.5 }}>
                {l.description || 'Access essential resource and information.'}
              </p>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '14px', fontSize: '13px', fontWeight: 700, color: 'var(--medium-blue)' }}>
                Open Link <i className="fa-solid fa-arrow-right-long" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </Page>
  );
}
