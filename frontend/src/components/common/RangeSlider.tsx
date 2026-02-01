'use client';

import { useState, useEffect, useRef } from 'react';

interface RangeSliderProps {
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  step?: number;
  formatLabel?: (value: number) => string;
  className?: string;
}

export function RangeSlider({
  min,
  max,
  value,
  onChange,
  step = 1,
  formatLabel = (v) => v.toString(),
  className = '',
}: RangeSliderProps) {
  const [localValue, setLocalValue] = useState<[number, number]>(value);
  const [isDragging, setIsDragging] = useState<'min' | 'max' | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleMinChange = (newMin: number) => {
    const clampedMin = Math.max(min, Math.min(newMin, localValue[1] - step));
    const newValue: [number, number] = [clampedMin, localValue[1]];
    setLocalValue(newValue);
    onChange(newValue);
  };

  const handleMaxChange = (newMax: number) => {
    const clampedMax = Math.min(max, Math.max(newMax, localValue[0] + step));
    const newValue: [number, number] = [localValue[0], clampedMax];
    setLocalValue(newValue);
    onChange(newValue);
  };

  const getPercentage = (val: number) => {
    return ((val - min) / (max - min)) * 100;
  };

  const minPercent = getPercentage(localValue[0]);
  const maxPercent = getPercentage(localValue[1]);

  return (
    <div className={`w-full ${className}`}>
      {/* Range Track */}
      <div className="relative h-2 mb-6">
        {/* Background Track */}
        <div
          ref={trackRef}
          className="absolute w-full h-2 bg-neutral-200 rounded-full"
        />

        {/* Active Range */}
        <div
          className="absolute h-2 bg-primary rounded-full"
          style={{
            left: `${minPercent}%`,
            right: `${100 - maxPercent}%`,
          }}
        />

        {/* Min Thumb */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 bg-white border-2 border-primary rounded-full cursor-pointer shadow-md hover:scale-110 transition-transform"
          style={{ left: `${minPercent}%` }}
          onMouseDown={() => setIsDragging('min')}
          onTouchStart={() => setIsDragging('min')}
          role="slider"
          aria-valuemin={min}
          aria-valuemax={localValue[1]}
          aria-valuenow={localValue[0]}
          aria-label="Minimum price"
          tabIndex={0}
        />

        {/* Max Thumb */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 bg-white border-2 border-primary rounded-full cursor-pointer shadow-md hover:scale-110 transition-transform"
          style={{ left: `${maxPercent}%` }}
          onMouseDown={() => setIsDragging('max')}
          onTouchStart={() => setIsDragging('max')}
          role="slider"
          aria-valuemin={localValue[0]}
          aria-valuemax={max}
          aria-valuenow={localValue[1]}
          aria-label="Maximum price"
          tabIndex={0}
        />
      </div>

      {/* Value Inputs */}
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <label htmlFor="min-input" className="sr-only">
            Minimum value
          </label>
          <input
            id="min-input"
            type="number"
            min={min}
            max={localValue[1] - step}
            step={step}
            value={localValue[0]}
            onChange={(e) => handleMinChange(Number(e.target.value))}
            className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Min"
          />
        </div>

        <span className="text-neutral-400">—</span>

        <div className="flex-1">
          <label htmlFor="max-input" className="sr-only">
            Maximum value
          </label>
          <input
            id="max-input"
            type="number"
            min={localValue[0] + step}
            max={max}
            step={step}
            value={localValue[1]}
            onChange={(e) => handleMaxChange(Number(e.target.value))}
            className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Max"
          />
        </div>
      </div>

      {/* Value Labels */}
      <div className="flex justify-between mt-2 text-xs text-neutral-500">
        <span>{formatLabel(localValue[0])}</span>
        <span>{formatLabel(localValue[1])}</span>
      </div>
    </div>
  );
}
