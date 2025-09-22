'use client'

import { useEffect, useRef, useState } from 'react'

import Button from './Button'
import FormField from './FormField'
import Modal from './Modal'
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

interface SaveConfigurationProps {
  configurations: SprintConfiguration[]
  currentConfigId: string | null
  currentConfig: SprintConfiguration
  onCreateConfiguration: (name: string, configData?: Partial<SprintConfiguration>) => string
  onDuplicateConfiguration: (configId: string, newName?: string) => string | null
  onUpdateConfigurationName: (configId: string, newName: string) => void
  onDeleteConfiguration: (configId: string) => void
  onSwitchToConfiguration: (configId: string) => void
  onShowToast: (message: string, type: 'success' | 'error' | 'save' | 'load' | 'delete') => void
}

interface SavedConfiguration {
  teamMembers: number
  sprintDays: number
  ptoActivities: PTOActivity[]
  onCallTime: number
  rolloverPoints: number
  savedAt: string
}

export default function SaveConfiguration({
  configurations,
  currentConfigId,
  currentConfig,
  onCreateConfiguration,
  onDuplicateConfiguration,
  onUpdateConfigurationName,
  onDeleteConfiguration,
  onSwitchToConfiguration,
  onShowToast
}: SaveConfigurationProps) {
  const [includePto, setIncludePto] = useState(false)
  const [includeRollover, setIncludeRollover] = useState(false)
  const [showConfigDropdown, setShowConfigDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  
  // Configuration management modals
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDuplicateModal, setShowDuplicateModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [newConfigName, setNewConfigName] = useState('')
  const [editConfigName, setEditConfigName] = useState('')
  const [duplicateConfigName, setDuplicateConfigName] = useState('')
  const [configToEdit, setConfigToEdit] = useState<SprintConfiguration | null>(null)
  const [configToDuplicate, setConfigToDuplicate] = useState<SprintConfiguration | null>(null)
  const [configToDelete, setConfigToDelete] = useState<SprintConfiguration | null>(null)
  
  // Save modal state
  const [saveMode, setSaveMode] = useState<'create' | 'update'>('create')
  const [selectedConfigToUpdate, setSelectedConfigToUpdate] = useState<string>('')

  // Click outside handler for dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowConfigDropdown(false)
      }
    }

    if (showConfigDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showConfigDropdown])

  const saveConfiguration = () => {
    try {
      const config: SavedConfiguration = {
        teamMembers: currentConfig.teamMembers,
        sprintDays: currentConfig.sprintDays,
        ptoActivities: includePto ? currentConfig.ptoActivities : [],
        onCallTime: currentConfig.onCallTime,
        rolloverPoints: includeRollover ? currentConfig.rolloverPoints : 0,
        savedAt: new Date().toISOString()
      }

      localStorage.setItem('sprintCapacityConfig', JSON.stringify(config))
      onShowToast('Configuration saved successfully!', 'save')
    } catch (error) {
      console.error('Failed to save configuration:', error)
      onShowToast('Failed to save configuration. Please try again.', 'error')
    }
  }

  // Configuration management handlers
  const handleCreateConfiguration = () => {
    if (newConfigName.trim()) {
      // Create a new configuration with current config data and the new name
      const configData = {
        teamMembers: currentConfig.teamMembers,
        sprintDays: currentConfig.sprintDays,
        onCallTime: currentConfig.onCallTime,
        rolloverPoints: includeRollover ? currentConfig.rolloverPoints : 0,
        ptoActivities: includePto ? currentConfig.ptoActivities : []
      }
      onCreateConfiguration(newConfigName.trim(), configData)
      setNewConfigName('')
      setShowCreateModal(false)
    }
  }

  const handleUpdateExistingConfiguration = () => {
    if (selectedConfigToUpdate) {
      // Update the selected configuration with current config data
      const configData = {
        teamMembers: currentConfig.teamMembers,
        sprintDays: currentConfig.sprintDays,
        onCallTime: currentConfig.onCallTime,
        rolloverPoints: includeRollover ? currentConfig.rolloverPoints : 0,
        ptoActivities: includePto ? currentConfig.ptoActivities : []
      }
      
      // Find the config to update and get its name
      const configToUpdate = configurations.find(c => c.id === selectedConfigToUpdate)
      if (configToUpdate) {
        // Update the configuration by deleting the old one and creating a new one with the same name
        onDeleteConfiguration(selectedConfigToUpdate)
        onCreateConfiguration(configToUpdate.name, configData)
        onShowToast(`Configuration "${configToUpdate.name}" updated successfully!`, 'save')
      }
      
      setSelectedConfigToUpdate('')
      setShowCreateModal(false)
    }
  }

  const handleDuplicateConfiguration = () => {
    if (configToDuplicate) {
      onDuplicateConfiguration(configToDuplicate.id, duplicateConfigName.trim() || undefined)
      setDuplicateConfigName('')
      setConfigToDuplicate(null)
      setShowDuplicateModal(false)
    }
  }

  const handleUpdateConfigurationName = () => {
    if (configToEdit && editConfigName.trim()) {
      onUpdateConfigurationName(configToEdit.id, editConfigName.trim())
      setEditConfigName('')
      setConfigToEdit(null)
      setShowEditModal(false)
    }
  }

  const handleDeleteConfiguration = () => {
    if (configToDelete) {
      onDeleteConfiguration(configToDelete.id)
      setConfigToDelete(null)
      setShowDeleteModal(false)
    }
  }

  const openEditModal = (config: SprintConfiguration) => {
    setConfigToEdit(config)
    setEditConfigName(config.name)
    setShowEditModal(true)
  }

  const openDuplicateModal = (config: SprintConfiguration) => {
    setConfigToDuplicate(config)
    setDuplicateConfigName(`${config.name} (Copy)`)
    setShowDuplicateModal(true)
  }

  const openDeleteModal = (config: SprintConfiguration) => {
    setConfigToDelete(config)
    setShowDeleteModal(true)
  }

  const openSaveModal = () => {
    setSaveMode('create')
    setNewConfigName('')
    setSelectedConfigToUpdate('')
    setShowCreateModal(true)
  }


  return (
    <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 mt-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
        Configuration Manager
      </h3>
      
      <div className="space-y-6">
        {/* Current Configuration Display */}
        <div className="relative" ref={dropdownRef}>
          <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-4 text-left">Current Configuration</h4>
          <div 
            className="bg-white dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            onClick={() => setShowConfigDropdown(!showConfigDropdown)}
          >
            <div className="flex items-center justify-between">
              <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                {currentConfig.name}
              </p>
              <div className="flex items-center space-x-2">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {configurations.length} total
                </div>
                <svg 
                  className={`w-4 h-4 text-gray-400 transition-transform ${showConfigDropdown ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Configuration Dropdown */}
          {showConfigDropdown && configurations.length > 0 && (
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
                    setShowConfigDropdown(false)
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
                        openEditModal(config)
                        setShowConfigDropdown(false)
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
                        openDuplicateModal(config)
                        setShowConfigDropdown(false)
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
                        openDeleteModal(config)
                        setShowConfigDropdown(false)
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

        {/* Save Section */}
        <div className="border-t border-gray-200 dark:border-gray-600 pt-6">
          <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-4 text-left">Save Configuration</h4>
          
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
                Include PTO & Activities
              </label>
            </div>

            {/* Include Rollover Points Checkbox */}
            <div className="flex items-center">
              <input
                id="includeRollover"
                type="checkbox"
                checked={includeRollover}
                onChange={(e) => setIncludeRollover(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="includeRollover" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Include Rollover Points
              </label>
            </div>

            {/* Save Button */}
            <div className="pt-2">
              <Button
                onClick={openSaveModal}
                variant="primary"
                size="md"
                fullWidth
                icon="save"
              >
                Save Configuration
              </Button>
            </div>
          </div>

          <div className="mt-6 text-xs text-gray-500 dark:text-gray-400 text-left">
            <p>Save includes: Team Size, Sprint Duration, On-Call Time{includeRollover ? ', Rollover Points' : ''}{includePto ? ', and PTO Activities' : ''}</p>
            <p className="mt-1 text-gray-400 dark:text-gray-500">This saves the current configuration to localStorage for backup purposes.</p>
          </div>
        </div>
      </div>

      {/* Save Configuration Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Save Configuration"
        titleSize="text-2xl"
        titleCentered={true}
      >
        {/* Current Configuration Preview */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-4">Current Configuration</h4>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-900 dark:text-gray-100">Team Size:</span>
                <span className="text-blue-600 dark:text-blue-400 font-medium">
                  {currentConfig.teamMembers} {currentConfig.teamMembers === 1 ? 'Member' : 'Members'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-900 dark:text-gray-100">Sprint Duration:</span>
                <span className="text-blue-600 dark:text-blue-400 font-medium">
                  {currentConfig.sprintDays} {currentConfig.sprintDays === 1 ? 'Day' : 'Days'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-900 dark:text-gray-100">Rollover Points:</span>
                <span className="text-gray-500 dark:text-gray-400">
                  {currentConfig.rolloverPoints > 0 ? `${currentConfig.rolloverPoints} Points` : 'None'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-900 dark:text-gray-100">PTO & Activities:</span>
                <span className="text-gray-500 dark:text-gray-400">
                  {currentConfig.ptoActivities.length > 0 ? `${currentConfig.ptoActivities.length} Activities` : 'None'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-900 dark:text-gray-100">On-Call Time:</span>
                <span className="text-gray-500 dark:text-gray-400">
                  {currentConfig.onCallTime > 0 ? `${currentConfig.onCallTime} Days` : 'None'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Save Mode Selection */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-4">Save Options</h4>
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                id="create-new"
                type="radio"
                name="saveMode"
                value="create"
                checked={saveMode === 'create'}
                onChange={(e) => setSaveMode(e.target.value as 'create' | 'update')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <label htmlFor="create-new" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Create a new configuration
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="update-existing"
                type="radio"
                name="saveMode"
                value="update"
                checked={saveMode === 'update'}
                onChange={(e) => setSaveMode(e.target.value as 'create' | 'update')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <label htmlFor="update-existing" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Update an existing configuration
              </label>
            </div>
          </div>
        </div>

        {/* Configuration Name Input (for create mode) */}
        {saveMode === 'create' && (
          <FormField label="Configuration Name">
            <input
              type="text"
              value={newConfigName}
              onChange={(e) => setNewConfigName(e.target.value)}
              placeholder="Enter configuration name..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && (saveMode === 'create' ? handleCreateConfiguration() : handleUpdateExistingConfiguration())}
            />
          </FormField>
        )}

        {/* Configuration Selection (for update mode) */}
        {saveMode === 'update' && (
          <FormField label="Select Configuration to Update">
            <select
              value={selectedConfigToUpdate}
              onChange={(e) => setSelectedConfigToUpdate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              autoFocus
            >
              <option value="">Choose a configuration...</option>
              {configurations.map((config) => (
                <option key={config.id} value={config.id}>
                  {config.name} ({config.teamMembers} members, {config.sprintDays} days)
                </option>
              ))}
            </select>
          </FormField>
        )}
        
        <div className="flex gap-4 mt-8">
          <Button
            onClick={() => setShowCreateModal(false)}
            variant="secondary"
            size="md"
            fullWidth
          >
            Cancel
          </Button>
          <Button
            onClick={saveMode === 'create' ? handleCreateConfiguration : handleUpdateExistingConfiguration}
            variant="primary"
            size="md"
            fullWidth
            disabled={
              saveMode === 'create' 
                ? !newConfigName.trim() 
                : !selectedConfigToUpdate
            }
          >
            {saveMode === 'create' ? 'Create Configuration' : 'Update Configuration'}
          </Button>
        </div>
      </Modal>

      {/* Edit Configuration Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Configuration Name"
        titleSize="text-2xl"
        titleCentered={true}
      >
        <FormField label="Configuration Name">
          <input
            type="text"
            value={editConfigName}
            onChange={(e) => setEditConfigName(e.target.value)}
            placeholder="Enter configuration name..."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            autoFocus
            onKeyDown={(e) => e.key === 'Enter' && handleUpdateConfigurationName()}
          />
        </FormField>
        
        <div className="flex gap-4 mt-8">
          <Button
            onClick={() => setShowEditModal(false)}
            variant="secondary"
            size="md"
            fullWidth
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdateConfigurationName}
            variant="primary"
            size="md"
            fullWidth
            disabled={!editConfigName.trim()}
          >
            Update Name
          </Button>
        </div>
      </Modal>

      {/* Duplicate Configuration Modal */}
      <Modal
        isOpen={showDuplicateModal}
        onClose={() => setShowDuplicateModal(false)}
        title="Duplicate Configuration"
        titleSize="text-2xl"
        titleCentered={true}
      >
        <FormField label="New Configuration Name">
          <input
            type="text"
            value={duplicateConfigName}
            onChange={(e) => setDuplicateConfigName(e.target.value)}
            placeholder="Enter name for duplicated configuration..."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            autoFocus
            onKeyDown={(e) => e.key === 'Enter' && handleDuplicateConfiguration()}
          />
        </FormField>
        
        <div className="flex gap-4 mt-8">
          <Button
            onClick={() => setShowDuplicateModal(false)}
            variant="secondary"
            size="md"
            fullWidth
          >
            Cancel
          </Button>
          <Button
            onClick={handleDuplicateConfiguration}
            variant="primary"
            size="md"
            fullWidth
            disabled={!duplicateConfigName.trim()}
          >
            Duplicate Configuration
          </Button>
        </div>
      </Modal>

      {/* Delete Configuration Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Configuration"
        titleSize="text-2xl"
        titleCentered={true}
      >
        <div className="text-center">
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Are you sure you want to delete the configuration
          </p>
          <p className="font-semibold text-lg text-red-600 dark:text-red-400 mb-6">
            &quot;{configToDelete?.name}&quot;?
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            This action cannot be undone.
          </p>
        </div>
        
        <div className="flex gap-4 mt-8">
          <Button
            onClick={() => setShowDeleteModal(false)}
            variant="secondary"
            size="md"
            fullWidth
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfiguration}
            variant="danger"
            size="md"
            fullWidth
          >
            Delete Configuration
          </Button>
        </div>
      </Modal>
    </div>
  )
}
