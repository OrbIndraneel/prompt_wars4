import { Activity, Users, Map as MapIcon, Settings, Bell } from 'lucide-react';
import PropTypes from 'prop-types';

function Sidebar({ activeTab, setActiveTab, user, setUser }) {
  const navItems = [
    { name: 'Overview', icon: <Activity size={20} /> },
    { name: 'Zone Maps', icon: <MapIcon size={20} /> },
    user?.role === 'admin' ? { name: 'Staff Deployment', icon: <Users size={20} /> } : null,
    { name: 'Incidents', icon: <Bell size={20} /> }
  ].filter(Boolean);

  return (
    <aside className="sidebar">
      <div className="brand">
        <img src="/logo.png" alt="OnStadium Logo" style={{ height: '36px', filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.2))' }} />
        OnStadium
      </div>
      
      <nav className="nav-links">
        {navItems.map(tab => (
          <button 
            key={tab.name}
            className={`nav-item ${activeTab === tab.name ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.name)}
            aria-label={`Navigate to ${tab.name}`}
            style={{ width: '100%', textAlign: 'left', background: 'transparent', border: 'none', cursor: 'pointer' }}
          >
            {tab.icon} {tab.name}
          </button>
        ))}
        <div style={{ flexGrow: 1 }}></div>
        <button 
          className={`nav-item ${activeTab === 'Settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('Settings')}
          aria-label="Navigate to Settings"
          style={{ width: '100%', textAlign: 'left', background: 'transparent', border: 'none', cursor: 'pointer' }}
        >
          <Settings size={20} /> Settings
        </button>
        
        <button 
          className="logout-card" 
          style={{ marginTop: '2rem', cursor: 'pointer', width: '100%', background: 'transparent', border: 'none', textAlign: 'left' }} 
          onClick={() => setUser(null)}
          aria-label="Logout"
        >
          <div className="flex items-center gap-2">
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'white', color: 'var(--accent-orange)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
              {user.id ? user.id.substring(0, 2).toUpperCase() : 'U'}
            </div>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>{user.id}</div>
              <div style={{ fontSize: '0.7rem', opacity: 0.8, textTransform: 'capitalize', color: 'var(--text-main)' }}>{user.role}</div>
            </div>
          </div>
          <div className="btn btn-ghost" style={{ padding: '0.25rem', color: 'var(--text-muted)' }}>➔</div>
        </button>
      </nav>
    </aside>
  );
}

Sidebar.propTypes = {
  activeTab: PropTypes.string.isRequired,
  setActiveTab: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  setUser: PropTypes.func.isRequired,
};

export default Sidebar;
