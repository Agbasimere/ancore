import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { AddressDisplay } from './address-display';

const sampleAddress = 'GCZJM35NKGVK47BB4SPBDV25477PZYIYPVVG453LPYFNXLS3FGHDXOCM';

describe('AddressDisplay', () => {
  it('renders address with truncation', () => {
    render(<AddressDisplay address={sampleAddress} />);
    expect(screen.getByText(/GCZJM3...HDXOCM/)).toBeInTheDocument();
  });

  it('renders label when provided', () => {
    render(<AddressDisplay address={sampleAddress} label="Wallet Address" />);
    expect(screen.getByText('Wallet Address')).toBeInTheDocument();
  });

  it('shows full short addresses without truncation', () => {
    const shortAddress = 'SHORT';
    render(<AddressDisplay address={shortAddress} />);
    expect(screen.getByText('SHORT')).toBeInTheDocument();
  });

  it('renders copy button by default', () => {
    render(<AddressDisplay address={sampleAddress} />);
    const copyButton = screen.getByLabelText('Copy address');
    expect(copyButton).toBeInTheDocument();
  });

  it('hides copy button when copyable is false', () => {
    render(<AddressDisplay address={sampleAddress} copyable={false} />);
    const copyButton = screen.queryByLabelText('Copy address');
    expect(copyButton).not.toBeInTheDocument();
  });

  it('handles copy to clipboard', async () => {
    const user = userEvent.setup();
    
    // Mock clipboard API
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });

    render(<AddressDisplay address={sampleAddress} />);
    const copyButton = screen.getByLabelText('Copy address');
    
    await user.click(copyButton);
    
    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(sampleAddress);
    });
  });

  it('respects custom truncation length', () => {
    render(<AddressDisplay address={sampleAddress} truncate={10} />);
    expect(screen.getByText(/GCZJM35NKG...3FGHDXOCM/)).toBeInTheDocument();
  });
});
