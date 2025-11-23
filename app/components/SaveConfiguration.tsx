'use client'

import Button from './Button'
import ConfigurationDropdown from './ConfigurationDropdown'
import SaveConfigurationModal from './SaveConfigurationModal'
import EditConfigurationModal from './EditConfigurationModal'
import DuplicateConfigurationModal from './DuplicateConfigurationModal'
import DeleteConfigurationModal from './DeleteConfigurationModal'
import { useConfigurationManager } from '../hooks/useConfigurationManager'
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
  const manager = useConfigurationManager({
    currentConfig,
    configurations,
    onCreateConfiguration,
    onDuplicateConfiguration,
    onUpdateConfigurationName,
    onDeleteConfiguration,
    onShowToast
  })

  return (
    <div className="bg-orange-100 dark:bg-orange-500/20 border border-orange-400 dark:border-orange-600 rounded-lg p-6 mt-6">
      <h3 className="text-lg font-semibold text-orange-700 dark:text-orange-200 mb-4">
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
        <div className="mt-6">
          <Button
            onClick={manager.openSaveModal}
            variant="primary"
            size="md"
            fullWidth
            icon="save"
          >
            Save Configuration
          </Button>
          
          <div className="mt-4 text-xs text-gray-700 dark:text-gray-500 text-left">
            <p>Saves configuration to localStorage for backup purposes.</p>
            <p className="mt-1">Configuration is automatically loaded from localStorage on page load.</p>
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
