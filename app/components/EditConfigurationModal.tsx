'use client'

import Modal from './Modal'
import Button from './Button'
import FormField from './FormField'
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

interface EditConfigurationModalProps {
  isOpen: boolean
  onClose: () => void
  config: SprintConfiguration | null
  editConfigName: string
  setEditConfigName: (name: string) => void
  onUpdateConfigurationName: () => void
}

export default function EditConfigurationModal({
  isOpen,
  onClose,
  config,
  editConfigName,
  setEditConfigName,
  onUpdateConfigurationName
}: EditConfigurationModalProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && editConfigName.trim()) {
      onUpdateConfigurationName()
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Configuration Name"
      titleSize="text-2xl"
      titleCentered={true}
    >
      <FormField label="Configuration Name" align="left">
        <input
          type="text"
          value={editConfigName}
          onChange={(e) => setEditConfigName(e.target.value)}
          placeholder="e.g Pool Team, GED, Half Team"
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
          onClick={onUpdateConfigurationName}
          variant="primary"
          size="md"
          fullWidth
          disabled={!editConfigName.trim()}
        >
          Update Name
        </Button>
      </div>
    </Modal>
  )
}

