import React, { useEffect, useState, useRef } from 'react';
import { AccessibilitySettings } from '../types';

interface CustomCursorProps {
  accessibility?: AccessibilitySettings;
}

interface ClickRipple {
  id: number;
  x: number;
  y: number;
}

export const CustomCursor: React.FC<CustomCursorProps> = ({ accessibility }) => {
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: -100, y: -100 });
  const [trailingPos, setTrailingPos] = useState<{ x: number; y: number }>({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isTextHovered, setIsTextHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [ripples, setRipples] = useState<ClickRipple[]>([]);

  const targetPosRef = useRef<{ x: number; y: number }>({ x: -100, y: -100 });
  const currentTrailingRef = useRef<{ x: number; y: number }>({ x: -100, y: -100 });
  const animFrameIdRef = useRef<number | null>(null);

  // Detect touch device to disable custom trailing cursor on mobile/touch screens
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const touchQuery = window.matchMedia('(pointer: coarse)');
      setIsTouchDevice(touchQuery.matches);

      const handleChange = (e: MediaQueryListEvent) => {
        setIsTouchDevice(e.matches);
      };
      touchQuery.addEventListener('change', handleChange);
      return () => touchQuery.removeEventListener('change', handleChange);
    }
  }, []);

  // Mouse movement and hover target detection
  useEffect(() => {
    if (isTouchDevice) return;

    const handleMouseMove = (e: MouseEvent) => {
      targetPosRef.current = { x: e.clientX, y: e.clientY };
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      // Check hovered element
      const target = e.target as HTMLElement | null;
      if (target) {
        const isInteractive = Boolean(
          target.closest('button') ||
          target.closest('a') ||
          target.closest('[role="button"]') ||
          target.closest('.cursor-pointer') ||
          target.closest('summary') ||
          target.closest('input[type="checkbox"]') ||
          target.closest('input[type="radio"]') ||
          target.closest('select') ||
          target.tagName === 'BUTTON' ||
          target.tagName === 'A'
        );

        const isTextInput = Boolean(
          target.tagName === 'INPUT' && (target as HTMLInputElement).type !== 'checkbox' && (target as HTMLInputElement).type !== 'radio' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable
        );

        setIsHovered(isInteractive && !isTextInput);
        setIsTextHovered(isTextInput);
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      setIsClicking(true);
      const newRipple: ClickRipple = {
        id: Date.now() + Math.random(),
        x: e.clientX,
        y: e.clientY
      };
      setRipples(prev => [...prev.slice(-4), newRipple]);

      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== newRipple.id));
      }, 550);
    };

    const handleMouseUp = () => {
      setIsClicking(false);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isVisible, isTouchDevice]);

  // Smooth lerp for outer aura trailing ring
  useEffect(() => {
    if (isTouchDevice) return;

    const smoothFactor = 0.22; // High-precision, fluid trailing speed
    const animate = () => {
      const target = targetPosRef.current;
      const current = currentTrailingRef.current;

      const dx = target.x - current.x;
      const dy = target.y - current.y;

      current.x += dx * smoothFactor;
      current.y += dy * smoothFactor;

      setTrailingPos({ x: current.x, y: current.y });
      animFrameIdRef.current = requestAnimationFrame(animate);
    };

    animFrameIdRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [isTouchDevice]);

  if (isTouchDevice || !isVisible) {
    return null;
  }

  const isHighContrast = accessibility?.highContrast;

  return (
    <div className="pointer-events-none fixed inset-0 z-[99999] overflow-hidden select-none">
      {/* Click Ripple Waves */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className={`absolute rounded-full pointer-events-none animate-ping ${
            isHighContrast
              ? 'border-2 border-yellow-400 bg-yellow-400/30'
              : 'border border-orange-500/70 bg-gradient-to-r from-orange-500/30 to-amber-400/20 shadow-lg shadow-orange-500/30'
          }`}
          style={{
            left: `${ripple.x}px`,
            top: `${ripple.y}px`,
            width: '36px',
            height: '36px',
            transform: 'translate(-50%, -50%)',
            animationDuration: '500ms',
            animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)'
          }}
        />
      ))}

      {/* Outer Smooth Trailing Orbital Ring */}
      <div
        className={`absolute pointer-events-none rounded-full transition-[width,height,border-color,background-color,transform] duration-200 ease-out flex items-center justify-center ${
          isHighContrast
            ? 'border-2 border-yellow-300 bg-yellow-400/10'
            : isHovered
            ? 'border border-orange-500/80 bg-orange-500/10 shadow-[0_0_15px_rgba(234,88,12,0.35)] backdrop-blur-[0.5px]'
            : isTextHovered
            ? 'border border-cyan-400/70 bg-cyan-400/10'
            : 'border border-orange-400/50 bg-orange-500/5 shadow-xs'
        }`}
        style={{
          left: `${trailingPos.x}px`,
          top: `${trailingPos.y}px`,
          width: isClicking ? '26px' : isHovered ? '46px' : isTextHovered ? '18px' : '34px',
          height: isClicking ? '26px' : isHovered ? '46px' : isTextHovered ? '32px' : '34px',
          transform: `translate(-50%, -50%) scale(${isClicking ? 0.85 : 1})`,
          borderRadius: isTextHovered ? '6px' : '9999px',
        }}
      >
        {/* Subtle decorative crosshair ticks for a tactile, futuristic learning reticle */}
        {isHovered && !isHighContrast && (
          <div className="absolute inset-0 flex items-center justify-center animate-spin [animation-duration:8s]">
            <span className="absolute w-1.5 h-0.5 bg-orange-500 top-0 left-1/2 -translate-x-1/2 rounded-full" />
            <span className="absolute w-1.5 h-0.5 bg-orange-500 bottom-0 left-1/2 -translate-x-1/2 rounded-full" />
            <span className="absolute h-1.5 w-0.5 bg-orange-500 left-0 top-1/2 -translate-y-1/2 rounded-full" />
            <span className="absolute h-1.5 w-0.5 bg-orange-500 right-0 top-1/2 -translate-y-1/2 rounded-full" />
          </div>
        )}

        {isHighContrast && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full" />
          </div>
        )}
      </div>

      {/* Inner Precision Dot / Stylus Tip */}
      <div
        className={`absolute pointer-events-none rounded-full transition-transform duration-75 ${
          isHighContrast
            ? 'bg-yellow-300 ring-2 ring-black shadow-[0_0_8px_#ffff00]'
            : isHovered
            ? 'bg-gradient-to-tr from-[#ea580c] to-[#fbbf24] shadow-[0_0_10px_rgba(234,88,12,0.8)]'
            : isTextHovered
            ? 'bg-cyan-400 h-4 w-1 rounded-sm shadow-[0_0_6px_rgba(34,211,238,0.7)]'
            : 'bg-gradient-to-br from-[#ea580c] via-orange-500 to-amber-400 shadow-[0_0_6px_rgba(234,88,12,0.5)]'
        }`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: isTextHovered ? '2px' : isHovered ? '9px' : isClicking ? '6px' : '7px',
          height: isTextHovered ? '16px' : isHovered ? '9px' : isClicking ? '6px' : '7px',
          transform: `translate(-50%, -50%) scale(${isClicking ? 0.75 : 1})`,
        }}
      />
    </div>
  );
};
