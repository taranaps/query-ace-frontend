// Import necessary testing utilities and the component to test


import '@testing-library/jest-dom';






import { render, screen } from '@testing-library/react';
import ImportQueryPage from './ImportQueryPage';


// Mock Lottie component to avoid animation errors during tests
jest.mock('lottie-react', () => ({
  __esModule: true,
  default: () => <div data-testid="lottie-animation" /> // Mock Lottie animation
}));


describe('ImportQueryPage Component', () => {
  test('renders the Import File button', () => {
    render(<ImportQueryPage />);


    // Check if the "Import File" button is in the document
    expect(screen.getByText('Import File')).toBeInTheDocument();
  });
});
