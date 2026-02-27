import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const DAY_INITIALS = ['M', 'Tu', 'W', 'Th', 'F', 'Sa', 'Su'];
// Days with activity: Mon, Wed, Fri (indices 0, 2, 4)
const ACTIVE_DAYS = [true, false, true, false, true, false, false];

export default function WeeklyGoals({ solved = 12, target = 20 }) {
  const pct = target > 0 ? Math.min(100, (solved / target) * 100) : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Goals</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm text-gray-700">
            Problems Solved: <span className="font-semibold text-gray-900">{solved}/{target}</span> this week
          </p>
          <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all duration-300"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
        <div className="flex items-center justify-between gap-2">
          {DAYS.map((day, i) => (
            <div key={day} className="flex flex-col items-center gap-1">
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center text-[10px] font-medium ${
                  ACTIVE_DAYS[i]
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                {DAY_INITIALS[i]}
              </div>
              <span className="text-[10px] text-gray-500">{day}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
