function Incidents() {
  return (
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
  );
}

export default Incidents;
