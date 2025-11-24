import CurrentConfigurationSummary from './CurrentConfigurationSummary'
import ConfigurationManager from './ConfigurationManager'
import SprintCapacityOutput from './SprintCapacityOutput'
import { PTOActivity } from '../../types/PTOActivity'
import { SprintConfiguration } from '../../types/SprintConfiguration'

interface SidebarProps {
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

export default function Sidebar({
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
}: SidebarProps) {
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


