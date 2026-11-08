/**
 * lib/population.js
 * Mathematical Institutional Population & Cohort Tally Engine for Pleasant View Schools.
 *
 * Guarantees that:
 * 1. For every school: Enrolled Learners === Day Scholars + Boarding Scholars.
 * 2. Institutional Total: Sum of all schools' learners === Sum of all Day Scholars + Sum of all Boarders.
 * 3. Both dimensions mathematically tally without discrepancy.
 */

/**
 * Extracts numeric count from strings like "280 Students", "60 Day Scholars", "180 Boarders (From Gr. 4)".
 * Returns 0 if text specifies day-only or contains no positive digits.
 */
export function parseCount(val) {
  if (typeof val === 'number') return Math.max(0, Math.round(val));
  if (!val || typeof val !== 'string') return 0;
  const lower = val.toLowerCase().trim();
  if (lower.includes('day only') || lower.includes('day school only') || lower === 'day scholars') {
    return 0;
  }
  const match = lower.replace(/,/g, '').match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
}

/**
 * Standard default verified baseline counts for Pleasant View Schools (Total 1,050 / 1000+).
 * Tally:
 *   Senior School:     60 Day + 220 Boarders = 280
 *   Junior Secondary: 120 Day + 200 Boarders = 320
 *   Primary School:   170 Day + 180 Boarders = 350
 *   Early Learning:   100 Day +   0 Boarders = 100
 * ────────────────────────────────────────────────────────
 *   TOTALS:           450 Day + 600 Boarders = 1,050 Learners
 *   Sum by Schools:   280 + 320 + 350 + 100   = 1,050 Learners
 *   ✓ BOTH DIMENSIONS TALLY EXACTLY TO 1,050 (1000+)
 */
export const DEFAULT_POPULATION_BASELINE = {
  'pleasantview-senior': { day: 60, boarders: 220, learners: 280, unit: 'Students' },
  'pleasantview-jss': { day: 120, boarders: 200, learners: 320, unit: 'Students' },
  'pleasantview-primary': { day: 170, boarders: 180, learners: 350, unit: 'Pupils' },
  'pleasantview-early-learning': { day: 100, boarders: 0, learners: 100, unit: 'Children' }
};

/**
 * Normalizes and tallies an individual school's population figures.
 */
export function getSchoolPopulationData(school) {
  if (!school) {
    return {
      dayScholars: 0,
      boarders: 0,
      totalLearners: 0,
      dayScholarsText: '0 Day Scholars',
      boardersText: '0 Boarders',
      totalLearnersText: '0 Learners',
      unit: 'Learners'
    };
  }

  const slug = school.slug || '';
  const baseline = DEFAULT_POPULATION_BASELINE[slug] || null;

  let rawLearners = parseCount(school.learners);
  let rawBoarders = parseCount(school.boarders);
  let rawDay = parseCount(school.day_scholars);

  // If database row had no explicit counts yet, fallback to mathematically verified baseline
  if (rawLearners === 0 && rawBoarders === 0 && rawDay === 0 && baseline) {
    rawLearners = baseline.learners;
    rawBoarders = baseline.boarders;
    rawDay = baseline.day;
  }

  // Enforce mathematical tally for the school: Day + Boarders = Total
  let dayScholars = rawDay;
  let boarders = rawBoarders;
  let totalLearners = rawLearners;

  if (dayScholars === 0 && boarders === 0 && totalLearners > 0) {
    // If only total was given, fallback to baseline or all day
    if (baseline) {
      boarders = baseline.boarders;
      dayScholars = baseline.day;
      totalLearners = baseline.learners;
    } else {
      dayScholars = totalLearners;
    }
  } else if (dayScholars === 0 && totalLearners >= boarders && boarders > 0) {
    dayScholars = totalLearners - boarders;
  } else if (totalLearners === 0) {
    totalLearners = dayScholars + boarders;
  } else if (totalLearners !== dayScholars + boarders) {
    // If explicit day and boarders were saved, their sum is authoritative
    if (dayScholars > 0 || boarders > 0) {
      totalLearners = dayScholars + boarders;
    }
  }

  const unit = baseline?.unit || (slug.includes('senior') || slug.includes('jss') ? 'Students' : slug.includes('early') ? 'Children' : 'Pupils');

  return {
    id: school.id,
    slug: school.slug,
    name: school.name,
    category: school.category || 'School',
    level: school.level || '',
    color: school.color || '#8B1E2D',
    dayScholars,
    boarders,
    totalLearners,
    dayScholarsText: `${dayScholars} Day Scholars`,
    boardersText: boarders > 0 ? `${boarders} Boarding Scholars` : 'Day Scholars Only',
    totalLearnersText: `${totalLearners} ${unit}`,
    unit,
    ratio: school.ratio || (slug.includes('senior') ? '1:15' : slug.includes('early') ? '1:12' : '1:20')
  };
}

/**
 * Calculates complete institutional population breakdown and guarantees mathematical tally.
 */
export function calculateInstitutionalPopulation(schoolsList = []) {
  const schools = Array.isArray(schoolsList) && schoolsList.length > 0
    ? schoolsList.map(getSchoolPopulationData)
    : Object.keys(DEFAULT_POPULATION_BASELINE).map(slug => {
        const b = DEFAULT_POPULATION_BASELINE[slug];
        return getSchoolPopulationData({
          slug,
          name: slug === 'pleasantview-senior'
            ? 'Pleasant View Senior School'
            : slug === 'pleasantview-jss'
              ? 'Pleasant View Junior Secondary'
              : slug === 'pleasantview-primary'
                ? 'Pleasant View Primary School'
                : 'Pleasant View Early Learning Centre',
          category: slug === 'pleasantview-senior'
            ? 'SENIOR SCHOOL'
            : slug === 'pleasantview-jss'
              ? 'JUNIOR SECONDARY (JSS)'
              : slug === 'pleasantview-primary'
                ? 'PRIMARY SCHOOL'
                : 'EARLY LEARNING',
          learners: `${b.learners} ${b.unit}`,
          boarders: b.boarders > 0 ? `${b.boarders} Boarders` : 'Day Scholars Only',
          day_scholars: `${b.day} Day Scholars`
        });
      });

  const totalDayScholars = schools.reduce((acc, s) => acc + s.dayScholars, 0);
  const totalBoarders = schools.reduce((acc, s) => acc + s.boarders, 0);
  const totalPopulation = schools.reduce((acc, s) => acc + s.totalLearners, 0);

  const sumByAttendance = totalDayScholars + totalBoarders;
  const isTallied = totalPopulation === sumByAttendance;

  return {
    schools,
    totalDayScholars,
    totalBoarders,
    totalPopulation,
    sumByAttendance,
    isTallied,
    badgeValue: '1000+',
    statDisplay: `${totalPopulation.toLocaleString()}+`,
    summaryText: `${totalPopulation.toLocaleString()} Total Enrolled Learners (${totalBoarders.toLocaleString()} Boarding + ${totalDayScholars.toLocaleString()} Day Scholars)`,
    formulaByAttendance: `${totalDayScholars} Day Scholars + ${totalBoarders} Boarding Scholars = ${totalPopulation} Total`,
    formulaBySchools: schools.map(s => `${s.name.replace(/Pleasant View /i, '')} (${s.totalLearners})`).join(' + ') + ` = ${totalPopulation}`
  };
}
