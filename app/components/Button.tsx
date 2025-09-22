'use client'

import Icon from './Icon'
import { useState } from 'react'

interface ButtonProps {
  children?: React.ReactNode
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  disabled?: boolean
  className?: string
  icon?: 'plus' | 'minus' | 'delete' | 'reload' | 'close' | 'check' | 'error' | 'save' | 'load' | 'trash'
  iconPosition?: 'left' | 'right'
  fullWidth?: boolean
  ariaLabel?: string
}

export default function Button({
  children,
  onClick,
  type = 'button',
  variant = 'secondary',
  size = 'md',
  disabled = false,
  className = '',
  icon,
  iconPosition = 'left',
  fullWidth = false,
  ariaLabel
}: ButtonProps) {
  const [isPressed, setIsPressed] = useState(false)
  
  const baseClasses = (icon === 'minus' || icon === 'plus')
    ? 'font-medium transition-all duration-150 active:scale-95 focus:ring-2 rounded-full'
    : 'font-medium transition-all duration-150 active:scale-95 focus:ring-2 focus:ring-offset-2 rounded-full'
  
  const variantClasses = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600 hover:ring-2 hover:ring-blue-300 focus:ring-blue-500 active:bg-blue-700 active:ring-2 active:ring-blue-300',
    secondary: icon === 'minus' 
      ? 'border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 hover:ring-2 hover:ring-red-500 focus:ring-red-500 active:bg-gray-100 dark:active:bg-gray-600'
      : 'border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 hover:ring-2 hover:ring-blue-500 focus:ring-blue-500 active:bg-gray-100 dark:active:bg-gray-600',
    danger: 'border border-red-300 dark:border-red-600 text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:ring-2 hover:ring-red-300 focus:ring-red-500',
    ghost: 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 hover:ring-2 hover:ring-blue-500'
  }
  
  const pressedClasses = isPressed 
    ? (icon === 'minus' 
        ? '!bg-red-500 !text-white !border-red-500 ring-2 ring-red-300' 
        : '!bg-blue-500 !text-white !border-blue-500 ring-2 ring-blue-300')
    : ''
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-4 py-2 text-lg',
    xl: 'w-20 h-20 text-xl'
  }
  
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : ''
  const widthClasses = fullWidth ? 'w-full' : ''
  
  const classes = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    disabledClasses,
    widthClasses,
    className,
    pressedClasses
  ].filter(Boolean).join(' ')
  
  const iconElement = icon ? (
    <Icon 
      name={icon} 
      size={size === 'xl' ? 'xl' : size === 'lg' ? 'lg' : 'md'} 
    />
  ) : null
  
  const handleClick = () => {
    if (disabled) return
    
    setIsPressed(true)
    setTimeout(() => setIsPressed(false), 200)
    
    if (onClick) {
      onClick()
    }
  }
  
  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled}
      className={classes}
      aria-label={ariaLabel}
    >
      <div className="flex items-center justify-center gap-2">
        {icon && iconPosition === 'left' && iconElement}
        {children && children}
        {icon && iconPosition === 'right' && iconElement}
      </div>
    </button>
  )
}
