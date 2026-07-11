import { render, screen, fireEvent } from '@testing-library/react';
import LandingPage from './LandingPage';
import { describe, it, expect, vi } from 'vitest';

describe('LandingPage', () => {
  it('renders login form', () => {
    render(<LandingPage onLogin={() => {}} />);
    expect(screen.getByText('OnStadium')).toBeInTheDocument();
    expect(screen.getByLabelText('Staff ID / Callsign')).toBeInTheDocument();
    expect(screen.getByLabelText('Secure PIN')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Authenticate & Enter/i })).toBeInTheDocument();
  });

  it('calls onLogin with credentials when submitted', () => {
    const handleLogin = vi.fn();
    render(<LandingPage onLogin={handleLogin} />);
    
    const staffIdInput = screen.getByLabelText('Staff ID / Callsign');
    const pinInput = screen.getByLabelText('Secure PIN');
    const submitBtn = screen.getByRole('button', { name: /Authenticate & Enter/i });

    fireEvent.change(staffIdInput, { target: { value: 'SEC-123' } });
    fireEvent.change(pinInput, { target: { value: 'password' } });
    fireEvent.click(submitBtn);

    expect(handleLogin).toHaveBeenCalledWith({ id: 'SEC-123', role: 'admin' });
  });
});
