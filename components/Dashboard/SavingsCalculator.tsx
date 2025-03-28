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

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface SavingsCalculatorProps {
  weeklyVapeCost: number;
  monthlyVapeCost: number;
  currentStreak: number;
  investmentRate: number;
  investmentYears: number;
}

const SavingsCalculator: React.FC<SavingsCalculatorProps> = ({
  weeklyVapeCost,
  monthlyVapeCost,
  currentStreak,
  investmentRate,
  investmentYears,
}) => {
  // Calculate current savings
  const currentSavings = (currentStreak / 7) * weeklyVapeCost;
  
  // Calculate compound interest over time
  const calculateCompoundInterest = (principal: number, rate: number, years: number) => {
    return principal * Math.pow(1 + rate, years);
  };
  
  const potentialFutureSavings = calculateCompoundInterest(
    currentSavings,
    investmentRate,
    investmentYears
  );
  
  // Generate data for chart
  const generateChartData = () => {
    const labels = [];
    const data = [];
    
    for (let year = 0; year <= investmentYears; year += 5) {
      labels.push(`Year ${year}`);
      data.push(calculateCompoundInterest(currentSavings, investmentRate, year));
    }
    
    return {
      labels,
      datasets: [
        {
          label: 'Potential Savings Growth',
          data,
          borderColor: 'rgb(79, 209, 197)',
          backgroundColor: 'rgba(79, 209, 197, 0.5)',
        },
      ],
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
      <h2 className="card-title">Financial Impact</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={statStyle}>
          <p style={{ color: '#a0aec0', fontSize: '0.875rem' }}>Money Saved So Far</p>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#48bb78' }}>${currentSavings.toFixed(2)}</p>
        </div>
        <div style={statStyle}>
          <p style={{ color: '#a0aec0', fontSize: '0.875rem' }}>Potential Future Value</p>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#805ad5' }}>${potentialFutureSavings.toFixed(2)}</p>
          <p style={{ color: '#a0aec0', fontSize: '0.75rem' }}>in {investmentYears} years at {(investmentRate * 100).toFixed(1)}% return</p>
        </div>
      </div>
      <div style={{ height: '16rem' }}>
        <Line 
          data={generateChartData()} 
          options={{
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                grid: {
                  color: 'rgba(255, 255, 255, 0.1)',
                },
                ticks: {
                  color: 'rgba(255, 255, 255, 0.7)',
                  callback: function(value) {
                    return '$' + value;
                  }
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
                    return `$${context.parsed.y.toFixed(2)}`;
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

export default SavingsCalculator; 