import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../stores/userStore.ts';

const SUGGESTED_GOALS = [
  'Learn to analyze texts computationally',
  'Create data visualizations for research',
  'Build generative art or literature tools', 
  'Analyze visual or auditory cultural data', 
  'Build a digital archive or collection',
  'Learn programming for academic work',
  'Scrape and collect web data',
  'Map networks and historical relationships', 
];

export function GoalSetting() {
  const navigate = useNavigate();
  const { profile, updateProfile } = useUserStore();
  const [goals, setGoals] = useState<string[]>(profile?.learningGoals || []);
  const [customGoal, setCustomGoal] = useState('');

  const toggleGoal = (goal: string) => {
    setGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]
    );
  };

  const addCustomGoal = () => {
    if (customGoal.trim() && !goals.includes(customGoal.trim())) {
      setGoals((prev) => [...prev, customGoal.trim()]);
      setCustomGoal('');
    }
  };

  const handleNext = () => {
    if (profile) {
      updateProfile({ learningGoals: goals });
    }
    navigate('/onboarding/preview');
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-medium">3</div>
          <h2 className="text-2xl font-bold text-gray-900">Your Goals</h2>
        </div>
        <p className="text-gray-600 ml-10">What would you like to accomplish?</p>
      </div>

      <div className="space-y-2 mb-6">
        {SUGGESTED_GOALS.map((goal) => (
          <button
            key={goal}
            onClick={() => toggleGoal(goal)}
            className={`w-full p-3 rounded-lg border text-sm text-left transition-colors ${
              goals.includes(goal)
                ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                : 'border-gray-200 hover:border-gray-300 text-gray-700'
            }`}
          >
            {goal}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={customGoal}
          onChange={(e) => setCustomGoal(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addCustomGoal()}
          placeholder="Add your own goal..."
          className="flex-1 p-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-indigo-400"
        />
        <button
          onClick={addCustomGoal}
          disabled={!customGoal.trim()}
          className="px-4 py-2 bg-gray-100 rounded-lg text-sm hover:bg-gray-200 disabled:opacity-50 transition-colors"
        >
          Add
        </button>
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={() => navigate('/onboarding/interests')}
          className="text-gray-600 hover:text-gray-800"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          disabled={goals.length === 0}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
}
