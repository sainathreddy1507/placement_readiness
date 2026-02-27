/**
 * Round mapping engine: dynamic rounds based on company size + detected skills.
 * No external APIs. Each round has title, short description, and whyItMatters.
 */

import { getDetectedCategoryKeys } from './skillExtraction';
import { getCompanyIntel, getSizeCategory } from './companyIntel';

function hasDSA(extracted) {
  const keys = getDetectedCategoryKeys(extracted);
  if (keys.includes('coreCS')) return true;
  const cats = extracted?.categories || {};
  return Object.values(cats).some((c) => c?.skills?.some((s) => /DSA|Data Structures|Algorithms/i.test(s)));
}

function hasWebStack(extracted) {
  const keys = getDetectedCategoryKeys(extracted);
  if (!keys.includes('web')) return false;
  const skills = extracted?.categories?.web?.skills || [];
  return skills.some((s) => /React|Node|JavaScript|TypeScript|Next/i.test(s));
}

export function getRoundMapping(companyName, jdText, extractedSkills) {
  const sizeCategory = companyName && String(companyName).trim()
    ? getSizeCategory(companyName)
    : 'startup';
  const extracted = extractedSkills || { categories: {}, generalFresher: true };
  const dsa = hasDSA(extracted);
  const webStack = hasWebStack(extracted);

  if (sizeCategory === 'enterprise' && dsa) {
    return [
      {
        roundNumber: 1,
        title: 'Round 1: Online Test (DSA + Aptitude)',
        description: 'Timed test covering data structures, algorithms, and quantitative aptitude.',
        whyItMatters: 'Screens for strong fundamentals and speed; often elimination round.',
      },
      {
        roundNumber: 2,
        title: 'Round 2: Technical (DSA + Core CS)',
        description: 'Coding and core CS concepts: OS, DBMS, networks, OOP.',
        whyItMatters: 'Validates problem-solving and theoretical depth.',
      },
      {
        roundNumber: 3,
        title: 'Round 3: Tech + Projects',
        description: 'Deep dive into your projects, design decisions, and tech stack.',
        whyItMatters: 'Shows how you apply knowledge in real scenarios.',
      },
      {
        roundNumber: 4,
        title: 'Round 4: HR',
        description: 'Behavioural questions, fit, and expectations.',
        whyItMatters: 'Assesses communication and alignment with company values.',
      },
    ];
  }

  if (sizeCategory === 'enterprise') {
    return [
      {
        roundNumber: 1,
        title: 'Round 1: Aptitude / Screening',
        description: 'Quantitative, logical reasoning, and verbal ability.',
        whyItMatters: 'First filter; time-bound accuracy matters.',
      },
      {
        roundNumber: 2,
        title: 'Round 2: Technical Interview',
        description: 'Core CS and role-specific technical questions.',
        whyItMatters: 'Core competency check for the role.',
      },
      {
        roundNumber: 3,
        title: 'Round 3: Projects & System Discussion',
        description: 'Projects, system design basics, and trade-offs.',
        whyItMatters: 'Demonstrates practical and design thinking.',
      },
      {
        roundNumber: 4,
        title: 'Round 4: HR / Managerial',
        description: 'Behavioural and fit; salary and expectations.',
        whyItMatters: 'Final alignment and mutual fit.',
      },
    ];
  }

  if ((sizeCategory === 'startup' || sizeCategory === 'mid-size') && webStack) {
    return [
      {
        roundNumber: 1,
        title: 'Round 1: Practical Coding',
        description: 'Hands-on coding: small problem or take-home aligned with stack.',
        whyItMatters: 'Startups value ability to ship; this round shows execution.',
      },
      {
        roundNumber: 2,
        title: 'Round 2: System Discussion',
        description: 'Architecture, APIs, and how you’d build or improve a feature.',
        whyItMatters: 'Tests design sense and collaboration on technical decisions.',
      },
      {
        roundNumber: 3,
        title: 'Round 3: Culture Fit',
        description: 'Projects, motivation, and how you work in a small team.',
        whyItMatters: 'Fit and ownership matter more in smaller teams.',
      },
    ];
  }

  if (sizeCategory === 'startup' || sizeCategory === 'mid-size') {
    return [
      {
        roundNumber: 1,
        title: 'Round 1: Problem-solving / Coding',
        description: 'Practical coding or problem-solving relevant to the role.',
        whyItMatters: 'Quick signal on coding and thinking under constraint.',
      },
      {
        roundNumber: 2,
        title: 'Round 2: Technical Deep Dive',
        description: 'Core CS and stack; projects and trade-offs.',
        whyItMatters: 'Validates depth in areas that matter for the role.',
      },
      {
        roundNumber: 3,
        title: 'Round 3: Culture & Fit',
        description: 'Behavioural and team fit; expectations.',
        whyItMatters: 'Ensures mutual fit for a smaller team.',
      },
    ];
  }

  // Fallback
  return [
    {
      roundNumber: 1,
      title: 'Round 1: Screening',
      description: 'Aptitude or coding screening.',
      whyItMatters: 'Initial filter for the process.',
    },
    {
      roundNumber: 2,
      title: 'Round 2: Technical',
      description: 'Technical interview based on role.',
      whyItMatters: 'Core competency assessment.',
    },
    {
      roundNumber: 3,
      title: 'Round 3: HR / Fit',
      description: 'Behavioural and fit.',
      whyItMatters: 'Final alignment.',
    },
  ];
}
