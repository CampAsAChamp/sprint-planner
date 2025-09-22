'use client'

import Button from './Button'

interface PTOActivity {
  id: string
  name: string
  developers: number
  duration: number
}

interface ActivityItemProps {
  activity: PTOActivity
  onRemove: (id: string) => void
}

export default function ActivityItem({ activity, onRemove }: ActivityItemProps) {
  return (
    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 flex items-center justify-between">
      <div>
        <h4 className="font-medium text-gray-900 dark:text-white">{activity.name}</h4>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {activity.developers} developer{activity.developers !== 1 ? 's' : ''} • {activity.duration} day{activity.duration !== 1 ? 's' : ''}
        </p>
      </div>
      <Button
        onClick={() => onRemove(activity.id)}
        variant="ghost"
        size="sm"
        icon="delete"
        className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:ring-2 hover:ring-red-500 hover:rounded-lg"
        ariaLabel="Remove activity"
      />
    </div>
  )
}
