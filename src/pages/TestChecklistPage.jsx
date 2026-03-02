import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { getTestChecklist, updateTestChecklistItem, resetTestChecklist } from '../utils/testChecklistStorage';
import { CheckSquare, RotateCcw, AlertTriangle } from 'lucide-react';

const TESTS = [
  {
    label: 'JD required validation works',
    hint: 'Go to Analyze, submit with empty JD. Error "Please paste the job description." must appear.',
  },
  {
    label: 'Short JD warning shows for <200 chars',
    hint: 'On Analyze, paste fewer than 200 characters. Warning about "too short to analyze deeply" must show.',
  },
  {
    label: 'Skills extraction groups correctly',
    hint: 'Analyze a JD with React, DSA, SQL. Results → Key skills should show Web, Core CS, Data with correct tags.',
  },
  {
    label: 'Round mapping changes based on company + skills',
    hint: 'Analyze with company "Amazon" + DSA in JD → 4 rounds including Online Test. With "Startup" + React → 3 rounds including Practical Coding.',
  },
  {
    label: 'Score calculation is deterministic',
    hint: 'Same JD + company + role gives same base score on re-analyze. Base score does not change when toggling skills.',
  },
  {
    label: 'Skill toggles update score live',
    hint: 'On Results, toggle "I know this" / "Need practice". Score at top must update immediately.',
  },
  {
    label: 'Changes persist after refresh',
    hint: 'Toggle some skills, refresh page, reopen same result from History. Toggles and score must be unchanged.',
  },
  {
    label: 'History saves and loads correctly',
    hint: 'Run an analysis, open History. Entry appears with date, company/role, score. Click opens Results with same data.',
  },
  {
    label: 'Export buttons copy the correct content',
    hint: 'On Results, use Copy 7-day plan, Copy checklist, Copy questions. Paste elsewhere; content must match the sections.',
  },
  {
    label: 'No console errors on core pages',
    hint: 'Open Dashboard, Analyze, Results, History. Check browser console (F12) for errors; there should be none.',
  },
];

export default function TestChecklistPage() {
  const [checks, setChecks] = useState(getTestChecklist());

  useEffect(() => {
    setChecks(getTestChecklist());
  }, []);

  const passed = checks.filter(Boolean).length;
  const allPassed = passed === 10;

  const handleToggle = (index, value) => {
    const next = updateTestChecklistItem(index, value);
    setChecks(next);
  };

  const handleReset = () => {
    setChecks(resetTestChecklist());
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Test Checklist</h1>
          <Link
            to="/dashboard"
            className="text-sm text-gray-600 hover:text-primary"
          >
            Back to Dashboard
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckSquare className="w-5 h-5" />
              Tests Passed: {passed} / 10
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!allPassed && (
              <p className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                Fix issues before shipping.
              </p>
            )}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <RotateCcw className="w-4 h-4" />
                Reset checklist
              </button>
              {allPassed && (
                <Link
                  to="/prp/08-ship"
                  className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover"
                >
                  Go to Ship
                </Link>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Checklist</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {TESTS.map((test, index) => (
                <li key={index} className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id={`test-${index}`}
                    checked={checks[index] || false}
                    onChange={(e) => handleToggle(index, e.target.checked)}
                    className="mt-1 h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <div className="flex-1 min-w-0">
                    <label htmlFor={`test-${index}`} className="font-medium text-gray-900 cursor-pointer">
                      {test.label}
                    </label>
                    {test.hint && (
                      <p className="mt-1 text-sm text-gray-500">How to test: {test.hint}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
