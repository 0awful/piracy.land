import React, { useState, useEffect } from 'react';
import { Terminal } from 'lucide-react';

export const DEFAULT_TIPS = [
  "If you're reading this. Something has gone wrong",
  "TEST TEST TEST",
  "This debug messaging should never be visible in production",
];

export const DEFAULT_LOGS = [
  { type: 'info', message: 'writing to logs' },
  { type: 'success', message: 'hey we wrote one' },
  { type: 'info', message: 'this debug messaging should never be visible in production' },
  { type: 'info', message: "if you're reading this something went wrong" }
];

const TipDisplay = ({ 
  tips = DEFAULT_TIPS, 
  interval = 3000,
  className = ""
}) => {
  const [currentTip, setCurrentTip] = useState(0);

  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentTip((prev) => (prev + 1) % tips.length);
      }, 500);
      setTimeout(() => {
        setIsAnimating(false);
      }, 1000);
    }, interval);
    return () => clearInterval(timer);
  }, [tips, interval]);

  return (
    <div className={`relative min-h-[3rem] w-[95%] max-w-[300px] sm:max-w-[400px] md:max-w-[500px] mx-auto overflow-hidden ${className}`}>
      <div
        className={`
          absolute inset-0 px-2
          flex items-center justify-center
          transition-all duration-500 ease-in-out
          ${isAnimating ? '-translate-x-full opacity-0' : 'translate-x-0 opacity-100'}
        `}
      >
        <span className="text-xs sm:text-sm md:text-base text-center text-green-500">
          {tips[currentTip]}
        </span>
      </div>
      <div
        className={`
          absolute inset-0 px-2
          flex items-center justify-center
          transition-all duration-500 ease-in-out
          ${isAnimating ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        `}
      >
        <span className="text-xs sm:text-sm md:text-base text-center text-green-500">
          {tips[(currentTip + 1) % tips.length]}
        </span>
      </div>
    </div>
  );
};

const Console = ({ 
  logs = [], 
  isOpen, 
  onToggle,
  logInterval = 1500,
  className = "" 
}) => {
  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 z-10"
          onMouseDown={onToggle}
          onTouchStart={onToggle}
          data-testid="console-overlay"
        />
      )}
      
      {!isOpen && (
        <button 
          className="
            fixed bottom-0 left-0
            w-10 h-10
            bg-black/90 
            border border-green-500/30
            rounded-tr-lg
            cursor-pointer
            flex items-center justify-center
            hover:bg-green-500/10
            active:bg-green-500/20
            transition-colors
            z-20
          "
          onMouseDown={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          onTouchStart={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          data-testid="console-toggle"
        >
          <Terminal 
            size={14} 
            className="text-green-500"
          />
        </button>
      )}
      
      <div 
        className={`
          fixed bottom-0 left-0
          w-2/3 sm:w-1/2 md:w-1/3 lg:w-1/4              
          transform transition-all duration-300 ease-in-out
          ${isOpen ? 'translate-y-0' : 'translate-y-full'}
          z-20
          ${className}
        `}
        data-testid="console-window"
      >
        <div 
          className="
            w-full
            h-10
            bg-black/90 
            border border-green-500/30
            rounded-tr-lg
            flex
            items-center
            relative
          "
        >
          <Terminal 
            size={14} 
            className="
              text-green-500
              absolute
              left-3
            "
          />
        </div>

        <div 
          className="
            bg-black/90 
            border-l border-r border-b border-green-500/30
            text-xs
            h-48 
            overflow-y-auto
          "
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
        >
          {logs.map((log, index) => (
            <div 
              key={index}
              className="
                px-2 py-0.5
                text-green-500
                animate-slideInFromLeft
                break-words
              "
              style={{ animationDelay: `${index * 100}ms` }}
              data-testid="console-log"
            >
              <span className="opacity-50 whitespace-nowrap text-[10px]">[{new Date().toISOString()}]</span>
              {' '}
              <span className="break-words">{log.message}</span>
            </div>
          ))}
          <div className="px-2 py-0.5 animate-pulse text-green-500">▋</div>
        </div>
      </div>
    </>
  );
};

export default function LoadingScreen({ 
  tips = DEFAULT_TIPS,
  logs = DEFAULT_LOGS,
  tipInterval = 3000,
  logInterval = 1500,
  showTips = true,
  showSpinner = true,
  className = "",
  spinnerClassName = "",
  tipsClassName = "",
  consoleClassName = ""
}) {
  const [currentLogs, setCurrentLogs] = useState(logs === DEFAULT_LOGS ? [] : logs);
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
    if (logs === DEFAULT_LOGS) {
      const timeouts = logs.map((log, index) => {
        return setTimeout(() => {
          setCurrentLogs(prev => [...prev, log]);
        }, index * logInterval);
      });

      return () => timeouts.forEach(clearTimeout);
    }
  }, [logs, logInterval]);

  const toggleConsole = () => {
    setIsConsoleOpen(prev => !prev);
  };

  if (!isVisible) return null;

  return (
    <div 
      className={`
        fixed inset-0 flex flex-col items-center justify-center
        bg-black text-green-500
        p-4
        ${className}
      `}
    >
      {showSpinner && (
        <div className={`mb-8 transform-gpu ${spinnerClassName}`} role="progressbar">
          <svg className="w-24 h-24" viewBox="0 0 100 100">
            <circle 
              className="opacity-25" 
              cx="50" cy="50" r="45" 
              stroke="currentColor" 
              strokeWidth="4" 
              fill="none" 
            />
            <path 
              className="animate-spin origin-center"
              d="M50 5A45 45 0 0 1 95 50"
              stroke="currentColor" 
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
        </div>
      )}

      {showTips && (
        <div className="w-full">
          <TipDisplay 
            tips={tips} 
            interval={tipInterval}
            className={tipsClassName}
          />
        </div>
      )}

      <Console 
        logs={currentLogs}
        isOpen={isConsoleOpen}
        onToggle={toggleConsole}
        logInterval={logInterval}
        className={consoleClassName}
      />

      <style jsx global>{`
        @keyframes slideInFromLeft {
          from {
            transform: translateX(-100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
