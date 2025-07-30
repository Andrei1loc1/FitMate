import { useState, useEffect } from 'react';

interface ProgressState {
  value: number;
  maxValue: number;
  percentage: number;
  isComplete: boolean;
}

export const useProgress = (initialValue: number = 0, maxValue: number = 100) => {
  const [progress, setProgress] = useState<ProgressState>({
    value: initialValue,
    maxValue,
    percentage: (initialValue / maxValue) * 100,
    isComplete: initialValue >= maxValue,
  });

  const updateProgress = (newValue: number) => {
    const percentage = Math.min((newValue / maxValue) * 100, 100);
    const isComplete = newValue >= maxValue;
    
    setProgress({
      value: newValue,
      maxValue,
      percentage,
      isComplete,
    });
  };

  const incrementProgress = (amount: number = 1) => {
    updateProgress(progress.value + amount);
  };

  const resetProgress = () => {
    updateProgress(0);
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return '#10B981'; // Green
    if (percentage >= 75) return '#3B82F6'; // Blue
    if (percentage >= 50) return '#F59E0B'; // Yellow
    return '#EF4444'; // Red
  };

  return {
    ...progress,
    updateProgress,
    incrementProgress,
    resetProgress,
    getProgressColor,
  };
}; 