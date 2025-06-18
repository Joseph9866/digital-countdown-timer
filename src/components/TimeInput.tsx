import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface TimeInputProps {
  onSetDuration: (hours: number, minutes: number, seconds: number) => void;
  isRunning: boolean;
  currentHours: number;
  currentMinutes: number;
  currentSeconds: number;
}

const PRESETS = [
  { name: 'Pomodoro', hours: 0, minutes: 25, seconds: 0 },
  { name: 'Short Break', hours: 0, minutes: 5, seconds: 0 },
  { name: 'Long Break', hours: 0, minutes: 15, seconds: 0 },
  { name: 'Focus Session', hours: 1, minutes: 30, seconds: 0 },
  { name: 'Quick Task', hours: 0, minutes: 10, seconds: 0 },
];

export const TimeInput: React.FC<TimeInputProps> = ({
  onSetDuration,
  isRunning,
  currentHours,
  currentMinutes,
  currentSeconds,
}) => {
  const [hours, setHours] = useState(currentHours);
  const [minutes, setMinutes] = useState(currentMinutes);
  const [seconds, setSeconds] = useState(currentSeconds);

  useEffect(() => {
    setHours(currentHours);
    setMinutes(currentMinutes);
    setSeconds(currentSeconds);
  }, [currentHours, currentMinutes, currentSeconds]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSetDuration(hours, minutes, seconds);
    
    // Save to localStorage
    localStorage.setItem('lastTimer', JSON.stringify({ hours, minutes, seconds }));
  };

  const handlePresetClick = (preset: typeof PRESETS[0]) => {
    setHours(preset.hours);
    setMinutes(preset.minutes);
    setSeconds(preset.seconds);
    onSetDuration(preset.hours, preset.minutes, preset.seconds);
    
    // Save to localStorage
    localStorage.setItem('lastTimer', JSON.stringify(preset));
  };

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('lastTimer');
    if (saved) {
      try {
        const { hours: savedHours, minutes: savedMinutes, seconds: savedSeconds } = JSON.parse(saved);
        if (savedHours !== undefined && savedMinutes !== undefined && savedSeconds !== undefined) {
          setHours(savedHours);
          setMinutes(savedMinutes);
          setSeconds(savedSeconds);
          onSetDuration(savedHours, savedMinutes, savedSeconds);
        }
      } catch (error) {
        console.error('Error loading saved timer:', error);
      }
    }
  }, [onSetDuration]);

  return (
    <div className="space-y-6">
      {/* Presets */}
      <div className="space-y-3">
        <h3 className="text-lg font-medium text-gray-300 flex items-center space-x-2">
          <Clock className="w-5 h-5" />
          <span>Quick Presets</span>
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {PRESETS.map((preset, index) => (
            <button
              key={index}
              onClick={() => handlePresetClick(preset)}
              disabled={isRunning}
              className="px-3 py-2 text-sm bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors duration-200 text-gray-300 hover:text-white border border-gray-700 hover:border-gray-600"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Time Input */}
      <div className="space-y-3">
        <h3 className="text-lg font-medium text-gray-300">Custom Timer</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-400">Hours</label>
              <input
                type="number"
                min="0"
                max="23"
                value={hours}
                onChange={(e) => setHours(Math.max(0, Math.min(23, parseInt(e.target.value) || 0)))}
                disabled={isRunning}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-400">Minutes</label>
              <input
                type="number"
                min="0"
                max="59"
                value={minutes}
                onChange={(e) => setMinutes(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                disabled={isRunning}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-400">Seconds</label>
              <input
                type="number"
                min="0"
                max="59"
                value={seconds}
                onChange={(e) => setSeconds(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                disabled={isRunning}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={isRunning || (hours === 0 && minutes === 0 && seconds === 0)}
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors duration-200 text-white font-medium"
          >
            Set Timer
          </button>
        </form>
      </div>
    </div>
  );
};