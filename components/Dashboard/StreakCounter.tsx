import React from 'react';
import { format, differenceInDays } from 'date-fns';

interface StreakCounterProps {
  startDate: Date;
  currentStreak: number;
  longestStreak: number;
}

const StreakCounter: React.FC<StreakCounterProps> = ({ 
  startDate, 
  currentStreak, 
  longestStreak 
}) => {
  const totalDays = differenceInDays(new Date(), startDate);
  
  const statStyle = {
    padding: '1rem',
    backgroundColor: 'rgba(26, 32, 44, 0.8)',
    borderRadius: '0.5rem',
    textAlign: 'center' as const
  };
  
  return (
    <div className="card">
      <h2 className="card-title">Your Vape-Free Journey</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
        <div style={statStyle}>
          <p style={{ color: '#a0aec0', fontSize: '0.875rem' }}>Current Streak</p>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#38b2ac' }}>{currentStreak}</p>
          <p style={{ color: '#a0aec0', fontSize: '0.875rem' }}>days</p>
        </div>
        <div style={statStyle}>
          <p style={{ color: '#a0aec0', fontSize: '0.875rem' }}>Longest Streak</p>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#805ad5' }}>{longestStreak}</p>
          <p style={{ color: '#a0aec0', fontSize: '0.875rem' }}>days</p>
        </div>
        <div style={statStyle}>
          <p style={{ color: '#a0aec0', fontSize: '0.875rem' }}>Total Days</p>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#48bb78' }}>{totalDays}</p>
          <p style={{ color: '#a0aec0', fontSize: '0.875rem' }}>since {format(startDate, 'MMM d, yyyy')}</p>
        </div>
      </div>
    </div>
  );
};

export default StreakCounter; 