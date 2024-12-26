import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SystemLog from './page'; // Replace with the actual import path of your component

describe('SystemLog Component', () => {
  test('filters logs based on selected admin', async () => {
    render(<SystemLog />); // Render your component

    // Simulate clicking the filter button to open the filter dropdown
    fireEvent.click(screen.getByText(/Filter by: Admin/i));

    // Simulate selecting "Arun Kumar" from the admin filter options
    fireEvent.click(screen.getByLabelText(/Arun Kumar/i)); // Assuming checkbox has accessible label

    // Wait for the filtering to complete
    await waitFor(() => {
      // Select all log items that are visible
      const visibleLogs = screen
        .getAllByText(/User Arun Kumar added Manoj Kumar as Admin/i, { exact: false })
        .filter(log => log.closest('.logItem')?.classList.contains('visible'));

      // Check that only one log is visible after filtering
      expect(visibleLogs.length).toBe(1);
    });

    // Ensure other logs are not visible
    const hiddenLogs = screen
      .getAllByText(/Parvathy Eeshwar removed Arun Mathew from Admin/i, { exact: false })
      .filter(log => !log.closest('.logItem')?.classList.contains('visible'));

    expect(hiddenLogs.length).toBeGreaterThan(0); // Ensure there are hidden logs
  });
});
