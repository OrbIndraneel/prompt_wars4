import PropTypes from 'prop-types';

function ZoneMap({ isGeneratorMode, setIsGeneratorMode, genGates, setGenGates, genLevels, setGenLevels, genSeats, setGenSeats, zones }) {
  return (
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
            <rect x="340" y="210" width="120" height="180" rx="30" fill="transparent" stroke="var(--text-muted)" strokeWidth="3" strokeDasharray="8 8" opacity="0.3" />
            <circle cx="400" cy="300" r="20" fill="transparent" stroke="var(--text-muted)" strokeWidth="3" strokeDasharray="8 8" opacity="0.3" />
            <line x1="340" y1="300" x2="460" y2="300" stroke="var(--text-muted)" strokeWidth="3" strokeDasharray="8 8" opacity="0.3" />
            
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
  );
}

ZoneMap.propTypes = {
  isGeneratorMode: PropTypes.bool.isRequired,
  setIsGeneratorMode: PropTypes.func.isRequired,
  genGates: PropTypes.number.isRequired,
  setGenGates: PropTypes.func.isRequired,
  genLevels: PropTypes.number.isRequired,
  setGenLevels: PropTypes.func.isRequired,
  genSeats: PropTypes.number.isRequired,
  setGenSeats: PropTypes.func.isRequired,
  zones: PropTypes.array.isRequired,
};

export default ZoneMap;
