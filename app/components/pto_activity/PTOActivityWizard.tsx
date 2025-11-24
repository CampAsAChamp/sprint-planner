'use client'

import { useState, useEffect } from 'react'
import Button from '@/app/components/ui/Button'
import CounterControls from '@/app/components/ui/CounterControls'
import FormField from '@/app/components/ui/FormField'
import Modal from '@/app/components/ui/Modal'
import { PTOActivity } from '@/app/types/PTOActivity'

interface PTOActivityWizardProps {
  isOpen: boolean
  onClose: () => void
  onSave: (activity: Omit<PTOActivity, 'id'>, editingId: string | null) => void
  editingPtoActivity: PTOActivity | null
  teamMembers: number
  sprintDays: number
}

export default function PTOActivityWizard({
  isOpen,
  onClose,
  onSave,
  editingPtoActivity,
  teamMembers,
  sprintDays
}: PTOActivityWizardProps) {
  const [wizardData, setWizardData] = useState({
    name: '',
    developers: 1,
    duration: 1
  })
  const [nameError, setNameError] = useState<string>('')
  const [nameFieldBounce, setNameFieldBounce] = useState<boolean>(false)

  // Reset form when modal opens/closes or when editing a different activity
  useEffect(() => {
    if (isOpen) {
      if (editingPtoActivity) {
        setWizardData({
          name: editingPtoActivity.name,
          developers: editingPtoActivity.developers,
          duration: editingPtoActivity.duration
        })
      } else {
        setWizardData({
          name: '',
          developers: 1,
          duration: 1
        })
      }
      setNameError('')
      setNameFieldBounce(false)
    }
  }, [isOpen, editingPtoActivity])

  const handleClose = () => {
    setNameError('')
    setNameFieldBounce(false)
    onClose()
  }

  const handleSave = () => {
    // Validate name
    const trimmedName = wizardData.name.trim()
    if (!trimmedName) {
      setNameError('Name is required')
      setNameFieldBounce(true)
      setTimeout(() => setNameFieldBounce(false), 500)
      return
    }

    // Call onSave with the activity data and editing ID
    onSave(
      {
        name: trimmedName,
        developers: wizardData.developers,
        duration: wizardData.duration
      },
      editingPtoActivity?.id || null
    )

    handleClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={editingPtoActivity ? "Edit PTO or Activity" : "Add PTO / Activity"}
      titleSize="text-3xl"
      titleCentered={true}
    >
      <div>
        {/* Activity Name */}
        <FormField label="Name" required align="left">
          <input
            type="text"
            value={wizardData.name}
            onChange={(e) => {
              setWizardData(prev => ({ ...prev, name: e.target.value }))
              if (nameError) setNameError('')
            }}
            placeholder="e.g., Team Retreat, Holiday, Training"
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all ${
              nameError 
                ? 'border-red-500 dark:border-red-500 focus:ring-red-500' 
                : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
            } ${nameFieldBounce ? 'animate-bounce-horizontal' : ''}`}
            autoFocus
            required
          />
          {nameError && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{nameError}</p>
          )}
        </FormField>

        {/* Number of Developers */}
        <div className="mt-12">
          <CounterControls
            label="Number of Developers"
            value={wizardData.developers}
            min={1}
            max={teamMembers}
            onDecrease={() => setWizardData(prev => ({ ...prev, developers: Math.max(1, prev.developers - 1) }))}
            onIncrease={() => setWizardData(prev => ({ ...prev, developers: Math.min(teamMembers, prev.developers + 1) }))}
          />
          <Button
            onClick={() => setWizardData(prev => ({ ...prev, developers: teamMembers }))}
            variant="secondary"
            size="sm"
            className="mt-6 px-8 py-4 rounded-full mx-auto block"
          >
            All Devs ({teamMembers})
          </Button>
        </div>

        {/* Duration */}
        <div className="mt-12">
          <CounterControls
            label="Duration in Sprint Days (0.5 Day Increments)"
            value={wizardData.duration}
            min={0.5}
            max={sprintDays}
            step={0.5}
            onDecrease={() => setWizardData(prev => ({ ...prev, duration: Math.max(0.5, prev.duration - 0.5) }))}
            onIncrease={() => setWizardData(prev => ({ ...prev, duration: Math.min(sprintDays, prev.duration + 0.5) }))}
          />
        </div>
      </div>

      {/* Modal Actions */}
      <div className="flex gap-4 mt-8">
        <Button
          onClick={handleClose}
          variant="secondary"
          size="md"
          fullWidth
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="primary"
          size="md"
          fullWidth
          className={!wizardData.name.trim() ? 'opacity-50 cursor-not-allowed' : ''}
        >
          {editingPtoActivity ? 'Save Changes' : 'Add'}
        </Button>
      </div>
    </Modal>
  )
}

