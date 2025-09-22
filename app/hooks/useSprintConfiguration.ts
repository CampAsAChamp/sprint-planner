'use client'

import { useCallback, useEffect, useState } from 'react'

import { PTOActivity } from '../types/PTOActivity'

interface SprintConfiguration {
  teamMembers: number
  sprintDays: number
  onCallTime: number
  ptoActivities: PTOActivity[]
}

interface ToastState {
  message: string
  type: 'success' | 'error' | 'save' | 'load' | 'delete'
  isVisible: boolean
}

export function useSprintConfiguration() {
  const [config, setConfig] = useState<SprintConfiguration>({
    teamMembers: 5,
    sprintDays: 5,
    onCallTime: 0,
    ptoActivities: []
  })
  
  const [toast, setToast] = useState<ToastState>({
    message: '',
    type: 'success',
    isVisible: false
  })
  
  // Toast handlers
  const showToast = useCallback((message: string, type: ToastState['type']) => {
    setToast({ message, type, isVisible: true })
  }, [])

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }))
  }

  // Configuration handlers
  const updateConfig = (updates: Partial<SprintConfiguration>) => {
    setConfig(prev => ({ ...prev, ...updates }))
  }

  const saveConfiguration = (includePto = false) => {
    try {
      const configToSave = {
        ...config,
        ptoActivities: includePto ? config.ptoActivities : [],
        savedAt: new Date().toISOString()
      }
      
      localStorage.setItem('sprintCapacityConfig', JSON.stringify(configToSave))
      showToast('Configuration saved successfully!', 'save')
      return true
    } catch (error) {
      console.error('Failed to save configuration:', error)
      showToast('Failed to save configuration. Please try again.', 'error')
      return false
    }
  }

  const loadConfiguration = useCallback((showNotification = true) => {
    try {
      const savedConfig = localStorage.getItem('sprintCapacityConfig')
      if (savedConfig) {
        const parsedConfig = JSON.parse(savedConfig)
        setConfig({
          teamMembers: parsedConfig.teamMembers || 5,
          sprintDays: parsedConfig.sprintDays || 5,
          onCallTime: parsedConfig.onCallTime || 0,
          ptoActivities: parsedConfig.ptoActivities || []
        })
        
        if (showNotification) {
          showToast('Configuration loaded successfully!', 'load')
        }
        return true
      } else {
        if (showNotification) {
          showToast('No saved configuration found.', 'error')
        }
        return false
      }
    } catch (error) {
      console.error('Failed to load configuration:', error)
      if (showNotification) {
        showToast('Failed to load configuration. Please try again.', 'error')
      }
      return false
    }
  }, [showToast])

  const deleteConfiguration = () => {
    try {
      localStorage.removeItem('sprintCapacityConfig')
      setConfig({
        teamMembers: 5,
        sprintDays: 5,
        onCallTime: 0,
        ptoActivities: []
      })
      showToast('Configuration deleted and reset to defaults!', 'delete')
    } catch (error) {
      console.error('Failed to delete configuration:', error)
      showToast('Failed to delete configuration. Please try again.', 'error')
    }
  }

  // Auto-load configuration on mount
  useEffect(() => {
    loadConfiguration(false)
  }, [loadConfiguration])

  return {
    config,
    updateConfig,
    saveConfiguration,
    loadConfiguration,
    deleteConfiguration,
    toast,
    showToast,
    hideToast
  }
}
