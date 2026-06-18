import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import BalanceCard from './BalanceCard';

describe('BalanceCard Component', () => {
  it('renders the total balance correctly', () => {
    // Mock rendering the balance card
    render(<BalanceCard balance="123.45" publicKey="GABC1234567890XYZ" isLoading={false} />);
    
    // Check if balance value renders properly
    expect(screen.getByText('123.45')).toBeInTheDocument();
  });

  it('renders a shortened version of the public key', () => {
    render(<BalanceCard balance="100.00" publicKey="GABC1234567890XYZ" isLoading={false} />);
    
    // Check if the public key was shortened correctly (e.g., GABC1234...)
    expect(screen.getByText('GABC1234...')).toBeInTheDocument();
  });
  
  it('displays placeholder text if no public key is provided', () => {
    render(<BalanceCard balance="0.00" publicKey={null} isLoading={false} />);
    expect(screen.getByText('—')).toBeInTheDocument();
  });
});
