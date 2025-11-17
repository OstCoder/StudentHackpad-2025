export const formatMinutesToTime = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours}h`;
  }
  
  return `${hours}h ${remainingMinutes}m`;
};

export const calculateDynamicTime = (
  tasks: { estimatedTime: number; completed: boolean }[],
  mood: number,
  energy: number
): number => {
  const baseTotalTime = tasks
    .filter(t => !t.completed)
    .reduce((sum, task) => sum + task.estimatedTime, 0);
  
  // Adjust based on mood and energy (higher = faster completion)
  const efficiencyFactor = ((mood + energy) / 20); // 0.1 to 1.0
  const adjustedTime = baseTotalTime * (1.5 - efficiencyFactor * 0.5); // Range: 1.0x to 1.5x
  
  return Math.round(adjustedTime);
};
