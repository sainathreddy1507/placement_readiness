import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { runAnalysis } from '../utils/analysis';
import { saveToHistory } from '../utils/historyStorage';
import { getCompanyIntel } from '../utils/companyIntel';
import { getRoundMapping } from '../utils/roundMapping';
import { FileText } from 'lucide-react';

export default function AnalyzePage() {
  const navigate = useNavigate();
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [jdText, setJdText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const jdShort = jdText.trim().length > 0 && jdText.trim().length < 200;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!jdText.trim()) {
      setError('Please paste the job description.');
      return;
    }
    setLoading(true);
    try {
      const result = runAnalysis({ company: company.trim(), role: role.trim(), jdText: jdText.trim() });
      const companyTrimmed = company.trim();
      const jdTrimmed = jdText.trim();
      const companyIntel = companyTrimmed
        ? getCompanyIntel(companyTrimmed, jdTrimmed, result.extractedSkills)
        : null;
      const roundMapping = getRoundMapping(companyTrimmed, jdTrimmed, result.extractedSkills);
      const entry = {
        company: companyTrimmed,
        role: role.trim(),
        jdText: jdTrimmed,
        extractedSkills: result.extractedSkills,
        plan: result.plan,
        checklist: result.checklist,
        questions: result.questions,
        baseScore: result.readinessScore,
        finalScore: result.readinessScore,
        skillConfidenceMap: {},
        companyIntel,
        roundMapping,
      };
      const saved = saveToHistory(entry);
      if (saved) {
        navigate('/dashboard/results', { state: { entry: saved } });
      } else {
        setError('Could not save to history. Try again.');
      }
    } catch (err) {
      setError('Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Analyze Job Description</h1>
        <p className="text-gray-600 mt-1">Paste a JD to extract skills and get a preparation plan.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Job details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company (optional)</label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Tech Corp"
                className="w-full rounded-lg border border-gray-200 px-4 py-2 text-gray-900 placeholder-gray-400 focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role (optional)</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. SDE 1, Frontend Developer"
                className="w-full rounded-lg border border-gray-200 px-4 py-2 text-gray-900 placeholder-gray-400 focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job description <span className="text-red-500">*</span></label>
              <textarea
                value={jdText}
                onChange={(e) => setJdText(e.target.value)}
                placeholder="Paste the full job description here..."
                rows={12}
                required
                className="w-full rounded-lg border border-gray-200 px-4 py-2 text-gray-900 placeholder-gray-400 focus:border-primary focus:ring-1 focus:ring-primary resize-y min-h-[200px]"
              />
              {jdShort && (
                <p className="mt-1.5 text-sm text-amber-700">
                  This JD is too short to analyze deeply. Paste full JD for better output.
                </p>
              )}
            </div>
            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-60 transition-colors"
            >
              {loading ? 'Analyzing…' : 'Analyze'}
            </button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
