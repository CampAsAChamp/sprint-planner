'use client'

import Button from '../ui/Button'
import { getPluralSuffix } from '../../utils/pluralize'

interface PTOActivity {
  id: string
  name: string
  developers: number
  duration: number
}

interface ActivityItemProps {
  activity: PTOActivity
  onRemove: (id: string) => void
  onEdit: (id: string) => void
}

export default function ActivityItem({ activity, onRemove, onEdit }: ActivityItemProps) {
  return (
    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 flex items-center justify-between min-w-0 max-w-md">
      <div className="text-left min-w-0 flex-1 mr-3">
        <h4 className="font-medium text-gray-900 dark:text-white text-left truncate">{activity.name}</h4>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-left">
          {activity.developers} dev{getPluralSuffix(activity.developers)} • {activity.duration} day{getPluralSuffix(activity.duration)}
        </p>
      </div>
      <div className="flex items-center gap-0.5 flex-shrink-0">
        <Button
          onClick={() => onEdit(activity.id)}
          variant="ghost"
          size="sm"
          className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:ring-2 hover:ring-blue-500 w-11 h-11 p-1"
          ariaLabel="Edit activity"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </Button>
        <Button
          onClick={() => onRemove(activity.id)}
          variant="ghost"
          size="sm"
          icon="delete"
          className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:ring-2 hover:ring-red-500 w-11 h-11 p-1"
          ariaLabel="Remove activity"
        />
      </div>
    </div>
  )
}
