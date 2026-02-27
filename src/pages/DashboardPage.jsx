import OverallReadiness from '../components/dashboard/OverallReadiness';
import SkillBreakdown from '../components/dashboard/SkillBreakdown';
import ContinuePractice from '../components/dashboard/ContinuePractice';
import WeeklyGoals from '../components/dashboard/WeeklyGoals';
import UpcomingAssessments from '../components/dashboard/UpcomingAssessments';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Your placement readiness at a glance.</p>
        <p className="text-sm text-gray-500 mt-2">
          Use <strong>Analyze</strong> in the sidebar to paste a JD and get results (score, company intel, round mapping, plan). Open <strong>Results</strong> or <strong>History</strong> to view them.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OverallReadiness score={72} max={100} />
        <SkillBreakdown />

        <ContinuePractice topic="Dynamic Programming" completed={3} total={10} />
        <WeeklyGoals solved={12} target={20} />

        <div className="lg:col-start-2">
          <UpcomingAssessments />
        </div>
      </div>
    </div>
  );
}
