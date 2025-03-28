'use client';

import { useState, useEffect } from 'react';
import StreakCounter from '../../components/Dashboard/StreakCounter';
import HealthBenefitsTracker from '../../components/Dashboard/HealthBenefitsTracker';
import DailyLogForm from '../../components/Dashboard/DailyLogForm';
import MotivationalQuote from '../../components/Dashboard/MotivationalQuote';
import StreakCalendar from '../../components/Dashboard/StreakCalendar';

export default function Dashboard() {
  const [userData, setUserData] = useState({
    startDate: new Date('2023-01-01'), // Default, will be updated from DB
    weeklyVapeCost: 30,
    monthlyVapeCost: 120,
    investmentRate: 0.07,
    investmentYears: 40
  });
  
  const [streakData, setStreakData] = useState({
    currentStreak: 0,
    longestStreak: 0,
    lastCheckin: new Date(),
    streakHistory: [] as {date: Date, streakCount: number}[]
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [checkedInToday, setCheckedInToday] = useState(false);
  
  // Fetch streak data
  useEffect(() => {
    const fetchStreakData = async () => {
      try {
        // First check if the API endpoint exists
        const response = await fetch('/api/streak');
        
        if (!response.ok) {
          console.error('Streak API returned error:', await response.text());
          throw new Error('Failed to fetch streak data');
        }
        
        const data = await response.json();
        console.log('Streak data received:', data); // Debug log
        
        // Check if already checked in today
        const lastCheckin = new Date(data.lastCheckin);
        const today = new Date();
        const isSameDay = 
          lastCheckin.getDate() === today.getDate() && 
          lastCheckin.getMonth() === today.getMonth() && 
          lastCheckin.getFullYear() === today.getFullYear();
        
        setCheckedInToday(isSameDay);
        
        // Format streak history dates
        const formattedHistory = data.streakHistory?.map((item: any) => ({
          date: new Date(item.date),
          streakCount: item.streakCount
        })) || [];
        
        setStreakData({
          currentStreak: data.currentStreak || 0,
          longestStreak: data.longestStreak || 0,
          lastCheckin: new Date(data.lastCheckin || new Date()),
          streakHistory: formattedHistory
        });
        
        // Also fetch user data if available
        try {
          const userResponse = await fetch('/api/user');
          if (userResponse.ok) {
            const userData = await userResponse.json();
            setUserData({
              startDate: new Date(userData.startDate),
              weeklyVapeCost: userData.weeklyVapeCost,
              monthlyVapeCost: userData.monthlyVapeCost,
              investmentRate: userData.investmentRate,
              investmentYears: userData.investmentYears
            });
          }
        } catch (err) {
          console.error('Error fetching user data:', err);
          // Not critical, so we don't set an error state
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching streak data:', err);
        setError('Failed to load streak data. Please try again later.');
        setIsLoading(false);
      }
    };
    
    fetchStreakData();
  }, []);
  
  // Handle daily log submission
  const handleLogSubmit = async (logData: any) => {
    try {
      const response = await fetch('/api/checkin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(logData),
      });
      
      if (!response.ok) throw new Error('Failed to submit check-in');
      
      const data = await response.json();
      
      // Update streak data
      const formattedHistory = data.streak.streakHistory?.map((item: any) => ({
        date: new Date(item.date),
        streakCount: item.streakCount
      })) || [];
      
      setStreakData({
        currentStreak: data.streak.currentStreak,
        longestStreak: data.streak.longestStreak,
        lastCheckin: new Date(data.streak.lastCheckin),
        streakHistory: formattedHistory
      });
      
      setCheckedInToday(true);
      
      alert('Daily check-in submitted successfully!');
    } catch (err) {
      console.error('Error submitting check-in:', err);
      alert('Failed to submit check-in. Please try again.');
    }
  };
  
  // Handle logging a smoke-free day
  const handleLogSmokeFreeDay = async () => {
    try {
      if (checkedInToday) {
        alert('You have already logged a smoke-free day today!');
        return;
      }
      
      const response = await fetch('/api/checkin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mood: 'good',
          cravingIntensity: 3,
          notes: 'Logged via quick button',
          triggers: [],
          activities: ['Quick log']
        }),
      });
      
      if (!response.ok) {
        console.error('Check-in API returned error:', await response.text());
        throw new Error('Failed to log smoke-free day');
      }
      
      const data = await response.json();
      console.log('Check-in response:', data); // Debug log
      
      // Update streak data
      const formattedHistory = data.streak.streakHistory?.map((item: any) => ({
        date: new Date(item.date),
        streakCount: item.streakCount
      })) || [];
      
      setStreakData({
        currentStreak: data.streak.currentStreak,
        longestStreak: data.streak.longestStreak,
        lastCheckin: new Date(data.streak.lastCheckin),
        streakHistory: formattedHistory
      });
      
      setCheckedInToday(true);
      
      alert('Smoke-free day logged successfully!');
    } catch (err) {
      console.error('Error logging smoke-free day:', err);
      alert('Failed to log smoke-free day. Please try again.');
    }
  };
  
  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <div style={{ 
          width: '3rem', 
          height: '3rem', 
          borderRadius: '50%', 
          border: '0.25rem solid rgba(56, 178, 172, 0.3)', 
          borderTopColor: 'var(--primary-color)',
          animation: 'spin 1s linear infinite'
        }}></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <div style={{ backgroundColor: 'rgba(220, 38, 38, 0.1)', padding: '1rem', borderRadius: '0.5rem' }}>
          <p style={{ color: '#ef4444' }}>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="btn btn-primary"
            style={{ marginTop: '1rem' }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container">
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white', marginBottom: '2rem', textAlign: 'center' }}>
        Vape-Free Dashboard
      </h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <StreakCounter 
          startDate={userData.startDate}
          currentStreak={streakData.currentStreak}
          longestStreak={streakData.longestStreak}
        />
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <HealthBenefitsTracker 
          startDate={userData.startDate}
          currentStreak={streakData.currentStreak}
          onLogSmokeFreeDay={handleLogSmokeFreeDay}
          checkedInToday={checkedInToday}
        />
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <StreakCalendar streakHistory={streakData.streakHistory} />
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <MotivationalQuote />
      </div>
      
      <div style={{ marginBottom: '1.5rem' }}>
        {checkedInToday ? (
          <div className="card">
            <div style={{ textAlign: 'center' }}>
              <h2 className="card-title">Already Checked In Today</h2>
              <p style={{ color: '#a0aec0' }}>Great job! You've already logged your vape-free day.</p>
              <p style={{ color: '#a0aec0', marginTop: '0.5rem' }}>Come back tomorrow to continue your streak!</p>
            </div>
          </div>
        ) : (
          <DailyLogForm onSubmit={handleLogSubmit} />
        )}
      </div>
    </div>
  );
} 