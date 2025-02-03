// import { render, screen, fireEvent, waitFor } from '@testing-library/react';
// import SystemLog from './page'; 

// describe('SystemLog Component', () => {
//   test('filters logs based on selected admin', async () => {
//     render(<SystemLog />); 

//     fireEvent.click(screen.getByText(/Filter by: Admin/i));

//     fireEvent.click(screen.getByLabelText(/Arun Kumar/i)); 

//     await waitFor(() => {
//       const visibleLogs = screen
//         .getAllByText(/User Arun Kumar added Manoj Kumar as Admin/i, { exact: false })
//         .filter(log => log.closest('.logItem')?.classList.contains('visible'));

//       expect(visibleLogs.length).toBe(1);
//     });

//     const hiddenLogs = screen
//       .getAllByText(/Parvathy Eeshwar removed Arun Mathew from Admin/i, { exact: false })
//       .filter(log => !log.closest('.logItem')?.classList.contains('visible'));

//     expect(hiddenLogs.length).toBeGreaterThan(0); 
//   });
// });
