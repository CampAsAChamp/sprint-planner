'use client'

import { useState } from 'react'
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

interface UseConfigurationManagerProps {
  currentConfig: SprintConfiguration
  configurations: SprintConfiguration[]
  onCreateConfiguration: (name: string, configData?: Partial<SprintConfiguration>) => string
  onDuplicateConfiguration: (configId: string, newName?: string) => string | null
  onUpdateConfigurationName: (configId: string, newName: string) => void
  onDeleteConfiguration: (configId: string) => void
  onShowToast: (message: string, type: 'success' | 'error' | 'save' | 'load' | 'delete') => void
}

export function useConfigurationManager({
  currentConfig,
  configurations,
  onCreateConfiguration,
  onDuplicateConfiguration,
  onUpdateConfigurationName,
  onDeleteConfiguration,
  onShowToast
}: UseConfigurationManagerProps) {
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDuplicateModal, setShowDuplicateModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showConfigDropdown, setShowConfigDropdown] = useState(false)

  // Form states
  const [newConfigName, setNewConfigName] = useState('')
  const [editConfigName, setEditConfigName] = useState('')
  const [duplicateConfigName, setDuplicateConfigName] = useState('')
  const [nameError, setNameError] = useState<string>('')
  const [nameFieldBounce, setNameFieldBounce] = useState<boolean>(false)

  // Configuration selection states
  const [configToEdit, setConfigToEdit] = useState<SprintConfiguration | null>(null)
  const [configToDuplicate, setConfigToDuplicate] = useState<SprintConfiguration | null>(null)
  const [configToDelete, setConfigToDelete] = useState<SprintConfiguration | null>(null)

  // Save modal states
  const [saveMode, setSaveMode] = useState<'create' | 'update'>('create')
  const [selectedConfigToUpdate, setSelectedConfigToUpdate] = useState<string>('')
  const [includePto, setIncludePto] = useState(true)
  const [includeRollover, setIncludeRollover] = useState(true)

  // Modal openers
  const openSaveModal = () => {
    setSaveMode('create')
    setNewConfigName('')
    setSelectedConfigToUpdate('')
    setNameError('')
    setNameFieldBounce(false)
    setShowCreateModal(true)
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

  // Modal closers
  const closeSaveModal = () => {
    setShowCreateModal(false)
    setNameError('')
    setNameFieldBounce(false)
  }

  const closeEditModal = () => {
    setShowEditModal(false)
    setEditConfigName('')
    setConfigToEdit(null)
  }

  const closeDuplicateModal = () => {
    setShowDuplicateModal(false)
    setDuplicateConfigName('')
    setConfigToDuplicate(null)
  }

  const closeDeleteModal = () => {
    setShowDeleteModal(false)
    setConfigToDelete(null)
  }

  // Configuration handlers
  const handleCreateConfiguration = () => {
    const trimmedName = newConfigName.trim()
    if (!trimmedName) {
      setNameError('Configuration name is required')
      setNameFieldBounce(true)
      setTimeout(() => setNameFieldBounce(false), 500)
      return
    }

    const configData = {
      teamMembers: currentConfig.teamMembers,
      sprintDays: currentConfig.sprintDays,
      onCallTime: currentConfig.onCallTime,
      rolloverPoints: includeRollover ? currentConfig.rolloverPoints : 0,
      ptoActivities: includePto ? currentConfig.ptoActivities : []
    }
    onCreateConfiguration(trimmedName, configData)
    setNewConfigName('')
    setNameError('')
    setNameFieldBounce(false)
    setShowCreateModal(false)
  }

  const handleUpdateExistingConfiguration = () => {
    if (selectedConfigToUpdate) {
      const configData = {
        teamMembers: currentConfig.teamMembers,
        sprintDays: currentConfig.sprintDays,
        onCallTime: currentConfig.onCallTime,
        rolloverPoints: includeRollover ? currentConfig.rolloverPoints : 0,
        ptoActivities: includePto ? currentConfig.ptoActivities : []
      }
      
      const configToUpdate = configurations.find(c => c.id === selectedConfigToUpdate)
      if (configToUpdate) {
        onDeleteConfiguration(selectedConfigToUpdate)
        onCreateConfiguration(configToUpdate.name, configData)
        onShowToast(`Configuration "${configToUpdate.name}" updated successfully!`, 'save')
      }
      
      setSelectedConfigToUpdate('')
      setShowCreateModal(false)
    }
  }

  const handleUpdateConfigurationName = () => {
    if (configToEdit && editConfigName.trim()) {
      onUpdateConfigurationName(configToEdit.id, editConfigName.trim())
      closeEditModal()
    }
  }

  const handleDuplicateConfiguration = () => {
    if (configToDuplicate) {
      onDuplicateConfiguration(configToDuplicate.id, duplicateConfigName.trim() || undefined)
      closeDuplicateModal()
    }
  }

  const handleDeleteConfiguration = () => {
    if (configToDelete) {
      onDeleteConfiguration(configToDelete.id)
      closeDeleteModal()
    }
  }

  return {
    // Modal states
    showCreateModal,
    showEditModal,
    showDuplicateModal,
    showDeleteModal,
    showConfigDropdown,
    setShowConfigDropdown,

    // Form states
    newConfigName,
    setNewConfigName,
    editConfigName,
    setEditConfigName,
    duplicateConfigName,
    setDuplicateConfigName,
    nameError,
    setNameError,
    nameFieldBounce,

    // Configuration selection states
    configToEdit,
    configToDuplicate,
    configToDelete,

    // Save modal states
    saveMode,
    setSaveMode,
    selectedConfigToUpdate,
    setSelectedConfigToUpdate,
    includePto,
    setIncludePto,
    includeRollover,
    setIncludeRollover,

    // Modal handlers
    openSaveModal,
    openEditModal,
    openDuplicateModal,
    openDeleteModal,
    closeSaveModal,
    closeEditModal,
    closeDuplicateModal,
    closeDeleteModal,

    // Configuration handlers
    handleCreateConfiguration,
    handleUpdateExistingConfiguration,
    handleUpdateConfigurationName,
    handleDuplicateConfiguration,
    handleDeleteConfiguration
  }
}

