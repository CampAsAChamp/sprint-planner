'use client'

import Button from './Button'
import { PTOActivity } from '../types/PTOActivity'
import { useState } from 'react'

interface SaveConfigurationProps {
  teamMembers: number
  sprintDays: number
  ptoActivities: PTOActivity[]
  onCallTime: number
  onShowToast: (message: string, type: 'success' | 'error' | 'save' | 'load' | 'delete') => void
  onLoadConfiguration: () => void
  onDeleteConfiguration: () => void
}

interface SavedConfiguration {
  teamMembers: number
  sprintDays: number
  ptoActivities: PTOActivity[]
  onCallTime: number
  savedAt: string
}

export default function SaveConfiguration({
  teamMembers,
  sprintDays,
  ptoActivities,
  onCallTime,
  onShowToast,
  onLoadConfiguration,
  onDeleteConfiguration
}: SaveConfigurationProps) {
  const [includePto, setIncludePto] = useState(false)

  const saveConfiguration = () => {
    try {
      const config: SavedConfiguration = {
        teamMembers,
        sprintDays,
        ptoActivities: includePto ? ptoActivities : [],
        onCallTime,
        savedAt: new Date().toISOString()
      }

      localStorage.setItem('sprintCapacityConfig', JSON.stringify(config))
      onShowToast('Configuration saved successfully!', 'save')
    } catch (error) {
      console.error('Failed to save configuration:', error)
      onShowToast('Failed to save configuration. Please try again.', 'error')
    }
  }


  return (
    <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 mt-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
        Save Configuration
      </h3>
      
      <div className="space-y-4">
        {/* Include PTO Checkbox */}
        <div className="flex items-center">
          <input
            id="includePto"
            type="checkbox"
            checked={includePto}
            onChange={(e) => setIncludePto(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="includePto" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
            Include PTO and Activities in saved configuration
          </label>
        </div>

        {/* Save Button */}
        <Button
          onClick={saveConfiguration}
          variant="primary"
          size="md"
          fullWidth
        >
          Save Current Configuration
        </Button>

        {/* Reload Button */}
        <Button
          onClick={onLoadConfiguration}
          variant="secondary"
          size="md"
          fullWidth
          icon="reload"
        >
          Reload Saved Configuration
        </Button>

        {/* Delete Configuration Button */}
        <Button
          onClick={onDeleteConfiguration}
          variant="danger"
          size="md"
          fullWidth
          icon="trash"
        >
          Delete Saved Configuration
        </Button>
      </div>

      <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
        <p>Configuration includes: Team Size, Sprint Duration, On-Call Time{includePto ? ', and PTO activities' : ''}</p>
        <p className="mt-2 text-gray-400 dark:text-gray-500">Saved configuration is automatically loaded when you visit the page.</p>
      </div>
    </div>
  )
}
