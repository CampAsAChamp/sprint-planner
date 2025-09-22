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
      <div className="flex items-center h-20">
        {/* Number Display */}
        <div className={`flex-1 h-20 px-4 text-center border border-gray-300 dark:border-gray-600 rounded-lg font-medium text-xl mr-8 flex items-center justify-center focus:outline-none transition-all duration-200 ${
          isAnimating && lastAction === 'decrease' 
            ? 'scale-105 ring-2 ring-red-500 border-red-400 dark:border-red-500 text-red-600 dark:text-red-400' 
            : isAnimating && lastAction === 'increase'
            ? 'scale-105 ring-2 ring-blue-500 border-blue-400 dark:border-blue-500 text-blue-600 dark:text-blue-400'
            : 'scale-100 bg-white dark:bg-gray-700 dark:text-white focus:bg-white focus:dark:bg-gray-700'
        }`}>
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
          size="xl"
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
          size="xl"
          icon="plus"
          className="flex-shrink-0 ml-2"
          ariaLabel={`Increase ${label.toLowerCase()}`}
        />
      </div>
    </FormField>
  )
}
