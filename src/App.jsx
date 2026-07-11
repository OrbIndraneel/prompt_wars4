import { useState, useEffect } from 'react';
import { Search, Bell, Settings } from 'lucide-react';
import { generateStadiumData } from './utils/stadiumGenerator';
import LandingPage from './LandingPage';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ZoneMap from './components/ZoneMap';
import StaffDeployment from './components/StaffDeployment';
import Incidents from './components/Incidents';
import Chatbot from './components/Chatbot';
import './App.css';

// MOCK DATA for Stadium Operations
const INITIAL_ZONES = [
  { id: 'z1', name: 'North Gate', density: 85, status: 'warning' },
  { id: 'z2', name: 'South Concourse', density: 45, status: 'normal' },
  { id: 'z3', name: 'East Wing Seating', density: 92, status: 'critical' },
  { id: 'z4', name: 'VIP Lounge', density: 20, status: 'normal' },
  { id: 'z5', name: 'West Gate', density: 60, status: 'normal' },
];

function App() {
  const [activeTab, setActiveTab] = useState('Overview');
  const [zones, setZones] = useState(INITIAL_ZONES);
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  // Generator State
  const [isGeneratorMode, setIsGeneratorMode] = useState(false);
  const [genGates, setGenGates] = useState(8);
  const [genLevels, setGenLevels] = useState(3);
  const [genSeats, setGenSeats] = useState(50000);

  // Staff State
  const [staff, setStaff] = useState([
    { id: 's1', name: 'Security Team Alpha', location: 'North Gate', count: 12, status: 'Active' },
    { id: 's2', name: 'Medical Unit 3', location: 'East Wing', count: 4, status: 'On Route' },
    { id: 's3', name: 'Crowd Control Team C', location: 'South Concourse', count: 8, status: 'Active' },
    { id: 's4', name: 'Cleaning Crew B', location: 'VIP Lounge', count: 5, status: 'Standby' }
  ]);
  const [reassigningId, setReassigningId] = useState(null);
  const [reassignZone, setReassignZone] = useState('');
  const [reassignCount, setReassignCount] = useState(0);

  // Apply Theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleReassign = (team) => {
    if (reassignCount < team.count && reassignCount > 0) {
      const newTeam = {
        id: 's' + Date.now(),
        name: `${team.name} (Split)`,
        location: reassignZone,
        count: reassignCount,
        status: 'On Route'
      };
      setStaff(prev => prev.map(s => s.id === team.id ? { ...s, count: s.count - reassignCount } : s).concat(newTeam));
    } else {
      setStaff(prev => prev.map(s => s.id === team.id ? { ...s, location: reassignZone, status: 'On Route', count: reassignCount } : s));
    }
    setReassigningId(null);
  };

  // Auto-update global zones from generator map
  useEffect(() => {
    if (isGeneratorMode) {
      setZones(generateStadiumData(genGates, genLevels, genSeats));
    }
  }, [genGates, genLevels, genSeats, isGeneratorMode]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setZones(prev => prev.map(zone => {
        const variation = Math.floor(Math.random() * 11) - 5;
        let newDensity = Math.max(0, Math.min(100, zone.density + variation));
        
        let newStatus = 'normal';
        if (newDensity > 90) newStatus = 'critical';
        else if (newDensity > 75) newStatus = 'warning';

        return { ...zone, density: newDensity, status: newStatus };
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!user) {
    return <LandingPage onLogin={(userData) => { setUser(userData); setActiveTab('Overview'); }} />;
  }

  return (
    <div className="app-container">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} user={user} setUser={setUser} />

      <main className="main-content">
        <header className="glass-header topbar">
          <h1 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{activeTab === 'Overview' ? 'Operational Intelligence' : activeTab}</h1>
          <div className="flex items-center gap-4">
            <div style={{ position: 'relative' }}>
              <label htmlFor="topSearch" className="sr-only" style={{ display: 'none' }}>Search</label>
              <Search size={18} style={{ position: 'absolute', left: 12, top: 10, color: 'var(--text-muted)' }} />
              <input id="topSearch" type="text" className="search-bar" placeholder="Search operations..." style={{ paddingLeft: '2.5rem' }} />
            </div>
            <button className="btn btn-ghost" style={{ padding: '0.5rem' }} onClick={() => setActiveTab('Incidents')} aria-label="View Incidents">
              <Bell size={20} />
            </button>
          </div>
        </header>

        {activeTab === 'Overview' && <Dashboard staff={staff} zones={zones} setActiveTab={setActiveTab} />}
        {activeTab === 'Zone Maps' && (
          <ZoneMap 
            isGeneratorMode={isGeneratorMode} setIsGeneratorMode={setIsGeneratorMode}
            genGates={genGates} setGenGates={setGenGates}
            genLevels={genLevels} setGenLevels={setGenLevels}
            genSeats={genSeats} setGenSeats={setGenSeats}
            zones={zones}
          />
        )}
        {activeTab === 'Staff Deployment' && (
          <StaffDeployment 
            staff={staff} zones={zones} 
            reassigningId={reassigningId} setReassigningId={setReassigningId}
            reassignZone={reassignZone} setReassignZone={setReassignZone}
            reassignCount={reassignCount} setReassignCount={setReassignCount}
            handleReassign={handleReassign}
          />
        )}
        {activeTab === 'Incidents' && <Incidents />}
        {activeTab === 'Settings' && (
          <div style={{ padding: '1.5rem 2rem', flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="card" style={{ padding: '2rem' }}>
              <h2 style={{ marginBottom: '1.5rem', color: 'var(--text-main)' }}>Platform Settings</h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
                <div style={{ padding: '1.5rem', background: 'var(--bg-color)', borderRadius: '12px', boxShadow: 'var(--shadow-pressed)' }}>
                  <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Settings size={18} /> General Preferences
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <label htmlFor="themeSelect" style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Theme Mode</label>
                      <select 
                        id="themeSelect"
                        value={theme}
                        onChange={(e) => setTheme(e.target.value)}
                        style={{ padding: '0.5rem', borderRadius: '8px', border: 'none', background: 'var(--bg-color)', boxShadow: 'var(--shadow-raised-sm)', outline: 'none', color: 'var(--text-main)' }}
                      >
                        <option value="light">Neumorphic Light</option>
                        <option value="dark">Neumorphic Dark</option>
                      </select>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <label htmlFor="pushNotif" style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Push Notifications</label>
                      <input id="pushNotif" type="checkbox" defaultChecked style={{ width: '1.2rem', height: '1.2rem' }} />
                    </div>
                  </div>
                </div>
              </div>
              
              <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                <button className="btn btn-primary" onClick={() => alert('Settings saved successfully!')}>Save Changes</button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Chatbot zones={zones} />
    </div>
  );
}

export default App;
