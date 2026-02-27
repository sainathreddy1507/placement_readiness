import { Link } from 'react-router-dom';
import { Code2, Video, BarChart3 } from 'lucide-react';

export default function LandingPage() {
  const features = [
    {
      title: 'Practice Problems',
      description: 'Solve coding challenges and build your problem-solving skills.',
      icon: Code2,
    },
    {
      title: 'Mock Interviews',
      description: 'Simulate real interviews with timed sessions and feedback.',
      icon: Video,
    },
    {
      title: 'Track Progress',
      description: 'Monitor your growth with analytics and performance insights.',
      icon: BarChart3,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Ace Your Placement
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-xl mb-8">
          Practice, assess, and prepare for your dream job
        </p>
        <Link
          to="/dashboard"
          className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium text-white bg-primary hover:bg-primary-hover transition-colors"
        >
          Get Started
        </Link>
      </section>

      {/* Features grid */}
      <section className="px-6 py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map(({ title, description, icon: Icon }) => (
            <div
              key={title}
              className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 rounded-lg bg-primary-light flex items-center justify-center text-primary mb-4">
                <Icon className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">{title}</h2>
              <p className="text-gray-600 text-sm">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-gray-500 border-t border-gray-200">
        © {new Date().getFullYear()} Placement Readiness Platform. All rights reserved.
      </footer>
    </div>
  );
}
