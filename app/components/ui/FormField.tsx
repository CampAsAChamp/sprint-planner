'use client'

interface FormFieldProps {
  label: string
  description?: string
  children: React.ReactNode
  className?: string
  labelSize?: 'sm' | 'md' | 'lg' | 'xl'
  descriptionSize?: 'sm' | 'md'
  required?: boolean
  align?: 'left' | 'center'
}

export default function FormField({
  label,
  description,
  children,
  className = '',
  labelSize = 'lg',
  descriptionSize = 'sm',
  required = false,
  align = 'center'
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
  
  const alignClasses = align === 'left' ? 'text-left' : 'text-center'
  
  return (
    <div className={className}>
      <label className={`block font-medium text-gray-700 dark:text-gray-300 mb-2 ${alignClasses} ${labelSizeClasses[labelSize]}`}>
        {label}
        {required && <span className="text-red-500 dark:text-red-400 ml-1">*</span>}
      </label>
      
      {description && (
        <p className={`text-gray-500 dark:text-gray-400 mb-4 ${alignClasses} ${descriptionSizeClasses[descriptionSize]}`}>
          {description}
        </p>
      )}
      
      {children}
    </div>
  )
}
