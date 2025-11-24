'use client'

import { useRef } from 'react'
import Button from '../ui/Button'
import ConfigurationDropdown from '../configuration/ConfigurationDropdown'
import SaveConfigurationModal from '../configuration/SaveConfigurationModal'
import EditConfigurationModal from '../configuration/EditConfigurationModal'
import DuplicateConfigurationModal from '../configuration/DuplicateConfigurationModal'
import DeleteConfigurationModal from '../configuration/DeleteConfigurationModal'
import { useConfigurationManager } from '../../hooks/useConfigurationManager'
import { SprintConfiguration } from '../../types/SprintConfiguration'

interface ConfigurationManagerProps {
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

export default function ConfigurationManager({
  configurations,
  currentConfigId,
  currentConfig,
  onCreateConfiguration,
  onDuplicateConfiguration,
  onUpdateConfigurationName,
  onDeleteConfiguration,
  onSwitchToConfiguration,
  onShowToast
}: ConfigurationManagerProps) {
  const manager = useConfigurationManager({
    currentConfig,
    configurations,
    onCreateConfiguration,
    onDuplicateConfiguration,
    onUpdateConfigurationName,
    onDeleteConfiguration,
    onShowToast
  })

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="bg-orange-100 dark:bg-orange-500/20 border border-orange-400 dark:border-orange-600 rounded-lg p-6 mt-6">
      <h3 className="text-xl font-medium text-orange-700 dark:text-orange-200 mb-4">
        Configuration Manager
      </h3>
      
      <div className="space-y-6">
        {/* Current Configuration Display */}
        <ConfigurationDropdown
          configurations={configurations}
          currentConfigId={currentConfigId}
          currentConfig={currentConfig}
          showDropdown={manager.showConfigDropdown}
          onToggleDropdown={() => manager.setShowConfigDropdown(!manager.showConfigDropdown)}
          onCloseDropdown={() => manager.setShowConfigDropdown(false)}
          onSwitchToConfiguration={onSwitchToConfiguration}
          onEditConfiguration={manager.openEditModal}
          onDuplicateConfiguration={manager.openDuplicateModal}
          onDeleteConfiguration={manager.openDeleteModal}
        />


        {/* Save Button */}
        <div className="mt-4">
          <Button
            onClick={manager.openSaveModal}
            variant="primary"
            size="md"
            fullWidth
            icon="save"
          >
            Save Configuration
          </Button>
        </div>

        {/* Import Button */}
        <div className="mt-6">
          <Button
            onClick={handleImportClick}
            variant="secondary"
            size="md"
            fullWidth
            icon="upload"
          >
            Import Configuration
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            onChange={manager.handleImportConfiguration}
            className="hidden"
          />
        </div>
        
        {/* Export Button */}
        <div className="mt-4">
          <Button
            onClick={manager.handleExportConfiguration}
            variant="secondary"
            size="md"
            fullWidth
            icon="download"
          >
            Export Configuration
          </Button>
          
          <div className="mt-4 text-xs text-gray-700 dark:text-gray-500 text-left">
            <p>Saves configuration to localStorage for backup and reuse purposes.</p>
            <p className="mt-1">Configuration is automatically loaded from localStorage on page load.</p>
            <p className="mt-2">Use Export to download configuration as a file, or Import to load from a file.</p>
          </div>
        </div>
      </div>

      {/* Save Configuration Modal */}
      <SaveConfigurationModal
        isOpen={manager.showCreateModal}
        onClose={manager.closeSaveModal}
        currentConfig={currentConfig}
        configurations={configurations}
        saveMode={manager.saveMode}
        setSaveMode={manager.setSaveMode}
        newConfigName={manager.newConfigName}
        setNewConfigName={manager.setNewConfigName}
        selectedConfigToUpdate={manager.selectedConfigToUpdate}
        setSelectedConfigToUpdate={manager.setSelectedConfigToUpdate}
        includePto={manager.includePto}
        setIncludePto={manager.setIncludePto}
        includeRollover={manager.includeRollover}
        setIncludeRollover={manager.setIncludeRollover}
        nameError={manager.nameError}
        setNameError={manager.setNameError}
        nameFieldBounce={manager.nameFieldBounce}
        onCreateConfiguration={manager.handleCreateConfiguration}
        onUpdateConfiguration={manager.handleUpdateExistingConfiguration}
      />

      {/* Edit Configuration Modal */}
      <EditConfigurationModal
        isOpen={manager.showEditModal}
        onClose={manager.closeEditModal}
        config={manager.configToEdit}
        editConfigName={manager.editConfigName}
        setEditConfigName={manager.setEditConfigName}
        onUpdateConfigurationName={manager.handleUpdateConfigurationName}
      />

      {/* Duplicate Configuration Modal */}
      <DuplicateConfigurationModal
        isOpen={manager.showDuplicateModal}
        onClose={manager.closeDuplicateModal}
        config={manager.configToDuplicate}
        duplicateConfigName={manager.duplicateConfigName}
        setDuplicateConfigName={manager.setDuplicateConfigName}
        onDuplicateConfiguration={manager.handleDuplicateConfiguration}
      />

      {/* Delete Configuration Modal */}
      <DeleteConfigurationModal
        isOpen={manager.showDeleteModal}
        onClose={manager.closeDeleteModal}
        config={manager.configToDelete}
        onDeleteConfiguration={manager.handleDeleteConfiguration}
      />
    </div>
  )
}

