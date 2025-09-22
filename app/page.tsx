'use client'

import { useEffect, useState } from 'react'

import ActivityItem from './components/ActivityItem'
import Button from './components/Button'
import CounterControls from './components/CounterControls'
import FormField from './components/FormField'
import Modal from './components/Modal'
import NumberInput from './components/NumberInput'
import { PTOActivity } from './types/PTOActivity'
import QuickSelect from './components/QuickSelect'
import SaveConfiguration from './components/SaveConfiguration'
import SprintCapacityOutput from './components/SprintCapacityOutput'
import Toast from './components/Toast'
import { getPluralSuffix } from './utils/pluralize'
import { useSprintConfiguration } from './hooks/useSprintConfiguration'

export default function Home() {
  const {
    config,
    updateConfig,
    saveConfiguration,
    loadConfiguration,
    deleteConfiguration,
    toast,
    showToast,
    hideToast
  } = useSprintConfiguration()
  
  const [showWizard, setShowWizard] = useState<boolean>(false)
  const [wizardData, setWizardData] = useState<{
    name: string
    developers: number
    duration: number
  }>({
    name: '',
    developers: 1,
    duration: 1
  })
  
  // Animation states for text inputs
  const [teamMembersAnimating, setTeamMembersAnimating] = useState<boolean>(false)
  const [sprintDaysAnimating, setSprintDaysAnimating] = useState<boolean>(false)
  const [sprintDaysLastAction, setSprintDaysLastAction] = useState<'increase' | 'decrease' | null>(null)
  const [onCallTimeAnimating, setOnCallTimeAnimating] = useState<boolean>(false)
  const [onCallTimeLastAction, setOnCallTimeLastAction] = useState<'increase' | 'decrease' | null>(null)
  
  // Animation effects
  useEffect(() => {
    setTeamMembersAnimating(true)
    const timer = setTimeout(() => setTeamMembersAnimating(false), 200)
    return () => clearTimeout(timer)
  }, [config.teamMembers])
  
  useEffect(() => {
    setSprintDaysAnimating(true)
    const timer = setTimeout(() => {
      setSprintDaysAnimating(false)
      setSprintDaysLastAction(null)
    }, 200)
    return () => clearTimeout(timer)
  }, [config.sprintDays])
  
  useEffect(() => {
    setOnCallTimeAnimating(true)
    const timer = setTimeout(() => {
      setOnCallTimeAnimating(false)
      setOnCallTimeLastAction(null)
    }, 200)
    return () => clearTimeout(timer)
  }, [config.onCallTime])

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-7xl mx-auto px-4 py-8 text-center">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-500 to-white bg-clip-text text-transparent dark:from-blue-300 dark:to-gray-300">
            Sprint Capacity Calculator
          </h1>
        </div>

        {/* Calculator Form */}
        <div className="max-w-full mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
            {/* Main Form */}
            <div className="lg:col-span-3">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border-2 border-gray-200 dark:border-gray-700 px-4 sm:px-8 md:px-12 lg:px-16 pt-8 sm:pt-12 md:pt-16 pb-2">
            {/* Team Members Input */}
            <NumberInput
              id="teamMembers"
              label="Number of Team Members"
              description="How many developers are working on this sprint?"
              value={config.teamMembers}
              min={1}
              onChange={(value) => updateConfig({ teamMembers: value })}
              animating={teamMembersAnimating}
            />

            {/* Divider */}
            <div className="border-t border-gray-200 dark:border-gray-600 my-6"></div>

            {/* Sprint Days Input */}
            <NumberInput
              id="sprintDays"
              label="Number of Sprint Days"
              description="How many days is this sprint? [1-30]"
              value={config.sprintDays}
              min={1}
              max={30}
              onChange={(value) => updateConfig({ sprintDays: value })}
              animating={sprintDaysAnimating}
              lastAction={sprintDaysLastAction}
              bottomMargin="mb-4"
            />
            
            {/* Quick Sprint Duration Buttons */}
            <QuickSelect
              title="Quick Select"
              options={[
                { value: 5, label: "5 Days", ariaLabel: "Set sprint duration to 5 (one week)" },
                { value: 10, label: "10 Days", ariaLabel: "Set sprint duration to 10 (two weeks)" },
                { value: 30, label: "30 Days", ariaLabel: "Set sprint duration to 30 (one month)" }
              ]}
              selectedValue={config.sprintDays}
              onSelect={(value) => updateConfig({ sprintDays: value })}
              onAnimationTrigger={(action) => {
                setSprintDaysLastAction(action)
                setSprintDaysAnimating(true)
                setTimeout(() => {
                  setSprintDaysAnimating(false)
                  setSprintDaysLastAction(null)
                }, 200)
              }}
              showDuration={true}
            />

            {/* Divider */}
            <div className="border-t border-gray-200 dark:border-gray-600 my-6"></div>

            {/* PTO and Activities Section */}
            <div className="mb-12">
              <label className="block text-xl font-medium text-gray-700 dark:text-gray-300 mb-2 text-center">
                PTO & Activities
              </label>
              
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 text-center">
                Add planned time off and activities that will affect team capacity
              </p>
              
              {/* Add Entry Button */}
              <Button
                onClick={() => {
                  setWizardData({
                    name: '',
                    developers: 1,
                    duration: 1
                  })
                  setShowWizard(true)
                }}
                variant="secondary"
                size="lg"
                icon="plus"
                fullWidth
                className="h-16"
              >
                Add PTO or Activity
              </Button>

              {/* Activities List */}
              {config.ptoActivities.length > 0 && (
                <div className="mt-6 space-y-3">
                  {config.ptoActivities.map((activity) => (
                    <ActivityItem
                      key={activity.id}
                      activity={activity}
                      onRemove={(id) => updateConfig({ 
                        ptoActivities: config.ptoActivities.filter(item => item.id !== id) 
                      })}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 dark:border-gray-600 my-6"></div>

            {/* On-Call Time Input */}
            <NumberInput
              id="onCallTime"
              label="On-Call Time"
              description="How many days of on-call time during this sprint?"
              value={config.onCallTime}
              min={0}
              max={Math.max(0, (config.teamMembers * config.sprintDays) - config.ptoActivities.reduce((sum, activity) => sum + (activity.developers * activity.duration), 0))}
              onChange={(value) => updateConfig({ onCallTime: value })}
              animating={onCallTimeAnimating}
              lastAction={onCallTimeLastAction}
              bottomMargin="mb-4"
            />
            
            {/* Quick On-Call Duration Buttons */}
            <QuickSelect
              title="Quick Select"
              options={[
                { value: 0, label: "0 Days", ariaLabel: "Set on-call time to 0 days" },
                { value: 1, label: "1 Day", ariaLabel: "Set on-call time to 1 day" },
                { value: 2, label: "2 Days", ariaLabel: "Set on-call time to 2 days" }
              ]}
              selectedValue={config.onCallTime}
              onSelect={(value) => updateConfig({ onCallTime: value })}
              onAnimationTrigger={(action) => {
                setOnCallTimeLastAction(action)
                setOnCallTimeAnimating(true)
                setTimeout(() => {
                  setOnCallTimeAnimating(false)
                  setOnCallTimeLastAction(null)
                }, 200)
              }}
              showDuration={false}
            />
              </div>
            </div>

            {/* Capacity Display Sidebar */}
            <div className="lg:col-span-2">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 sm:p-6 lg:p-8 lg:sticky lg:top-8">
                <h3 className="text-xl font-medium text-blue-900 dark:text-blue-100 mb-8 text-center">
                  Current Configuration
                </h3>
                <div className="space-y-3">
                  {config.teamMembers > 0 ? (
                    <div className="flex justify-between items-center text-lg text-gray-700 dark:text-gray-300">
                      <span className="font-bold text-gray-900 dark:text-gray-100 text-left">Team Size</span>
                      <span className="font-semibold text-blue-700 dark:text-blue-200 text-right">{config.teamMembers} Member{getPluralSuffix(config.teamMembers)}</span>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center text-lg text-gray-500 dark:text-gray-400">
                      <span className="font-bold text-gray-900 dark:text-gray-100 text-left">Team Size</span>
                      <span className="font-semibold text-gray-500 dark:text-gray-400 text-right">Not set</span>
                    </div>
                  )}
                  
                  {config.sprintDays > 0 ? (
                    <div className="flex justify-between items-center text-lg text-gray-700 dark:text-gray-300">
                      <span className="font-bold text-gray-900 dark:text-gray-100 text-left">Sprint Duration</span>
                      <span className="font-semibold text-blue-700 dark:text-blue-200 text-right">{config.sprintDays} Day{getPluralSuffix(config.sprintDays)}</span>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center text-lg text-gray-500 dark:text-gray-400">
                      <span className="font-bold text-gray-900 dark:text-gray-100 text-left">Sprint Duration</span>
                      <span className="font-semibold text-gray-500 dark:text-gray-400 text-right">Not set</span>
                    </div>
                  )}
                  
                  {config.ptoActivities.length > 0 ? (
                    <div className="mt-4">
                      <div className="flex justify-between items-center text-lg text-gray-700 dark:text-gray-300 mb-2">
                        <span className="font-bold text-gray-900 dark:text-gray-100 whitespace-nowrap text-left">PTO & Activities</span>
                        <span className="font-semibold text-blue-700 dark:text-blue-200 text-right">{config.ptoActivities.length} Planned</span>
                      </div>
                      <div className="text-sm text-blue-600 dark:text-blue-300 space-y-1">
                        {config.ptoActivities.map((activity) => (
                          <p key={activity.id} className="text-left">
                            {activity.name}: {activity.developers} dev{getPluralSuffix(activity.developers)} × {activity.duration} Day{getPluralSuffix(activity.duration)}
                          </p>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center text-lg text-gray-500 dark:text-gray-400">
                      <span className="font-bold text-gray-900 dark:text-gray-100 whitespace-nowrap text-left">PTO & Activities</span>
                      <span className="font-semibold text-gray-500 dark:text-gray-400 text-right">None</span>
                    </div>
                  )}
                  
                  {config.onCallTime > 0 ? (
                    <div className="flex justify-between items-center text-lg text-gray-700 dark:text-gray-300">
                      <span className="font-bold text-gray-900 dark:text-gray-100 text-left">On-Call Time</span>
                      <span className="font-semibold text-blue-700 dark:text-blue-200 text-right">{config.onCallTime} Day{getPluralSuffix(config.onCallTime)}</span>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center text-lg text-gray-500 dark:text-gray-400">
                      <span className="font-bold text-gray-900 dark:text-gray-100 text-left">On-Call Time</span>
                      <span className="font-semibold text-gray-500 dark:text-gray-400 text-right">None</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Sprint Capacity Calculation */}
              <SprintCapacityOutput 
                teamMembers={config.teamMembers}
                sprintDays={config.sprintDays}
                ptoActivities={config.ptoActivities}
                onCallTime={config.onCallTime}
              />
              
              {/* Save Configuration */}
              <SaveConfiguration
                teamMembers={config.teamMembers}
                sprintDays={config.sprintDays}
                ptoActivities={config.ptoActivities}
                onCallTime={config.onCallTime}
                onShowToast={showToast}
                onLoadConfiguration={loadConfiguration}
                onDeleteConfiguration={deleteConfiguration}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Wizard Modal */}
      <Modal
        isOpen={showWizard}
        onClose={() => setShowWizard(false)}
        title="Add PTO or Activity"
        titleSize="text-3xl"
        titleCentered={true}
      >
        <div>
          {/* Activity Name */}
          <FormField label="Name">
            <input
              type="text"
              value={wizardData.name}
              onChange={(e) => setWizardData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Team Retreat, Holiday, Training"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              autoFocus
            />
          </FormField>

          {/* Number of Developers */}
          <div className="mt-12">
            <CounterControls
              label="Number of Developers"
              value={wizardData.developers}
              min={1}
              max={config.teamMembers}
              onDecrease={() => setWizardData(prev => ({ ...prev, developers: Math.max(1, prev.developers - 1) }))}
              onIncrease={() => setWizardData(prev => ({ ...prev, developers: Math.min(config.teamMembers, prev.developers + 1) }))}
            />
            <Button
              onClick={() => setWizardData(prev => ({ ...prev, developers: config.teamMembers }))}
              variant="secondary"
              size="sm"
              fullWidth
              className="mt-6"
            >
              Select All Developers ({config.teamMembers})
            </Button>
          </div>

          {/* Duration */}
          <div className="mt-12">
            <CounterControls
              label="Duration in Sprint Days (0.5 Day Increments)"
              value={wizardData.duration}
              min={0.5}
              max={config.sprintDays}
              step={0.5}
              onDecrease={() => setWizardData(prev => ({ ...prev, duration: Math.max(0.5, prev.duration - 0.5) }))}
              onIncrease={() => setWizardData(prev => ({ ...prev, duration: Math.min(config.sprintDays, prev.duration + 0.5) }))}
            />
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex gap-4 mt-8">
          <Button
            onClick={() => setShowWizard(false)}
            variant="secondary"
            size="md"
            fullWidth
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              const newActivity: PTOActivity = {
                id: Date.now().toString(),
                name: wizardData.name.trim() || 'Untitled Activity',
                developers: wizardData.developers,
                duration: wizardData.duration
              }
              updateConfig({ 
                ptoActivities: [...config.ptoActivities, newActivity] 
              })
              setShowWizard(false)
            }}
            variant="primary"
            size="md"
            fullWidth
          >
            Add Activity
          </Button>
        </div>
      </Modal>

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </main>
  )
}
