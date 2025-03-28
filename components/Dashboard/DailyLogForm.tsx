import React, { useState } from 'react';

interface DailyLogFormProps {
  onSubmit: (logData: {
    mood: string;
    cravingIntensity: number;
    notes: string;
    triggers: string[];
    activities: string[];
  }) => void;
}

const DailyLogForm: React.FC<DailyLogFormProps> = ({ onSubmit }) => {
  const [mood, setMood] = useState<string>('neutral');
  const [cravingIntensity, setCravingIntensity] = useState<number>(5);
  const [notes, setNotes] = useState<string>('');
  const [trigger, setTrigger] = useState<string>('');
  const [triggers, setTriggers] = useState<string[]>([]);
  const [activity, setActivity] = useState<string>('');
  const [activities, setActivities] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      mood,
      cravingIntensity,
      notes,
      triggers,
      activities,
    });
    
    // Reset form
    setMood('neutral');
    setCravingIntensity(5);
    setNotes('');
    setTrigger('');
    setTriggers([]);
    setActivity('');
    setActivities([]);
  };

  const addTrigger = () => {
    if (trigger.trim() !== '' && !triggers.includes(trigger.trim())) {
      setTriggers([...triggers, trigger.trim()]);
      setTrigger('');
    }
  };

  const addActivity = () => {
    if (activity.trim() !== '' && !activities.includes(activity.trim())) {
      setActivities([...activities, activity.trim()]);
      setActivity('');
    }
  };

  return (
    <div className="bg-gray-800 rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-cyan-400 mb-4">Daily Check-in</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-300 mb-2">How are you feeling today?</label>
          <div className="flex justify-between">
            {['terrible', 'bad', 'neutral', 'good', 'great'].map((option) => (
              <button
                key={option}
                type="button"
                className={`px-4 py-2 rounded-lg ${
                  mood === option 
                    ? 'bg-cyan-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
                onClick={() => setMood(option)}
              >
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-300 mb-2">
            Craving Intensity (1-10): {cravingIntensity}
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={cravingIntensity}
            onChange={(e) => setCravingIntensity(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>Low</span>
            <span>High</span>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-300 mb-2">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            rows={3}
            placeholder="How was your day? Any challenges or victories?"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-300 mb-2">Triggers</label>
          <div className="flex">
            <input
              type="text"
              value={trigger}
              onChange={(e) => setTrigger(e.target.value)}
              className="flex-grow px-3 py-2 bg-gray-700 text-white rounded-l-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="Add a trigger"
            />
            <button
              type="button"
              onClick={addTrigger}
              className="px-4 py-2 bg-cyan-600 text-white rounded-r-lg hover:bg-cyan-700"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {triggers.map((t, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm"
              >
                {t}
                <button
                  type="button"
                  className="ml-2 text-gray-400 hover:text-gray-200"
                  onClick={() => setTriggers(triggers.filter((_, i) => i !== index))}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-gray-300 mb-2">Activities That Helped</label>
          <div className="flex">
            <input
              type="text"
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              className="flex-grow px-3 py-2 bg-gray-700 text-white rounded-l-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="Add an activity"
            />
            <button
              type="button"
              onClick={addActivity}
              className="px-4 py-2 bg-cyan-600 text-white rounded-r-lg hover:bg-cyan-700"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {activities.map((a, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm"
              >
                {a}
                <button
                  type="button"
                  className="ml-2 text-gray-400 hover:text-gray-200"
                  onClick={() => setActivities(activities.filter((_, i) => i !== index))}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
        >
          Submit Daily Log
        </button>
      </form>
    </div>
  );
};

export default DailyLogForm; 