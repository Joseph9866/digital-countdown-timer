import React from 'react';
import { AlertCircle, X } from 'lucide-react';

interface TimerAlertProps {
  isVisible: boolean;
  onClose: () => void;
}

export const TimerAlert: React.FC<TimerAlertProps> = ({ isVisible, onClose }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 animate-in fade-in duration-200">
      <div className="bg-gray-900 rounded-2xl p-8 max-w-md mx-4 border border-red-500 shadow-2xl shadow-red-500/20 animate-in zoom-in duration-300">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-8 h-8 text-red-400" />
            <h2 className="text-2xl font-bold text-white">Time's Up!</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors duration-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <p className="text-gray-300 text-lg mb-6">
          ⏰ Your countdown timer has finished!
        </p>
        
        <button
          onClick={onClose}
          className="w-full px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-200"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
};