import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';

export default function ContinuePractice({
  topic = 'Dynamic Programming',
  completed = 3,
  total = 10,
}) {
  const pct = total > 0 ? (completed / total) * 100 : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Continue Practice</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm font-medium text-gray-900">{topic}</p>
        <div className="space-y-2">
          <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all duration-300"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="text-xs text-gray-500">
            {completed} / {total} completed
          </p>
        </div>
        <Link
          to="/dashboard/practice"
          className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover transition-colors"
        >
          Continue
        </Link>
      </CardContent>
    </Card>
  );
}
