import { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import './LandingPage.css';

function LandingPage({ onLogin }) {
  const [staffId, setStaffId] = useState('');
  const [pin, setPin] = useState('');
  const [role, setRole] = useState('admin');

  const handleLogin = useCallback((e) => {
    e.preventDefault();
    // SECURITY NOTE: This is a frontend mock for hackathon purposes.
    // In production, authentication and session management must happen on a secure backend server.
    if (staffId && pin) {
      onLogin({ id: staffId, role });
    }
  }, [staffId, pin, role, onLogin]);

  return (
    <main className="landing-page">
      
      {/* 3D Isometric Floating Stadium Graphic */}
      <div className="hero-image-container">
        <img src="/isometric_stadium.png" alt="Isometric Stadium" />
      </div>

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

          <form onSubmit={handleLogin} className="login-form">
            <div className="input-group">
              <label htmlFor="staffId" className="input-label">Staff ID / Callsign</label>
              <input 
                id="staffId"
                type="text" 
                className="neumorphic-input" 
                placeholder="e.g. SEC-Alpha-01" 
                value={staffId}
                onChange={(e) => setStaffId(e.target.value)}
                required
                aria-required="true"
              />
            </div>
            
            <div className="input-group">
              <label htmlFor="pin" className="input-label">Secure PIN</label>
              <input 
                id="pin"
                type="password" 
                className="neumorphic-input" 
                placeholder="••••••••" 
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                required
                aria-required="true"
              />
            </div>

            <div className="input-group">
              <label htmlFor="role" className="input-label">Role</label>
              <select 
                id="role"
                className="neumorphic-input"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="admin">Command Center Admin</option>
                <option value="staff">Field Staff</option>
              </select>
            </div>

            <button type="submit" className="login-btn">
              Authenticate & Enter
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

LandingPage.propTypes = {
  onLogin: PropTypes.func.isRequired,
};

export default LandingPage;
