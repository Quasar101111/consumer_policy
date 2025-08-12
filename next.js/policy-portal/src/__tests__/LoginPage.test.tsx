// __tests__/LoginPage.test.tsx

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from '@/app/login/page'; // adjust import path as needed
import * as api from '@/services/api';
import { useRouter } from 'next/navigation';


jest.mock('@/services/api');
const mockedLogin = jest.mocked(api.login);
// Mock next/navigation useRouter
const mockPush = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  __esModule: true,
}));



describe('LoginPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  
  });

  it('renders login form inputs and button', () => {
    render(<LoginPage />);
    expect(screen.getByLabelText(/User Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('shows validation errors when fields are empty', async () => {
    render(<LoginPage />);

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    expect(await screen.findByText(/Username is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/Password is required/i)).toBeInTheDocument();
  });

  it('calls login API and redirects on success', async () => {
    mockedLogin.mockResolvedValue({ username: 'testuser', token: 'fake-token' });

    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText(/User Name/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => expect(mockedLogin).toHaveBeenCalledWith({
      username: 'testuser',
      password: 'password123',
    }));


   await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/dashboard'));

  });

  it('shows error message on login failure', async () => {
    mockedLogin.mockRejectedValue(new Error('Invalid username or password'));

    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText(/User Name/i), { target: { value: 'wronguser' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'wrongpass' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    expect(await screen.findByText(/Invalid username or password/i)).toBeInTheDocument();

   
  });
});
