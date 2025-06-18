import React, { useEffect, useState } from 'react';
import { useTimer } from './hooks/useTimer';
import { DigitalTimer } from './components/DigitalTimer';
import { TimeInput } from './components/TimeInput';
import { Controls } from './components/Controls';
import { TimerAlert } from './components/TimerAlert';

function App() {
  const timer = useTimer();
  const [showAlert, setShowAlert] = useState(false);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  // Initialize Web Audio API
  useEffect(() => {
    const initAudio = () => {
      try {
        const context = new (window.AudioContext || (window as any).webkitAudioContext)();
        setAudioContext(context);
      } catch (error) {
        console.warn('Web Audio API not supported:', error);
      }
    };
    
    initAudio();
    
    return () => {
      if (audioContext) {
        audioContext.close();
      }
    };
  }, []);

  // Play alarm sound using Web Audio API
  const playAlarmSound = () => {
    if (!audioContext) return;
    
    try {
      // Create a beep sound
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 1);
      
      // Play multiple beeps
      setTimeout(() => {
        if (audioContext.state === 'running') {
          const osc2 = audioContext.createOscillator();
          const gain2 = audioContext.createGain();
          osc2.connect(gain2);
          gain2.connect(audioContext.destination);
          osc2.frequency.setValueAtTime(1000, audioContext.currentTime);
          gain2.gain.setValueAtTime(0.3, audioContext.currentTime);
          gain2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
          osc2.start(audioContext.currentTime);
          osc2.stop(audioContext.currentTime + 0.5);
        }
      }, 200);
    } catch (error) {
      console.warn('Error playing alarm sound:', error);
    }
  };

  // Handle timer completion
  useEffect(() => {
    if (timer.isFinished && !showAlert) {
      setShowAlert(true);
      playAlarmSound();
      
      // Show browser notification if permission granted
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Timer Finished!', {
          body: 'Your countdown timer has reached zero.',
          icon: '/vite.svg',
        });
      }
    }
  }, [timer.isFinished, showAlert]);

  // Request notification permission on first interaction
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              Digital Countdown Timer
            </h1>
            <p className="text-gray-400 text-lg">
              Professional productivity timer for focused work sessions
            </p>
          </div>

          {/* Main Timer Display */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-3xl p-8 md:p-12 mb-8 border border-gray-700/50 shadow-2xl">
            <DigitalTimer
              hours={timer.hours}
              minutes={timer.minutes}
              seconds={timer.seconds}
              milliseconds={timer.milliseconds}
              isRunning={timer.isRunning}
              isFinished={timer.isFinished}
            />
          </div>

          {/* Controls */}
          <div className="mb-8">
            <Controls
              isRunning={timer.isRunning}
              isFinished={timer.isFinished}
              onStart={timer.startTimer}
              onPause={timer.pauseTimer}
              onReset={timer.resetTimer}
              remainingMs={timer.remainingMs}
            />
          </div>

          {/* Time Input */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-3xl p-8 border border-gray-700/50 shadow-2xl">
            <TimeInput
              onSetDuration={timer.setDuration}
              isRunning={timer.isRunning}
              currentHours={timer.hours}
              currentMinutes={timer.minutes}
              currentSeconds={timer.seconds}
            />
          </div>

          {/* Progress Bar */}
          {timer.totalMs > 0 && (
            <div className="mt-8 bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-400">Progress</span>
                <span className="text-sm font-medium text-gray-400">
                  {Math.round(((timer.totalMs - timer.remainingMs) / timer.totalMs) * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-300 ${
                    timer.isFinished
                      ? 'bg-red-500'
                      : timer.isRunning
                      ? 'bg-blue-500'
                      : 'bg-gray-500'
                  }`}
                  style={{
                    width: `${Math.min(100, ((timer.totalMs - timer.remainingMs) / timer.totalMs) * 100)}%`,
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Timer Alert Modal */}
      <TimerAlert isVisible={showAlert} onClose={handleCloseAlert} />
    </div>
  );
}

export default App;