// Smart Pictorial Categorization & Metadata Helpers for Pleasant View Schools

export const PICTORIAL_CATEGORIES = [
  'Science & Labs',
  'Sports & Athletics',
  'Academics & Classroom',
  'Boarding & Pastoral',
  'Clubs, Music & Arts',
  'Events & Chapel',
  'Campus & Facilities',
  'Community & Leadership'
];

export const PICTORIAL_CATEGORY_META = {
  'Science & Labs': {
    icon: 'fa-solid fa-flask-vial',
    badgeBg: 'rgba(13, 110, 110, 0.92)',
    shortLabel: 'Science & Labs',
    description: 'Chemistry, Biology, Physics, Robotics, Pre-Technical & Computer Laboratories'
  },
  'Sports & Athletics': {
    icon: 'fa-solid fa-futbol',
    badgeBg: 'rgba(21, 128, 61, 0.92)',
    shortLabel: 'Sports & Athletics',
    description: 'Football, Basketball, Volleyball, Swimming, Track & Field Championships'
  },
  'Academics & Classroom': {
    icon: 'fa-solid fa-graduation-cap',
    badgeBg: 'rgba(5, 40, 107, 0.92)',
    shortLabel: 'Academics & Classroom',
    description: 'Classroom Learning, Library Research, CBE Assessments & Academic Honors'
  },
  'Boarding & Pastoral': {
    icon: 'fa-solid fa-house-chimney-user',
    badgeBg: 'rgba(139, 30, 45, 0.92)',
    shortLabel: 'Boarding & Pastoral',
    description: 'Modern Dormitories, Nutritious Dining & Caring Home-Away-From-Home Life'
  },
  'Clubs, Music & Arts': {
    icon: 'fa-solid fa-music',
    badgeBg: 'rgba(126, 34, 206, 0.92)',
    shortLabel: 'Clubs, Music & Arts',
    description: 'Choir, Musical Instruments, Drama, Fine Art, Debate, Scouts & Talents'
  },
  'Events & Chapel': {
    icon: 'fa-solid fa-church',
    badgeBg: 'rgba(180, 83, 9, 0.92)',
    shortLabel: 'Events & Chapel',
    description: 'Chapel Services, Christian Devotions, VISOs, Graduations & Ceremonies'
  },
  'Campus & Facilities': {
    icon: 'fa-solid fa-school',
    badgeBg: 'rgba(30, 58, 138, 0.92)',
    shortLabel: 'Campus & Facilities',
    description: 'Scenic Githunguri Grounds, Architecture, School Fleet & Infrastructure'
  },
  'Community & Leadership': {
    icon: 'fa-solid fa-users',
    badgeBg: 'rgba(55, 65, 81, 0.92)',
    shortLabel: 'Community & Leadership',
    description: 'School Leadership, Faculty, Student Voices & Distinguished Alumni'
  }
};

const VIDEO_EXT_RE = /\.(mp4|webm|ogg|ogv|mov|m4v|3gp|mkv|avi)(\?.*)?$/i;

