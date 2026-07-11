import { Users } from 'lucide-react';
import PropTypes from 'prop-types';

function StaffDeployment({ staff, zones, reassigningId, setReassigningId, reassignZone, setReassignZone, reassignCount, setReassignCount, handleReassign }) {
  return (
    <div style={{ padding: '1.5rem 2rem', flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>On-Duty Personnel ({staff.reduce((acc, s) => acc + s.count, 0)})</h3>
        <div className="flex flex-col gap-4">
          {staff.map((s) => (
            <div key={s.id} style={{ padding: '1rem', background: 'var(--bg-color)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: 'var(--shadow-pressed)' }}>
              <div className="flex items-center gap-4">
                <Users color="var(--accent-blue)" />
                <div>
                  <div style={{ fontWeight: 600 }}>{s.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Location: {s.location}</div>
                </div>
              </div>
              {reassigningId === s.id ? (
                <div className="flex gap-2 items-center">
                  <select 
                    value={reassignZone} 
                    onChange={e => setReassignZone(e.target.value)} 
                    style={{ padding: '0.25rem 0.5rem', borderRadius: '8px', border: 'none', background: 'var(--bg-color)', boxShadow: 'var(--shadow-raised-sm)', outline: 'none' }}
                  >
                    {zones.map(z => <option key={z.id} value={z.name}>{z.name}</option>)}
                  </select>
                  <input 
                    type="number" 
                    min={1} 
                    value={reassignCount} 
                    onChange={e => setReassignCount(Number(e.target.value))} 
                    style={{ width: '60px', padding: '0.25rem 0.5rem', borderRadius: '8px', border: 'none', background: 'var(--bg-color)', boxShadow: 'var(--shadow-raised-sm)', outline: 'none' }} 
                  />
                  <button className="btn btn-primary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem' }} onClick={() => handleReassign(s)}>Confirm</button>
                  <button className="btn btn-ghost" style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem' }} onClick={() => setReassigningId(null)}>Cancel</button>
                </div>
              ) : (
                <div className="flex gap-4 items-center">
                  <span style={{ background: 'var(--bg-color)', boxShadow: 'var(--shadow-raised-sm)', padding: '0.25rem 0.75rem', borderRadius: '12px', fontSize: '0.8rem', color: 'var(--text-main)' }}>{s.count} Members</span>
                  <span style={{ color: s.status === 'Active' ? 'var(--accent-green)' : s.status === 'On Route' ? 'var(--accent-blue)' : 'var(--accent-yellow)', fontSize: '0.9rem', fontWeight: 500 }}>{s.status}</span>
                  <button className="btn btn-ghost" style={{ fontSize: '0.8rem' }} onClick={() => {
                    setReassigningId(s.id);
                    setReassignZone(zones[0]?.name || 'North Gate');
                    setReassignCount(s.count);
                  }}>Reassign</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

StaffDeployment.propTypes = {
  staff: PropTypes.array.isRequired,
  zones: PropTypes.array.isRequired,
  reassigningId: PropTypes.string,
  setReassigningId: PropTypes.func.isRequired,
  reassignZone: PropTypes.string.isRequired,
  setReassignZone: PropTypes.func.isRequired,
  reassignCount: PropTypes.number.isRequired,
  setReassignCount: PropTypes.func.isRequired,
  handleReassign: PropTypes.func.isRequired,
};

export default StaffDeployment;
