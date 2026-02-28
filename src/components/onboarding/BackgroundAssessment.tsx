import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../stores/userStore.ts';

const DISCIPLINES = [
  'Literature', 'History', 'Art History', 'Linguistics',
  'Media Studies', 'Creative Writing', 'Philosophy', 
  'Music', 'Archaeology', 'Anthropology', 'Other',
];

const ROLES = [
  'Undergraduate Student', 'Graduate Student', 'Postdoctoral Researcher',
  'Faculty', 'Librarian', 'Independent Researcher', 'Other',
];

export function BackgroundAssessment() {
  const navigate = useNavigate();
  const { createProfile, profile, updateProfile } = useUserStore();
  const [discipline, setDiscipline] = useState(profile?.background.discipline || '');
  const [role, setRole] = useState(profile?.background.role || '');
  const [experience, setExperience] = useState<'none' | 'beginner' | 'intermediate'>(
    profile?.background.programmingExperience || 'none'
  );

  const handleNext = () => {
    const backgroundData = {
      background: {
        discipline,
        role,
        programmingExperience: experience,
        researchInterests: profile?.background.researchInterests || [],
      },
    };
    if (profile) {
      updateProfile(backgroundData);
    } else {
      createProfile(backgroundData);
    }
    navigate('/onboarding/interests');
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-medium">1</div>
          <h2 className="text-2xl font-bold text-gray-900">Your Background</h2>
        </div>
        <p className="text-gray-600 ml-10">Tell us about your academic background.</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What is your primary discipline?
          </label>
          <div className="grid grid-cols-2 gap-2">
            {DISCIPLINES.map((d) => (
              <button
                key={d}
                onClick={() => setDiscipline(d.toLowerCase().replace(' ', '-'))}
                className={`p-3 rounded-lg border text-sm text-left transition-colors ${
                  discipline === d.toLowerCase().replace(' ', '-')
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What is your current role?
          </label>
          <div className="grid grid-cols-2 gap-2">
            {ROLES.map((r) => (
              <button
                key={r}
                onClick={() => setRole(r.toLowerCase().replace(/ /g, '-'))}
                className={`p-3 rounded-lg border text-sm text-left transition-colors ${
                  role === r.toLowerCase().replace(/ /g, '-')
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Have you written code before?
          </label>
          <div className="space-y-2">
            {[
              { value: 'none' as const, label: 'No experience' },
              { value: 'beginner' as const, label: 'Some experience (tutorials, basic scripts)' },
              { value: 'intermediate' as const, label: 'Comfortable writing code' },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => setExperience(opt.value)}
                className={`w-full p-3 rounded-lg border text-sm text-left transition-colors ${
                  experience === opt.value
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={() => navigate('/onboarding')}
          className="text-gray-600 hover:text-gray-800"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          disabled={!discipline || !role}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
}
