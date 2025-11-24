import React from 'react'
import Button from '@/app/components/ui/Button'
import FormField from '@/app/components/ui/FormField'

interface QuickSelectOption {
  value: number
  label: string
  ariaLabel: string
}

interface ControlledNumberInputProps {
  id: string
  label: string
  description: string
  value: number
  min: number
  max?: number
  onChange: (value: number) => void
  quickSelectOptions: QuickSelectOption[]
  animating: boolean
  lastAction: 'increase' | 'decrease' | null
  onIncrease: () => void
  onDecrease: () => void
  placeholder?: string
  formatValue?: (value: number) => string
}

export default function ControlledNumberInput({
  id,
  label,
  description,
  value,
  min,
  max,
  onChange,
  quickSelectOptions,
  animating,
  lastAction,
  onIncrease,
  onDecrease,
  placeholder = "0",
  formatValue
}: ControlledNumberInputProps) {
  const displayValue = formatValue ? formatValue(value) : value

  return (
    <div className="mb-3">
      <FormField
        label={label}
        description={description}
        className="mb-0"
      >
        <div className="flex items-center justify-center h-10 sm:h-12 gap-1 sm:gap-2">
          {/* Number Input */}
          <input
            type="number"
            id={id}
            min={min}
            max={max}
            value={value || ''}
            onChange={(e) => {
              const inputValue = parseInt(e.target.value) || 0;
              if (inputValue >= min && (max === undefined || inputValue <= max)) {
                onChange(inputValue);
              }
            }}
            className={`w-20 sm:w-24 h-10 sm:h-12 px-1 sm:px-3 text-center border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 transition-all duration-200 font-medium text-sm sm:text-base md:text-lg lg:text-xl [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
              !animating 
                ? 'scale-100 text-gray-900 dark:text-white' 
                : lastAction === 'decrease' 
                  ? 'scale-105 ring-2 ring-red-500 border-red-400 dark:border-red-500 text-red-600 dark:text-red-400'
                  : lastAction === 'increase'
                    ? 'scale-105 ring-2 ring-blue-500 border-blue-400 dark:border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'scale-100 text-gray-900 dark:text-white'
            }`}
            placeholder={placeholder}
          />

          {/* Minus Button */}
          <Button
            onClick={onDecrease}
            disabled={value <= min}
            variant="secondary"
            size="sm"
            icon="minus"
            className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10"
            ariaLabel={`Decrease ${label.toLowerCase()}`}
          />

          {/* Plus Button */}
          <Button
            onClick={onIncrease}
            disabled={max !== undefined && value >= max}
            variant="secondary"
            size="sm"
            icon="plus"
            className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10"
            ariaLabel={`Increase ${label.toLowerCase()}`}
          />

          {/* Separator */}
          <div className="w-px h-8 sm:h-10 bg-gray-300 dark:bg-gray-600 mx-2"></div>

          {/* Quick Select Buttons */}
          <div className="flex gap-1 sm:gap-2">
            {quickSelectOptions.map((option) => (
              <Button
                key={option.value}
                onClick={() => onChange(option.value)}
                variant={value === option.value ? 'primary' : 'secondary'}
                size="sm"
                className="h-8 sm:h-10 min-w-[50px] sm:min-w-[60px] rounded-full text-xs sm:text-sm"
                ariaLabel={option.ariaLabel}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>
      </FormField>
    </div>
  )
}

