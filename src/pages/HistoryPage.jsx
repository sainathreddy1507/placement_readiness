import { useNavigate } from 'react-router-dom';
import { getHistory } from '../utils/historyStorage';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { History } from 'lucide-react';

export default function HistoryPage() {
  const navigate = useNavigate();
  const entries = getHistory();

  const formatDate = (iso) => {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString(undefined, { dateStyle: 'medium' }) + ' ' + d.toLocaleTimeString(undefined, { timeStyle: 'short' });
    } catch {
      return iso;
    }
  };

  const openResult = (entry) => {
    navigate('/dashboard/results', { state: { id: entry.id } });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">History</h1>
        <p className="text-gray-600 mt-1">Past analyses. Click an entry to view results.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="w-5 h-5" />
            Saved analyses
          </CardTitle>
        </CardHeader>
        <CardContent>
          {entries.length === 0 ? (
            <p className="text-gray-600">No analyses yet. Run one from the Analyze page.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {entries.map((entry) => (
                <li
                  key={entry.id}
                  onClick={() => openResult(entry)}
                  className="py-4 first:pt-0 last:pb-0 cursor-pointer hover:bg-gray-50 -mx-2 px-2 rounded-lg transition-colors"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-medium text-gray-900">
                        {entry.company || entry.role ? [entry.company, entry.role].filter(Boolean).join(' · ') : 'Job description'}
                      </p>
                      <p className="text-sm text-gray-500">{formatDate(entry.createdAt)}</p>
                    </div>
                    <span className="text-lg font-semibold text-primary shrink-0">{entry.readinessScore ?? '—'}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
