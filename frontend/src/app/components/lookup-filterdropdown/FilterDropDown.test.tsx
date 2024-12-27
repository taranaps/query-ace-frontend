import React from 'react';
import { render, screen, fireEvent,waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FilterDropdown from '../lookup-filterdropdown/FilterDropDown';

describe('FilterDropdown', () => {
  const defaultProps = {
    label: 'Filter',
    options: ['Apple', 'Banana', 'Cherry', 'Date'],
    selectedOptions: [],
    onChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with the correct label', () => {
    render(<FilterDropdown {...defaultProps} />);
    expect(screen.getByRole('button')).toHaveTextContent('Filter');
  });

  it('opens dropdown when clicking the button', () => {
    render(<FilterDropdown {...defaultProps} />);
    const button = screen.getByRole('button');

    fireEvent.click(button);

    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    expect(screen.getByText('Apple')).toBeInTheDocument();
  });

  it('filters options based on search input', async () => {
    render(<FilterDropdown {...defaultProps} />);

    // Open dropdown
    fireEvent.click(screen.getByRole('button'));

    // Type in search
    const searchInput = screen.getByPlaceholderText('Search...');
    await userEvent.type(searchInput, 'ap');

    // Check filtered results
    expect(screen.getByText('Apple')).toBeInTheDocument();
    expect(screen.queryByText('Banana')).not.toBeInTheDocument();
  });

  it('closes dropdown when clicking outside', async () => {
    render(<FilterDropdown {...defaultProps} />);

    // Open dropdown
    fireEvent.click(screen.getByRole('button'));

    // Click outside
    fireEvent.mouseDown(document.body);

    // Wait for dropdown to close
    await waitFor(() => {
      expect(screen.queryByPlaceholderText('Search...')).not.toBeInTheDocument();
    });
  });

  it('handles case-insensitive search', async () => {
    render(<FilterDropdown {...defaultProps} />);

    // Open dropdown
    fireEvent.click(screen.getByRole('button'));

    // Type in search with different cases
    const searchInput = screen.getByPlaceholderText('Search...');
    await userEvent.type(searchInput, 'aPpLe');

    expect(screen.getByText('Apple')).toBeInTheDocument();
  });

  it('preserves search text when closing and reopening dropdown', async () => {
    render(<FilterDropdown {...defaultProps} />);

    // Open dropdown
    fireEvent.click(screen.getByRole('button'));

    // Type in search
    const searchInput = screen.getByPlaceholderText('Search...');
    await userEvent.type(searchInput, 'ap');

    // Close dropdown
    fireEvent.click(screen.getByRole('button'));

    // Reopen dropdown
    fireEvent.click(screen.getByRole('button'));

    // Verify search text is preserved
    expect(screen.getByPlaceholderText('Search...')).toHaveValue('ap');
  });

  it('handles empty options array', () => {
    render(
      <FilterDropdown
        {...defaultProps}
        options={[]}
      />
    );

    // Open dropdown
    fireEvent.click(screen.getByRole('button'));

    // Verify no options are displayed
    const options = screen.queryAllByRole('checkbox');
    expect(options).toHaveLength(0);
  });
});