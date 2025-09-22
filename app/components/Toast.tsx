'use client'

import { useEffect, useState } from 'react'

import Button from './Button'
import Icon from './Icon'

interface ToastProps {
  message: string
  type: 'success' | 'error' | 'save' | 'load' | 'delete'
  isVisible: boolean
  onClose: () => void
}

export default function Toast({ message, type, isVisible, onClose }: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose()
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [isVisible, onClose])

  if (!isVisible) return null

  const getToastStyles = (type: string) => {
    switch (type) {
      case 'success':
        return {
          bgColor: 'bg-green-500',
          icon: 'check' as const
        }
      case 'error':
        return {
          bgColor: 'bg-red-500',
          icon: 'error' as const
        }
      case 'save':
        return {
          bgColor: 'bg-blue-500',
          icon: 'save' as const
        }
      case 'load':
        return {
          bgColor: 'bg-purple-500',
          icon: 'load' as const
        }
      case 'delete':
        return {
          bgColor: 'bg-orange-500',
          icon: 'trash' as const
        }
      default:
        return {
          bgColor: 'bg-gray-500',
          icon: 'check' as const
        }
    }
  }

  const { bgColor, icon } = getToastStyles(type)

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right duration-300">
      <div className={`${bgColor} text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 min-w-80`}>
        <Icon name={icon} size="md" />
        <span className="font-medium">{message}</span>
        <Button
          onClick={onClose}
          variant="ghost"
          size="sm"
          icon="close"
          className="ml-auto hover:!bg-gray-600/30 hover:!ring-gray-600/30 rounded p-1"
        />
      </div>
    </div>
  )
}
