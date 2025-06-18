import React from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface ControlsProps {
  isRunning: boolean;
  isFinished: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  remainingMs: number;
}

export const Controls: React.FC<ControlsProps> = ({
  isRunning,
  isFinished,
  onStart,
  onPause,
  onReset,
  remainingMs,
}) => {
  const canStart = remainingMs > 0 && !isRunning;
  const canPause = isRunning;
  const canReset = remainingMs !== 0 || isFinished;

  return (
    <div className="flex justify-center space-x-4">
      <button
        onClick={canPause ? onPause : onStart}
        disabled={!canStart && !canPause}
        className={`flex items-center space-x-2 px-8 py-4 rounded-full font-medium text-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
          isRunning
            ? 'bg-yellow-600 hover:bg-yellow-700 text-white shadow-lg shadow-yellow-600/30'
            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/30'
        }`}
      >
        {isRunning ? (
          <>
            <Pause className="w-6 h-6" />
            <span>Pause</span>
          </>
        ) : (
          <>
            <Play className="w-6 h-6" />
            <span>Start</span>
          </>
        )}
      </button>
      
      <button
        onClick={onReset}
        disabled={!canReset}
        className="flex items-center space-x-2 px-8 py-4 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-full font-medium text-lg transition-all duration-200 transform hover:scale-105 disabled:transform-none text-white shadow-lg shadow-gray-700/30"
      >
        <RotateCcw className="w-6 h-6" />
        <span>Reset</span>
      </button>
    </div>
  );
};