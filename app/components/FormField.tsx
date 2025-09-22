'use client'

interface FormFieldProps {
  label: string
  description?: string
  children: React.ReactNode
  className?: string
  labelSize?: 'sm' | 'md' | 'lg' | 'xl'
  descriptionSize?: 'sm' | 'md'
}

export default function FormField({
  label,
  description,
  children,
  className = '',
  labelSize = 'lg',
  descriptionSize = 'sm'
}: FormFieldProps) {
  const labelSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  }
  
  const descriptionSizeClasses = {
    sm: 'text-sm',
    md: 'text-base'
  }
  
  return (
    <div className={className}>
      <label className={`block font-medium text-gray-700 dark:text-gray-300 mb-2 ${labelSizeClasses[labelSize]}`}>
        {label}
      </label>
      
      {description && (
        <p className={`text-gray-500 dark:text-gray-400 mb-4 ${descriptionSizeClasses[descriptionSize]}`}>
          {description}
        </p>
      )}
      
      {children}
    </div>
  )
}
