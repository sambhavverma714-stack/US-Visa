/**
 * Enhanced predictive logic for US Visa Approval Simulation
 * Inspired by the US Perm Visas dataset structure.
 */
export const predictVisaApproval = (data) => {
  const { education, wage, experience, region, sector, employerSize } = data;
  
  // Base probability (historical average for PERM is around 70-80%)
  let score = 0.70;
  
  // Education impact
  const eduWeights = {
    'Doctorate': 0.15,
    'Master\'s': 0.10,
    'Bachelor\'s': 0.05,
    'High School': -0.15,
    'None': -0.25
  };
  score += eduWeights[education] || 0;
  
  // Wage impact (Normalizing against $100k)
  const normalizedWage = wage / 100000;
  if (normalizedWage > 1.5) score += 0.10;
  else if (normalizedWage < 0.6) score -= 0.15;
  
  // Sector impact
  const sectorWeights = {
    'IT': 0.08,
    'Aerospace': 0.12,
    'Advanced Mfg': 0.05,
    'Education': 0.02,
    'Finance': 0.04
  };
  score += sectorWeights[sector] || 0;

  // Employer Size impact
  if (employerSize === 'Large (5000+)') score += 0.05;
  else if (employerSize === 'Small (<50)') score -= 0.05;
  
  // Experience impact
  score += Math.min(0.05, (experience / 15) * 0.05);
  
  // Region variability
  if (region === 'West' || region === 'Northeast') score += 0.03;
  
  // Random noise (Simulating model variance)
  score += (Math.random() - 0.5) * 0.02;

  return Math.max(0.01, Math.min(0.99, score));
};

export const getFeatureImportance = () => {
  return {
    labels: ['Wage', 'Education', 'Job Sector', 'Experience', 'Region', 'Employer Size'],
    datasets: [{
      label: 'Feature Importance Score',
      data: [0.35, 0.25, 0.15, 0.12, 0.08, 0.05],
      backgroundColor: [
        '#6366f1', '#8b5cf6', '#ec4899', '#06b6d4', '#10b981', '#f59e0b'
      ],
      borderRadius: 8,
    }]
  };
};

export const getStateDistribution = () => {
  return {
    labels: ['California', 'Texas', 'New York', 'New Jersey', 'Washington'],
    datasets: [{
      label: 'Applications',
      data: [12500, 8400, 7200, 5100, 4800],
      backgroundColor: 'rgba(99, 102, 241, 0.6)',
      borderColor: '#6366f1',
      borderWidth: 1,
    }]
  };
};

export const generateHistoricalData = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return {
    labels: months,
    datasets: [
      {
        label: 'Approval Rate (%)',
        data: months.map(() => 72 + Math.random() * 15),
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Prediction Confidence',
        data: months.map(() => 85 + Math.random() * 8),
        borderColor: '#ec4899',
        backgroundColor: 'transparent',
        borderDash: [5, 5],
        tension: 0.4,
      }
    ]
  };
};
