import { render, screen, fireEvent } from '@testing-library/react';
import Filter from './filter';
import '@testing-library/jest-dom';


describe('Filter Component', () => {
  const mockOnFilterChange = jest.fn();
  const admins = ['Alice', 'Bob', 'Charlie', 'David'];

  test('renders Filter component', () => {
    render(<Filter admins={admins} onFilterChange={mockOnFilterChange} />);
    const filterButton = screen.getByText(/filter by: admin/i);
    expect(filterButton).toBeInTheDocument();
  });

  test('toggles popup visibility when filter button is clicked', () => {
    render(<Filter admins={admins} onFilterChange={mockOnFilterChange} />);
    const filterButton = screen.getByText(/filter by: admin/i);
    
    // Open the popup
    fireEvent.click(filterButton);
    expect(screen.getByText(/filter admins/i)).toBeInTheDocument();
    
    // Close the popup
    fireEvent.click(screen.getByText('✕'));
    expect(screen.queryByText(/filter admins/i)).not.toBeInTheDocument();
  });

  test('filters admins based on search query', () => {
    render(<Filter admins={admins} onFilterChange={mockOnFilterChange} />);
    fireEvent.click(screen.getByText(/filter by: admin/i));
    const searchInput = screen.getByPlaceholderText(/search admins/i);
    
    fireEvent.change(searchInput, { target: { value: 'Bo' } });
    expect(screen.getByLabelText('Bob')).toBeInTheDocument();
    expect(screen.queryByLabelText('Alice')).not.toBeInTheDocument();
  });

  test('selects and deselects admins correctly', () => {
    render(<Filter admins={admins} onFilterChange={mockOnFilterChange} />);
    fireEvent.click(screen.getByText(/filter by: admin/i));

    const bobCheckbox = screen.getByLabelText('Bob');
    const aliceCheckbox = screen.getByLabelText('Alice');

    // Select Bob
    fireEvent.click(bobCheckbox);
    expect(bobCheckbox).toBeChecked();
    expect(mockOnFilterChange).toHaveBeenCalledWith(['Bob']);

    // Deselect Bob
    fireEvent.click(bobCheckbox);
    expect(bobCheckbox).not.toBeChecked();
    expect(mockOnFilterChange).toHaveBeenCalledWith([]);
    
    // Select Alice
    fireEvent.click(aliceCheckbox);
    expect(aliceCheckbox).toBeChecked();
    expect(mockOnFilterChange).toHaveBeenCalledWith(['Alice']);
  });

  test('calls onFilterChange with selected admins', () => {
    render(<Filter admins={admins} onFilterChange={mockOnFilterChange} />);
    fireEvent.click(screen.getByText(/filter by: admin/i));
    
    // Select multiple admins
    fireEvent.click(screen.getByLabelText('Alice'));
    fireEvent.click(screen.getByLabelText('David'));
    
    expect(mockOnFilterChange).toHaveBeenCalledWith(['Alice', 'David']);
  });
});
