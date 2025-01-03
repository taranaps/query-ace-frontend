

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


    expect(screen.getByText('Import File')).toBeInTheDocument();
  });
});
