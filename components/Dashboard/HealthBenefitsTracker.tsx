import React from 'react';
import { Line } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { differenceInHours, differenceInDays } from 'date-fns';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface HealthBenefitsTrackerProps {
  startDate: Date;
  currentStreak: number;
  onLogSmokeFreeDay: () => void;
  checkedInToday?: boolean;
}

const HealthBenefitsTracker: React.FC<HealthBenefitsTrackerProps> = ({
  startDate,
  currentStreak,
  onLogSmokeFreeDay,
  checkedInToday = false
}) => {
  const hoursQuit = differenceInHours(new Date(), startDate);
  const daysQuit = differenceInDays(new Date(), startDate);
  
  // Health benefits timeline
  const healthBenefits = [
    { time: 8, label: "8 hours", benefit: "Carbon monoxide levels return to normal" },
    { time: 24, label: "24 hours", benefit: "Decreased risk of heart attack" },
    { time: 48, label: "48 hours", benefit: "Nerve endings start to regrow" },
    { time: 72, label: "72 hours", benefit: "Bronchial tubes relax, breathing easier" },
    { time: 336, label: "2 weeks", benefit: "Circulation improves, lung function increases" },
    { time: 720, label: "1 month", benefit: "Cilia regrow in lungs, less coughing" },
    { time: 2160, label: "3 months", benefit: "Heart attack risk drops significantly" },
    { time: 4320, label: "6 months", benefit: "Reduced respiratory infections" },
    { time: 8760, label: "1 year", benefit: "Risk of coronary heart disease cut in half" },
    { time: 43800, label: "5 years", benefit: "Stroke risk reduced to that of a non-smoker" },
    { time: 87600, label: "10 years", benefit: "Lung cancer risk cut in half" },
    { time: 131400, label: "15 years", benefit: "Heart disease risk same as non-smoker" }
  ];
  
  // Find the next upcoming benefit
  const nextBenefit = healthBenefits.find(benefit => benefit.time > hoursQuit) || healthBenefits[healthBenefits.length - 1];
  
  // Calculate progress to next benefit
  const prevBenefit = healthBenefits[healthBenefits.indexOf(nextBenefit) - 1] || { time: 0 };
  const progressToNext = Math.min(100, ((hoursQuit - prevBenefit.time) / (nextBenefit.time - prevBenefit.time)) * 100);
  
  // Generate data for biomarkers chart
  const generateChartData = () => {
    // Biomarkers that improve after quitting
    const biomarkers = [
      { name: "Oxygen Levels", recovery: [70, 75, 82, 88, 92, 95, 97, 98] },
      { name: "Heart Rate", recovery: [92, 88, 85, 82, 79, 76, 74, 72] }, // Decreasing is good
      { name: "Lung Function", recovery: [65, 68, 72, 78, 83, 87, 92, 95] },
      { name: "Inflammation", recovery: [85, 80, 72, 65, 58, 50, 42, 35] }  // Decreasing is good
    ];
    
    const labels = ["Day 1", "Day 3", "Week 1", "Week 2", "Month 1", "Month 3", "Month 6", "Year 1"];
    
    // Determine which data points to show based on days quit
    const dataPointsToShow = daysQuit < 3 ? 2 : 
                             daysQuit < 7 ? 3 :
                             daysQuit < 14 ? 4 :
                             daysQuit < 30 ? 5 :
                             daysQuit < 90 ? 6 :
                             daysQuit < 180 ? 7 : 8;
    
    const datasets = biomarkers.map(marker => {
      const data = marker.recovery.slice(0, dataPointsToShow);
      // Add projected future values
      while (data.length < 8) {
        data.push(0);
      }
      
      return {
        label: marker.name,
        data: data,
        borderColor: marker.name === "Oxygen Levels" ? 'rgb(52, 211, 153)' : // Green
                    marker.name === "Heart Rate" ? 'rgb(239, 68, 68)' : // Red
                    marker.name === "Lung Function" ? 'rgb(59, 130, 246)' : // Blue
                    'rgb(249, 115, 22)', // Orange for Inflammation
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        tension: 0.3
      };
    });
    
    return {
      labels: labels.slice(0, dataPointsToShow),
      datasets
    };
  };
  
  const statStyle = {
    padding: '1rem',
    backgroundColor: 'rgba(26, 32, 44, 0.8)',
    borderRadius: '0.5rem',
    textAlign: 'center' as const
  };
  
  return (
    <div className="card">
      <h2 className="card-title">Health Recovery Tracker</h2>
      
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ color: 'var(--primary-color)', marginBottom: '0.5rem' }}>Your Next Health Milestone</h3>
        <div style={statStyle}>
          <p style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#e2e8f0' }}>{nextBenefit.label}</p>
          <p style={{ color: '#a0aec0' }}>{nextBenefit.benefit}</p>
          <div style={{ marginTop: '0.5rem', backgroundColor: '#4a5568', height: '0.5rem', borderRadius: '9999px' }}>
            <div 
              style={{ 
                width: `${progressToNext}%`, 
                backgroundColor: 'var(--primary-color)', 
                height: '100%', 
                borderRadius: '9999px',
                transition: 'width 0.5s ease-in-out'
              }} 
            />
          </div>
          <p style={{ color: '#a0aec0', marginTop: '0.25rem', fontSize: '0.875rem' }}>
            {progressToNext.toFixed(0)}% progress to next milestone
          </p>
        </div>
      </div>
      
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ color: 'var(--primary-color)', marginBottom: '0.5rem' }}>Key Health Indicators</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
          <div style={statStyle}>
            <p style={{ color: '#a0aec0', fontSize: '0.875rem' }}>Carbon Monoxide</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#48bb78' }}>
              {hoursQuit >= 24 ? "Normal" : "Reducing"}
            </p>
          </div>
          <div style={statStyle}>
            <p style={{ color: '#a0aec0', fontSize: '0.875rem' }}>Nicotine</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: hoursQuit >= 72 ? '#48bb78' : '#f59e0b' }}>
              {hoursQuit >= 72 ? "Eliminated" : "Reducing"}
            </p>
          </div>
        </div>
      </div>
      
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={statStyle}>
          <p style={{ color: '#a0aec0', fontSize: '0.875rem' }}>Current Streak</p>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#e2e8f0' }}>
            {currentStreak} {currentStreak === 1 ? 'day' : 'days'}
          </p>
          <button
            onClick={onLogSmokeFreeDay}
            disabled={checkedInToday}
            style={{
              backgroundColor: checkedInToday ? '#4a5568' : 'var(--primary-color)',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem',
              border: 'none',
              marginTop: '0.5rem',
              cursor: checkedInToday ? 'not-allowed' : 'pointer',
              opacity: checkedInToday ? 0.7 : 1
            }}
          >
            {checkedInToday ? 'Already Logged Today' : 'Log Smoke-Free Day'}
          </button>
        </div>
      </div>
      
      <div style={{ height: '16rem' }}>
        <h3 style={{ color: 'var(--primary-color)', marginBottom: '0.5rem' }}>Biomarkers Improvement</h3>
        <Line 
          data={generateChartData()} 
          options={{
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: false,
                min: 30,
                max: 100,
                grid: {
                  color: 'rgba(255, 255, 255, 0.1)',
                },
                ticks: {
                  color: 'rgba(255, 255, 255, 0.7)',
                }
              },
              x: {
                grid: {
                  color: 'rgba(255, 255, 255, 0.1)',
                },
                ticks: {
                  color: 'rgba(255, 255, 255, 0.7)',
                }
              }
            },
            plugins: {
              legend: {
                labels: {
                  color: 'rgba(255, 255, 255, 0.7)',
                }
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    return `${context.dataset.label}: ${context.parsed.y}%`;
                  }
                }
              }
            }
          }}
        />
      </div>
    </div>
  );
};

export default HealthBenefitsTracker; 