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
  rolloverPoints: number
}

export default function SprintCapacityOutput({ 
  teamMembers, 
  sprintDays, 
  ptoActivities, 
  onCallTime,
  rolloverPoints 
}: SprintCapacityProps) {
  const [lastAction, setLastAction] = useState<'increase' | 'decrease' | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [previousCapacity, setPreviousCapacity] = useState<number>(0)
  const calculateCapacity = () => {
    // Basic calculation: team members * sprint days - PTO days - on-call days - rollover points
    const totalPtoDays = ptoActivities.reduce((sum, activity) => sum + (activity.developers * activity.duration), 0);
    const totalCapacity = (teamMembers * sprintDays) - totalPtoDays - onCallTime - rolloverPoints;
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

  // Get container styling based on animation state
  const getContainerClasses = () => {
    if (isAnimating && lastAction === 'decrease') {
      return 'border-2 border-red-300 dark:border-red-600 ring-2 ring-red-500'
    }
    if (isAnimating && lastAction === 'increase') {
      return 'border-2 border-blue-300 dark:border-blue-600 ring-2 ring-blue-500'
    }
    return 'border-2 border-green-200 dark:border-green-800'
  }

  // Get title styling based on animation state
  const getTitleClasses = () => {
    if (isAnimating && lastAction === 'decrease') {
      return 'text-red-700 dark:text-red-300'
    }
    if (isAnimating && lastAction === 'increase') {
      return 'text-blue-700 dark:text-blue-300'
    }
    return 'text-green-600 dark:text-green-400'
  }

  // Get capacity number styling based on animation state
  const getCapacityClasses = () => {
    if (isAnimating && lastAction === 'decrease') {
      return 'text-red-700 dark:text-red-300'
    }
    if (isAnimating && lastAction === 'increase') {
      return 'text-blue-700 dark:text-blue-300'
    }
    return 'text-white dark:text-white'
  }

  return (
    <div className={`rounded-lg p-4 sm:p-6 lg:p-8 mt-6 transition-all duration-200 ${getContainerClasses()}`}>
      <h3 className={`text-xl sm:text-2xl lg:text-3xl font-medium mb-4 sm:mb-6 lg:mb-8 transition-colors duration-200 ${getTitleClasses()}`} style={{textAlign: 'center'}}>
        Sprint Capacity
      </h3>
      <div className="text-center">
        <div className={`text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 transition-colors duration-200 ${getCapacityClasses()}`}>
          {currentCapacity.toFixed(1)} Points
        </div>
      </div>
    </div>
  );
}
