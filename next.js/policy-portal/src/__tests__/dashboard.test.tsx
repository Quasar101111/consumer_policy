// __tests__/DashboardPage.test.tsx

import { render, screen, waitFor } from '@testing-library/react';
import DashboardPage from '@/app/dashboard/page';
import * as api from '@/services/api';
import { useRouter } from 'next/navigation';

// Mock the API functions
jest.mock('@/services/api');
const mockedTotalPremium = jest.mocked(api.totalPremium);
const mockedViewPolicyNumbers = jest.mocked(api.viewPolicyNumbers);

// Mock useRouter
const mockReplace = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: mockReplace,
  }),
  __esModule: true,
}));

jest.mock('@/components/sidebar', () => () => <div data-testid="mock-sidebar" />);

describe('DashboardPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('renders sidebar and all 4 dashboard sections', async () => {
    // Mock API response
    mockedTotalPremium.mockResolvedValue(123456);
    mockedViewPolicyNumbers.mockResolvedValue(['POL001', 'POL002']);

    // Mock localStorage
    localStorage.setItem('username', 'testuser');

    render(<DashboardPage />);

    // Sidebar should render
    expect(screen.getByTestId('mock-sidebar')).toBeInTheDocument();

    // Wait for data to appear
  expect(await screen.findByText('2')).toBeInTheDocument();
expect(
  await screen.findByText((content) => content.includes('1,23,456'))
).toBeInTheDocument();


    // Add Policy & Manage Policy buttons should be present
    expect(screen.getByText(/Add Policy/i)).toBeInTheDocument();
    expect(screen.getByText(/Manage Policy/i)).toBeInTheDocument();
  });

  it('does not call API if username is missing from localStorage', async () => {
    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByTestId('mock-sidebar')).toBeInTheDocument();
    });

    expect(mockedTotalPremium).not.toHaveBeenCalled();
    expect(mockedViewPolicyNumbers).not.toHaveBeenCalled();
  });
});
