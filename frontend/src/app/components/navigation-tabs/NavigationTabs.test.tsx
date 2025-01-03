import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import NavigationTabs from './NavigationTabs';
import '@testing-library/jest-dom';


jest.mock('../add-record-form/AddRecordForm', () => () => <div data-testid="add-record-form">Add Record Form</div>);
jest.mock('../import-query-page/ImportQueryPage', () => () => <div data-testid="import-files-page">Import Files Page</div>);

describe('NavigationTabs Component', () => {
  test('renders without crashing', () => {
    const { container } = render(<NavigationTabs />);
    expect(container).toBeInTheDocument();
  });

  test('default active tab is Add Query', () => {
    render(<NavigationTabs />);
    const addQueryTab = screen.getByText('Add Query');
    expect(addQueryTab).toHaveClass('active'); 
    expect(screen.getByTestId('add-record-form')).toBeInTheDocument();
  });

  test('switches to Import Query tab on click', () => {
    render(<NavigationTabs />);
    const importQueryTab = screen.getByText('Import Query');
    fireEvent.click(importQueryTab);
    expect(importQueryTab).toHaveClass('active');
    expect(screen.getByTestId('import-files-page')).toBeInTheDocument();
  });

  test('active tab has correct class', () => {
    render(<NavigationTabs />);
    const addQueryTab = screen.getByText('Add Query');
    const importQueryTab = screen.getByText('Import Query');
    fireEvent.click(importQueryTab);
    expect(importQueryTab).toHaveClass('active');
    expect(addQueryTab).not.toHaveClass('active');
  });

  test('renders both tab buttons', () => {
    render(<NavigationTabs />);
    expect(screen.getByText('Add Query')).toBeInTheDocument();
    expect(screen.getByText('Import Query')).toBeInTheDocument();
  });
});
