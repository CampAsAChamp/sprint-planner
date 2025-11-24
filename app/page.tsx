'use client'

import { useState } from 'react'

import Footer from '@/app/components/layout/Footer'
import PageHeader from '@/app/components/layout/PageHeader'
import PTOActivityWizard from '@/app/components/pto_activity/PTOActivityWizard'
import SprintPlannerForm from '@/app/components/sprint/SprintPlannerForm'
import Sidebar from '@/app/components/sidebar/Sidebar'
import ThemeToggle from '@/app/components/ui/ThemeToggle'
import Toast from '@/app/components/ui/Toast'
import { PTOActivity } from '@/app/types/PTOActivity'
import { useAnimationState } from '@/app/hooks/useAnimationState'
import { useSprintConfiguration } from '@/app/hooks/useSprintConfiguration'

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
  const [editingPtoActivity, setEditingPtoActivity] = useState<PTOActivity | null>(null)
  
  // Animation states for inputs
  const teamMembersAnimation = useAnimationState(config.teamMembers)
  const sprintDaysAnimation = useAnimationState(config.sprintDays)
  const onCallTimeAnimation = useAnimationState(config.onCallTime)
  const rolloverPointsAnimation = useAnimationState(config.rolloverPoints)

  const handleSavePtoActivity = (ptoActivity: Omit<PTOActivity, 'id'>, editingId: string | null) => {
    if (editingId) {
      // Edit existing ptoActivity
      updateConfig({ 
        ptoActivities: config.ptoActivities.map(item => 
          item.id === editingId 
            ? { ...item, ...ptoActivity }
            : item
        )
      })
    } else {
      // Create new ptoActivity
      const newPtoActivity: PTOActivity = {
        id: Date.now().toString(),
        ...ptoActivity
      }
      updateConfig({ 
        ptoActivities: [...config.ptoActivities, newPtoActivity] 
      })
    }
    
    setShowWizard(false)
    setEditingPtoActivity(null)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex flex-col">
      <ThemeToggle />
      
      <div className="flex-grow w-full max-w-7xl mx-auto px-4 py-8 text-center">
        <PageHeader />

        <div className="max-w-full mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
            <SprintPlannerForm
              config={config}
              updateConfig={updateConfig}
              teamMembersAnimation={teamMembersAnimation}
              sprintDaysAnimation={sprintDaysAnimation}
              rolloverPointsAnimation={rolloverPointsAnimation}
              onCallTimeAnimation={onCallTimeAnimation}
              onAddActivity={() => {
                setEditingPtoActivity(null)
                setShowWizard(true)
              }}
              onEditActivity={(id) => {
                const activityToEdit = config.ptoActivities.find(item => item.id === id)
                if (activityToEdit) {
                  setEditingPtoActivity(activityToEdit)
                  setShowWizard(true)
                }
              }}
              onRemoveActivity={(id) => updateConfig({ 
                ptoActivities: config.ptoActivities.filter(item => item.id !== id) 
              })}
            />

            <Sidebar
              teamMembers={config.teamMembers}
              sprintDays={config.sprintDays}
              rolloverPoints={config.rolloverPoints}
              onCallTime={config.onCallTime}
              ptoActivities={config.ptoActivities}
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

      <PTOActivityWizard
        isOpen={showWizard}
        onClose={() => {
          setShowWizard(false)
          setEditingPtoActivity(null)
        }}
        onSave={handleSavePtoActivity}
        editingPtoActivity={editingPtoActivity}
        teamMembers={config.teamMembers}
        sprintDays={config.sprintDays}
      />

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />

      <Footer />
    </main>
  )
}
