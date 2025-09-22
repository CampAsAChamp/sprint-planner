interface SprintCapacityProps {
  teamMembers: number
  sprintDays: number
  ptoActivities: Array<{
    id: string
    name: string
    developers: number
    duration: number
  }>
  onCallTime: number
}

export default function SprintCapacityOutput({ 
  teamMembers, 
  sprintDays, 
  ptoActivities, 
  onCallTime 
}: SprintCapacityProps) {
  const calculateCapacity = () => {
    // Basic calculation: team members * sprint days - PTO days - on-call days
    const totalPtoDays = ptoActivities.reduce((sum, activity) => sum + (activity.developers * activity.duration), 0);
    const totalCapacity = (teamMembers * sprintDays) - totalPtoDays - onCallTime;
    return Math.max(0, totalCapacity).toFixed(1);
  };

  return (
    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-8 mt-6">
      <h3 className="text-xl font-medium text-green-900 dark:text-green-100 mb-6" style={{fontSize: '1.25rem', textAlign: 'center'}}>
        Sprint Capacity
      </h3>
      <div className="text-center">
        <div className="text-4xl font-bold text-green-700 dark:text-green-300 mb-2">
          {calculateCapacity()}
        </div>
        <div className="text-sm text-green-600 dark:text-green-400">
          Available Developer Days
        </div>
      </div>
    </div>
  );
}
