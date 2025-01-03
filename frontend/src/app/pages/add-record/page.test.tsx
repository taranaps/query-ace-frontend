import React from 'react';
import { render, screen } from '@testing-library/react';
import AddRecordPage from './page';
import '@testing-library/jest-dom';


jest.mock('@/app/components/navigation-tabs/NavigationTabs', () => () => <div data-testid="navigation-tabs"></div>);

describe('AddRecordPage Component', () => {
  test('renders without crashing', () => {
    const { container } = render(<AddRecordPage />);
    expect(container).toBeInTheDocument();
  });

  test('renders the NavigationTabs component', () => {
    render(<AddRecordPage />);
    const navigationTabs = screen.getByTestId('navigation-tabs');
    expect(navigationTabs).toBeInTheDocument();
  });

  test('applies correct inline styles to the parent div', () => {
    const { container } = render(<AddRecordPage />);
    const parentDiv = container.querySelector('div');
    expect(parentDiv).toHaveStyle({
      height: '100%',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
    });
  });
});
