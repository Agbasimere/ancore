import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AmountInput } from './amount-input';

describe('AmountInput', () => {
  it('renders with label and asset badge', () => {
    render(<AmountInput balance="100.50" asset="XLM" />);
    expect(screen.getByText('Amount')).toBeInTheDocument();
    expect(screen.getByText('XLM')).toBeInTheDocument();
  });

  it('displays balance information', () => {
    render(<AmountInput balance="100.50" asset="XLM" />);
    expect(screen.getByText(/Balance: 100.50 XLM/)).toBeInTheDocument();
  });

  it('shows custom label when provided', () => {
    render(<AmountInput label="Send Amount" balance="50" asset="USDC" />);
    expect(screen.getByText('Send Amount')).toBeInTheDocument();
  });

  it('displays error message when provided', () => {
    render(<AmountInput error="Insufficient balance" balance="10" asset="XLM" />);
    expect(screen.getByText('Insufficient balance')).toBeInTheDocument();
  });

  it('renders input with number type', () => {
    render(<AmountInput balance="100" asset="XLM" />);
    const input = screen.getByPlaceholderText('0.00');
    expect(input).toHaveAttribute('type', 'number');
  });

  it('handles disabled state', () => {
    render(<AmountInput disabled balance="100" asset="XLM" />);
    const input = screen.getByPlaceholderText('0.00');
    expect(input).toBeDisabled();
  });
});
