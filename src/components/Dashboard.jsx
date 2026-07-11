import { Activity, Users, AlertTriangle, CheckCircle, ShieldAlert } from 'lucide-react';
import PropTypes from 'prop-types';

function Dashboard({ staff, zones, setActiveTab }) {
  return (
    <div className="dashboard-grid">
      {/* Top Metrics Row */}
      <div className="top-metrics-row">
        {[
          { title: 'Total Attendance', value: '68,402', icon: <Users size={24} color="var(--accent-red)" /> },
          { title: 'Active Staff', value: staff.reduce((acc, s) => acc + s.count, 0).toLocaleString(), icon: <Activity size={24} color="var(--accent-blue)" /> },
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
  );
}

Dashboard.propTypes = {
  staff: PropTypes.array.isRequired,
  zones: PropTypes.array.isRequired,
  setActiveTab: PropTypes.func.isRequired,
};

export default Dashboard;
