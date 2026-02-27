import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { getHistoryEntryById, getHistory } from '../utils/historyStorage';
import { ArrowLeft, Calendar, ListChecks, HelpCircle, Target } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ResultsPage() {
  const location = useLocation();
  const [entry, setEntry] = useState(location.state?.entry || null);
  const idFromState = location.state?.id;

  useEffect(() => {
    if (entry) return;
    if (idFromState) {
      const fromHistory = getHistoryEntryById(idFromState);
      setEntry(fromHistory);
      return;
    }
    // No state: show latest (most recent) from history
    const history = getHistory();
    if (history.length > 0) setEntry(history[0]);
  }, [idFromState, entry]);

  const data = entry;
  if (!data) {
    return (
      <div className="space-y-6">
        <p className="text-gray-600">No analysis to show. Run an analysis first or open one from History.</p>
        <Link to="/dashboard/analyze" className="inline-flex items-center gap-2 text-primary font-medium">
          Go to Analyze
        </Link>
      </div>
    );
  }

  const { company, role, readinessScore, extractedSkills, checklist, plan, questions } = data;
  const categories = extractedSkills?.categories || {};
  const generalFresher = extractedSkills?.generalFresher;

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

      {/* Readiness score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Readiness score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-primary">{readinessScore}</span>
            <span className="text-gray-500">/ 100</span>
          </div>
        </CardContent>
      </Card>

      {/* Key skills extracted */}
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
                  <div className="flex flex-wrap gap-2">
                    {(skills || []).map((s) => (
                      <span
                        key={s}
                        className="rounded-full bg-primary-light px-3 py-1 text-sm font-medium text-primary"
                      >
                        {s}
                      </span>
                    ))}
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
    </div>
  );
}
