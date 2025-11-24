import React from 'react'
import { PTOActivity } from '@/app/types/PTOActivity'
import { getPluralSuffix } from '@/app/utils/pluralize'

interface CurrentConfigurationSummaryProps {
  configName?: string
  teamMembers: number
  sprintDays: number
  rolloverPoints: number
  onCallTime: number
  ptoActivities: PTOActivity[]
}

export default function CurrentConfigurationSummary({
  configName,
  teamMembers,
  sprintDays,
  rolloverPoints,
  onCallTime,
  ptoActivities
}: CurrentConfigurationSummaryProps) {
  const isDefaultConfig = !configName || configName === 'Default Configuration'
  return (
    <div className="bg-blue-100 dark:bg-blue-900/20 border border-blue-400 dark:border-blue-800 rounded-lg p-4 sm:p-6 lg:p-8">
      <h3 className="text-xl font-medium text-blue-900 dark:text-blue-100 text-center">
        Current Configuration
      </h3>
      {!isDefaultConfig && (
        <p className="text-sm text-blue-600 dark:text-blue-300 text-center mt-1 mb-6 font-medium">
          {configName}
        </p>
      )}
      {isDefaultConfig && <div className="mb-8"></div>}
      <div className="space-y-3">
        {/* Team Size */}
        {teamMembers > 0 ? (
          <div className="flex justify-between items-center text-lg text-gray-700 dark:text-gray-300">
            <span className="font-bold text-gray-900 dark:text-gray-100 text-left">Team Size</span>
            <span className="font-semibold text-blue-700 dark:text-blue-200 text-right">
              {teamMembers} Dev{getPluralSuffix(teamMembers)}
            </span>
          </div>
        ) : (
          <div className="flex justify-between items-center text-lg text-gray-500 dark:text-gray-400">
            <span className="font-bold text-gray-900 dark:text-gray-100 text-left">Team Size</span>
            <span className="font-semibold text-gray-500 dark:text-gray-400 text-right">Not set</span>
          </div>
        )}
        
        {/* Sprint Duration */}
        {sprintDays > 0 ? (
          <div className="flex justify-between items-center text-lg text-gray-700 dark:text-gray-300">
            <span className="font-bold text-gray-900 dark:text-gray-100 text-left">Sprint Duration</span>
            <span className="font-semibold text-blue-700 dark:text-blue-200 text-right">
              {sprintDays} Day{getPluralSuffix(sprintDays)}
            </span>
          </div>
        ) : (
          <div className="flex justify-between items-center text-lg text-gray-500 dark:text-gray-400">
            <span className="font-bold text-gray-900 dark:text-gray-100 text-left">Sprint Duration</span>
            <span className="font-semibold text-gray-500 dark:text-gray-400 text-right">Not set</span>
          </div>
        )}
        
        {/* Rollover Points */}
        {rolloverPoints > 0 ? (
          <div className="flex justify-between items-center text-lg text-gray-700 dark:text-gray-300">
            <span className="font-bold text-gray-900 dark:text-gray-100 text-left">Rollover Points</span>
            <span className="font-semibold text-blue-700 dark:text-blue-200 text-right">
              {rolloverPoints} Point{getPluralSuffix(rolloverPoints)}
            </span>
          </div>
        ) : (
          <div className="flex justify-between items-center text-lg text-gray-500 dark:text-gray-400">
            <span className="font-bold text-gray-900 dark:text-gray-100 text-left">Rollover Points</span>
            <span className="font-semibold text-gray-500 dark:text-gray-400 text-right">None</span>
          </div>
        )}
        
        {/* On-Call Time */}
        {onCallTime > 0 ? (
          <div className="flex justify-between items-center text-lg text-gray-700 dark:text-gray-300">
            <span className="font-bold text-gray-900 dark:text-gray-100 text-left">On-Call Time</span>
            <span className="font-semibold text-blue-700 dark:text-blue-200 text-right">
              {onCallTime} Point{getPluralSuffix(onCallTime)}
            </span>
          </div>
        ) : (
          <div className="flex justify-between items-center text-lg text-gray-500 dark:text-gray-400">
            <span className="font-bold text-gray-900 dark:text-gray-100 text-left">On-Call Time</span>
            <span className="font-semibold text-gray-500 dark:text-gray-400 text-right">None</span>
          </div>
        )}

        {/* PTO & Activities */}
        {ptoActivities.length > 0 ? (
          <div className="mt-4">
            <div className="flex justify-between items-center text-lg text-gray-700 dark:text-gray-300 mb-2">
              <span className="font-bold text-gray-900 dark:text-gray-100 whitespace-nowrap text-left">
                PTO & Activities
              </span>
              <span className="font-semibold text-blue-700 dark:text-blue-200 text-right">
                {ptoActivities.length} Planned
              </span>
            </div>
            <div className="text-sm text-blue-600 dark:text-blue-300 space-y-1">
              {ptoActivities.map((activity) => (
                <p key={activity.id} className="text-left">
                  {activity.name}: {activity.developers} dev{getPluralSuffix(activity.developers)} × {activity.duration} Day{getPluralSuffix(activity.duration)}
                </p>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex justify-between items-center text-lg text-gray-500 dark:text-gray-400">
            <span className="font-bold text-gray-900 dark:text-gray-100 whitespace-nowrap text-left">
              PTO & Activities
            </span>
            <span className="font-semibold text-gray-500 dark:text-gray-400 text-right">None</span>
          </div>
        )}
      </div>
    </div>
  )
}


