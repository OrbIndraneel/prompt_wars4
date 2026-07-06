import { useState, useEffect, useRef } from 'react';
import { 
  Activity, Users, Map as MapIcon, Settings, Bell, Search, 
  Send, AlertTriangle, CheckCircle, ShieldAlert 
} from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
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
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'StadiumOps AI initialized. How can I assist you with current operations?' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setZones(prev => prev.map(zone => {
        const variation = Math.floor(Math.random() * 11) - 5; // -5 to +5
        let newDensity = Math.max(0, Math.min(100, zone.density + variation));
        
        let newStatus = 'normal';
        if (newDensity > 90) newStatus = 'critical';
        else if (newDensity > 75) newStatus = 'warning';

        return { ...zone, density: newDensity, status: newStatus };
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage = chatInput;
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setChatInput('');
    setIsTyping(true);

    try {
      setTimeout(() => {
        const mockResponse = generateMockAIResponse(userMessage, zones);
        setMessages(prev => [...prev, { role: 'ai', text: mockResponse }]);
        setIsTyping(false);
      }, 1500);

    } catch (error) {
      console.error(error);
      setIsTyping(false);
    }
  };

  const generateMockAIResponse = (query, currentZones) => {
    const q = query.toLowerCase();
    const criticalZone = currentZones.find(z => z.status === 'critical');
    
    if (q.includes('congestion') || q.includes('crowd') || q.includes('busy')) {
      if (criticalZone) {
        return `I've analyzed the live feeds. ${criticalZone.name} is currently experiencing critical congestion (${criticalZone.density}%). I recommend opening overflow lanes 3 and 4 and dispatching 2 additional crowd management staff.`;
      }
      return "Current crowd levels are manageable across all sectors. The busiest area is North Gate at 85% capacity.";
    }
    
    if (q.includes('evacuate') || q.includes('emergency')) {
      return "Generating emergency routing... Direct all East Wing traffic to Exits 12-15. Overriding digital signage now.";
    }

    return "I can assist with crowd management, resource allocation, and emergency routing. What specific area are you inquiring about?";
  };

  const tabs = [
    { name: 'Overview', icon: <Activity size={20} /> },
    { name: 'Zone Maps', icon: <MapIcon size={20} /> },
    { name: 'Staff Deployment', icon: <Users size={20} /> },
    { name: 'Incidents', icon: <Bell size={20} /> }
  ];

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="brand">
          <Activity size={28} color="white" />
          StadiumCompanion AI
        </div>
        
        <nav className="nav-links">
          {tabs.map(tab => (
            <div 
              key={tab.name}
              className={`nav-item ${activeTab === tab.name ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.name)}
            >
              {tab.icon} {tab.name}
            </div>
          ))}
          <div style={{ flexGrow: 1 }}></div>
          <div className="nav-item"><Settings size={20} /> Settings</div>
          
          <div className="logout-card" style={{ marginTop: '2rem' }}>
            <div className="flex items-center gap-2">
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'white', color: 'var(--accent-orange)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                JD
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>John Doe</div>
                <div style={{ fontSize: '0.7rem', opacity: 0.8 }}>Admin</div>
              </div>
            </div>
            <button className="btn btn-ghost" style={{ padding: '0.25rem', color: 'white' }}>➔</button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="glass-header topbar">
          <h1 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{activeTab === 'Overview' ? 'Operational Intelligence' : activeTab}</h1>
          <div className="flex items-center gap-4">
            <div style={{ position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: 12, top: 10, color: 'var(--text-muted)' }} />
              <input type="text" className="search-bar" placeholder="Search operations..." style={{ paddingLeft: '2.5rem' }} />
            </div>
            <button className="btn btn-ghost" style={{ padding: '0.5rem' }}><Bell size={20} /></button>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--bg-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', boxShadow: 'var(--shadow-raised-sm)', color: 'var(--text-main)' }}>
              SO
            </div>
          </div>
        </header>

        {activeTab === 'Overview' && (
          <div className="dashboard-grid">
            
            {/* Top Metrics Row */}
            <div className="top-metrics-row">
              {[
                { title: 'Total Attendance', value: '68,402', icon: <Users size={24} color="var(--accent-red)" /> },
                { title: 'Active Staff', value: '1,204', icon: <Activity size={24} color="var(--accent-blue)" /> },
                { title: 'Active Incidents', value: '3', icon: <ShieldAlert size={24} color="var(--accent-green)" /> },
                { title: 'Avg Congestion', value: '42%', icon: <AlertTriangle size={24} color="var(--accent-yellow)" /> },
              ].map((metric, idx) => (
                <div key={idx} className="card" style={{ flex: 1, padding: '1.25rem', flexDirection: 'row', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: 50, height: 50, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-pressed)' }}>
                    {metric.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>{metric.title}</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{metric.value}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Stadium Map Widget */}
            <div className="card stadium-map">
              <div className="card-title">
                <span>Live Zone Status</span>
                <button className="btn btn-ghost" style={{ fontSize: '0.8rem', padding: '0.25rem 0.75rem' }} onClick={() => setActiveTab('Zone Maps')}>Full Map</button>
              </div>
              
              <div className="flex flex-col gap-4" style={{ marginTop: '1rem' }}>
                {zones.map(zone => (
                  <div key={zone.id} className="metric-item animate-fade-in">
                    <div className="flex items-center gap-4">
                      {zone.status === 'critical' ? <ShieldAlert color="var(--accent-red)" /> : 
                       zone.status === 'warning' ? <AlertTriangle color="var(--accent-yellow)" /> : 
                       <CheckCircle color="var(--accent-green)" />}
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{zone.name}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Status: {zone.status.toUpperCase()}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div style={{ width: 150, height: 8, borderRadius: 4, overflow: 'hidden', boxShadow: 'var(--shadow-pressed)' }}>
                        <div style={{ 
                          height: '100%', 
                          width: `${zone.density}%`,
                          background: zone.status === 'critical' ? 'var(--accent-red)' : zone.status === 'warning' ? 'var(--accent-yellow)' : 'var(--accent-green)',
                          transition: 'width 0.5s ease'
                        }}></div>
                      </div>
                      <div className="metric-value" style={{ color: 'var(--text-main)' }}>{zone.density}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Assistant Chat */}
            <div className="card ai-assistant">
              <div className="card-title">
                <div className="flex items-center gap-2">
                  <Activity size={18} />
                  Ops Assistant AI
                </div>
              </div>
              <div className="chat-messages">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`message ${msg.role}`}>
                    {msg.text}
                  </div>
                ))}
                {isTyping && (
                  <div className="message ai" style={{ opacity: 0.9 }}>Analyzing stadium data...</div>
                )}
                <div ref={chatEndRef} />
              </div>
              <form onSubmit={handleSendMessage} className="chat-input-container">
                <input 
                  type="text" 
                  className="chat-input"
                  placeholder="Ask for routing..." 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                />
                <button type="submit" className="icon-btn" disabled={!chatInput.trim() || isTyping}>
                  <Send size={18} />
                </button>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'Zone Maps' && (
          <div style={{ padding: '1.5rem 2rem', flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="glass-panel" style={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 20, left: 20, background: 'var(--panel-bg)', padding: '1rem', borderRadius: '8px', zIndex: 10 }}>
                <h3 style={{ marginBottom: '0.5rem' }}>Map Legend</h3>
                <div className="flex items-center gap-2" style={{ marginBottom: '0.25rem', fontSize: '0.9rem' }}><div style={{ width: 12, height: 12, background: 'var(--accent-green)', borderRadius: '50%' }}></div> Normal</div>
                <div className="flex items-center gap-2" style={{ marginBottom: '0.25rem', fontSize: '0.9rem' }}><div style={{ width: 12, height: 12, background: 'var(--accent-yellow)', borderRadius: '50%' }}></div> Warning</div>
                <div className="flex items-center gap-2" style={{ fontSize: '0.9rem' }}><div style={{ width: 12, height: 12, background: 'var(--accent-red)', borderRadius: '50%' }}></div> Critical</div>
              </div>
              <div style={{ width: '60%', height: '60%', border: '2px dashed rgba(255,255,255,0.2)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <MapIcon size={64} color="rgba(255,255,255,0.1)" />
                <span style={{ position: 'absolute', color: 'rgba(255,255,255,0.3)', fontSize: '1.5rem', fontWeight: 600 }}>Interactive Stadium SVG/Canvas Placeholder</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Staff Deployment' && (
          <div style={{ padding: '1.5rem 2rem', flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <h3 style={{ marginBottom: '1rem' }}>On-Duty Personnel (1,204)</h3>
              <div className="flex flex-col gap-4">
                {[
                  { name: 'Security Team Alpha', location: 'North Gate', count: 12, status: 'Active' },
                  { name: 'Medical Unit 3', location: 'East Wing', count: 4, status: 'On Route' },
                  { name: 'Crowd Control Team C', location: 'South Concourse', count: 8, status: 'Active' },
                  { name: 'Cleaning Crew B', location: 'VIP Lounge', count: 5, status: 'Standby' }
                ].map((s, idx) => (
                  <div key={idx} style={{ padding: '1rem', background: 'var(--bg-color)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: 'var(--shadow-pressed)' }}>
                    <div className="flex items-center gap-4">
                      <Users color="var(--accent-blue)" />
                      <div>
                        <div style={{ fontWeight: 600 }}>{s.name}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Location: {s.location}</div>
                      </div>
                    </div>
                    <div className="flex gap-4 items-center">
                      <span style={{ background: 'rgba(255,255,255,0.1)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem' }}>{s.count} Members</span>
                      <span style={{ color: s.status === 'Active' ? 'var(--accent-green)' : 'var(--accent-yellow)', fontSize: '0.9rem', fontWeight: 500 }}>{s.status}</span>
                      <button className="btn btn-ghost" style={{ fontSize: '0.8rem' }}>Reassign</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Incidents' && (
          <div style={{ padding: '1.5rem 2rem', flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <div className="flex justify-between items-center" style={{ marginBottom: '1rem' }}>
                <h3>Active Incidents & Alerts</h3>
                <button className="btn btn-primary" style={{ fontSize: '0.9rem' }}>Report Incident</button>
              </div>
              <div className="flex flex-col gap-4">
                {[
                  { title: 'Severe Congestion at Gate 3', time: '2 mins ago', severity: 'High', type: 'Crowd Control' },
                  { title: 'Medical emergency reported in Section 104', time: '15 mins ago', severity: 'Critical', type: 'Medical' },
                  { title: 'Spill on Concourse B', time: '45 mins ago', severity: 'Low', type: 'Maintenance' },
                ].map((inc, idx) => (
                  <div key={idx} style={{ padding: '1rem', background: 'var(--bg-color)', borderLeft: `4px solid ${inc.severity === 'Critical' ? 'var(--accent-red)' : inc.severity === 'High' ? 'var(--accent-yellow)' : 'var(--accent-blue)'}`, borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: 'var(--shadow-pressed)' }}>
                    <div>
                      <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{inc.title}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{inc.time} • Type: {inc.type}</div>
                    </div>
                    <button className="btn btn-ghost" style={{ fontSize: '0.8rem' }}>View Details</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
