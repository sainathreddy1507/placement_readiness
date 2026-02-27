import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';

const SIZE = 160;
const STROKE = 12;
const R = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * R;

export default function OverallReadiness({ score = 72, max = 100 }) {
  const pct = Math.min(100, Math.max(0, (score / max) * 100));
  const dashOffset = CIRCUMFERENCE - (pct / 100) * CIRCUMFERENCE;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Overall Readiness</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="relative" style={{ width: SIZE, height: SIZE }}>
          <svg width={SIZE} height={SIZE} className="rotate-[-90deg]">
            <circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={R}
              fill="none"
              stroke="hsl(220, 14%, 96%)"
              strokeWidth={STROKE}
            />
            <circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={R}
              fill="none"
              stroke="hsl(245, 58%, 51%)"
              strokeWidth={STROKE}
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={dashOffset}
              style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-gray-900">{score}</span>
            <span className="text-sm text-gray-500">/ {max}</span>
          </div>
        </div>
        <p className="mt-2 text-sm font-medium text-gray-600">Readiness Score</p>
      </CardContent>
    </Card>
  );
}
