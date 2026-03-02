import { extractSkillsFromJD, getDetectedCategoryKeys, getAllDetectedSkills } from './skillExtraction';
import { DEFAULT_OTHER_SKILLS } from './analysisSchema';

const ROUND_LABELS = [
  'Round 1: Aptitude / Basics',
  'Round 2: DSA + Core CS',
  'Round 3: Tech interview (projects + stack)',
  'Round 4: Managerial / HR',
];

/**
 * Build round-wise checklist (5–8 items per round) based on detected skills.
 */
function buildChecklist(extracted) {
  const keys = getDetectedCategoryKeys(extracted);
  const hasDSA = keys.includes('coreCS') || keys.some(k => extracted.categories[k]?.skills?.some(s => /DSA|Data Structures|Algorithms/i.test(s)));
  const hasWeb = keys.includes('web');
  const hasData = keys.includes('data');
  const hasLang = keys.includes('languages');
  const hasCloud = keys.includes('cloudDevOps');
  const hasTesting = keys.includes('testing');

  const round1 = [
    'Quantitative aptitude: practice percentages, ratios, time-speed-distance',
    'Logical reasoning: sequences, syllogisms, puzzles',
    'Verbal: reading comprehension and grammar',
    'Company research and role understanding',
    'Basic CS fundamentals review',
  ];
  if (keys.length > 0) round1.push('Brush up core subjects relevant to the role');
  if (keys.length >= 2) round1.push('Time management practice for timed tests');

  const round2 = [
    'Arrays, strings, and two-pointer techniques',
    'Hash maps and sets for lookups',
    'Sorting and searching (binary search)',
    'Recursion and basic DP patterns',
  ];
  if (hasDSA) {
    round2.push('Trees and graphs: traversal and shortest path');
    round2.push('Stack/queue and sliding window problems');
  }
  if (hasData) round2.push('SQL queries: joins, subqueries, indexing');
  if (hasLang) round2.push('Language-specific syntax and standard library');
  round2.push('Complexity analysis (time and space)');

  const round3 = [
    'Prepare 2–3 projects with clear problem-solution-impact',
    'Align project tech stack with JD requirements',
    'Explain design decisions and trade-offs',
  ];
  if (hasWeb) {
    round3.push('Frontend/backend architecture and APIs');
    round3.push('State management and performance (if React/JS in JD)');
  }
  if (hasData) round3.push('Database design and normalization');
  if (hasCloud) round3.push('Deployment and DevOps basics');
  if (hasTesting) round3.push('Testing strategy and tools used');
  round3.push('System design basics: scalability and consistency');

  const round4 = [
    'Tell me about yourself (2-min version)',
    'Why this company? Why this role?',
    'Strengths and weaknesses with examples',
    'Past conflict or failure and how you resolved it',
    'Salary expectations and notice period',
    'Questions to ask the interviewer',
  ];
  if (keys.length > 0) round4.push('Connect your skills to the JD');
  round4.push('Behavioural STAR format practice');

  return [
    { round: ROUND_LABELS[0], items: round1.slice(0, 8) },
    { round: ROUND_LABELS[1], items: round2.slice(0, 8) },
    { round: ROUND_LABELS[2], items: round3.slice(0, 8) },
    { round: ROUND_LABELS[3], items: round4.slice(0, 8) },
  ];
}

/**
 * 7-day plan adapted to detected skills.
 */
function buildSevenDayPlan(extracted) {
  const keys = getDetectedCategoryKeys(extracted);
  const hasReact = keys.includes('web') && extracted.categories.web?.skills?.some(s => /react/i.test(s));
  const hasDSA = keys.includes('coreCS');
  const hasData = keys.includes('data');
  const hasSQL = hasData && extracted.categories.data?.skills?.some(s => /sql|mysql|postgres/i.test(s));

  const day1_2 = ['OS: processes, threads, memory', 'DBMS: ACID, normalisation', 'Networks: TCP/IP, HTTP'];
  if (hasDSA) day1_2.push('Complexity, arrays, strings');
  if (hasData) day1_2.push('SQL basics and joins');

  const day3_4 = ['DSA: arrays, hashing, two pointers', 'DSA: binary search, sliding window', 'DSA: recursion, DP basics', 'Coding practice: 2–3 problems per day'];
  if (hasDSA) day3_4.push('Trees and graphs revision');

  const day5 = ['Project 1: problem, solution, impact', 'Project 2: tech stack alignment with JD', 'Resume bullet proofing'];
  if (hasReact) day5.push('Frontend project: state and APIs');

  const day6 = ['Mock: DSA and coding', 'Mock: system design / DB', 'Mock: behavioural'];
  if (hasReact) day6.push('Mock: React and frontend questions');

  const day7 = ['Revision: weak topics from the week', 'Formula sheet and cheat notes'];
  if (hasSQL) day7.push('SQL and indexing revision');
  if (hasReact) day7.push('React lifecycle and hooks revision');

  return [
    { day: 1, title: 'Day 1–2: Basics + Core CS', items: day1_2 },
    { day: 3, title: 'Day 3–4: DSA + Coding practice', items: day3_4 },
    { day: 5, title: 'Day 5: Project + Resume alignment', items: day5 },
    { day: 6, title: 'Day 6: Mock interview questions', items: day6 },
    { day: 7, title: 'Day 7: Revision + Weak areas', items: day7 },
  ];
}

/**
 * Generate up to 10 likely interview questions from detected skills.
 */
