import { render, screen } from '@testing-library/react';
import DataCard from './DataCard';
import '@testing-library/jest-dom';
import React from 'react';

interface ButtonConfig {
  label: string;
  onClick: () => void;
  color?: "primary" | "secondary" | "error" | "success" | "info" | "warning";
  size?: "small" | "medium" | "large";
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

describe('DataCard', () => {
  it('renders buttons with different colors', () => {
    const buttons: ButtonConfig[] = [
      { label: 'Primary', color: 'primary', onClick: jest.fn() },
      { label: 'Secondary', color: 'secondary', onClick: jest.fn() },
      { label: 'Error', color: 'error', onClick: jest.fn() },
      { label: 'Success', color: 'success', onClick: jest.fn() },
      { label: 'Info', color: 'info', onClick: jest.fn() },
      { label: 'Warning', color: 'warning', onClick: jest.fn() }
    ];

    render(
      <DataCard 
        id={1}
        buttons={buttons}
      />
    );
  
    const primaryButton = screen.getByRole('button', { name: /Primary/i });
    const secondaryButton = screen.getByRole('button', { name: /Secondary/i });
    const errorButton = screen.getByRole('button', { name: /Error/i });
    const successButton = screen.getByRole('button', { name: /Success/i });
    const infoButton = screen.getByRole('button', { name: /Info/i });
    const warningButton = screen.getByRole('button', { name: /Warning/i });
  
    expect(primaryButton).toHaveClass('MuiButton-containedPrimary');
    expect(secondaryButton).toHaveClass('MuiButton-containedSecondary');
    expect(errorButton).toHaveClass('MuiButton-containedError');
    expect(successButton).toHaveClass('MuiButton-containedSuccess');
    expect(infoButton).toHaveClass('MuiButton-containedInfo');
    expect(warningButton).toHaveClass('MuiButton-containedWarning');
  });

  it('renders buttons with default primary color when color is not specified', () => {
    const buttons: ButtonConfig[] = [
      { label: 'Default Color', onClick: jest.fn() }
    ];

    render(<DataCard id={1} buttons={buttons} />);
    
    const button = screen.getByRole('button', { name: /Default Color/i });
    expect(button).toHaveClass('MuiButton-containedPrimary');
  });
});