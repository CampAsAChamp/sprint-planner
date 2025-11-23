'use client'

import { useEffect, useState } from 'react'

import ActivityItem from './components/ActivityItem'
import Button from './components/Button'
import CounterControls from './components/CounterControls'
import FormField from './components/FormField'
import GitHubLogo from './components/GitHubLogo'
import Modal from './components/Modal'
import NumberInput from './components/NumberInput'
import { PTOActivity } from './types/PTOActivity'
import SaveConfiguration from './components/SaveConfiguration'
import SprintCapacityOutput from './components/SprintCapacityOutput'
import ThemeToggle from './components/ThemeToggle'
import Toast from './components/Toast'
import { getPluralSuffix } from './utils/pluralize'
import { useSprintConfiguration } from './hooks/useSprintConfiguration'

export default function Home() {
  const {
    config,
    configurations,
    currentConfigId,
    updateConfig,
    createConfiguration,
    duplicateConfiguration,
    updateConfigurationName,
    deleteConfiguration,
    switchToConfiguration,
    toast,
    showToast,
    hideToast
  } = useSprintConfiguration()
  
  const [showWizard, setShowWizard] = useState<boolean>(false)
  const [editingActivityId, setEditingActivityId] = useState<string | null>(null)
  const [wizardData, setWizardData] = useState<{
    name: string
    developers: number
    duration: number
  }>({
    name: '',
    developers: 1,
    duration: 1
  })
  const [nameError, setNameError] = useState<string>('')
  const [nameFieldBounce, setNameFieldBounce] = useState<boolean>(false)
  
  // Animation states for text inputs
  const [teamMembersAnimating, setTeamMembersAnimating] = useState<boolean>(false)
  const [sprintDaysAnimating, setSprintDaysAnimating] = useState<boolean>(false)
  const [sprintDaysLastAction, setSprintDaysLastAction] = useState<'increase' | 'decrease' | null>(null)
  const [onCallTimeAnimating, setOnCallTimeAnimating] = useState<boolean>(false)
  const [onCallTimeLastAction, setOnCallTimeLastAction] = useState<'increase' | 'decrease' | null>(null)
  const [rolloverPointsAnimating, setRolloverPointsAnimating] = useState<boolean>(false)
  const [rolloverPointsLastAction, setRolloverPointsLastAction] = useState<'increase' | 'decrease' | null>(null)
  
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

  useEffect(() => {
    setRolloverPointsAnimating(true)
    const timer = setTimeout(() => {
      setRolloverPointsAnimating(false)
      setRolloverPointsLastAction(null)
    }, 200)
    return () => clearTimeout(timer)
  }, [config.rolloverPoints])

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Theme Toggle */}
      <ThemeToggle />
      
      <div className="w-full max-w-7xl mx-auto px-4 py-8 text-center">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-900 bg-clip-text text-transparent dark:from-blue-300 dark:to-gray-300">
            Sprint Capacity Calculator
          </h1>
        </div>

        {/* Calculator Form */}
        <div className="max-w-full mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
            {/* Main Form */}
            <div className="lg:col-span-3">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border-2 border-gray-200 dark:border-gray-700 px-3 sm:px-6 md:px-8 lg:px-10 pt-4 sm:pt-6 md:pt-8 pb-2 overflow-hidden">
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
            <div className="mb-3">
              <FormField
                label="Number of Sprint Days"
                description="How many days is this sprint? [1-30]"
                className="mb-0"
              >
                <div className="flex items-center justify-center h-10 sm:h-12 gap-1 sm:gap-2">
                  {/* Number Input */}
                  <input
                    type="number"
                    id="sprintDays"
                    min={1}
                    max={30}
                    value={config.sprintDays || ''}
                    onChange={(e) => {
                      const inputValue = parseInt(e.target.value) || 0;
                      if (inputValue >= 1 && inputValue <= 30) {
                        updateConfig({ sprintDays: inputValue });
                      }
                    }}
                    className={`w-20 sm:w-24 h-10 sm:h-12 px-1 sm:px-3 text-center border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 transition-all duration-200 font-medium text-sm sm:text-base md:text-lg lg:text-xl [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                      !sprintDaysAnimating 
                        ? 'scale-100 text-gray-900 dark:text-white' 
                        : sprintDaysLastAction === 'decrease' 
                          ? 'scale-105 ring-2 ring-red-500 border-red-400 dark:border-red-500 text-red-600 dark:text-red-400'
                          : sprintDaysLastAction === 'increase'
                            ? 'scale-105 ring-2 ring-blue-500 border-blue-400 dark:border-blue-500 text-blue-600 dark:text-blue-400'
                            : 'scale-100 text-gray-900 dark:text-white'
                    }`}
                    placeholder="0"
                  />

                  {/* Minus Button */}
                  <Button
                    onClick={() => {
                      setSprintDaysLastAction('decrease')
                      setSprintDaysAnimating(true)
                      updateConfig({ sprintDays: Math.max(1, config.sprintDays - 1) })
                    }}
                    disabled={config.sprintDays <= 1}
                    variant="secondary"
                    size="sm"
                    icon="minus"
                    className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10"
                    ariaLabel="Decrease sprint days"
                  />

                  {/* Plus Button */}
                  <Button
                    onClick={() => {
                      setSprintDaysLastAction('increase')
                      setSprintDaysAnimating(true)
                      updateConfig({ sprintDays: Math.min(30, config.sprintDays + 1) })
                    }}
                    disabled={config.sprintDays >= 30}
                    variant="secondary"
                    size="sm"
                    icon="plus"
                    className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10"
                    ariaLabel="Increase sprint days"
                  />

                  {/* Separator */}
                  <div className="w-px h-8 sm:h-10 bg-gray-300 dark:bg-gray-600 mx-2"></div>

                  {/* Quick Select Buttons */}
                  <div className="flex gap-1 sm:gap-2">
                    <Button
                      onClick={() => {
                        const newValue = 5
                        setSprintDaysLastAction(newValue > config.sprintDays ? 'increase' : 'decrease')
                        setSprintDaysAnimating(true)
                        updateConfig({ sprintDays: newValue })
                      }}
                      variant={config.sprintDays === 5 ? 'primary' : 'secondary'}
                      size="sm"
                      className="h-8 sm:h-10 min-w-[50px] sm:min-w-[60px] rounded-full text-xs sm:text-sm"
                      ariaLabel="Set sprint duration to 5 (one week)"
                    >
                      5 Days
                    </Button>
                    <Button
                      onClick={() => {
                        const newValue = 10
                        setSprintDaysLastAction(newValue > config.sprintDays ? 'increase' : 'decrease')
                        setSprintDaysAnimating(true)
                        updateConfig({ sprintDays: newValue })
                      }}
                      variant={config.sprintDays === 10 ? 'primary' : 'secondary'}
                      size="sm"
                      className="h-8 sm:h-10 min-w-[50px] sm:min-w-[60px] rounded-full text-xs sm:text-sm"
                      ariaLabel="Set sprint duration to 10 (two weeks)"
                    >
                      10 Days
                    </Button>
                    <Button
                      onClick={() => {
                        const newValue = 30
                        setSprintDaysLastAction(newValue > config.sprintDays ? 'increase' : 'decrease')
                        setSprintDaysAnimating(true)
                        updateConfig({ sprintDays: newValue })
                      }}
                      variant={config.sprintDays === 30 ? 'primary' : 'secondary'}
                      size="sm"
                      className="h-8 sm:h-10 min-w-[50px] sm:min-w-[60px] rounded-full text-xs sm:text-sm"
                      ariaLabel="Set sprint duration to 30 (one month)"
                    >
                      30 Days
                    </Button>
                  </div>
                </div>
              </FormField>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 dark:border-gray-600 my-6"></div>

            {/* Rollover Points Input */}
            <div className="mb-3">
              <FormField
                label="Rollover Points from Previous Sprint"
                description="How many story points are rolling over from the previous sprint?"
                className="mb-0"
              >
                <div className="flex items-center justify-center h-10 sm:h-12 gap-1 sm:gap-2">
                  {/* Number Input */}
                  <input
                    type="number"
                    id="rolloverPoints"
                    min={0}
                    value={config.rolloverPoints || ''}
                    onChange={(e) => {
                      const inputValue = parseInt(e.target.value) || 0;
                      if (inputValue >= 0) {
                        updateConfig({ rolloverPoints: inputValue });
                      }
                    }}
                    className={`w-20 sm:w-24 h-10 sm:h-12 px-1 sm:px-3 text-center border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 transition-all duration-200 font-medium text-sm sm:text-base md:text-lg lg:text-xl [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                      !rolloverPointsAnimating 
                        ? 'scale-100 text-gray-900 dark:text-white' 
                        : rolloverPointsLastAction === 'decrease' 
                          ? 'scale-105 ring-2 ring-red-500 border-red-400 dark:border-red-500 text-red-600 dark:text-red-400'
                          : rolloverPointsLastAction === 'increase'
                            ? 'scale-105 ring-2 ring-blue-500 border-blue-400 dark:border-blue-500 text-blue-600 dark:text-blue-400'
                            : 'scale-100 text-gray-900 dark:text-white'
                    }`}
                    placeholder="0"
                  />

                  {/* Minus Button */}
                  <Button
                    onClick={() => {
                      setRolloverPointsLastAction('decrease')
                      setRolloverPointsAnimating(true)
                      updateConfig({ rolloverPoints: Math.max(0, config.rolloverPoints - 1) })
                    }}
                    disabled={config.rolloverPoints <= 0}
                    variant="secondary"
                    size="sm"
                    icon="minus"
                    className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10"
                    ariaLabel="Decrease rollover points"
                  />

                  {/* Plus Button */}
                  <Button
                    onClick={() => {
                      setRolloverPointsLastAction('increase')
                      setRolloverPointsAnimating(true)
                      updateConfig({ rolloverPoints: config.rolloverPoints + 1 })
                    }}
                    variant="secondary"
                    size="sm"
                    icon="plus"
                    className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10"
                    ariaLabel="Increase rollover points"
                  />

                  {/* Separator */}
                  <div className="w-px h-8 sm:h-10 bg-gray-300 dark:bg-gray-600 mx-2"></div>

                  {/* Quick Select Buttons */}
                  <div className="flex gap-1 sm:gap-2">
                    <Button
                      onClick={() => {
                        const newValue = 0
                        setRolloverPointsLastAction(newValue > config.rolloverPoints ? 'increase' : 'decrease')
                        setRolloverPointsAnimating(true)
                        updateConfig({ rolloverPoints: newValue })
                      }}
                      variant={config.rolloverPoints === 0 ? 'primary' : 'secondary'}
                      size="sm"
                      className="h-8 sm:h-10 min-w-[50px] sm:min-w-[60px] rounded-full text-xs sm:text-sm"
                      ariaLabel="Set rollover points to 0"
                    >
                      0 Points
                    </Button>
                    <Button
                      onClick={() => {
                        const newValue = 2
                        setRolloverPointsLastAction(newValue > config.rolloverPoints ? 'increase' : 'decrease')
                        setRolloverPointsAnimating(true)
                        updateConfig({ rolloverPoints: newValue })
                      }}
                      variant={config.rolloverPoints === 2 ? 'primary' : 'secondary'}
                      size="sm"
                      className="h-8 sm:h-10 min-w-[50px] sm:min-w-[60px] rounded-full text-xs sm:text-sm"
                      ariaLabel="Set rollover points to 2"
                    >
                      2 Points
                    </Button>
                    <Button
                      onClick={() => {
                        const newValue = 3
                        setRolloverPointsLastAction(newValue > config.rolloverPoints ? 'increase' : 'decrease')
                        setRolloverPointsAnimating(true)
                        updateConfig({ rolloverPoints: newValue })
                      }}
                      variant={config.rolloverPoints === 3 ? 'primary' : 'secondary'}
                      size="sm"
                      className="h-8 sm:h-10 min-w-[50px] sm:min-w-[60px] rounded-full text-xs sm:text-sm"
                      ariaLabel="Set rollover points to 3"
                    >
                      3 Points
                    </Button>
                  </div>
                </div>
              </FormField>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 dark:border-gray-600 my-6"></div>

            {/* On-Call Time Input */}
            <div className="mb-3">
              <FormField
                label="On-Call Time"
                description="How many points of on-call time during this sprint?"
                className="mb-0"
              >
                <div className="flex items-center justify-center h-10 sm:h-12 gap-1 sm:gap-2">
                  {/* Number Input */}
                  <input
                    type="number"
                    id="onCallTime"
                    min={0}
                    max={Math.max(0, (config.teamMembers * config.sprintDays) - config.ptoActivities.reduce((sum, activity) => sum + (activity.developers * activity.duration), 0))}
                    value={config.onCallTime || ''}
                    onChange={(e) => {
                      const inputValue = parseInt(e.target.value) || 0;
                      const maxValue = Math.max(0, (config.teamMembers * config.sprintDays) - config.ptoActivities.reduce((sum, activity) => sum + (activity.developers * activity.duration), 0));
                      if (inputValue >= 0 && inputValue <= maxValue) {
                        updateConfig({ onCallTime: inputValue });
                      }
                    }}
                    className={`w-20 sm:w-24 h-10 sm:h-12 px-1 sm:px-3 text-center border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 transition-all duration-200 font-medium text-sm sm:text-base md:text-lg lg:text-xl [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                      !onCallTimeAnimating 
                        ? 'scale-100 text-gray-900 dark:text-white' 
                        : onCallTimeLastAction === 'decrease' 
                          ? 'scale-105 ring-2 ring-red-500 border-red-400 dark:border-red-500 text-red-600 dark:text-red-400'
                          : onCallTimeLastAction === 'increase'
                            ? 'scale-105 ring-2 ring-blue-500 border-blue-400 dark:border-blue-500 text-blue-600 dark:text-blue-400'
                            : 'scale-100 text-gray-900 dark:text-white'
                    }`}
                    placeholder="0"
                  />

                  {/* Minus Button */}
                  <Button
                    onClick={() => {
                      setOnCallTimeLastAction('decrease')
                      setOnCallTimeAnimating(true)
                      updateConfig({ onCallTime: Math.max(0, config.onCallTime - 1) })
                    }}
                    disabled={config.onCallTime <= 0}
                    variant="secondary"
                    size="sm"
                    icon="minus"
                    className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10"
                    ariaLabel="Decrease on-call time"
                  />

                  {/* Plus Button */}
                  <Button
                    onClick={() => {
                      setOnCallTimeLastAction('increase')
                      setOnCallTimeAnimating(true)
                      const maxValue = Math.max(0, (config.teamMembers * config.sprintDays) - config.ptoActivities.reduce((sum, activity) => sum + (activity.developers * activity.duration), 0));
                      updateConfig({ onCallTime: Math.min(maxValue, config.onCallTime + 1) });
                    }}
                    disabled={config.onCallTime >= Math.max(0, (config.teamMembers * config.sprintDays) - config.ptoActivities.reduce((sum, activity) => sum + (activity.developers * activity.duration), 0))}
                    variant="secondary"
                    size="sm"
                    icon="plus"
                    className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10"
                    ariaLabel="Increase on-call time"
                  />

                  {/* Separator */}
                  <div className="w-px h-8 sm:h-10 bg-gray-300 dark:bg-gray-600 mx-2"></div>

                  {/* Quick Select Buttons */}
                  <div className="flex gap-1 sm:gap-2">
                    <Button
                      onClick={() => {
                        const newValue = 0
                        setOnCallTimeLastAction(newValue > config.onCallTime ? 'increase' : 'decrease')
                        setOnCallTimeAnimating(true)
                        updateConfig({ onCallTime: newValue })
                      }}
                      variant={config.onCallTime === 0 ? 'primary' : 'secondary'}
                      size="sm"
                      className="h-8 sm:h-10 min-w-[50px] sm:min-w-[60px] rounded-full text-xs sm:text-sm"
                      ariaLabel="Set on-call time to 0 points"
                    >
                      0 Points
                    </Button>
                    <Button
                      onClick={() => {
                        const newValue = 1
                        setOnCallTimeLastAction(newValue > config.onCallTime ? 'increase' : 'decrease')
                        setOnCallTimeAnimating(true)
                        updateConfig({ onCallTime: newValue })
                      }}
                      variant={config.onCallTime === 1 ? 'primary' : 'secondary'}
                      size="sm"
                      className="h-8 sm:h-10 min-w-[50px] sm:min-w-[60px] rounded-full text-xs sm:text-sm"
                      ariaLabel="Set on-call time to 1 point"
                    >
                      1 Point
                    </Button>
                    <Button
                      onClick={() => {
                        const newValue = 3
                        setOnCallTimeLastAction(newValue > config.onCallTime ? 'increase' : 'decrease')
                        setOnCallTimeAnimating(true)
                        updateConfig({ onCallTime: newValue })
                      }}
                      variant={config.onCallTime === 3 ? 'primary' : 'secondary'}
                      size="sm"
                      className="h-8 sm:h-10 min-w-[50px] sm:min-w-[60px] rounded-full text-xs sm:text-sm"
                      ariaLabel="Set on-call time to 3 points"
                    >
                      3 Points
                    </Button>
                  </div>
                </div>
              </FormField>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 dark:border-gray-600 my-6"></div>

            {/* PTO and Activities Section */}
            <div className="mb-8">
              <label className="block text-xl font-medium text-gray-700 dark:text-gray-300 mb-2 text-center">
                PTO & Activities
              </label>
              
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 text-center">
                Add planned time off and activities that will affect team capacity
              </p>
              
              {/* Add Entry Button */}
              <Button
                onClick={() => {
                  setEditingActivityId(null)
                  setWizardData({
                    name: '',
                    developers: 1,
                    duration: 1
                  })
                  setNameError('')
                  setNameFieldBounce(false)
                  setShowWizard(true)
                }}
                variant="secondary"
                size="lg"
                icon="plus"
                fullWidth
                className="h-12"
              >
                Add PTO / Activity
              </Button>

              {/* Activities List */}
              {config.ptoActivities.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-3">
                  {config.ptoActivities.map((activity) => (
                    <div key={activity.id} className="flex-shrink-0 min-w-0">
                      <ActivityItem
                        activity={activity}
                        onRemove={(id) => updateConfig({ 
                          ptoActivities: config.ptoActivities.filter(item => item.id !== id) 
                        })}
                        onEdit={(id) => {
                          const activityToEdit = config.ptoActivities.find(item => item.id === id)
                          if (activityToEdit) {
                            setEditingActivityId(id)
                            setWizardData({
                              name: activityToEdit.name,
                              developers: activityToEdit.developers,
                              duration: activityToEdit.duration
                            })
                            setNameError('')
                            setNameFieldBounce(false)
                            setShowWizard(true)
                          }
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

              </div>
            </div>

            {/* Capacity Display Sidebar */}
            <div className="lg:col-span-2">
              <div className="bg-blue-100 dark:bg-blue-900/20 border border-blue-400 dark:border-blue-800 rounded-lg p-4 sm:p-6 lg:p-8">
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
                  
                  {config.rolloverPoints > 0 ? (
                    <div className="flex justify-between items-center text-lg text-gray-700 dark:text-gray-300">
                      <span className="font-bold text-gray-900 dark:text-gray-100 text-left">Rollover Points</span>
                      <span className="font-semibold text-blue-700 dark:text-blue-200 text-right">{config.rolloverPoints} Point{getPluralSuffix(config.rolloverPoints)}</span>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center text-lg text-gray-500 dark:text-gray-400">
                      <span className="font-bold text-gray-900 dark:text-gray-100 text-left">Rollover Points</span>
                      <span className="font-semibold text-gray-500 dark:text-gray-400 text-right">None</span>
                    </div>
                  )}
                  
                  {config.onCallTime > 0 ? (
                    <div className="flex justify-between items-center text-lg text-gray-700 dark:text-gray-300">
                      <span className="font-bold text-gray-900 dark:text-gray-100 text-left">On-Call Time</span>
                      <span className="font-semibold text-blue-700 dark:text-blue-200 text-right">{config.onCallTime} Point{getPluralSuffix(config.onCallTime)}</span>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center text-lg text-gray-500 dark:text-gray-400">
                      <span className="font-bold text-gray-900 dark:text-gray-100 text-left">On-Call Time</span>
                      <span className="font-semibold text-gray-500 dark:text-gray-400 text-right">None</span>
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
                  
                </div>
              </div>
              
              {/* Sprint Capacity Calculation */}
              <SprintCapacityOutput 
                teamMembers={config.teamMembers}
                sprintDays={config.sprintDays}
                ptoActivities={config.ptoActivities}
                onCallTime={config.onCallTime}
                rolloverPoints={config.rolloverPoints}
              />
              
              {/* Configuration Manager */}
              <SaveConfiguration
                configurations={configurations}
                currentConfigId={currentConfigId}
                currentConfig={config}
                onCreateConfiguration={createConfiguration}
                onDuplicateConfiguration={duplicateConfiguration}
                onUpdateConfigurationName={updateConfigurationName}
                onDeleteConfiguration={deleteConfiguration}
                onSwitchToConfiguration={switchToConfiguration}
                onShowToast={showToast}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Wizard Modal */}
      <Modal
        isOpen={showWizard}
        onClose={() => {
          setShowWizard(false)
          setEditingActivityId(null)
          setNameError('')
          setNameFieldBounce(false)
        }}
        title={editingActivityId ? "Edit PTO or Activity" : "Add PTO / Activity"}
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
              max={config.teamMembers}
              onDecrease={() => setWizardData(prev => ({ ...prev, developers: Math.max(1, prev.developers - 1) }))}
              onIncrease={() => setWizardData(prev => ({ ...prev, developers: Math.min(config.teamMembers, prev.developers + 1) }))}
            />
            <Button
              onClick={() => setWizardData(prev => ({ ...prev, developers: config.teamMembers }))}
              variant="secondary"
              size="sm"
              className="mt-6 px-8 py-4 rounded-full mx-auto block"
            >
              All Devs ({config.teamMembers})
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
            onClick={() => {
              setShowWizard(false)
              setEditingActivityId(null)
              setNameError('')
              setNameFieldBounce(false)
            }}
            variant="secondary"
            size="md"
            fullWidth
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              // Validate name
              const trimmedName = wizardData.name.trim()
              if (!trimmedName) {
                setNameError('Name is required')
                setNameFieldBounce(true)
                setTimeout(() => setNameFieldBounce(false), 500)
                return
              }

              if (editingActivityId) {
                // Edit existing activity
                updateConfig({ 
                  ptoActivities: config.ptoActivities.map(item => 
                    item.id === editingActivityId 
                      ? {
                          ...item,
                          name: trimmedName,
                          developers: wizardData.developers,
                          duration: wizardData.duration
                        }
                      : item
                  )
                })
              } else {
                // Create new activity
                const newActivity: PTOActivity = {
                  id: Date.now().toString(),
                  name: trimmedName,
                  developers: wizardData.developers,
                  duration: wizardData.duration
                }
                updateConfig({ 
                  ptoActivities: [...config.ptoActivities, newActivity] 
                })
              }
              setShowWizard(false)
              setEditingActivityId(null)
              setNameError('')
            }}
            variant="primary"
            size="md"
            fullWidth
            className={!wizardData.name.trim() ? 'opacity-50 cursor-not-allowed' : ''}
          >
            {editingActivityId ? 'Save Changes' : 'Add'}
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

      {/* GitHub Logo */}
      <GitHubLogo />
    </main>
  )
}
