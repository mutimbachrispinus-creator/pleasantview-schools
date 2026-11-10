'use client';
import { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const QUICK_CHIPS = [
  { label: 'School Fees', query: 'fees' },
  { label: 'Campus Tour', query: 'tour' },
  { label: 'Boarding Life', query: 'boarding' },
  { label: 'Bus Routes', query: 'transport' },
  { label: 'Junior Secondary (JSS)', query: 'jss' },
  { label: 'Senior High School', query: 'senior' },
  { label: 'Science Labs', query: 'labs' },
  { label: 'WhatsApp', query: 'whatsapp' }
];

const SEARCH_ITEMS = [
  // Academic Divisions
  {
    id: 'senior-school',
    title: 'Pleasant View Senior School',
    category: 'Academic Divisions',
    badge: 'Senior School',
    desc: 'KSSEA & KCSE pathways, STEM specialization, Pre-Technical labs, Day & Boarding options.',
    url: '/s/pleasantview-senior',
    icon: 'fa-solid fa-graduation-cap',
    tags: ['senior', 'high school', 'kcse', 'kssea', 'form 1', 'form 4', 'grade 10', 'grade 11', 'grade 12', 'stem']
  },
  {
    id: 'jss',
    title: 'Pleasant View Junior Secondary (JSS)',
    category: 'Academic Divisions',
    badge: 'Junior Secondary',
    desc: 'Grade 7, 8 & 9 CBE curriculum, Integrated Science, Agriculture, Robotics & Day/Boarding.',
    url: '/s/pleasantview-jss',
    icon: 'fa-solid fa-school',
    tags: ['junior', 'jss', 'grade 7', 'grade 8', 'grade 9', 'kjsea', 'cbe', 'cbc', 'boarding', 'day']
  },
  {
    id: 'primary-school',
    title: 'Pleasant View Primary School',
    category: 'Academic Divisions',
    badge: 'Primary School',
    desc: 'Grade 1 through 6, outstanding KPSEA academic distinctions, nurturing boarding from Grade 4.',
    url: '/s/pleasantview-primary',
    icon: 'fa-solid fa-book-open-reader',
    tags: ['primary', 'grade 1', 'grade 2', 'grade 3', 'grade 4', 'grade 5', 'grade 6', 'kpsea', 'boarding']
  },
  {
    id: 'early-learning',
    title: 'Pleasant View Early Learning Centre',
    category: 'Academic Divisions',
    badge: 'Early Years',
    desc: 'Playgroup, PP1 and PP2 foundation stage, play-based CBE literacy, numeracy & Christian care.',
    url: '/s/pleasantview-early-learning',
    icon: 'fa-solid fa-shapes',
    tags: ['kindergarten', 'early learning', 'pp1', 'pp2', 'playgroup', 'nursery', 'creche', 'day']
  },
  {
    id: 'academics-overview',
    title: 'Curriculum & Academic Eminence',
    category: 'Academics',
    badge: 'Curriculum',
    desc: 'CBE transition, KPSEA & KJSEA ranking among top 10 in Kiambu County, STEM curriculum.',
    url: '/academics',
    icon: 'fa-solid fa-award',
    tags: ['academics', 'curriculum', 'cbe', 'cbc', 'performance', 'kpsea', 'kjsea', 'exams', 'results']
  },

  // Admissions & Fees
  {
    id: 'book-tour',
    title: 'Book a Campus Walking Tour',
    category: 'Admissions',
    badge: 'Campus Visit',
    desc: 'Schedule a personalized guided tour of our campuses, classrooms, dormitories, and labs.',
    url: '/admissions#visit',
    icon: 'fa-regular fa-calendar-check',
    tags: ['visit', 'tour', 'book', 'campus visit', 'walk', 'appointment', 'view']
  },
  {
    id: 'admissions-apply',
    title: 'Admissions & How to Apply',
    category: 'Admissions',
    badge: 'Enrolment',
    desc: 'Application process, entry requirements, required documents, and continuous intake.',
    url: '/admissions',
    icon: 'fa-solid fa-file-signature',
    tags: ['admission', 'apply', 'enrol', 'join', 'intake', 'requirements', 'forms', 'documents']
  },
  {
    id: 'school-fees',
    title: 'School Fees & Financial Guidelines',
    category: 'Admissions',
    badge: 'Tuition & Fees',
    desc: 'Review fee structure, payment schedules, boarding fees, transport rates, and guidelines.',
    url: '/admissions#fees',
    icon: 'fa-solid fa-receipt',
    tags: ['fees', 'fee', 'school fees', 'cost', 'tuition', 'payment', 'structure', 'rates', 'pricing']
  },

  // Facilities & Campus Life
  {
    id: 'boarding-life',
    title: 'Boarding Life & Pastoral Care',
    category: 'Campus Life',
    badge: 'Boarding',
    desc: 'Modern dormitories, resident houseparents, registered nurse, Christian devotions from Grade 4.',
    url: '/student-life#boarding',
    icon: 'fa-solid fa-house-chimney-window',
    tags: ['boarding', 'dormitory', 'dorm', 'residence', 'hostel', 'boarder', 'meals', 'prep']
  },
  {
    id: 'school-transport',
    title: 'School Transport & Monitored Bus Routes',
    category: 'Campus Life',
    badge: 'Transport',
    desc: 'Reliable bus fleet covering Githunguri, Komothai, Ruiru, Kiambu Town, and surrounding environs.',
    url: '/facilities#transport',
    icon: 'fa-solid fa-bus-simple',
    tags: ['transport', 'bus', 'routes', 'pick up', 'drop off', 'van', 'githunguri', 'ruiru', 'kiambu']
  },
  {
    id: 'science-labs',
    title: 'Science Laboratories & STEM Hubs',
    category: 'Campus Life',
    badge: 'Facilities',
    desc: 'Pre-Technical workshops, Integrated Science labs, ICT suites, and digital coding stations.',
    url: '/facilities#laboratories',
    icon: 'fa-solid fa-flask-vial',
    tags: ['science', 'laboratory', 'labs', 'stem', 'robotics', 'computers', 'ict', 'coding']
  },
  {
    id: 'sports-co-curricular',
    title: 'Sports, Clubs & Co-Curricular Arts',
    category: 'Campus Life',
    badge: 'Co-Curricular',
    desc: 'Athletics, football, swimming, scouting, music, drama, debate, and Christian Union.',
    url: '/co-curricular',
    icon: 'fa-solid fa-futbol',
    tags: ['sports', 'clubs', 'football', 'soccer', 'swimming', 'music', 'drama', 'scouts', 'athletics']
  },
  {
    id: 'facilities-overview',
    title: 'Campus Grounds & Physical Facilities',
    category: 'Campus Life',
    badge: 'Facilities',
    desc: 'Serene highlands environment, dining halls, sports grounds, libraries, and clean sanitation.',
    url: '/facilities',
    icon: 'fa-solid fa-building-columns',
    tags: ['facilities', 'campus', 'grounds', 'library', 'dining', 'hall', 'sanitation']
  },
  {
    id: 'student-life',
    title: 'Student Life, Mentorship & Values',
    category: 'Campus Life',
    badge: 'Student Life',
    desc: 'Holistic character development, leadership opportunities, chapel devotions, and peer mentorship.',
    url: '/student-life',
    icon: 'fa-solid fa-users',
    tags: ['student life', 'mentorship', 'counseling', 'chapel', 'christian', 'prefects', 'values']
  },

  // Institutional Heritage & People
  {
    id: 'history-heritage',
    title: 'Our 28-Year History & Heritage (Est. 1998)',
    category: 'About Us',
    badge: 'Heritage',
    desc: 'Founded in 1998 in Githunguri, tracing our growth from primary school into multi-division excellence.',
    url: '/history',
    icon: 'fa-solid fa-clock-rotate-left',
    tags: ['history', 'heritage', 'founded', '1998', 'founder', 'years', 'origin']
  },
  {
    id: 'leadership',
    title: 'Leadership & School Heads',
    category: 'About Us',
    badge: 'Governance',
    desc: 'Messages and guidance from Directors, Headteachers, and Academic Principals.',
    url: '/leadership',
    icon: 'fa-solid fa-user-tie',
    tags: ['leadership', 'director', 'principal', 'headteacher', 'headmistress', 'management', 'board']
  },
  {
    id: 'parent-testimonials',
    title: 'Parent & Alumni Testimonials',
    category: 'About Us',
    badge: 'Voices',
    desc: 'Reflections, endorsements, and firsthand experiences from parents and graduates.',
    url: '/#parent-reviews',
    icon: 'fa-solid fa-comments',
    tags: ['reviews', 'testimonials', 'parents', 'opinions', 'feedback', 'endorsements']
  },
  {
    id: 'alumni-network',
    title: 'Alumni Network & Career Achievements',
    category: 'About Us',
    badge: 'Alumni',
    desc: 'Inspiring stories of Pleasant View alumni excelling in universities and professional careers.',
    url: '/alumni',
    icon: 'fa-solid fa-user-graduate',
    tags: ['alumni', 'graduates', 'former students', 'success stories', 'careers']
  },
  {
    id: 'campus-pictorial',
    title: 'Photo Gallery & Pictorial Showcase',
    category: 'Media & Gallery',
    badge: 'Gallery',
    desc: 'High-definition photography across academic sessions, sports tournaments, and student life.',
    url: '/pictorial',
    icon: 'fa-solid fa-camera-retro',
    tags: ['photos', 'pictures', 'gallery', 'pictorial', 'images', 'events']
  },
  {
    id: 'news-bulletin',
    title: 'Latest School News & Term Bulletins',
    category: 'Media & Gallery',
    badge: 'Notices',
    desc: 'Important announcements, academic calendars, term dates, and event schedules.',
    url: '/news',
    icon: 'fa-solid fa-newspaper',
    tags: ['news', 'notices', 'bulletin', 'updates', 'announcements', 'calendar', 'term dates']
  },
  {
    id: 'careers-jobs',
    title: 'Careers & Staff Vacancies',
    category: 'About Us',
    badge: 'Careers',
    desc: 'Teaching and administrative job openings, CBE educator recruitment, and staff culture.',
    url: '/careers',
    icon: 'fa-solid fa-briefcase',
    tags: ['careers', 'jobs', 'vacancies', 'teaching', 'employment', 'work with us', 'recruitment']
  },

  // Contact & Quick Portals
  {
    id: 'contact-desk',
    title: 'Contact Admissions & Campus Enquiries',
    category: 'Contact & Portals',
    badge: 'Contact',
    desc: 'Phone lines, email directory, inquiry message form, and physical office hours.',
    url: '/contact',
    icon: 'fa-solid fa-envelope',
    tags: ['contact', 'phone', 'email', 'call', 'enquiry', 'address', 'office']
  },
  {
    id: 'whatsapp-chat',
    title: 'Chat with Admissions on WhatsApp',
    category: 'Contact & Portals',
    badge: 'WhatsApp',
    desc: 'Direct instant messaging with the Pleasant View Admissions Desk (+254 711 689 913).',
    url: 'https://wa.me/254711689913?text=Hello%20Pleasant%20View%20Schools,%20I%20would%20like%20to%20inquire%20about%20admissions.',
    icon: 'fa-brands fa-whatsapp',
    tags: ['whatsapp', 'chat', 'direct message', 'text', 'instant reply']
  },
  {
    id: 'campus-directions',
    title: 'Google Maps Driving Directions',
    category: 'Contact & Portals',
    badge: 'Map',
    desc: 'GPS pin and driving directions to Pleasant View Schools campus in Githunguri, Kiambu.',
    url: 'https://maps.app.goo.gl/iBXf1M86VKxqAEft5',
    icon: 'fa-solid fa-location-dot',
    tags: ['directions', 'map', 'google maps', 'location', 'where', 'how to get there', 'gps']
  },
  {
    id: 'staff-portal',
    title: 'Staff & Faculty Management Portal',
    category: 'Contact & Portals',
    badge: 'Portal',
    desc: 'Secure faculty sign-in, curriculum records, admissions queue, and student data.',
    url: '/staff-portal',
    icon: 'fa-solid fa-user-shield',
    tags: ['staff', 'portal', 'teachers', 'login', 'admin', 'faculty']
  }
];

export default function QuickSearchModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const resultsRef = useRef(null);
  const router = useRouter();

  // Listen for open-quick-search custom event
  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true);
    };
    window.addEventListener('open-quick-search', handleOpen);
    return () => window.removeEventListener('open-quick-search', handleOpen);
  }, []);

  // Keyboard shortcut listener (Cmd+K / Ctrl+K and Esc)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Focus input on open & lock scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 50);
    } else {
      document.body.style.overflow = '';
      setQuery('');
      setSelectedIndex(0);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Filter items based on query
  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SEARCH_ITEMS.slice(0, 8); // show popular 8 by default

    return SEARCH_ITEMS.filter(item => {
      if (item.title.toLowerCase().includes(q)) return true;
      if (item.desc.toLowerCase().includes(q)) return true;
      if (item.category.toLowerCase().includes(q)) return true;
      if (item.badge.toLowerCase().includes(q)) return true;
      if (item.tags.some(tag => tag.includes(q))) return true;
      return false;
    });
  }, [query]);

  // Reset selected index on filter change
  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredItems]);

  const handleSelect = (item) => {
    setIsOpen(false);
    if (item.url.startsWith('http')) {
      window.open(item.url, '_blank', 'noopener,noreferrer');
    } else {
      router.push(item.url);
    }
  };

  const handleKeyDownNav = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % Math.max(1, filteredItems.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        handleSelect(filteredItems[selectedIndex]);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="quick-search-backdrop"
      onClick={() => setIsOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-label="Search Pleasant View Schools"
    >
      <div
        className="quick-search-dialog"
        onClick={(e) => e.stopPropagation()}
      >
        {/* TOP SEARCH BAR */}
        <div className="quick-search-input-wrap">
          <i className="fa-solid fa-magnifying-glass search-leading-icon" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDownNav}
            placeholder="Search programs, fees, boarding, bus routes, CBE..."
            className="quick-search-input"
            autoComplete="off"
            spellCheck="false"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="search-clear-btn"
              aria-label="Clear query"
            >
              &times;
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="search-esc-badge"
            title="Press Esc to close"
          >
            ESC
          </button>
        </div>

        {/* QUICK SUGGESTION CHIPS */}
        <div className="quick-search-chips">
          <span className="chips-label">Popular:</span>
          {QUICK_CHIPS.map((chip, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setQuery(chip.query)}
              className={`search-chip ${query === chip.query ? 'active' : ''}`}
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* RESULTS LIST */}
        <div className="quick-search-results" ref={resultsRef}>
          {filteredItems.length === 0 ? (
            <div className="search-empty-state">
              <i className="fa-solid fa-compass" style={{ fontSize: '32px', color: '#94a3b8', marginBottom: '12px', display: 'block' }} />
              <h4>No matching resources found for &ldquo;{query}&rdquo;</h4>
              <p>Try searching for <strong>fees</strong>, <strong>boarding</strong>, <strong>transport</strong>, <strong>admissions</strong>, or <strong>JSS</strong>.</p>
              <div style={{ marginTop: '16px' }}>
                <a
                  href="https://wa.me/254711689913?text=Hello%20Pleasant%20View%20Schools,%20I%20have%20an%20inquiry."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button button-gold"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', fontSize: '13px' }}
                >
                  <i className="fa-brands fa-whatsapp" /> Ask Admissions on WhatsApp
                </a>
              </div>
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`search-result-item ${isSelected ? 'selected' : ''}`}
                >
                  <div className="result-icon-box">
                    <i className={item.icon} />
                  </div>
                  <div className="result-info">
                    <div className="result-top">
                      <strong className="result-title">{item.title}</strong>
                      <span className="result-badge">{item.badge}</span>
                    </div>
                    <p className="result-desc">{item.desc}</p>
                  </div>
                  <div className="result-arrow">
                    <i className="fa-solid fa-arrow-right" />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* FOOTER HELPER */}
        <div className="quick-search-footer">
          <div className="search-footer-hints">
            <span><kbd>&uarr;</kbd> <kbd>&darr;</kbd> Navigate</span>
            <span><kbd>&crarr;</kbd> Select</span>
            <span><kbd>Esc</kbd> Close</span>
          </div>
          <div className="search-footer-brand">
            Pleasant View Schools &bull; Our Aim is Victory
          </div>
        </div>
      </div>
    </div>
  );
}
