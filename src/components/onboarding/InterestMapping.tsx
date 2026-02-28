import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../stores/userStore.ts';

const INTEREST_CARDS = [
  { id: 'text-analysis', label: 'Analyzing word frequency', description: 'Count and compare word usage across texts' },
  { id: 'visualization', label: 'Creating visualizations', description: 'Make charts and graphs from humanities data' },
  { id: 'timelines', label: 'Creating timelines', description: 'Visualize events over time' },
  { id: 'mapping', label: 'Mapping historical events', description: 'Geographic visualization of data' },
  { id: 'web-scraping', label: 'Collecting web data', description: 'Gather data from websites and APIs' },
  { id: 'regex', label: 'Finding text patterns', description: 'Use regular expressions for text search' },
  { id: 'sentiment', label: 'Sentiment analysis', description: 'Detect emotions and opinions in text' },
  { id: 'networks', label: 'Network analysis', description: 'Map relationships between entities' },
  { id: 'topic-modeling', label: 'Topic modeling', description: 'Discover themes in large text collections' },
  { id: 'data-cleaning', label: 'Data cleaning', description: 'Prepare messy data for analysis' },
  { id: 'metadata', label: 'Working with metadata', description: 'Manage structured information about resources' },
  { id: 'archives', label: 'Working with archives', description: 'Process digitized archival materials' },
  { id: 'network-analysis', label: 'Working with relational data', description: 'Explore the implications of structures in your data' },
];

export function InterestMapping() {
  const navigate = useNavigate();
  const { profile, updateProfile } = useUserStore();
  const [selected, setSelected] = useState<string[]>(
    profile?.background.researchInterests || []
  );

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : prev.length < 5 ? [...prev, id] : prev
    );
  };

  const handleNext = () => {
    if (profile) {
      updateProfile({
        background: {
          ...profile.background,
          researchInterests: selected,
        },
      });
    }
    navigate('/onboarding/goals');
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-medium">2</div>
          <h2 className="text-2xl font-bold text-gray-900">Your Interests</h2>
        </div>
        <p className="text-gray-600 ml-10">
          Select 3-5 topics that interest you most.
          <span className="ml-2 text-sm text-gray-400">({selected.length}/5 selected)</span>
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {INTEREST_CARDS.map((card) => (
          <button
            key={card.id}
            onClick={() => toggle(card.id)}
            className={`p-4 rounded-lg border text-left transition-colors ${
              selected.includes(card.id)
                ? 'border-indigo-600 bg-indigo-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className={`font-medium text-sm ${selected.includes(card.id) ? 'text-indigo-700' : 'text-gray-900'}`}>
              {card.label}
            </div>
            <div className="text-xs text-gray-500 mt-1">{card.description}</div>
          </button>
        ))}
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={() => navigate('/onboarding/background')}
          className="text-gray-600 hover:text-gray-800"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          disabled={selected.length < 3}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
}
