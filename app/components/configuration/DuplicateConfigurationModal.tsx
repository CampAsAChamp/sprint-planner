'use client'

import Modal from '../ui/Modal'
import Button from '../ui/Button'
import FormField from '../ui/FormField'
import { PTOActivity } from '../../types/PTOActivity'

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

interface DuplicateConfigurationModalProps {
  isOpen: boolean
  onClose: () => void
  config: SprintConfiguration | null
  duplicateConfigName: string
  setDuplicateConfigName: (name: string) => void
  onDuplicateConfiguration: () => void
}

export default function DuplicateConfigurationModal({
  isOpen,
  onClose,
  config,
  duplicateConfigName,
  setDuplicateConfigName,
  onDuplicateConfiguration
}: DuplicateConfigurationModalProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && duplicateConfigName.trim()) {
      onDuplicateConfiguration()
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Duplicate Configuration"
      titleSize="text-2xl"
      titleCentered={true}
    >
      <FormField label="New Configuration Name" align="left">
        <input
          type="text"
          value={duplicateConfigName}
          onChange={(e) => setDuplicateConfigName(e.target.value)}
          placeholder="Enter name for duplicated configuration..."
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          autoFocus
          onKeyDown={handleKeyDown}
        />
      </FormField>
      
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
          onClick={onDuplicateConfiguration}
          variant="primary"
          size="md"
          fullWidth
          disabled={!duplicateConfigName.trim()}
        >
          Duplicate Configuration
        </Button>
      </div>
    </Modal>
  )
}

