import React from 'react'
import ActivityItem from './ActivityItem'
import Button from '../ui/Button'
import { PTOActivity } from '../../types/PTOActivity'

interface PTOActivitiesSectionProps {
  ptoActivities: PTOActivity[]
  onAddActivity: () => void
  onEditActivity: (id: string) => void
  onRemoveActivity: (id: string) => void
}

export default function PTOActivitiesSection({
  ptoActivities,
  onAddActivity,
  onEditActivity,
  onRemoveActivity
}: PTOActivitiesSectionProps) {
  return (
    <div className="mb-8">
      <label className="block text-xl font-medium text-gray-700 dark:text-gray-300 mb-2 text-center">
        PTO & Activities
      </label>
      
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 text-center">
        Add planned time off and activities that will affect team capacity
      </p>
      
      {/* Add Entry Button */}
      <Button
        onClick={onAddActivity}
        variant="secondary"
        size="lg"
        icon="plus"
        fullWidth
        className="h-12"
      >
        Add PTO / Activity
      </Button>

      {/* Activities List */}
      {ptoActivities.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-3">
          {ptoActivities.map((activity) => (
            <div key={activity.id} className="flex-shrink-0 min-w-0">
              <ActivityItem
                activity={activity}
                onRemove={onRemoveActivity}
                onEdit={onEditActivity}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