function buildQuestions(extracted) {
  const list = [];
  const keys = getDetectedCategoryKeys(extracted);
  const cats = extracted.categories || {};

  if (cats.coreCS?.skills?.some(s => /DSA|Algorithms|Data Structures/i.test(s))) {
    list.push('How would you optimize search in sorted data? When to use binary search?');
    list.push('Explain time complexity of common sorting algorithms. When to use which?');
  }
  if (cats.coreCS?.skills?.some(s => /OOP/i.test(s))) {
    list.push('Explain OOP principles with examples. Difference between abstraction and encapsulation?');
  }
  if (cats.data?.skills?.some(s => /SQL|MySQL|PostgreSQL/i.test(s))) {
    list.push('Explain indexing and when it helps. What are clustered vs non-clustered indexes?');
    list.push('How would you design a schema for a given use case? Normalisation trade-offs.');
  }
  if (cats.web?.skills?.some(s => /React/i.test(s))) {
    list.push('Explain state management options in React (useState, Context, Redux). When to use what?');
    list.push('Virtual DOM and reconciliation. How does React optimize re-renders?');
  }
  if (cats.web?.skills?.some(s => /Node|Express|REST|API/i.test(s))) {
    list.push('REST vs GraphQL. When would you choose one over the other?');
  }
  if (cats.languages?.skills?.some(s => /JavaScript|Java|Python/i.test(s))) {
    list.push('Explain event loop / concurrency model in your primary language.');
  }
  if (cats.cloudDevOps?.skills?.length) {
    list.push('Explain CI/CD pipeline. How would you automate build and deploy?');
  }
  if (cats.testing?.skills?.length) {
    list.push('How do you approach unit testing vs integration testing?');
  }

  // Fill up to 10 with generic but useful questions
  const generic = [
    'Tell me about a challenging technical problem you solved.',
    'How do you stay updated with new technologies?',
    'Describe a project you are proud of and your role in it.',
    'How do you handle disagreements in a team?',
    'Where do you see yourself in 2–3 years?',
  ];
  while (list.length < 10) {
    const pick = generic.find(q => !list.includes(q));
    if (pick) list.push(pick);
    else break;
  }
  return list.slice(0, 10);
}

/**
 * Readiness score 0–100.
 * Start 35, +5 per category (max 30), +10 company, +10 role, +10 JD length > 800.
 */
function computeReadinessScore(extracted, company, role, jdText) {
  let score = 35;
  const categoryCount = Math.min(6, getDetectedCategoryKeys(extracted).length);
  score += categoryCount * 5; // max 30
  if (company && String(company).trim().length > 0) score += 10;
  if (role && String(role).trim().length > 0) score += 10;
  if (jdText && jdText.length > 800) score += 10;
  return Math.min(100, Math.max(0, score));
}

/** When no skills detected: checklist focused on Communication, Problem solving, Basic coding, Projects. */
function buildChecklistForOther() {
  return [
    { round: 'Round 1: Aptitude / Basics', items: ['Quantitative and logical reasoning', 'Verbal ability and comprehension', 'Company and role research', 'Time management practice'] },
    { round: 'Round 2: Problem-solving & Basic coding', items: ['Basic coding in your preferred language', 'Simple data structures (arrays, strings)', 'Problem-solving approach and clarity', 'Practice explaining your approach'] },
    { round: 'Round 3: Projects & Communication', items: ['Prepare 1–2 projects with clear impact', 'Practice explaining projects in 2–3 minutes', 'Communication and clarity of thought', 'Behavioural STAR examples'] },
    { round: 'Round 4: HR & Fit', items: ['Tell me about yourself', 'Why this company / role', 'Strengths and weaknesses', 'Questions to ask the interviewer'] },
  ];
}

/** 7-day plan when only "other" skills (e.g. general fresher). */
function buildPlanForOther() {
  return [
    { day: 1, title: 'Day 1–2: Basics & Communication', items: ['Brush up basics of one language', 'Practice explaining a project in 2 minutes', 'One simple coding problem'] },
    { day: 3, title: 'Day 3–4: Problem-solving practice', items: ['Arrays and strings: 2–3 problems', 'Practice explaining approach out loud', 'Basic logic and reasoning'] },
    { day: 5, title: 'Day 5: Projects & Resume', items: ['Document project impact clearly', 'Resume bullet proofing', 'Prepare STAR stories'] },
    { day: 6, title: 'Day 6: Mock & Questions', items: ['Mock: explain a project', 'Mock: one coding problem', 'Prepare 3–5 questions for interviewer'] },
    { day: 7, title: 'Day 7: Revision', items: ['Revision: weak areas', 'Final run-through of intro and projects'] },
  ];
}

/** 10 questions when no specific skills detected (other focus). */
function buildQuestionsForOther() {
  return [
    'Tell me about yourself and your background.',
    'Describe a project you worked on and your role.',
    'How do you approach a problem you have not seen before?',
    'Explain a technical concept to a non-technical person.',
    'Describe a time you worked in a team under pressure.',
    'What are your strengths and weaknesses?',
    'Why do you want to join this company / role?',
    'Where do you see yourself in 2–3 years?',
    'Do you have any questions for us?',
    'What is one thing you would like to improve?',
  ];
}

/**
 * Run full analysis from form inputs. No external APIs.
 * When no skills detected, uses "other" (Communication, Problem solving, Basic coding, Projects).
 */
export function runAnalysis({ company = '', role = '', jdText = '' }) {
  const extracted = extractSkillsFromJD(jdText);
  const isOtherOnly = extracted.generalFresher || getDetectedCategoryKeys(extracted).length === 0;

  const checklist = isOtherOnly ? buildChecklistForOther() : buildChecklist(extracted);
  const plan = isOtherOnly ? buildPlanForOther() : buildSevenDayPlan(extracted);
  const questions = isOtherOnly ? buildQuestionsForOther() : buildQuestions(extracted);
  const readinessScore = computeReadinessScore(extracted, company, role, jdText);

  return {
    extractedSkills: extracted,
    checklist,
    plan,
    questions,
    readinessScore,
  };
}
