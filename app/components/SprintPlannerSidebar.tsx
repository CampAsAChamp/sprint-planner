import CurrentConfigurationSummary from './CurrentConfigurationSummary'
import ConfigurationManager from './SaveConfiguration'
import SprintCapacityOutput from './SprintCapacityOutput'
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

interface SprintPlannerSidebarProps {
  // Current config values
  teamMembers: number
  sprintDays: number
  rolloverPoints: number
  onCallTime: number
  ptoActivities: PTOActivity[]
  
  // Configuration management
  configurations: SprintConfiguration[]
  currentConfigId: string | null
  currentConfig: SprintConfiguration
  onCreateConfiguration: (name: string, configData?: Partial<SprintConfiguration>) => string
  onDuplicateConfiguration: (configId: string, newName?: string) => string | null
  onUpdateConfigurationName: (configId: string, newName: string) => void
  onDeleteConfiguration: (configId: string) => void
  onSwitchToConfiguration: (configId: string) => void
  onShowToast: (message: string, type: 'success' | 'error' | 'save' | 'load' | 'delete') => void
}

export default function SprintPlannerSidebar({
  teamMembers,
  sprintDays,
  rolloverPoints,
  onCallTime,
  ptoActivities,
  configurations,
  currentConfigId,
  currentConfig,
  onCreateConfiguration,
  onDuplicateConfiguration,
  onUpdateConfigurationName,
  onDeleteConfiguration,
  onSwitchToConfiguration,
  onShowToast
}: SprintPlannerSidebarProps) {
  return (
    <div className="lg:col-span-2">
      <CurrentConfigurationSummary
        configName={currentConfig.name}
        teamMembers={teamMembers}
        sprintDays={sprintDays}
        rolloverPoints={rolloverPoints}
        onCallTime={onCallTime}
        ptoActivities={ptoActivities}
      />
      
      <SprintCapacityOutput 
        teamMembers={teamMembers}
        sprintDays={sprintDays}
        ptoActivities={ptoActivities}
        onCallTime={onCallTime}
        rolloverPoints={rolloverPoints}
      />
      
      <ConfigurationManager
        configurations={configurations}
        currentConfigId={currentConfigId}
        currentConfig={currentConfig}
        onCreateConfiguration={onCreateConfiguration}
        onDuplicateConfiguration={onDuplicateConfiguration}
        onUpdateConfigurationName={onUpdateConfigurationName}
        onDeleteConfiguration={onDeleteConfiguration}
        onSwitchToConfiguration={onSwitchToConfiguration}
        onShowToast={onShowToast}
      />
    </div>
  )
}

