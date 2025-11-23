'use client'

import Modal from '../ui/Modal'
import Button from '../ui/Button'
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

interface DeleteConfigurationModalProps {
  isOpen: boolean
  onClose: () => void
  config: SprintConfiguration | null
  onDeleteConfiguration: () => void
}

export default function DeleteConfigurationModal({
  isOpen,
  onClose,
  config,
  onDeleteConfiguration
}: DeleteConfigurationModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Configuration"
      titleSize="text-2xl"
      titleCentered={true}
    >
      <div className="text-center">
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Are you sure you want to delete the configuration
        </p>
        <p className="font-semibold text-lg text-red-600 dark:text-red-400 mb-6">
          &quot;{config?.name}&quot;?
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          This action cannot be undone.
        </p>
      </div>
      
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
          onClick={onDeleteConfiguration}
          variant="danger"
          size="md"
          fullWidth
        >
          Delete Configuration
        </Button>
      </div>
    </Modal>
  )
}

