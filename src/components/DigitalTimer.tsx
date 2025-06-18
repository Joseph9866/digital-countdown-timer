import React from 'react';

interface DigitalTimerProps {
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
  isRunning: boolean;
  isFinished: boolean;
}

export const DigitalTimer: React.FC<DigitalTimerProps> = ({
  hours,
  minutes,
  seconds,
  milliseconds,
  isRunning,
  isFinished,
}) => {
  const formatNumber = (num: number, digits: number = 2) => {
    return num.toString().padStart(digits, '0');
  };

  const getTimerColor = () => {
    if (isFinished) return 'text-red-400';
    if (isRunning) return 'text-blue-400';
    return 'text-gray-300';
  };

  const getGlowEffect = () => {
    if (isFinished) return 'drop-shadow-[0_0_20px_rgba(248,113,113,0.6)]';
    if (isRunning) return 'drop-shadow-[0_0_20px_rgba(96,165,250,0.4)]';
    return 'drop-shadow-[0_0_10px_rgba(209,213,219,0.2)]';
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className={`transition-all duration-300 ${isRunning ? 'animate-pulse' : ''}`}>
        <h1 className="text-2xl md:text-3xl font-medium text-gray-400 mb-4 text-center">
          🕒 Time Left
        </h1>
      </div>
      
      <div className={`font-mono text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[10rem] font-bold transition-all duration-300 ${getTimerColor()} ${getGlowEffect()}`}>
        <div className="flex items-center justify-center space-x-2 md:space-x-4">
          <span className="tabular-nums">{formatNumber(hours)}</span>
          <span className="opacity-60">:</span>
          <span className="tabular-nums">{formatNumber(minutes)}</span>
          <span className="opacity-60">:</span>
          <span className="tabular-nums">{formatNumber(seconds)}</span>
          <span className="opacity-60">:</span>
          <span className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl tabular-nums">
            {formatNumber(Math.floor(milliseconds / 10))}
          </span>
        </div>
      </div>
      
      <div className="flex space-x-4 md:space-x-8 text-sm md:text-base text-gray-500 font-medium">
        <span>HOURS</span>
        <span>MINUTES</span>
        <span>SECONDS</span>
        <span>CENTISEC</span>
      </div>
    </div>
  );
};