export function isValidPictorialImageUrl(rawUrl = '') {
  const url = String(rawUrl || '').trim();
  if (!url) return false;
  if (VIDEO_EXT_RE.test(url)) return false;
  if (/^https?:\/\/(www\.)?(youtube\.com|youtu\.be|vimeo\.com)\//i.test(url)) return false;
  if (url.includes('logo.svg') || url.includes('favicon') || url.includes('pwa_icon') || url.includes('pwa_maskable') || url.includes('apple-touch-icon') || url.includes('pvs_crest')) {
    return false;
  }
  return true;
}

// Tokenize camelCase, snake_case, kebab-case, and paths into clean space-separated lowercase words
function normalizeTokens(str = '') {
  return String(str || '')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_\-\/\\.,:;!?()[\]{}"'`~+|]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

const CATEGORY_RULES = {
  'Science & Labs': [
    { re: /\b(science\s+lab|chemistry\s+lab|biology\s+lab|physics\s+lab|computer\s+lab|ict\s+lab|robotics\s+lab|stem\s+lab|integrated\s+science|pre\s+technical|pre\s+tech|science\s+fair|robotics\s+expo)\b/g, weight: 4.5 },
    { re: /\b(lab|labs|laboratory|laboratories|microscope|microscopes|beaker|beakers|bunsen|titration|pipette|test\s+tube|reagent|experiment|experiments|lab\s+coat|goggles|specimen|apparatus)\b/g, weight: 3.5 },
    { re: /\b(chemistry|biology|physics|robotics|robot|robots|coding|programming|stem|ict|computer\s+science|computer\s+studies|solar\s+prototype|practical|practicals)\b/g, weight: 2.4 }
  ],
  'Sports & Athletics': [
    { re: /\b(sports\s+field|football\s+pitch|athletics\s+meet|cross\s+country|swimming\s+gala|sports\s+gala|sports\s+day|track\s+and\s+field|basketball\s+court|volleyball\s+court|football\s+derby|sports\s+fixtures|sports\s+pavilion)\b/g, weight: 4.5 },
    { re: /\b(sport|sports|athletic|athletics|football|soccer|basketball|volleyball|netball|rugby|hockey|handball|tennis|badminton|swimming|swimmer|swimmers|relay|marathon|sprint|hurdles|javelin|discus|sportsmanship)\b/g, weight: 3.5 },
    { re: /\b(pitch|gala|tournament|derby|fixture|fixtures|league|trophy|medal|medals|championship|champions|jersey|coach|referee|pe|games)\b/g, weight: 2.2 }
  ],
  'Academics & Classroom': [
    { re: /\b(classroom|classrooms|library|libraries|resource\s+centre|resource\s+center|study\s+hub|digital\s+study|early\s+learning|montessori|academic\s+honors|academic\s+distinction|national\s+exams|exam\s+results)\b/g, weight: 3.8 },
    { re: /\b(kpsea|kjsea|kcse|kssea|lesson|lessons|tuition|reading|literacy|numeracy|homework|whiteboard|blackboard|smartboard|desk|desks|playgroup|pp1|pp2|valedictory|graduation)\b/g, weight: 2.6 },
    { re: /\b(academic|academics|curriculum|cbe|cbc|mathematics|english|kiswahili|revision|examination|examinations|assessment|assessments|scholar|scholars)\b/g, weight: 1.5 }
  ],
  'Boarding & Pastoral': [
    { re: /\b(boarding\s+house|boarding\s+houses|boarding\s+life|pastoral\s+boarding|pastoral\s+care|dining\s+hall|dining\s+pavilion|home\s+away\s+from\s+home)\b/g, weight: 4.5 },
    { re: /\b(boarding|boarder|boarders|dorm|dorms|dormitory|dormitories|hostel|cubicle|bunk|matron|matrons|houseparent|houseparents|housemistress|housemaster|accommodation|sanatorium)\b/g, weight: 3.5 },
    { re: /\b(dining|cafeteria|kitchen|meals|breakfast|lunch|supper|pastoral)\b/g, weight: 2.2 }
  ],
  'Clubs, Music & Arts': [
    { re: /\b(creative\s+arts|music\s+studio|arts\s+studio|music\s+club|drama\s+festival|music\s+festival|choir\s+performance|fine\s+art|performing\s+arts|co\s+curricular\s+clubs)\b/g, weight: 4.5 },
    { re: /\b(choir|choral|music|musical|instrument|instruments|piano|guitar|violin|drum|drums|band|orchestra|drama|theatre|theater|acting|dance|dancing|painting|drawing|craft|crafts)\b/g, weight: 3.4 },
    { re: /\b(art|arts|debate|debating|scout|scouts|girl\s+guides|chess|journalism|wildlife\s+club|club|clubs|talent|talents|festival)\b/g, weight: 2.3 }
  ],
  'Events & Chapel': [
    { re: /\b(chapel\s+service|chapel\s+hall|christian\s+fellowship|morning\s+devotion|morning\s+devotions|sunday\s+worship|thanksgiving\s+service|visiting\s+sunday|visiting\s+day|parents\s+day|prize\s+giving|open\s+day|spiritual\s+life)\b/g, weight: 4.5 },
    { re: /\b(chapel|worship|devotion|devotions|fellowship|prayer|praying|sermon|chaplain|dedication|thanksgiving|viso|visos|ceremony|celebration|parade)\b/g, weight: 3.3 },
    { re: /\b(christian|spiritual|church|bible|assembly|event|events)\b/g, weight: 1.8 }
  ],
  'Campus & Facilities': [
    { re: /\b(school\s+bus|transport\s+fleet|campus\s+grounds|campus\s+environment|administration\s+block|aerial\s+view|githunguri\s+grounds|campus\s+tour|main\s+gate)\b/g, weight: 4.2 },
    { re: /\b(grounds|quadrangle|pavilion|architecture|fleet|bus|buses|transport|gate|entrance|garden|gardens|lawn|greenery|buildings|infrastructure|facilities|facility|compound)\b/g, weight: 2.8 },
    { re: /\b(campus|environment|scenic|highlands|block|clinic|dispensary)\b/g, weight: 1.4 }
  ],
  'Community & Leadership': [
    { re: /\b(board\s+of\s+directors|executive\s+principal|head\s+of\s+institution|managing\s+director|alumni\s+story|alumni\s+success|student\s+council|head\s+girl|head\s+boy)\b/g, weight: 4.2 },
    { re: /\b(director|principal|headteacher|hoi|coordinator|dean|alumni|alumnus|alumna|graduate|graduates|prefect|prefects|faculty|portrait|headshot)\b/g, weight: 3.0 },
    { re: /\b(leadership|leader|staff|teachers|mentor|mentors)\b/g, weight: 1.6 }
  ]
};

function scoreSegment(rawText, multiplier, scores) {
  if (!rawText) return;
  const text = normalizeTokens(rawText);
  if (!text) return;

  for (const cat of PICTORIAL_CATEGORIES) {
    const rules = CATEGORY_RULES[cat] || [];
    for (const { re, weight } of rules) {
      re.lastIndex = 0;
      const matches = text.match(re);
      if (matches && matches.length > 0) {
        // Diminishing returns for repeated occurrences in the same text block
        const countFactor = 1 + Math.min(matches.length - 1, 2) * 0.35;
        scores[cat] = (scores[cat] || 0) + weight * multiplier * countFactor;
      }
    }
  }
}

export function normalizePictorialCategory(rawCategory = '', contextText = '') {
  const raw = String(rawCategory || '').trim();
  if (!raw || raw.toLowerCase() === 'auto') return '';

  if (PICTORIAL_CATEGORIES.includes(raw)) {
    return raw;
  }

  const low = raw.toLowerCase();
  if (low.includes('lab') || low.includes('science') || low.includes('stem') || low.includes('robotics') || low.includes('innovation')) {
    // Distinguish pure Academics vs Science & Labs when legacy value was "Academic & STEM"
    if (low === 'academic & stem' || low === 'academics & stem') {
      const ctx = normalizeTokens(contextText);
      if (/\b(lab|labs|laboratory|science|chemistry|biology|physics|robotics|robot|computer|ict|stem|experiment|practical|pre\s+tech|pre\s+technical)\b/.test(ctx)) {
        return 'Science & Labs';
      }
      return 'Academics & Classroom';
    }
    return 'Science & Labs';
  }
  if (low.includes('sport') || low.includes('athletic') || low.includes('game') || low.includes('football')) {
    return 'Sports & Athletics';
  }
  if (low.includes('board') || low.includes('pastoral') || low.includes('dorm') || low.includes('accommodat')) {
    return 'Boarding & Pastoral';
  }
  if (low.includes('club') || low.includes('talent') || low.includes('music') || low.includes('choir') || low.includes('art') || low.includes('drama')) {
    return 'Clubs, Music & Arts';
  }
  if (low.includes('event') || low.includes('spiritual') || low.includes('christian') || low.includes('chapel') || low.includes('viso')) {
    return 'Events & Chapel';
  }
  if (low.includes('facilit') || low.includes('environment') || low.includes('ground') || low.includes('campus') || low.includes('tour') || low.includes('transport')) {
    return 'Campus & Facilities';
  }
  if (low.includes('leader') || low.includes('alumni') || low.includes('community') || low.includes('staff') || low.includes('student')) {
    return 'Community & Leadership';
  }
  if (low.includes('academic') || low.includes('class') || low.includes('exam') || low.includes('library')) {
    const ctx = normalizeTokens(contextText);
    if (/\b(lab|labs|laboratory|science|chemistry|biology|physics|robotics|experiment|practical)\b/.test(ctx)) {
      return 'Science & Labs';
    }
    return 'Academics & Classroom';
  }

  return '';
}

const GENERIC_FILENAME_RE = /^(img|dsc|dcim|pxl|photo|image|pic|picture|screenshot|whatsapp\s*image|untitled|file|upload|banner|gallery|others|media)[\s_\-0-9a-f]*$/i;

function extractCleanFilenameText(fileName = '', imageUrl = '') {
  const candidates = [];
  if (fileName) {
    const base = String(fileName).replace(/\.[^.]+$/, '').trim();
    if (base && !GENERIC_FILENAME_RE.test(base)) {
      candidates.push(base);
    }
  }
  if (imageUrl && !String(imageUrl).startsWith('/img/')) {
    const seg = String(imageUrl).split('?')[0].split('/').pop() || '';
    const base = seg.replace(/\.[^.]+$/, '').trim();
    if (base && !GENERIC_FILENAME_RE.test(base)) {
      candidates.push(base);
    }
  }
  return candidates.join(' ');
}

/**
 * Automatically categorizes any uploaded photo into a canonical Pictorial category
 * (e.g., 'Science & Labs', 'Sports & Athletics', 'Academics & Classroom', etc.)
 * using weighted filename, title/caption, source context, and visual pixel hints.
 */
export function categorizePhoto({
  explicitCategory = '',
  fileName = '',
  imageUrl = '',
  title = '',
  caption = '',
  body = '',
  sourceCategory = '',
  buttonLink = '',
  sectionHint = '',
  visualHint = ''
} = {}) {
  const combinedContext = `${fileName} ${imageUrl} ${title} ${caption} ${sourceCategory}`;

  // 1. Respect explicit non-auto category chosen by admin
  if (explicitCategory && String(explicitCategory).toLowerCase() !== 'auto') {
    const normalized = normalizePictorialCategory(explicitCategory, combinedContext);
    if (normalized) return normalized;
  }

  // 2. Score all available signals with domain-calibrated weights
  const scores = Object.fromEntries(PICTORIAL_CATEGORIES.map(c => [c, 0]));

  const cleanFileText = extractCleanFilenameText(fileName, imageUrl);
  scoreSegment(cleanFileText, 4.0, scores);
  scoreSegment(title, 3.5, scores);
  scoreSegment(sourceCategory, 2.8, scores);
  scoreSegment(buttonLink, 2.5, scores);
  scoreSegment(caption, 2.2, scores);

  // Person-centric sections (Leadership, Alumni, Student Voices) usually upload portraits;
  // weigh body text gently so incidental mentions don't override a clear portrait unless title/filename says otherwise.
  const isPersonSection = ['leadership', 'alumni', 'learner'].includes(sectionHint);
  scoreSegment(body, isPersonSection ? 0.45 : 1.1, scores);

  if (isPersonSection) {
    scores['Community & Leadership'] += 6.5;
  } else if (sectionHint === 'school') {
    scores['Campus & Facilities'] += 3.5;
  }

  // 3. Apply lightweight client-side visual scene hints as a gentle tie-breaker when text signals are weak
  const maxTextScore = Math.max(...Object.values(scores));
  if (visualHint && maxTextScore < 4.0) {
    const vh = String(visualHint).toLowerCase();
    if (vh.includes('turf_field')) {
      scores['Sports & Athletics'] += 2.6;
      scores['Campus & Facilities'] += 1.2;
    } else if (vh.includes('bright_indoor_lab')) {
      scores['Science & Labs'] += 1.8;
      scores['Academics & Classroom'] += 1.4;
    } else if (vh.includes('outdoor_grounds')) {
      scores['Campus & Facilities'] += 2.0;
    } else if (vh.includes('portrait')) {
      scores['Community & Leadership'] += 1.8;
    }
  }

  // 4. Select top-scoring category
  let bestCategory = '';
  let bestScore = 0;
  for (const cat of PICTORIAL_CATEGORIES) {
    if (scores[cat] > bestScore) {
      bestScore = scores[cat];
      bestCategory = cat;
    }
  }

  if (bestCategory && bestScore > 0) {
    return bestCategory;
  }

  // 5. Contextual fallback when filename & metadata are completely generic
  if (sourceCategory) {
    const fromSource = normalizePictorialCategory(sourceCategory, combinedContext);
    if (fromSource) return fromSource;
  }

  switch (sectionHint) {
    case 'leadership':
    case 'alumni':
    case 'learner':
      return 'Community & Leadership';
    case 'news':
      return 'Academics & Classroom';
    case 'hero':
    case 'school':
    default:
      return 'Campus & Facilities';
  }
}

export function derivePhotoTitle({
  title = '',
  fileName = '',
  imageUrl = '',
  sectionHint = '',
  category = ''
} = {}) {
  const cleanTitle = String(title || '').trim();
  if (cleanTitle) return cleanTitle;

  const rawName = String(fileName || '').replace(/\.[^.]+$/, '').trim() ||
    (!String(imageUrl).startsWith('/img/') ? String(imageUrl).split('?')[0].split('/').pop()?.replace(/\.[^.]+$/, '') || '' : '');

  if (rawName && !GENERIC_FILENAME_RE.test(rawName)) {
    const humanized = rawName
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/[_\-]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/\b\w/g, ch => ch.toUpperCase());
    if (humanized.length >= 3) return humanized;
  }

  const sectionLabels = {
    hero: 'Campus Highlight',
    news: 'Campus News Moment',
    leadership: 'School Leadership',
    alumni: 'Alumni Spotlight',
    learner: 'Pleasant View Scholar',
    school: 'Pleasant View Campus',
    video: 'Campus Showcase'
  };

  if (sectionHint && sectionLabels[sectionHint]) {
    return sectionLabels[sectionHint];
  }
  if (category) {
    return `Pleasant View — ${category}`;
  }
  return 'Pleasant View Campus Pictorial';
}
