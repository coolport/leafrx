export const myPlants = [
    { id: 1, name: 'Mango Tree #1', type: 'Mango', health: 85, lastChecked: '2 days ago', status: 'healthy', location: 'North Field', entries: 15, healthTrend: [70, 75, 80, 82, 85, 83, 85] },
    { id: 2, name: 'Banana Grove A', type: 'Banana', health: 62, lastChecked: '1 day ago', status: 'warning', location: 'West Section', entries: 8, healthTrend: [60, 65, 62, 68, 65, 63, 62] },
    { id: 3, name: 'Guava Tree #2', type: 'Guava', health: 45, lastChecked: '3 hours ago', status: 'critical', location: 'South Garden', entries: 12, healthTrend: [50, 48, 45, 47, 43, 40, 45] },
  ];
  
  export const recentScans = [
    { id: 1, plant: 'Mango Tree #1', disease: 'Healthy', severity: 'None', date: '2 days ago', color: '#22c55e' },
    { id: 2, plant: 'Banana Grove A', disease: 'Early Leaf Spot', severity: 'Moderate', date: '1 day ago', color: '#eab308' },
    { id: 3, plant: 'Guava Tree #2', disease: 'Anthracnose', severity: 'Severe', date: '3 hours ago', color: '#ef4444' },
  ];
  
  export const timelineData = [
    { date: 'Today', time: '2:30 PM', health: 62, status: 'warning', note: 'Early leaf spot detected' },
    { date: 'Yesterday', time: '10:15 AM', health: 65, status: 'warning', note: 'Slight yellowing observed' },
    { date: '3 days ago', time: '3:45 PM', health: 70, status: 'healthy', note: 'Healthy growth, no issues' },
  ];
  
  export const chartData = [45, 52, 58, 62, 59, 65, 85]; // Kept as a standalone for potential default/other uses
  export const chartLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  export const diseases = [
    { name: 'Anthracnose', affected: 'Mango, Guava', severity: 'High', color: '#fee2e2', textColor: '#991b1b' },
    { name: 'Bacterial Leaf Spot', affected: 'Banana', severity: 'Medium', color: '#fef3c7', textColor: '#854d0e' },
    { name: 'Powdery Mildew', affected: 'Multiple species', severity: 'Low', color: '#dcfce7', textColor: '#166534' },
  ]
  