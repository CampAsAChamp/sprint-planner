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

interface ConfigurationPreviewProps {
  config: SprintConfiguration
}

export default function ConfigurationPreview({ config }: ConfigurationPreviewProps) {
  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="font-medium text-gray-900 dark:text-gray-100">Team Size:</span>
          <span className="text-blue-600 dark:text-blue-400 font-medium">
            {config.teamMembers} {config.teamMembers === 1 ? 'Member' : 'Members'}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-medium text-gray-900 dark:text-gray-100">Sprint Duration:</span>
          <span className="text-blue-600 dark:text-blue-400 font-medium">
            {config.sprintDays} {config.sprintDays === 1 ? 'Day' : 'Days'}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-medium text-gray-900 dark:text-gray-100">Rollover Points:</span>
          <span className="text-blue-600 dark:text-blue-400 font-medium">
            {config.rolloverPoints > 0 ? `${config.rolloverPoints} Points` : 'None'}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-medium text-gray-900 dark:text-gray-100">PTO & Activities:</span>
          <span className="text-blue-600 dark:text-blue-400 font-medium">
            {config.ptoActivities.length > 0 ? `${config.ptoActivities.length} Activities` : 'None'}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-medium text-gray-900 dark:text-gray-100">On-Call Time:</span>
          <span className="text-blue-600 dark:text-blue-400 font-medium">
            {config.onCallTime > 0 ? `${config.onCallTime} Point${config.onCallTime === 1 ? '' : 's'}` : 'None'}
          </span>
        </div>
      </div>
    </div>
  )
}

