import React from 'react';
import { cn } from './Badge';

interface IntegrityScoreGaugeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showLabel?: boolean;
}

export function IntegrityScoreGauge({ 
  score, 
  size = 'md', 
  className,
  showLabel = true 
}: IntegrityScoreGaugeProps) {
  // Determine color based on score
  let colorClass = 'text-success-green';
  let strokeColor = '#38A169'; // success green
  
  if (score <= 40) {
    colorClass = 'text-danger-red';
    strokeColor = '#E53E3E'; // danger red
  } else if (score <= 65) {
    colorClass = 'text-warning-amber';
    strokeColor = '#ED8936'; // warning amber
  } else if (score <= 85) {
    colorClass = 'text-info-blue';
    strokeColor = '#4299E1'; // info blue
  }

  const sizeMap = {
    sm: { width: 48, strokeWidth: 4, textClass: 'text-xs' },
    md: { width: 64, strokeWidth: 5, textClass: 'text-sm' },
    lg: { width: 96, strokeWidth: 8, textClass: 'text-2xl' },
    xl: { width: 144, strokeWidth: 12, textClass: 'text-4xl' },
  };

  const currentSize = sizeMap[size];
  const radius = (currentSize.width - currentSize.strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className={cn("relative flex flex-col items-center justify-center", className)}>
      <div className="relative" style={{ width: currentSize.width, height: currentSize.width }}>
        <svg
          className="transform -rotate-90 w-full h-full"
          viewBox={`0 0 ${currentSize.width} ${currentSize.width}`}
        >
          {/* Background circle */}
          <circle
            className="text-border-subtle"
            strokeWidth={currentSize.strokeWidth}
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx={currentSize.width / 2}
            cy={currentSize.width / 2}
          />
          {/* Foreground circle */}
          <circle
            className="transition-all duration-1000 ease-out"
            strokeWidth={currentSize.strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            stroke={strokeColor}
            fill="transparent"
            r={radius}
            cx={currentSize.width / 2}
            cy={currentSize.width / 2}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn("font-mono font-bold", colorClass, currentSize.textClass)}>
            {score}
          </span>
        </div>
      </div>
      {showLabel && (
        <span className="text-[10px] uppercase tracking-wider text-text-secondary mt-2 font-semibold">
          AI Score
        </span>
      )}
    </div>
  );
}
