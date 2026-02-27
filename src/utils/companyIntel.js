/**
 * Company intel heuristics (no external APIs).
 * Size: Startup (<200), Mid-size (200–2000), Enterprise (2000+).
 * Unknown company → Startup by default.
 */

const KNOWN_ENTERPRISE = [
  'amazon', 'microsoft', 'google', 'meta', 'apple', 'infosys', 'tcs', 'wipro',
  'accenture', 'capgemini', 'cognizant', 'hcl', 'tech mahindra', 'oracle',
  'ibm', 'salesforce', 'adobe', 'netflix', 'uber', 'paypal', 'goldman sachs',
  'jpmorgan', 'morgan stanley', 'flipkart', 'ola', 'swiggy', 'zomato',
  'tata consultancy', 'tata consulting', 'mindtree', 'lti', 'larsen',
  'deloitte', 'ey', 'kpmg', 'pwc',
];

const INDUSTRY_KEYWORDS = [
  { keywords: ['fintech', 'banking', 'payment', 'lending', 'insurance'], industry: 'Financial Services' },
  { keywords: ['healthcare', 'medical', 'pharma', 'clinical'], industry: 'Healthcare' },
  { keywords: ['ecommerce', 'retail', 'marketplace', 'shopping'], industry: 'E-commerce & Retail' },
  { keywords: ['edtech', 'education', 'learning', 'course'], industry: 'Education Technology' },
  { keywords: ['saas', 'enterprise software', 'b2b'], industry: 'Enterprise Software' },
  { keywords: ['product', 'consumer app', 'mobile app'], industry: 'Consumer Technology' },
];

const DEFAULT_INDUSTRY = 'Technology Services';

export function getSizeCategory(companyName) {
  if (!companyName || typeof companyName !== 'string') return 'startup';
  const normalized = companyName.toLowerCase().trim();
  const isEnterprise = KNOWN_ENTERPRISE.some((name) => normalized.includes(name));
  if (isEnterprise) return 'enterprise';
  // Heuristic: could add mid-size keywords (e.g. "labs", "ventures") if needed
  return 'startup';
}

export function inferIndustry(jdText) {
  if (!jdText || typeof jdText !== 'string') return DEFAULT_INDUSTRY;
  const text = jdText.toLowerCase();
  for (const { keywords, industry } of INDUSTRY_KEYWORDS) {
    if (keywords.some((kw) => text.includes(kw))) return industry;
  }
  return DEFAULT_INDUSTRY;
}

export function getTypicalHiringFocus(sizeCategory) {
  if (sizeCategory === 'enterprise') {
    return 'Structured DSA and core CS fundamentals; aptitude and coding tests; system design and behavioural rounds.';
  }
  if (sizeCategory === 'mid-size') {
    return 'Mix of problem-solving and stack depth; practical coding and system discussion; culture fit.';
  }
  return 'Practical problem-solving and stack depth; hands-on coding; system discussion and culture fit.';
}

/**
 * Returns { companyName, industry, sizeCategory, typicalHiringFocus }.
 * Use when company name is provided.
 */
export function getCompanyIntel(companyName, jdText, extractedSkills) {
  const name = (companyName && String(companyName).trim()) || '';
  const sizeCategory = getSizeCategory(name);
  const industry = inferIndustry(jdText);
  const typicalHiringFocus = getTypicalHiringFocus(sizeCategory);
  return {
    companyName: name || 'Company',
    industry,
    sizeCategory,
    sizeLabel: sizeCategory === 'enterprise' ? 'Enterprise (2000+)' : sizeCategory === 'mid-size' ? 'Mid-size (200–2000)' : 'Startup (<200)',
    typicalHiringFocus,
  };
}
