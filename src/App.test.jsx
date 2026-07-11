import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';
import { describe, it, expect } from 'vitest';

describe('App', () => {
  it('renders landing page initially', () => {
    render(<App />);
    expect(screen.getByText('Authenticate & Enter')).toBeInTheDocument();
  });

  it('renders dashboard after login', () => {
    render(<App />);
    const staffIdInput = screen.getByLabelText('Staff ID / Callsign');
    const pinInput = screen.getByLabelText('Secure PIN');
    const submitBtn = screen.getByRole('button', { name: /Authenticate & Enter/i });

    fireEvent.change(staffIdInput, { target: { value: 'SEC-123' } });
    fireEvent.change(pinInput, { target: { value: '1234' } });
    fireEvent.click(submitBtn);

    expect(screen.getByText('Operational Intelligence')).toBeInTheDocument();
    expect(screen.getByText('Total Attendance')).toBeInTheDocument();
  });
});
