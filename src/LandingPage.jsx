import { useState } from 'react';
import './LandingPage.css';

function LandingPage({ onLogin }) {
  const [staffId, setStaffId] = useState('');
  const [pin, setPin] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (staffId && pin) {
      onLogin();
    }
  };

  return (
    <div className="landing-page">
      {/* Frosted Glass Overlay covering the left half (hiding the baked-in text from the image) */}
      <div className="landing-overlay">
        
        <div className="login-card">
          <div className="login-header">
            <div className="login-title">
              <img src="/logo.png" alt="Logo" style={{ height: '48px', filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.2))' }} />
              OnStadium
            </div>
            <div className="login-subtitle">
              Operational Intelligence Dashboard. Please authenticate to access live stadium telemetry and staff deployment controls.
            </div>
          </div>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="input-group">
              <label className="input-label">Staff ID / Callsign</label>
              <input 
                type="text" 
                className="neumorphic-input" 
                placeholder="e.g. SEC-Alpha-01" 
                value={staffId}
                onChange={(e) => setStaffId(e.target.value)}
                required
              />
            </div>
            
            <div className="input-group">
              <label className="input-label">Secure PIN</label>
              <input 
                type="password" 
                className="neumorphic-input" 
                placeholder="••••••••" 
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="login-btn">
              Authenticate & Enter
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}

export default LandingPage;
