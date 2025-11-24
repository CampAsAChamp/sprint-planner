import ControlledNumberInput from '../ui/ControlledNumberInput'
import Divider from '../ui/Divider'
import NumberInput from '../ui/NumberInput'
import PTOActivitiesSection from '../pto_activity/PTOActivitiesSection'
import { PTOActivity } from '../../types/PTOActivity'

interface AnimationState {
  animating: boolean
  lastAction: 'increase' | 'decrease' | null
  setLastAction: (action: 'increase' | 'decrease') => void
}

interface SprintConfiguration {
  teamMembers: number
  sprintDays: number
  onCallTime: number
  rolloverPoints: number
  ptoActivities: PTOActivity[]
}

interface SprintPlannerFormProps {
  config: SprintConfiguration
  updateConfig: (updates: Partial<SprintConfiguration>) => void
  teamMembersAnimation: { animating: boolean }
  sprintDaysAnimation: AnimationState
  rolloverPointsAnimation: AnimationState
  onCallTimeAnimation: AnimationState
  onAddActivity: () => void
  onEditActivity: (id: string) => void
  onRemoveActivity: (id: string) => void
}

export default function SprintPlannerForm({
  config,
  updateConfig,
  teamMembersAnimation,
  sprintDaysAnimation,
  rolloverPointsAnimation,
  onCallTimeAnimation,
  onAddActivity,
  onEditActivity,
  onRemoveActivity
}: SprintPlannerFormProps) {
  return (
    <div className="lg:col-span-3">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border-2 border-gray-200 dark:border-gray-700 px-3 sm:px-6 md:px-8 lg:px-10 pt-4 sm:pt-6 md:pt-8 pb-2 overflow-hidden">
        {/* Team Members Input */}
        <NumberInput
          id="teamMembers"
          label="Developers"
          description="How many developers are working on this sprint?"
          value={config.teamMembers}
          min={1}
          onChange={(value) => updateConfig({ teamMembers: value })}
          animating={teamMembersAnimation.animating}
        />

        <Divider />

        {/* Sprint Days Input */}
        <ControlledNumberInput
          id="sprintDays"
          label="Sprint Duration"
          description="How many days is this sprint? [1-30]"
          value={config.sprintDays}
          min={1}
          max={30}
          onChange={(value) => {
            sprintDaysAnimation.setLastAction(value > config.sprintDays ? 'increase' : 'decrease')
            updateConfig({ sprintDays: value })
          }}
          quickSelectOptions={[
            { value: 5, label: '5 Days', ariaLabel: 'Set sprint duration to 5 (one week)' },
            { value: 10, label: '10 Days', ariaLabel: 'Set sprint duration to 10 (two weeks)' },
            { value: 30, label: '30 Days', ariaLabel: 'Set sprint duration to 30 (one month)' }
          ]}
          animating={sprintDaysAnimation.animating}
          lastAction={sprintDaysAnimation.lastAction}
          onIncrease={() => {
            sprintDaysAnimation.setLastAction('increase')
            updateConfig({ sprintDays: Math.min(30, config.sprintDays + 1) })
          }}
          onDecrease={() => {
            sprintDaysAnimation.setLastAction('decrease')
            updateConfig({ sprintDays: Math.max(1, config.sprintDays - 1) })
          }}
        />

        <Divider />

        {/* Rollover Points Input */}
        <ControlledNumberInput
          id="rolloverPoints"
          label="Rollover Points"
          description="How many story points are rolling over from the previous sprint?"
          value={config.rolloverPoints}
          min={0}
          onChange={(value) => {
            rolloverPointsAnimation.setLastAction(value > config.rolloverPoints ? 'increase' : 'decrease')
            updateConfig({ rolloverPoints: value })
          }}
          quickSelectOptions={[
            { value: 0, label: '0 Points', ariaLabel: 'Set rollover points to 0' },
            { value: 2, label: '2 Points', ariaLabel: 'Set rollover points to 2' },
            { value: 3, label: '3 Points', ariaLabel: 'Set rollover points to 3' }
          ]}
          animating={rolloverPointsAnimation.animating}
          lastAction={rolloverPointsAnimation.lastAction}
          onIncrease={() => {
            rolloverPointsAnimation.setLastAction('increase')
            updateConfig({ rolloverPoints: config.rolloverPoints + 1 })
          }}
          onDecrease={() => {
            rolloverPointsAnimation.setLastAction('decrease')
            updateConfig({ rolloverPoints: Math.max(0, config.rolloverPoints - 1) })
          }}
        />

        <Divider />

        {/* On-Call Time Input */}
        <ControlledNumberInput
          id="onCallTime"
          label="On-Call Time"
          description="How many points of on-call time during this sprint?"
          value={config.onCallTime}
          min={0}
          max={Math.max(0, (config.teamMembers * config.sprintDays) - config.ptoActivities.reduce((sum, activity) => sum + (activity.developers * activity.duration), 0))}
          onChange={(value) => {
            onCallTimeAnimation.setLastAction(value > config.onCallTime ? 'increase' : 'decrease')
            updateConfig({ onCallTime: value })
          }}
          quickSelectOptions={[
            { value: 0, label: '0 Points', ariaLabel: 'Set on-call time to 0 points' },
            { value: 1, label: '1 Point', ariaLabel: 'Set on-call time to 1 point' },
            { value: 3, label: '3 Points', ariaLabel: 'Set on-call time to 3 points' }
          ]}
          animating={onCallTimeAnimation.animating}
          lastAction={onCallTimeAnimation.lastAction}
          onIncrease={() => {
            onCallTimeAnimation.setLastAction('increase')
            const maxValue = Math.max(0, (config.teamMembers * config.sprintDays) - config.ptoActivities.reduce((sum, activity) => sum + (activity.developers * activity.duration), 0))
            updateConfig({ onCallTime: Math.min(maxValue, config.onCallTime + 1) })
          }}
          onDecrease={() => {
            onCallTimeAnimation.setLastAction('decrease')
            updateConfig({ onCallTime: Math.max(0, config.onCallTime - 1) })
          }}
        />

        <Divider />

        {/* PTO and Activities Section */}
        <PTOActivitiesSection
          ptoActivities={config.ptoActivities}
          onAddActivity={onAddActivity}
          onEditActivity={onEditActivity}
          onRemoveActivity={onRemoveActivity}
        />
      </div>
    </div>
  )
}

