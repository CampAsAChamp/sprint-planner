'use client'

import Modal from '@/app/components/ui/Modal'
import Button from '@/app/components/ui/Button'
import FormField from '@/app/components/ui/FormField'
import ConfigurationPreview from '@/app/components/configuration/ConfigurationPreview'
import { SprintConfiguration } from '@/app/types/SprintConfiguration'

interface SaveConfigurationModalProps {
  isOpen: boolean
  onClose: () => void
  currentConfig: SprintConfiguration
  configurations: SprintConfiguration[]
  saveMode: 'create' | 'update'
  setSaveMode: (mode: 'create' | 'update') => void
  newConfigName: string
  setNewConfigName: (name: string) => void
  selectedConfigToUpdate: string
  setSelectedConfigToUpdate: (id: string) => void
  includePto: boolean
  setIncludePto: (include: boolean) => void
  includeRollover: boolean
  setIncludeRollover: (include: boolean) => void
  nameError: string
  setNameError: (error: string) => void
  nameFieldBounce: boolean
  onCreateConfiguration: () => void
  onUpdateConfiguration: () => void
}

export default function SaveConfigurationModal({
  isOpen,
  onClose,
  currentConfig,
  configurations,
  saveMode,
  setSaveMode,
  newConfigName,
  setNewConfigName,
  selectedConfigToUpdate,
  setSelectedConfigToUpdate,
  includePto,
  setIncludePto,
  includeRollover,
  setIncludeRollover,
  nameError,
  setNameError,
  nameFieldBounce,
  onCreateConfiguration,
  onUpdateConfiguration
}: SaveConfigurationModalProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (saveMode === 'create') {
        onCreateConfiguration()
      } else {
        onUpdateConfiguration()
      }
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Save Configuration"
      titleSize="text-2xl"
      titleCentered={true}
    >
      {/* Current Configuration Preview */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-4 text-left">Current Configuration</h4>
        <ConfigurationPreview config={currentConfig} />
      </div>

      {/* Include Options */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-4 text-left">Include in Save</h4>
        <div className="space-y-4">
          {/* Include PTO Checkbox */}
          <div className="flex items-center">
            <input
              id="modalIncludePto"
              type="checkbox"
              checked={includePto}
              onChange={(e) => setIncludePto(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="modalIncludePto" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
              Include PTO & Activities
            </label>
          </div>

          {/* Include Rollover Points Checkbox */}
          <div className="flex items-center">
            <input
              id="modalIncludeRollover"
              type="checkbox"
              checked={includeRollover}
              onChange={(e) => setIncludeRollover(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="modalIncludeRollover" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
              Include Rollover Points
            </label>
          </div>
        </div>
      </div>

      {/* Save Mode Selection */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-4 text-left">Save Options</h4>
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
        <div className="mt-6">
          <FormField label="Configuration Name" required align="left">
            <input
              type="text"
              value={newConfigName}
              onChange={(e) => {
                setNewConfigName(e.target.value)
                if (nameError) setNameError('')
              }}
              placeholder="e.g Pool Team, GED, Half Team"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all ${
                nameError 
                  ? 'border-red-500 dark:border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
              } ${nameFieldBounce ? 'animate-bounce-horizontal' : ''}`}
              autoFocus
              onKeyDown={handleKeyDown}
            />
            {nameError && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">{nameError}</p>
            )}
          </FormField>
        </div>
      )}

      {/* Configuration Selection (for update mode) */}
      {saveMode === 'update' && (
        <div className="mt-6">
          <FormField label="Select Configuration to Update" align="left">
            <select
              value={selectedConfigToUpdate}
              onChange={(e) => setSelectedConfigToUpdate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
        </div>
      )}
      
      <div className="flex gap-4 mt-8">
        <Button
          onClick={onClose}
          variant="secondary"
          size="md"
          fullWidth
        >
          Cancel
        </Button>
        <Button
          onClick={saveMode === 'create' ? onCreateConfiguration : onUpdateConfiguration}
          variant="primary"
          size="md"
          fullWidth
          disabled={saveMode === 'update' && !selectedConfigToUpdate}
          className={saveMode === 'create' && !newConfigName.trim() ? 'opacity-50 cursor-not-allowed' : ''}
        >
          {saveMode === 'create' ? 'Create Configuration' : 'Update Configuration'}
        </Button>
      </div>
    </Modal>
  )
}

