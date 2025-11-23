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
    // Basic calculation: team members * sprint days - PTO days
    const totalPtoDays = ptoActivities.reduce((sum, activity) => sum + (activity.developers * activity.duration), 0);
    const baseCapacity = teamMembers * sprintDays;
    const totalPoints = Math.max(0, baseCapacity - totalPtoDays);
    const newPoints = Math.max(0, totalPoints - rolloverPoints - onCallTime);
    return { baseCapacity, totalPtoDays, totalPoints, rolloverPoints, newPoints, onCallTime };
  };

  const { baseCapacity, totalPtoDays, totalPoints, newPoints } = calculateCapacity();
  const currentCapacity = totalPoints;

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
      return 'bg-white dark:bg-transparent border-2 border-red-300 dark:border-red-600 ring-2 ring-red-500'
    }
    if (isAnimating && lastAction === 'increase') {
      return 'bg-white dark:bg-transparent border-2 border-blue-300 dark:border-blue-600 ring-2 ring-blue-500'
    }
    return 'bg-green-100 dark:bg-transparent border-2 border-green-400 dark:border-green-800'
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
    return 'text-gray-900 dark:text-white'
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
        
        {/* Breakdown Section */}
        <div className="mt-6 pt-4 border-t border-green-300 dark:border-green-700">
          <div className="space-y-2 text-sm sm:text-base">
            <div className="flex justify-between items-center text-gray-700 dark:text-gray-300">
              <span className="font-medium">Base Capacity</span>
              <span className="font-semibold">{teamMembers} dev{teamMembers !== 1 ? 's' : ''} × {sprintDays} day{sprintDays !== 1 ? 's' : ''} = {baseCapacity.toFixed(1)}</span>
            </div>
            {rolloverPoints > 0 && (
              <div className="flex justify-between items-center text-gray-700 dark:text-gray-300">
                <span className="font-medium">Rollover Points</span>
                <span className="font-semibold">- {rolloverPoints.toFixed(1)}</span>
              </div>
            )}
            {onCallTime > 0 && (
              <div className="flex justify-between items-center text-gray-700 dark:text-gray-300">
                <span className="font-medium">On-Call Time</span>
                <span className="font-semibold">- {onCallTime.toFixed(1)}</span>
              </div>
            )}
            {totalPtoDays > 0 && (
              <div className="flex justify-between items-center text-gray-700 dark:text-gray-300">
                <span className="font-medium">PTO & Activities</span>
                <span className="font-semibold">- {totalPtoDays.toFixed(1)}</span>
              </div>
            )}
            {rolloverPoints > 0 && (
              <>
                <div className="flex justify-between items-center pt-2 border-t border-green-200 dark:border-green-800">
                  <span className="font-bold text-gray-900 dark:text-white">New Points (excluding on-call)</span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {newPoints.toFixed(1)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-900 dark:text-white">New Points (including on-call)</span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {(totalPoints - rolloverPoints).toFixed(1)}
                  </span>
                </div>
              </>
            )}
            <div className="flex justify-between items-center pt-2 border-t border-green-200 dark:border-green-800">
              <span className="font-bold text-gray-900 dark:text-white flex items-center gap-1">
                Total Capacity
                <span className="relative group">
                  <svg 
                    className="w-4 h-4 text-gray-500 dark:text-gray-400 cursor-help" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 16v-4m0-4h.01"/>
                  </svg>
                  <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                    Total Capacity = Base Capacity - PTO & Activities
                  </span>
                </span>
              </span>
              <span className="font-bold text-gray-900 dark:text-white">
                {totalPoints.toFixed(1)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
