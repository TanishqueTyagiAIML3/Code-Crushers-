import React from 'react';
import { Check } from 'lucide-react';

export interface CircularProgressRingProps {
  id?: string;
  progress: number; // 0 to 100
  size?: number; // diameter in pixels (default 56)
  strokeWidth?: number; // ring stroke width (default 5)
  color?: string; // ring color (e.g. #ea580c, #10b981)
  trackColor?: string; // background track color
  showCheckmarkWhenComplete?: boolean;
  showPercentageText?: boolean;
  centerIcon?: React.ReactNode;
  className?: string;
  isDarkMode?: boolean;
  ariaLabel?: string;
}

export function CircularProgressRing({
  id,
  progress,
  size = 56,
  strokeWidth = 5,
  color = '#ea580c',
  trackColor,
  showCheckmarkWhenComplete = true,
  showPercentageText = true,
  centerIcon,
  className = '',
  isDarkMode = false,
  ariaLabel
}: CircularProgressRingProps) {
  const boundedProgress = Math.min(100, Math.max(0, Math.round(progress)));
  const isComplete = boundedProgress >= 100;

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (boundedProgress / 100) * circumference;

  const defaultTrackColor = isDarkMode ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)';
  const activeTrackColor = trackColor || defaultTrackColor;
  const activeStrokeColor = color || (isComplete ? '#10b981' : '#ea580c');

  return (
    <div 
      id={id}
      className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size }}
      role="progressbar"
      aria-valuenow={boundedProgress}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={ariaLabel || `${boundedProgress}% topic completed`}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90 origin-center"
      >
        {/* Background Track Ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={activeTrackColor}
          strokeWidth={strokeWidth}
        />

        {/* Foreground Animated Progress Ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={activeStrokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
      </svg>

      {/* Center Display: Checkmark, Percentage, or Icon */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        {centerIcon ? (
          centerIcon
        ) : isComplete && showCheckmarkWhenComplete ? (
          <div className="flex items-center justify-center">
            <Check 
              className="w-4 h-4 stroke-[3] transition-transform animate-scale-in" 
              style={{ color: activeStrokeColor }} 
            />
          </div>
        ) : showPercentageText ? (
          <span 
            className="font-mono font-bold text-xs tracking-tight"
            style={{ 
              fontSize: size < 48 ? '10px' : size < 64 ? '11px' : '13px',
              color: isDarkMode ? '#f8fafc' : '#1e293b'
            }}
          >
            {boundedProgress}%
          </span>
        ) : null}
      </div>
    </div>
  );
}
