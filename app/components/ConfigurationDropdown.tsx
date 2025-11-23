'use client'

import { useEffect, useRef } from 'react'
import { PTOActivity } from '../types/PTOActivity'

interface SprintConfiguration {
  id: string
  name: string
  teamMembers: number
  sprintDays: number
  onCallTime: number
  rolloverPoints: number
  ptoActivities: PTOActivity[]
  createdAt: string
  updatedAt: string
}

interface ConfigurationDropdownProps {
  configurations: SprintConfiguration[]
  currentConfigId: string | null
  currentConfig: SprintConfiguration
  showDropdown: boolean
  onToggleDropdown: () => void
  onCloseDropdown: () => void
  onSwitchToConfiguration: (configId: string) => void
  onEditConfiguration: (config: SprintConfiguration) => void
  onDuplicateConfiguration: (config: SprintConfiguration) => void
  onDeleteConfiguration: (config: SprintConfiguration) => void
}

export default function ConfigurationDropdown({
  configurations,
  currentConfigId,
  currentConfig,
  showDropdown,
  onToggleDropdown,
  onCloseDropdown,
  onSwitchToConfiguration,
  onEditConfiguration,
  onDuplicateConfiguration,
  onDeleteConfiguration
}: ConfigurationDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Click outside handler for dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onCloseDropdown()
      }
    }

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showDropdown, onCloseDropdown])

  return (
    <div className="relative" ref={dropdownRef}>
      <h4 className="font-semibold text-gray-950 dark:text-gray-50 mb-4 text-left">Current Configuration</h4>
      <div 
        className={`bg-white dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600 transition-colors ${
          configurations.length > 0 
            ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600' 
            : 'cursor-default'
        }`}
        onClick={() => configurations.length > 0 && onToggleDropdown()}
      >
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
            {currentConfig.name}
          </p>
          <div className="flex items-center space-x-2">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {configurations.length} total
            </div>
            {configurations.length > 0 && (
              <svg 
                className={`w-4 h-4 text-gray-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            )}
          </div>
        </div>
      </div>

      {/* Configuration Dropdown */}
      {showDropdown && configurations.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto overflow-x-hidden">
          {configurations.map((config) => (
            <div
              key={config.id}
              className={`flex items-center justify-between cursor-pointer transition-colors ${
                config.id === currentConfigId
                  ? 'bg-blue-100 dark:bg-blue-900/40 border-l-4 border-l-blue-500 border-b border-gray-100 dark:border-gray-600 -mx-1'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-600 border-b border-gray-100 dark:border-gray-600'
              } last:border-b-0`}
              onClick={() => {
                onSwitchToConfiguration(config.id)
                onCloseDropdown()
              }}
            >
              <div className="flex-1 min-w-0 text-left p-4">
                <p className={`font-medium truncate mb-1 ${
                  config.id === currentConfigId 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-gray-900 dark:text-gray-100'
                }`}>
                  {config.name}
                </p>
                <p className={`text-sm mb-1 ${
                  config.id === currentConfigId 
                    ? 'text-blue-500 dark:text-blue-300' 
                    : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {config.teamMembers} members • {config.sprintDays} days
                  {config.rolloverPoints > 0 && (
                    <span> • {config.rolloverPoints} rollover</span>
                  )}
                  {config.ptoActivities.length > 0 && (
                    <span> • {config.ptoActivities.length} PTO</span>
                  )}
                  <span> • {config.onCallTime} on-call</span>
                </p>
                <p className={`text-xs ${
                  config.id === currentConfigId 
                    ? 'text-blue-400 dark:text-blue-200' 
                    : 'text-gray-400 dark:text-gray-500'
                }`}>
                  Updated: {new Date(config.updatedAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center space-x-1 ml-2 p-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onEditConfiguration(config)
                    onCloseDropdown()
                  }}
                  className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                  title="Edit name"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onDuplicateConfiguration(config)
                    onCloseDropdown()
                  }}
                  className="p-1 text-gray-400 hover:text-green-600 dark:hover:text-green-400"
                  title="Duplicate"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onDeleteConfiguration(config)
                    onCloseDropdown()
                  }}
                  className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                  title="Delete"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

