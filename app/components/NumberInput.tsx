'use client'

import { useEffect, useState } from 'react'

import Button from './Button'
import FormField from './FormField'

interface NumberInputProps {
  id: string
  label: string
  description: string
  value: number
  min: number
  max?: number
  onChange: (value: number) => void
  animating?: boolean
  lastAction?: 'increase' | 'decrease' | null
  placeholder?: string
  bottomMargin?: string
}

export default function NumberInput({
  id,
  label,
  description,
  value,
  min,
  max,
  onChange,
  animating = false,
  lastAction: externalLastAction = null,
  placeholder = "0",
  bottomMargin = "mb-12"
}: NumberInputProps) {
  const [lastAction, setLastAction] = useState<'decrease' | 'increase' | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  
  // Use external animating prop when provided
  const shouldAnimate = animating || isAnimating
  const currentAction = externalLastAction || lastAction

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = parseInt(e.target.value) || 0;
    if (inputValue >= min && (max === undefined || inputValue <= max)) {
      onChange(inputValue);
    }
  };

  const handleDecrease = () => {
    setLastAction('decrease')
    setIsAnimating(true)
    onChange(Math.max(min, value - 1));
  };

  const handleIncrease = () => {
    setLastAction('increase')
    setIsAnimating(true)
    onChange(max === undefined ? value + 1 : Math.min(max, value + 1));
  };

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
    <FormField
      label={label}
      description={description}
      className={bottomMargin}
    >
      <div className="flex items-center h-16 sm:h-20">
        {/* Number Input */}
        <input
          type="number"
          id={id}
          min={min}
          max={max}
          value={value || ''}
          onChange={handleInputChange}
          className={`flex-1 h-16 sm:h-20 px-2 sm:px-4 text-center border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 transition-all duration-200 font-medium text-lg sm:text-xl mr-2 sm:mr-8 ${
            shouldAnimate && currentAction === 'decrease' 
              ? 'scale-105 ring-2 ring-red-500 border-red-400 dark:border-red-500 text-red-600 dark:text-red-400' 
              : shouldAnimate && currentAction === 'increase'
              ? 'scale-105 ring-2 ring-blue-500 border-blue-400 dark:border-blue-500 text-blue-600 dark:text-blue-400'
              : 'scale-100 dark:text-white'
          }`}
          placeholder={placeholder}
        />

        {/* Minus Button */}
        <Button
          onClick={handleDecrease}
          disabled={value <= min}
          variant="secondary"
          size="xl"
          icon="minus"
          className="flex-shrink-0 mr-1 sm:mr-2"
          ariaLabel={`Decrease ${label.toLowerCase()}`}
        />

        {/* Plus Button */}
        <Button
          onClick={handleIncrease}
          disabled={max !== undefined && value >= max}
          variant="secondary"
          size="xl"
          icon="plus"
          className="flex-shrink-0 ml-1 sm:ml-2"
          ariaLabel={`Increase ${label.toLowerCase()}`}
        />
      </div>
    </FormField>
  )
}
