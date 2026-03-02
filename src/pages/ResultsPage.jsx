import { useLocation } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { getHistoryEntryById, getHistory, updateHistoryEntry } from '../utils/historyStorage';
import { getCompanyIntel } from '../utils/companyIntel';
import { getRoundMapping } from '../utils/roundMapping';
import { toDisplayCategories, toLegacyExtracted } from '../utils/analysisSchema';
import { ArrowLeft, Calendar, ListChecks, HelpCircle, Target, Download, ClipboardList, Building2, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ResultsPage() {
  const location = useLocation();
  const [entry, setEntry] = useState(location.state?.entry || null);
  const idFromState = location.state?.id;
  const [skillConfidence, setSkillConfidence] = useState({});

  // Load entry from history if opened from History or directly
  useEffect(() => {
    if (entry) return;
    if (idFromState) {
      const fromHistory = getHistoryEntryById(idFromState);
      setEntry(fromHistory);
      return;
    }
    const history = getHistory();
    if (history.length > 0) setEntry(history[0]);
  }, [idFromState, entry]);

  // Initialize / sync skill confidence map whenever entry changes (works with normalized extractedSkills)
  useEffect(() => {
    if (!entry || !entry.extractedSkills) return;
    const extracted = entry.extractedSkills;
    const existing = entry.skillConfidenceMap || {};
    const next = { ...existing };
    const keys = ['coreCS', 'languages', 'web', 'data', 'cloud', 'testing', 'other'];
    keys.forEach((key) => {
      const skills = extracted[key];
      if (Array.isArray(skills)) skills.forEach((s) => { if (!next[s]) next[s] = 'practice'; });
    });
    setSkillConfidence(next);
    const baseScoreVal = typeof entry.baseScore === 'number' ? entry.baseScore : (typeof entry.baseReadinessScore === 'number' ? entry.baseReadinessScore : null);
    if (entry && baseScoreVal === null && typeof entry.finalScore === 'number') {
      const updated = { ...entry, baseScore: entry.finalScore, skillConfidenceMap: next };
      setEntry(updated);
      updateHistoryEntry(updated);
    } else if (entry) {
      const updated = { ...entry, skillConfidenceMap: next };
      setEntry(updated);
      updateHistoryEntry(updated);
    }
  }, [entry]);

  const data = entry;
  if (!data) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">No analysis yet</h2>
        <p className="text-gray-600">
          Results (readiness score, company intel, round mapping, skills, plan) appear here after you run an analysis.
        </p>
        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
          <li>Go to <strong>Analyze</strong>, paste a job description (and optional company/role), then click Analyze.</li>
          <li>Or open a past analysis from <strong>History</strong>.</li>
        </ul>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/dashboard/analyze"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover"
          >
            Analyze a job description
          </Link>
          <Link to="/dashboard" className="inline-flex items-center gap-2 text-primary font-medium">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const { company, role, extractedSkills, checklist, plan, questions } = data;
  const categories = toDisplayCategories(extractedSkills) || {};
  const generalFresher = Object.keys(categories).length === 0 || (Object.keys(categories).length === 1 && categories.other);

  const legacyExtracted = useMemo(() => toLegacyExtracted(extractedSkills), [extractedSkills]);

  const companyIntel = useMemo(() => {
    if (!company || !company.trim()) return null;
    return data.companyIntel || getCompanyIntel(company, data.jdText, legacyExtracted);
  }, [company, data.companyIntel, data.jdText, legacyExtracted]);

  const roundMapping = useMemo(() => {
    return data.roundMapping && data.roundMapping.length > 0
      ? data.roundMapping
      : getRoundMapping(company, data.jdText, legacyExtracted);
  }, [company, data.jdText, data.roundMapping, legacyExtracted]);

  // Persist intel for older entries that don't have it
  useEffect(() => {
    if (!data?.id || !company?.trim()) return;
    const hasIntel = data.companyIntel && data.roundMapping?.length > 0;
    if (hasIntel) return;
    const updated = {
      ...data,
      companyIntel: companyIntel || getCompanyIntel(company, data.jdText, legacyExtracted),
      roundMapping,
    };
    setEntry(updated);
    updateHistoryEntry(updated);
  }, [data?.id, company, data?.companyIntel, data?.roundMapping, companyIntel, roundMapping, legacyExtracted, data]);

  const baseScore = typeof data.baseScore === 'number'
    ? data.baseScore
    : typeof data.baseReadinessScore === 'number'
      ? data.baseReadinessScore
      : 35;

  const allSkills = useMemo(() => {
    const list = [];
    Object.values(categories).forEach(({ skills = [] }) => {
      skills.forEach((s) => list.push(s));
    });
    return Array.from(new Set(list));
  }, [categories]);

  const adjustedScore = useMemo(() => {
    if (allSkills.length === 0) return baseScore;
    let know = 0;
    let practice = 0;
    allSkills.forEach((s) => {
      const state = skillConfidence[s] || 'practice';
      if (state === 'know') know += 1;
      else practice += 1;
    });
    const score = baseScore + know * 2 - practice * 2;
    return Math.max(0, Math.min(100, score));
  }, [allSkills, baseScore, skillConfidence]);

  const handleConfidenceChange = (skill, value) => {
    setSkillConfidence((prev) => {
      const next = { ...prev, [skill]: value };
      // persist to history with updated readinessScore
      const updatedEntry = {
        ...data,
        skillConfidenceMap: next,
      };
      // compute with new map
      let know = 0;
      let practice = 0;
      allSkills.forEach((s) => {
        const state = next[s] || 'practice';
        if (state === 'know') know += 1;
        else practice += 1;
      });
      const base = typeof updatedEntry.baseScore === 'number' ? updatedEntry.baseScore : baseScore;
      const newScore = Math.max(0, Math.min(100, base + know * 2 - practice * 2));
      updatedEntry.finalScore = newScore;
      updatedEntry.updatedAt = new Date().toISOString();
      setEntry(updatedEntry);
      updateHistoryEntry(updatedEntry);
      return next;
    });
  };

  const copyText = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Swallow errors silently to keep UI calm
    }
  };

  const buildPlanText = () => {
    const lines = [];
    lines.push(`7-day plan for ${company || role || 'this role'}`);
    lines.push('');
    (plan || []).forEach((day) => {
      lines.push(day.title);
      (day.items || []).forEach((item) => lines.push(`- ${item}`));
      lines.push('');
    });
    return lines.join('\n');
  };

  const buildChecklistText = () => {
    const lines = [];
    lines.push('Round-wise preparation checklist');
    lines.push('');
    (checklist || []).forEach((round) => {
      lines.push(round.round);
      (round.items || []).forEach((item) => lines.push(`- ${item}`));
      lines.push('');
    });
    return lines.join('\n');
  };

  const buildQuestionsText = () => {
    const lines = [];
    lines.push('Likely interview questions');
    lines.push('');
    (questions || []).forEach((q, idx) => {
      lines.push(`${idx + 1}. ${q}`);
    });
    return lines.join('\n');
  };

  const buildFullExportText = () => {
    const lines = [];
    lines.push(`Company: ${company || '-'}`);
    lines.push(`Role: ${role || '-'}`);
    lines.push(`Readiness score: ${adjustedScore}/100`);
    lines.push('');
    lines.push('Key skills:');
    if (generalFresher) {
      lines.push('- General fresher stack');
    } else {
      Object.values(categories).forEach(({ label, skills = [] }) => {
        if (!skills.length) return;
        lines.push(`- ${label}: ${skills.join(', ')}`);
      });
    }
    lines.push('');
    lines.push(buildChecklistText());
    lines.push('');
    lines.push(buildPlanText());
    lines.push('');
    lines.push(buildQuestionsText());
    return lines.join('\n');
  };

  const handleDownloadTxt = () => {
    const content = buildFullExportText();
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const safeName = (company || role || 'placement-plan').replace(/[^a-z0-9-_]+/gi, '_');
    a.download = `${safeName || 'placement-plan'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const weakSkills = useMemo(() => {
    const practiceSkills = allSkills.filter((s) => (skillConfidence[s] || 'practice') === 'practice');
    return practiceSkills.slice(0, 3);
  }, [allSkills, skillConfidence]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Analysis results</h1>
          <p className="text-gray-600 mt-1">
            {company && role ? `${company} · ${role}` : company || role || 'Job description analysis'}
          </p>
        </div>
        <Link
          to="/dashboard/history"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary"
        >
          <ArrowLeft className="w-4 h-4" />
          History
        </Link>
      </div>

      {/* Readiness score + exports */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Readiness score
            </span>
            <div className="flex flex-wrap gap-2 text-xs">
              <button
                type="button"
                onClick={() => copyText(buildPlanText())}
                className="inline-flex items-center gap-1 rounded-full border border-gray-200 px-3 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors"
              >
                <ClipboardList className="w-3 h-3" />
                Copy 7-day plan
              </button>
              <button
                type="button"
                onClick={() => copyText(buildChecklistText())}
                className="inline-flex items-center gap-1 rounded-full border border-gray-200 px-3 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors"
              >
                <ClipboardList className="w-3 h-3" />
                Copy round checklist
              </button>
              <button
                type="button"
                onClick={() => copyText(buildQuestionsText())}
                className="inline-flex items-center gap-1 rounded-full border border-gray-200 px-3 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors"
              >
                <ClipboardList className="w-3 h-3" />
                Copy 10 questions
              </button>
              <button
                type="button"
                onClick={handleDownloadTxt}
                className="inline-flex items-center gap-1 rounded-full border border-gray-200 px-3 py-1 text-gray-700 hover:border-primary hover:text-primary transition-colors"
              >
                <Download className="w-3 h-3" />
                Download as TXT
              </button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-primary">{adjustedScore}</span>
            <span className="text-gray-500">/ 100</span>
          </div>
          {(typeof data.baseScore === 'number' || typeof data.baseReadinessScore === 'number') && (
            <p className="mt-1 text-xs text-gray-500">
              Base score: {baseScore}. Adjusted by your self-assessment.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Company Intel — only when company name provided */}
      {companyIntel && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Company intel
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 text-sm">
              <p className="font-medium text-gray-900">{companyIntel.companyName}</p>
              <p className="text-gray-600"><span className="font-medium text-gray-700">Industry:</span> {companyIntel.industry}</p>
              <p className="text-gray-600"><span className="font-medium text-gray-700">Estimated size:</span> {companyIntel.sizeLabel}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-700 mb-1">Typical hiring focus</p>
              <p className="text-sm text-gray-600">{companyIntel.typicalHiringFocus}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Round mapping — vertical timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Round mapping
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {roundMapping.map((round, index) => (
              <div key={round.roundNumber} className="flex gap-4 pb-6 last:pb-0">
                <div className="flex flex-col items-center shrink-0">
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium">
                    {round.roundNumber}
                  </div>
                  {index < roundMapping.length - 1 && (
                    <div className="w-0.5 flex-1 min-h-[24px] bg-gray-200 mt-1" />
                  )}
                </div>
                <div className="flex-1 min-w-0 pt-0.5">
                  <p className="font-medium text-gray-900">{round.title}</p>
                  <p className="text-sm text-gray-600 mt-1">{round.description}</p>
                  <p className="text-xs text-gray-500 mt-2 italic">Why this round matters: {round.whyItMatters}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-gray-500 italic">Demo Mode: Company intel generated heuristically.</p>
        </CardContent>
      </Card>

      {/* Key skills extracted with self-assessment */}
      <Card>
        <CardHeader>
          <CardTitle>Key skills extracted</CardTitle>
        </CardHeader>
        <CardContent>
          {generalFresher ? (
            <p className="text-gray-600">General fresher stack (no specific keywords detected).</p>
          ) : (
            <div className="space-y-4">
              {Object.entries(categories).map(([key, { label, skills }]) => (
                <div key={key}>
                  <p className="text-sm font-medium text-gray-700 mb-2">{label}</p>
                  <div className="flex flex-col gap-2">
                    {(skills || []).map((s) => {
                      const state = skillConfidence[s] || 'practice';
                      const knowActive = state === 'know';
                      return (
                        <div
                          key={s}
                          className="flex items-center justify-between gap-3 rounded-lg border border-gray-100 px-3 py-2"
                        >
                          <span
                            className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
                              knowActive
                                ? 'bg-primary-light text-primary'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {s}
                          </span>
                          <div className="inline-flex rounded-full border border-gray-200 bg-white text-xs overflow-hidden">
                            <button
                              type="button"
                              onClick={() => handleConfidenceChange(s, 'know')}
                              className={`px-3 py-1 ${
                                knowActive
                                  ? 'bg-primary text-white'
                                  : 'bg-white text-gray-600 hover:bg-gray-50'
                              }`}
                            >
                              I know this
                            </button>
                            <button
                              type="button"
                              onClick={() => handleConfidenceChange(s, 'practice')}
                              className={`px-3 py-1 ${
                                !knowActive
                                  ? 'bg-gray-100 text-gray-700'
                                  : 'bg-white text-gray-600 hover:bg-gray-50'
                              }`}
                            >
                              Need practice
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Round-wise checklist */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ListChecks className="w-5 h-5" />
            Round-wise preparation checklist
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-6">
            {(checklist || []).map((round) => (
              <li key={round.round}>
                <p className="font-medium text-gray-900 mb-2">{round.round}</p>
                <ul className="list-disc list-inside space-y-1 text-gray-600 text-sm">
                  {(round.items || []).map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* 7-day plan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            7-day plan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {(plan || []).map((day) => (
              <li key={day.day}>
                <p className="font-medium text-gray-900 mb-1">{day.title}</p>
                <ul className="list-disc list-inside text-gray-600 text-sm space-y-0.5">
                  {(day.items || []).map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* 10 likely questions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5" />
            10 likely interview questions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2 text-gray-700 text-sm">
            {(questions || []).map((q, i) => (
              <li key={i}>{q}</li>
            ))}
          </ol>
        </CardContent>
      </Card>

      {/* Action Next box */} 
      <Card>
        <CardHeader>
          <CardTitle>Action Next</CardTitle>
        </CardHeader>
        <CardContent>
          {weakSkills.length === 0 ? (
            <p className="text-sm text-gray-600">
              All current skills are marked as \"I know this\". You can revisit this later as you prepare.
            </p>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-gray-700">
                Top areas to focus next:
              </p>
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                {weakSkills.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
          )}
          <p className="mt-4 text-sm font-medium text-gray-900">
            Suggested next action: <span className="text-primary">Start Day 1 plan now.</span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
