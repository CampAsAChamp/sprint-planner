'use client'

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
  return (
    <FormField label={label}>
      <div className="flex items-center h-20">
        {/* Number Display */}
        <div className="flex-1 h-20 px-4 text-center border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white font-medium text-xl mr-8 flex items-center justify-center">
          {value}
        </div>

        {/* Minus Button */}
        <Button
          onClick={onDecrease}
          disabled={value <= min}
          variant="secondary"
          size="xl"
          icon="minus"
          className="flex-shrink-0 mr-2"
          ariaLabel={`Decrease ${label.toLowerCase()}`}
        />

        {/* Plus Button */}
        <Button
          onClick={onIncrease}
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
