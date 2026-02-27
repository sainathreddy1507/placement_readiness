import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';

const DATA = [
  { subject: 'DSA', value: 75, fullMark: 100 },
  { subject: 'System Design', value: 60, fullMark: 100 },
  { subject: 'Communication', value: 80, fullMark: 100 },
  { subject: 'Resume', value: 85, fullMark: 100 },
  { subject: 'Aptitude', value: 70, fullMark: 100 },
];

export default function SkillBreakdown() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Skill Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsRadarChart data={DATA} margin={{ top: 16, right: 24, left: 24, bottom: 16 }}>
              <PolarGrid stroke="hsl(220, 13%, 91%)" />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fill: 'hsl(220, 9%, 46%)', fontSize: 12 }}
                tickLine={false}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 100]}
                tick={{ fill: 'hsl(220, 9%, 46%)', fontSize: 10 }}
                tickCount={5}
              />
              <Radar
                name="Score"
                dataKey="value"
                stroke="hsl(245, 58%, 51%)"
                fill="hsl(245, 58%, 51%)"
                fillOpacity={0.25}
                strokeWidth={2}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid hsl(220, 13%, 91%)',
                  borderRadius: '8px',
                  fontSize: '13px',
                }}
                formatter={(value) => [`${value} / 100`, 'Score']}
              />
            </RechartsRadarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
