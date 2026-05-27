import React from 'react';
import { cn } from './Badge';

interface IntegrityScoreGaugeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showLabel?: boolean;
}

const getScoreConfig = (score: number) => {
  if (score >= 71) return {
    color: 'text-success-green',
    stroke: '#10B981',
    glow: 'rgba(16, 185, 129, 0.3)',
    label: 'TRUSTED',
  };
  if (score >= 41) return {
    color: 'text-warning-amber',
    stroke: '#F59E0B',
    glow: 'rgba(245, 158, 11, 0.3)',
    label: 'MODERATE',
  };
  return {
    color: 'text-danger-red',
    stroke: '#FF4D4D',
    glow: 'rgba(255, 77, 77, 0.3)',
    label: 'HIGH RISK',
  };
};

export function IntegrityScoreGauge({
  score,
  size = 'md',
  className,
  showLabel = true,
}: IntegrityScoreGaugeProps) {
  const { color, stroke, glow, label } = getScoreConfig(score);

  const sizeMap = {
    sm: { width: 44, strokeWidth: 4, textClass: 'text-[11px]' },
    md: { width: 64, strokeWidth: 5, textClass: 'text-sm' },
    lg: { width: 96, strokeWidth: 7, textClass: 'text-xl' },
    xl: { width: 140, strokeWidth: 10, textClass: 'text-4xl' },
  };

  const s = sizeMap[size];
  const radius = (s.width - s.strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (score / 100) * circumference;

  return (
    <div className={cn('relative flex flex-col items-center justify-center', className)}>
      <div className="relative" style={{ width: s.width, height: s.width }}>
        <svg
          className="transform -rotate-90 w-full h-full"
          viewBox={`0 0 ${s.width} ${s.width}`}
        >
          {/* Drop shadow filter for glow */}
          <defs>
            <filter id={`glow-${score}`}>
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Track */}
          <circle
            strokeWidth={s.strokeWidth}
            stroke="rgba(255,255,255,0.06)"
            fill="transparent"
            r={radius}
            cx={s.width / 2}
            cy={s.width / 2}
          />

          {/* Progress arc */}
          <circle
            className="transition-all duration-1000 ease-out"
            strokeWidth={s.strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            stroke={stroke}
            fill="transparent"
            r={radius}
            cx={s.width / 2}
            cy={s.width / 2}
            filter={`url(#glow-${score})`}
          />
        </svg>

        {/* Score number */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn('font-mono font-black leading-none', color, s.textClass)}>
            {score}
          </span>
        </div>
      </div>

      {showLabel && (
        <div className="mt-2 text-center">
          <span className={cn('text-[9px] font-mono font-black uppercase tracking-widest', color)}>
            {label}
          </span>
          <div className={cn('text-[8px] font-mono text-text-muted mt-0.5')}>
            AI SCORE
          </div>
        </div>
      )}
    </div>
  );
}
