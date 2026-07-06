import { useState, useEffect, useRef } from 'react';
import { 
  Activity, Users, Map as MapIcon, Settings, Bell, Search, 
  Send, AlertTriangle, CheckCircle, ShieldAlert 
} from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { generateStadiumData } from './utils/stadiumGenerator';
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
  const [isChatOpen, setIsChatOpen] = useState(false);
  const chatEndRef = useRef(null);

  // Generator State
  const [isGeneratorMode, setIsGeneratorMode] = useState(false);
  const [genGates, setGenGates] = useState(8);
  const [genLevels, setGenLevels] = useState(3);
  const [genSeats, setGenSeats] = useState(50000);

  // Auto-update global zones from generator map
  useEffect(() => {
    if (isGeneratorMode) {
      setZones(generateStadiumData(genGates, genLevels, genSeats));
    }
  }, [genGates, genLevels, genSeats, isGeneratorMode]);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setZones(prev => prev.map(zone => {
        // If the zone has a path (meaning it's generated), keep the path
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
      // Small timeout to allow UI to show typing indicator
      setTimeout(async () => {
        try {
          const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
          if (apiKey && apiKey !== 'YOUR_API_KEY_HERE') {
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
            const promptContext = `You are a Stadium Operations AI Assistant for the FIFA World Cup 2026.
Current Live Zone Status (JSON):
${JSON.stringify(zones)}

The user asks: "${userMessage}"
Provide a brief, professional, and actionable response based on the live zone status. Keep it under 3 sentences.`;

            const result = await model.generateContent(promptContext);
            setMessages(prev => [...prev, { role: 'ai', text: result.response.text() }]);
          } else {
            // Fallback to mock response if no API key is set
            const mockResponse = generateMockAIResponse(userMessage, zones);
            setMessages(prev => [...prev, { role: 'ai', text: mockResponse + " (Mock mode: No VITE_GEMINI_API_KEY found)" }]);
          }
        } catch (apiError) {
          console.error("Gemini API Error:", apiError);
          setMessages(prev => [...prev, { role: 'ai', text: "Error connecting to AI services. Please check your API key." }]);
        } finally {
          setIsTyping(false);
        }
      }, 500);

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
          <div 
            className={`nav-item ${activeTab === 'Settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('Settings')}
          >
            <Settings size={20} /> Settings
          </div>
          
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
            <button className="btn btn-ghost" style={{ padding: '0.25rem', color: 'var(--text-muted)' }} onClick={() => alert('Logging out of StadiumCompanion AI...')}>➔</button>
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
            <button className="btn btn-ghost" style={{ padding: '0.5rem' }} onClick={() => alert('Opening notifications...')}>
              <Bell size={20} />
            </button>
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
                <div key={idx} className="card" style={{ flex: 1, padding: '1.5rem 1.25rem', flexDirection: 'row', alignItems: 'center', gap: '1.25rem' }}>
                  <div style={{ width: 48, height: 48, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-pressed)' }}>
                    {metric.icon}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.2 }}>{metric.title}</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-main)' }}>{metric.value}</div>
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
              
              <div className="flex flex-col gap-4" style={{ marginTop: '1rem', flexGrow: 1, overflowY: 'auto', paddingRight: '0.5rem' }}>
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

          </div>
        )}

        {activeTab === 'Zone Maps' && (
          <div style={{ padding: '1.5rem 2rem', flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="flex justify-between items-center">
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Interactive Mapping</h2>
              <button 
                className="btn btn-primary" 
                onClick={() => setIsGeneratorMode(!isGeneratorMode)}
              >
                {isGeneratorMode ? 'Exit Generator' : 'Layout Generator'}
              </button>
            </div>

            {isGeneratorMode && (
              <div className="card animate-fade-in" style={{ padding: '1.5rem', display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Number of Gates ({genGates})</label>
                  <input type="range" min="2" max="16" value={genGates} onChange={(e) => setGenGates(Number(e.target.value))} style={{ width: '100%', marginTop: '0.5rem' }} />
                </div>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Tiers / Levels ({genLevels})</label>
                  <input type="range" min="1" max="5" value={genLevels} onChange={(e) => setGenLevels(Number(e.target.value))} style={{ width: '100%', marginTop: '0.5rem' }} />
                </div>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Capacity ({genSeats.toLocaleString()})</label>
                  <input type="range" min="10000" max="100000" step="5000" value={genSeats} onChange={(e) => setGenSeats(Number(e.target.value))} style={{ width: '100%', marginTop: '0.5rem' }} />
                </div>
              </div>
            )}

            <div className="card" style={{ flexGrow: 1, minHeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 20, left: 20, background: 'var(--bg-color)', padding: '1.25rem', borderRadius: '12px', zIndex: 10, boxShadow: 'var(--shadow-raised-sm)' }}>
                <h3 style={{ marginBottom: '1rem', color: 'var(--text-main)' }}>Map Legend</h3>
                <div className="flex items-center gap-2" style={{ marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}><div style={{ width: 12, height: 12, background: 'var(--accent-green)', borderRadius: '50%' }}></div> Normal</div>
                <div className="flex items-center gap-2" style={{ marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}><div style={{ width: 12, height: 12, background: 'var(--accent-yellow)', borderRadius: '50%' }}></div> Warning</div>
                <div className="flex items-center gap-2" style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}><div style={{ width: 12, height: 12, background: 'var(--accent-red)', borderRadius: '50%' }}></div> Critical</div>
              </div>
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg viewBox="0 0 800 600" style={{ width: '100%', height: '100%', filter: 'drop-shadow(var(--shadow-raised))' }}>
                  {/* Center Pitch */}
                  <rect x="320" y="180" width="160" height="240" rx="40" fill="transparent" stroke="var(--text-muted)" strokeWidth="3" strokeDasharray="8 8" opacity="0.3" />
                  <circle cx="400" cy="300" r="25" fill="transparent" stroke="var(--text-muted)" strokeWidth="3" strokeDasharray="8 8" opacity="0.3" />
                  <line x1="320" y1="300" x2="480" y2="300" stroke="var(--text-muted)" strokeWidth="3" strokeDasharray="8 8" opacity="0.3" />
                  
                  {/* Zones */}
                  {zones.map((zone, idx) => (
                    zone.path ? (
                      // Dynamic Generated Paths
                      <path 
                        key={idx} 
                        d={zone.path} 
                        fill={zone.status === 'critical' ? 'var(--accent-red)' : zone.status === 'warning' ? 'var(--accent-yellow)' : 'var(--accent-green)'} 
                        opacity="0.85" 
                        style={{ transition: 'fill 0.5s ease', cursor: 'pointer' }}
                        title={`${zone.name}`}
                      />
                    ) : (
                      // Fallback for INITIAL_ZONES that don't have a path
                      <text key={idx} x="400" y={200 + (idx * 30)} textAnchor="middle" fill="var(--text-muted)">
                        Enable Generator for Map View
                      </text>
                    )
                  ))}
                </svg>
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
                      <button className="btn btn-ghost" style={{ fontSize: '0.8rem' }} onClick={() => alert(`Reassigning ${s.name} to a new zone...`)}>Reassign</button>
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
                <button className="btn btn-primary" style={{ fontSize: '0.9rem' }} onClick={() => alert('Opening Incident Report form...')}>Report Incident</button>
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
                    <button className="btn btn-ghost" style={{ fontSize: '0.8rem' }} onClick={() => alert(`Viewing details for: ${inc.title}`)}>View Details</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

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
                      <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Theme Mode</span>
                      <select style={{ padding: '0.5rem', borderRadius: '8px', border: 'none', background: 'var(--bg-color)', boxShadow: 'var(--shadow-raised-sm)', outline: 'none' }}>
                        <option>Neumorphic Light</option>
                        <option disabled>Dark Mode (Coming Soon)</option>
                      </select>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Push Notifications</span>
                      <input type="checkbox" defaultChecked style={{ width: '1.2rem', height: '1.2rem' }} />
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

      {/* Floating Action Button */}
      <button className="chatbot-fab" onClick={() => setIsChatOpen(!isChatOpen)}>
        <Activity size={28} />
      </button>

      {/* AI Assistant Popup */}
      {isChatOpen && (
        <div className="ai-assistant-popup animate-fade-in">
          <div className="card-title">
            <div className="flex items-center gap-2">
              <Activity size={18} />
              Ops Assistant AI
            </div>
            <button className="btn btn-ghost" style={{ padding: 0 }} onClick={() => setIsChatOpen(false)}>✕</button>
          </div>
          <div className="chat-messages" style={{ overflowY: 'auto', flexGrow: 1, paddingRight: '0.5rem', marginBottom: '1rem' }}>
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
      )}
    </div>
  );
}

export default App;
