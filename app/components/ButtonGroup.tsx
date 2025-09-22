'use client'

import Button from './Button'
import FormField from './FormField'

interface ButtonGroupOption {
  value: number
  label: string
  ariaLabel: string
}

interface ButtonGroupProps {
  label: string
  description: string
  options: ButtonGroupOption[]
  selectedValue: number
  onSelect: (value: number) => void
}

export default function ButtonGroup({ label, description, options, selectedValue, onSelect }: ButtonGroupProps) {
  return (
    <FormField
      label={label}
      description={description}
      className="mb-12"
    >
      <div className="flex items-center gap-2 sm:gap-4 h-16 sm:h-20">
        {options.map((option) => (
          <Button
            key={option.value}
            onClick={() => onSelect(option.value)}
            variant={selectedValue === option.value ? 'primary' : 'secondary'}
            size="xl"
            className="flex-1"
            ariaLabel={option.ariaLabel}
          >
            {option.label}
          </Button>
        ))}
      </div>
    </FormField>
  )
}
