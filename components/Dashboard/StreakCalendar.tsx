import React from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';

interface StreakCalendarProps {
  streakHistory: {
    date: Date;
    streakCount: number;
  }[];
}

const StreakCalendar: React.FC<StreakCalendarProps> = ({ streakHistory }) => {
  const [currentMonth, setCurrentMonth] = React.useState(new Date());
  
  const renderCalendar = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
    
    // Convert streak history dates to strings for easier comparison
    const streakDays = streakHistory.map(item => format(new Date(item.date), 'yyyy-MM-dd'));
    
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem' }}>
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
          <div 
            key={day} 
            style={{ 
              textAlign: 'center', 
              fontWeight: 'bold', 
              color: '#a0aec0',
              padding: '0.5rem 0'
            }}
          >
            {day}
          </div>
        ))}
        
        {days.map(day => {
          const formattedDate = format(day, 'yyyy-MM-dd');
          const isStreakDay = streakDays.includes(formattedDate);
          const isToday = isSameDay(day, new Date());
          
          return (
            <div 
              key={day.toString()} 
              style={{ 
                textAlign: 'center',
                padding: '0.5rem',
                backgroundColor: isStreakDay ? 'rgba(56, 178, 172, 0.3)' : 'rgba(26, 32, 44, 0.5)',
                borderRadius: '0.25rem',
                position: 'relative',
                border: isToday ? '2px solid var(--primary-color)' : 'none'
              }}
            >
              <span style={{ color: isStreakDay ? '#e2e8f0' : '#718096' }}>
                {format(day, 'd')}
              </span>
              {isStreakDay && (
                <span style={{ 
                  position: 'absolute', 
                  top: '50%', 
                  left: '50%', 
                  transform: 'translate(-50%, -50%)',
                  fontSize: '1.5rem',
                  color: 'var(--primary-color)',
                  opacity: 0.8
                }}>
                  ✓
                </span>
              )}
            </div>
          );
        })}
      </div>
    );
  };
  
  return (
    <div className="card">
      <h2 className="card-title">Vape-Free Calendar</h2>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <button 
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          style={{ 
            backgroundColor: 'transparent', 
            border: 'none', 
            color: 'var(--primary-color)',
            cursor: 'pointer',
            fontSize: '1.25rem'
          }}
        >
          &lt;
        </button>
        <h3 style={{ color: '#e2e8f0', margin: 0 }}>
          {format(currentMonth, 'MMMM yyyy')}
        </h3>
        <button 
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          style={{ 
            backgroundColor: 'transparent', 
            border: 'none', 
            color: 'var(--primary-color)',
            cursor: 'pointer',
            fontSize: '1.25rem'
          }}
        >
          &gt;
        </button>
      </div>
      
      {renderCalendar()}
      
      <div style={{ marginTop: '1rem', textAlign: 'center', color: '#a0aec0' }}>
        <p>Each ✓ represents a day you stayed vape-free!</p>
      </div>
    </div>
  );
};

export default StreakCalendar; 