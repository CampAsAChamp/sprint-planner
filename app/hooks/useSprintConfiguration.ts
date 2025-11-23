'use client'

import { useCallback, useEffect, useState } from 'react'

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

interface ToastState {
  message: string
  type: 'success' | 'error' | 'save' | 'load' | 'delete'
  isVisible: boolean
}

export function useSprintConfiguration() {
  const [configurations, setConfigurations] = useState<SprintConfiguration[]>([])
  const [currentConfigId, setCurrentConfigId] = useState<string | null>(null)
  const [currentConfig, setCurrentConfig] = useState<SprintConfiguration>({
    id: 'default',
    name: 'Default Configuration',
    teamMembers: 5,
    sprintDays: 5,
    onCallTime: 0,
    rolloverPoints: 0,
    ptoActivities: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
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
  const updateConfig = (updates: Partial<Omit<SprintConfiguration, 'id' | 'name' | 'createdAt' | 'updatedAt'>>) => {
    setCurrentConfig(prev => ({ ...prev, ...updates, updatedAt: new Date().toISOString() }))
  }

  const createConfiguration = (name: string, configData?: Partial<SprintConfiguration>) => {
    const newConfig: SprintConfiguration = {
      id: Date.now().toString(),
      name: name.trim() || 'Untitled Configuration',
      teamMembers: configData?.teamMembers || currentConfig.teamMembers,
      sprintDays: configData?.sprintDays || currentConfig.sprintDays,
      onCallTime: configData?.onCallTime || currentConfig.onCallTime,
      rolloverPoints: configData?.rolloverPoints || currentConfig.rolloverPoints,
      ptoActivities: configData?.ptoActivities || currentConfig.ptoActivities,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    setConfigurations(prev => [...prev, newConfig])
    setCurrentConfigId(newConfig.id)
    setCurrentConfig(newConfig)
    showToast(`Configuration "${newConfig.name}" created successfully!`, 'save')
    return newConfig.id
  }

  const duplicateConfiguration = (configId: string, newName?: string) => {
    const configToDuplicate = configurations.find(c => c.id === configId)
    if (!configToDuplicate) return null
    
    const duplicatedConfig: SprintConfiguration = {
      ...configToDuplicate,
      id: Date.now().toString(),
      name: newName || `${configToDuplicate.name} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    setConfigurations(prev => [...prev, duplicatedConfig])
    setCurrentConfigId(duplicatedConfig.id)
    showToast(`Configuration "${duplicatedConfig.name}" created successfully!`, 'save')
    return duplicatedConfig.id
  }

  const updateConfigurationName = (configId: string, newName: string) => {
    const trimmedName = newName.trim() || 'Untitled Configuration'
    const updatedAt = new Date().toISOString()
    
    setConfigurations(prev => prev.map(config => 
      config.id === configId 
        ? { ...config, name: trimmedName, updatedAt }
        : config
    ))
    
    // If we're updating the current config's name, update currentConfig as well
    if (currentConfigId === configId) {
      setCurrentConfig(prev => ({
        ...prev,
        name: trimmedName,
        updatedAt
      }))
    }
    
    showToast('Configuration name updated successfully!', 'save')
  }

  const deleteConfiguration = (configId: string) => {
    const configToDelete = configurations.find(c => c.id === configId)
    if (!configToDelete) return
    
    const remainingConfigs = configurations.filter(c => c.id !== configId)
    setConfigurations(remainingConfigs)
    
    // If we deleted the current config, switch to another one or reset to default
    if (currentConfigId === configId) {
      if (remainingConfigs.length > 0) {
        setCurrentConfigId(remainingConfigs[0].id)
        setCurrentConfig(remainingConfigs[0])
      } else {
        setCurrentConfigId(null)
        // Reset to default configuration when no configurations remain
        setCurrentConfig({
          id: 'default',
          name: 'Default Configuration',
          teamMembers: 5,
          sprintDays: 5,
          onCallTime: 0,
          rolloverPoints: 0,
          ptoActivities: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })
      }
    }
    
    // Immediately save the updated configurations to localStorage
    try {
      localStorage.setItem('sprintCapacityConfigurations', JSON.stringify(remainingConfigs))
      if (remainingConfigs.length === 0) {
        localStorage.removeItem('sprintCapacityCurrentConfigId')
      } else if (currentConfigId === configId && remainingConfigs.length > 0) {
        localStorage.setItem('sprintCapacityCurrentConfigId', remainingConfigs[0].id)
      }
    } catch (error) {
      console.error('Failed to save configurations after deletion:', error)
    }
    
    showToast(`Configuration "${configToDelete.name}" deleted successfully!`, 'delete')
  }

  const switchToConfiguration = (configId: string) => {
    const targetConfig = configurations.find(c => c.id === configId)
    if (targetConfig) {
      setCurrentConfigId(configId)
      setCurrentConfig(targetConfig)
      showToast(`Switched to "${targetConfig.name}"`, 'load')
    }
  }

  const saveConfigurationsToStorage = useCallback(() => {
    try {
      // Check if localStorage is available
      if (typeof window === 'undefined' || !window.localStorage) {
        console.warn('localStorage is not available')
        return false
      }
      
      console.log('Saving configurations to localStorage:', { configurations, currentConfigId })
      localStorage.setItem('sprintCapacityConfigurations', JSON.stringify(configurations))
      localStorage.setItem('sprintCapacityCurrentConfigId', currentConfigId || '')
      console.log('Successfully saved to localStorage')
      return true
    } catch (error) {
      console.error('Failed to save configurations:', error)
      showToast('Failed to save configurations. Please try again.', 'error')
      return false
    }
  }, [configurations, currentConfigId, showToast])

  const loadConfigurationsFromStorage = useCallback((showNotification = true) => {
    try {
      // Check if localStorage is available
      if (typeof window === 'undefined' || !window.localStorage) {
        console.warn('localStorage is not available')
        return false
      }
      
      const savedConfigurations = localStorage.getItem('sprintCapacityConfigurations')
      const savedCurrentId = localStorage.getItem('sprintCapacityCurrentConfigId')
      
      console.log('Loading from localStorage:', { savedConfigurations, savedCurrentId })
      
      if (savedConfigurations) {
        const parsedConfigurations = JSON.parse(savedConfigurations)
        console.log('Parsed configurations:', parsedConfigurations)
        setConfigurations(parsedConfigurations)
        
        if (savedCurrentId && parsedConfigurations.find((c: SprintConfiguration) => c.id === savedCurrentId)) {
          const targetConfig = parsedConfigurations.find((c: SprintConfiguration) => c.id === savedCurrentId)
          setCurrentConfigId(savedCurrentId)
          setCurrentConfig(targetConfig)
          console.log('Loaded specific config:', targetConfig)
        } else if (parsedConfigurations.length > 0) {
          setCurrentConfigId(parsedConfigurations[0].id)
          setCurrentConfig(parsedConfigurations[0])
          console.log('Loaded first config:', parsedConfigurations[0])
        }
        
        if (showNotification && parsedConfigurations.length > 0) {
          showToast('Configurations loaded successfully!', 'load')
        }
        return true
      } else {
        console.log('No saved configurations found in localStorage')
        if (showNotification) {
          showToast('No saved configurations found.', 'error')
        }
        return false
      }
    } catch (error) {
      console.error('Failed to load configurations:', error)
      if (showNotification) {
        showToast('Failed to load configurations. Please try again.', 'error')
      }
      return false
    }
  }, [showToast])

  // Auto-save configurations when they change (but not on initial load)
  useEffect(() => {
    // Only save if we have configurations and we're not in the initial loading state
    if (configurations.length > 0) {
      saveConfigurationsToStorage()
    }
  }, [saveConfigurationsToStorage])

  // Auto-load configurations on mount
  useEffect(() => {
    loadConfigurationsFromStorage(false)
  }, [loadConfigurationsFromStorage])

  return {
    config: currentConfig,
    configurations,
    currentConfigId,
    updateConfig,
    createConfiguration,
    duplicateConfiguration,
    updateConfigurationName,
    deleteConfiguration,
    switchToConfiguration,
    saveConfigurationsToStorage,
    loadConfigurationsFromStorage,
    toast,
    showToast,
    hideToast
  }
}
