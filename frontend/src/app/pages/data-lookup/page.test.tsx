// page.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import QueryLookup from './page';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import * as api from '@/app/api/questioncard/fetchQueriesQuestions';
import * as tagApi from '@/app/api/tags/route.ts';

// Mocking the necessary modules
jest.mock('@/context/AuthContext');
jest.mock('next/navigation');
jest.mock('@/app/api/questioncard/fetchQueriesQuestions');
jest.mock('@/app/api/tags/route.ts');
jest.mock('@/app/components/dashboard-datacard/DataCardDashboard', () => () => <div>DataCardDashboard Mock</div>);
jest.mock('@/app/components/pagination/Pagination', () => () => <div>Pagination Mock</div>);
jest.mock('@/app/components/lookup-filterdropdown/FilterDropDown', () => () => <div>FilterDropdown Mock</div>);

describe('QueryLookup', () => {
  let pushMock: jest.Mock;
  let useAuthMock: jest.Mock;

  beforeEach(() => {
    // Set up mocks
    pushMock = jest.fn();
    useRouter.mockReturnValue({ push: pushMock });
    useAuthMock = useAuth as jest.Mock;
    useAuthMock.mockReturnValue({ user: { status: 'ACTIVE' } });

    // Mock API responses
    api.fetchQueriesQuestions = jest.fn().mockResolvedValue({ success: true, data: [] });
    tagApi.fetchAllTagDetails = jest.fn().mockResolvedValue([]);
  });

  test('renders loading state initially', () => {
    render(<QueryLookup />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test('redirects to login page if user is inactive or not authenticated', () => {
    useAuthMock.mockReturnValue({ user: { status: 'INACTIVE' } });
    render(<QueryLookup />);
    expect(pushMock).toHaveBeenCalledWith('/pages/login');
  });

  test('fetches data and renders the filter dropdowns', async () => {
    render(<QueryLookup />);
    await waitFor(() => expect(api.fetchQueriesQuestions).toHaveBeenCalled());
    expect(screen.getByText('Filter by Company')).toBeInTheDocument();
    expect(screen.getByText('Filter by Created By')).toBeInTheDocument();
  });

  test('filters data when filter options are selected', async () => {
    render(<QueryLookup />);

    // Mock filter query API response
    api.fetchQueriesQuestions.mockResolvedValueOnce({
      success: true,
      data: [{ id: '1', question: 'What is React?', answers: [], customer: 'Customer A', usersUsername: 'User A', queryCreatedAt: '2022-01-01', tags: [] }]
    });

    fireEvent.change(screen.getByLabelText(/filter by company/i), { target: { value: ['Company A'] } });
    fireEvent.change(screen.getByLabelText(/filter by created by/i), { target: { value: ['User A'] } });

    await waitFor(() => expect(api.fetchQueriesQuestions).toHaveBeenCalledTimes(2));  // Checking for 2 calls to fetchQueriesQuestions (initial and after filter)
    expect(screen.getByText('What is React?')).toBeInTheDocument();
  });

  test('displays data cards after data is loaded', async () => {
    render(<QueryLookup />);
    api.fetchQueriesQuestions.mockResolvedValueOnce({
      success: true,
      data: [
        {
          id: '1',
          question: 'What is React?',
          answers: [],
          customer: 'Customer A',
          usersUsername: 'User A',
          queryCreatedAt: '2022-01-01',
          tags: ['tag1', 'tag2']
        }
      ]
    });
    await waitFor(() => expect(screen.getByText('DataCardDashboard Mock')).toBeInTheDocument());
  });

  test('opens popup when a data card is clicked', async () => {
    render(<QueryLookup />);
    const mockData = [
      {
        id: '1',
        question: 'What is React?',
        answers: [{ answer: 'A JavaScript library' }],
        customer: 'Customer A',
        usersUsername: 'User A',
        queryCreatedAt: '2022-01-01',
        tags: ['tag1', 'tag2']
      }
    ];

    api.fetchQueriesQuestions.mockResolvedValueOnce({ success: true, data: mockData });

    await waitFor(() => expect(screen.getByText('DataCardDashboard Mock')).toBeInTheDocument());

    const dataCard = screen.getByText('DataCardDashboard Mock');
    fireEvent.click(dataCard);

    await waitFor(() => expect(screen.getByText('DataPopup Mock')).toBeInTheDocument());
  });

  test('handles pagination correctly', () => {
    render(<QueryLookup />);
    const pagination = screen.getByText('Pagination Mock');
    expect(pagination).toBeInTheDocument();
  });

  test('handles filter and sorting functionality', async () => {
    render(<QueryLookup />);

    fireEvent.change(screen.getByLabelText(/filter by company/i), { target: { value: ['Company A'] } });
    fireEvent.change(screen.getByLabelText(/filter by created by/i), { target: { value: ['User A'] } });

    await waitFor(() => expect(api.fetchQueriesQuestions).toHaveBeenCalledTimes(2));  // Ensuring that both the filters are applied
    expect(screen.getByText('What is React?')).toBeInTheDocument();
  });
});
