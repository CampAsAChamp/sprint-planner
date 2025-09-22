'use client'

import Button from './Button'

interface QuickSelectOption {
  value: number
  label: string
  ariaLabel: string
}

interface QuickSelectProps {
  title: string
  options: QuickSelectOption[]
  selectedValue: number
  onSelect: (value: number) => void
  showDuration?: boolean
}

export default function QuickSelect({ title, options, selectedValue, onSelect, showDuration = false }: QuickSelectProps) {
  const getDurationText = (days: number) => {
    if (days === 5) return "1 week"
    if (days === 10) return "2 weeks"
    if (days === 30) return "1 month"
    return ""
  }

  return (
    <div className="mt-1 mb-12">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 text-center">
        {title}
      </p>
      <div className="flex gap-2 sm:gap-4 md:gap-6 justify-center flex-wrap">
        {options.map((option) => (
          <div key={option.value} className="flex flex-col items-center">
            <Button
              onClick={() => onSelect(option.value)}
              variant={selectedValue === option.value ? 'primary' : 'secondary'}
              size="sm"
              ariaLabel={option.ariaLabel}
            >
              {option.label}
            </Button>
            {showDuration && (
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 text-center">
                {getDurationText(option.value)}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
