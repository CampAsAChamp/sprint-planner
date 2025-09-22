'use client'

import { useEffect, useState } from 'react'

interface SprintCapacityProps {
  teamMembers: number
  sprintDays: number
  ptoActivities: Array<{
    id: string
    name: string
    developers: number
    duration: number
  }>
  onCallTime: number
}

export default function SprintCapacityOutput({ 
  teamMembers, 
  sprintDays, 
  ptoActivities, 
  onCallTime 
}: SprintCapacityProps) {
  const [lastAction, setLastAction] = useState<'increase' | 'decrease' | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [previousCapacity, setPreviousCapacity] = useState<number>(0)
  const calculateCapacity = () => {
    // Basic calculation: team members * sprint days - PTO days - on-call days
    const totalPtoDays = ptoActivities.reduce((sum, activity) => sum + (activity.developers * activity.duration), 0);
    const totalCapacity = (teamMembers * sprintDays) - totalPtoDays - onCallTime;
    return Math.max(0, totalCapacity);
  };

  const currentCapacity = calculateCapacity();

  // Track capacity changes and trigger animations
  useEffect(() => {
    if (previousCapacity !== 0 && previousCapacity !== currentCapacity) {
      if (currentCapacity > previousCapacity) {
        setLastAction('increase')
      } else {
        setLastAction('decrease')
      }
      setIsAnimating(true)
    }
    setPreviousCapacity(currentCapacity)
  }, [currentCapacity, previousCapacity])

  // Reset animation state after animation duration
  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => {
        setIsAnimating(false)
        setLastAction(null)
      }, 200)
      return () => clearTimeout(timer)
    }
  }, [isAnimating])

  return (
    <div className={`rounded-lg p-4 sm:p-6 lg:p-8 mt-6 transition-all duration-200 ${
      isAnimating && lastAction === 'decrease' 
        ? 'bg-red-100 dark:bg-red-900/40 border-2 border-red-300 dark:border-red-600 ring-2 ring-red-500' 
        : isAnimating && lastAction === 'increase'
        ? 'bg-blue-100 dark:bg-blue-900/40 border-2 border-blue-300 dark:border-blue-600 ring-2 ring-blue-500'
        : 'border-2 border-green-200 dark:border-green-800'
    }`}>
      <h3 className={`text-xl sm:text-2xl lg:text-3xl font-medium mb-4 sm:mb-6 lg:mb-8 transition-colors duration-200 ${
        isAnimating && lastAction === 'decrease' 
          ? 'text-red-700 dark:text-red-300' 
          : isAnimating && lastAction === 'increase'
          ? 'text-blue-700 dark:text-blue-300'
          : 'text-green-600 dark:text-green-400'
      }`} style={{textAlign: 'center'}}>
        Sprint Capacity
      </h3>
      <div className="text-center">
        <div className={`text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 transition-colors duration-200 ${
          isAnimating && lastAction === 'decrease' 
            ? 'text-red-700 dark:text-red-300' 
            : isAnimating && lastAction === 'increase'
            ? 'text-blue-700 dark:text-blue-300'
            : 'text-white dark:text-white'
        }`}>
          {currentCapacity.toFixed(1)} Points
        </div>
      </div>
    </div>
  );
}
