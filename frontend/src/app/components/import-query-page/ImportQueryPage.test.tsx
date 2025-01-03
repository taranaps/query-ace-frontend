import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import ImportQueryPage from './ImportQueryPage';

jest.mock('lottie-react', () => ({
  __esModule: true,
  default: () => <div data-testid="lottie-animation" /> 
}));

describe('ImportQueryPage Component', () => {
  test('renders the Import File button', () => {
    render(<ImportQueryPage />);

    // Check if the "Import File" button is rendered correctly
    const importButton = screen.getByText('Import File');
    expect(importButton).toBeInTheDocument();
  });
});
