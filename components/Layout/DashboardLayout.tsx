import React from 'react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div>
      <header className="header">
        <div className="container header-content">
          <h1 style={{ color: '#38b2ac' }}>Vape-Free Dashboard</h1>
          <nav>
            <ul className="nav-list">
              <li>
                <a href="/dashboard" className="nav-link">Dashboard</a>
              </li>
              <li>
                <a href="/history" className="nav-link">History</a>
              </li>
              <li>
                <a href="/settings" className="nav-link">Settings</a>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <main className="container">
        {children}
      </main>
      <footer className="footer">
        <div className="container">
          <p>Vape-Free Dashboard - Your journey to a healthier life</p>
        </div>
      </footer>
    </div>
  );
};

export default DashboardLayout; 