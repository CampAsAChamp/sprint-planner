'use client'

import { useEffect, useState } from 'react'

import Button from './Button'
import FormField from './FormField'

interface CounterControlsProps {
  label: string
  value: number
  min: number
  max: number
  step?: number
  onDecrease: () => void
  onIncrease: () => void
}

export default function CounterControls({ 
  label, 
  value, 
  min, 
  max, 
  step = 1, 
  onDecrease, 
  onIncrease 
}: CounterControlsProps) {
  const [lastAction, setLastAction] = useState<'decrease' | 'increase' | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)

  // Get animation classes based on current state
  const getAnimationClasses = () => {
    if (!isAnimating) {
      return 'scale-100 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:bg-white focus:dark:bg-gray-700'
    }
    
    if (lastAction === 'decrease') {
      return 'scale-105 ring-2 ring-red-500 border-red-400 dark:border-red-500 text-red-600 dark:text-red-400 bg-white dark:bg-gray-700 focus:bg-white focus:dark:bg-gray-700'
    }
    
    if (lastAction === 'increase') {
      return 'scale-105 ring-2 ring-blue-500 border-blue-400 dark:border-blue-500 text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-700 focus:bg-white focus:dark:bg-gray-700'
    }
    
    return 'scale-100 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:bg-white focus:dark:bg-gray-700'
  }

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
    <FormField label={label}>
      <div className="flex items-center justify-center h-16 mt-4">
        {/* Number Display */}
        <div className={`w-20 sm:w-24 h-16 px-4 text-center border border-gray-300 dark:border-gray-600 rounded-lg font-medium text-lg mr-6 flex items-center justify-center focus:outline-none transition-all duration-200 ${getAnimationClasses()}`}>
          {value}
        </div>

        {/* Minus Button */}
        <Button
          onClick={() => {
            setLastAction('decrease')
            setIsAnimating(true)
            onDecrease()
          }}
          disabled={value <= min}
          variant="secondary"
          size="lg"
          icon="minus"
          className="flex-shrink-0 mr-2"
          ariaLabel={`Decrease ${label.toLowerCase()}`}
        />

        {/* Plus Button */}
        <Button
          onClick={() => {
            setLastAction('increase')
            setIsAnimating(true)
            onIncrease()
          }}
          disabled={value >= max}
          variant="secondary"
          size="lg"
          icon="plus"
          className="flex-shrink-0 ml-2"
          ariaLabel={`Increase ${label.toLowerCase()}`}
        />
      </div>
    </FormField>
  )
}
