'use client'

import Button from './Button'
import { getPluralSuffix } from '../utils/pluralize'

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
    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 flex items-center justify-between min-w-0 max-w-xs">
      <div className="text-left min-w-0 flex-1 mr-2">
        <h4 className="font-medium text-gray-900 dark:text-white text-left truncate">{activity.name}</h4>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-left">
          {activity.developers} dev{getPluralSuffix(activity.developers)} • {activity.duration} day{getPluralSuffix(activity.duration)}
        </p>
      </div>
      <Button
        onClick={() => onRemove(activity.id)}
        variant="ghost"
        size="sm"
        icon="delete"
        className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:ring-2 hover:ring-red-500 hover:rounded-lg flex-shrink-0"
        ariaLabel="Remove activity"
      />
    </div>
  )
}
