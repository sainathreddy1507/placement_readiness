import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { areAllTestsPassed } from '../utils/testChecklistStorage';
import { Lock, Ship } from 'lucide-react';

export default function ShipPage() {
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    setUnlocked(areAllTestsPassed());
  }, []);

  if (!unlocked) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <Lock className="w-5 h-5" />
              Ship locked
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              Complete all 10 tests on the Test Checklist before shipping.
            </p>
            <Link
              to="/prp/07-test"
              className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover"
            >
              Open Test Checklist
            </Link>
            <p className="text-sm text-gray-500">
              <Link to="/dashboard" className="text-primary hover:underline">Back to Dashboard</Link>
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Ship</h1>
          <Link to="/dashboard" className="text-sm text-gray-600 hover:text-primary">
            Back to Dashboard
          </Link>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ship className="w-5 h-5" />
              Ready to ship
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              All tests passed. The Placement Readiness Platform is ready to ship.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
