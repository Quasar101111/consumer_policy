// __tests__/RegisterPage.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RegisterPage from '@/app/register/page'; // Adjust this if the path differs
import * as api from '@/services/api';

// Mocks
jest.mock('@/services/api');

const mockedCheckUsernameAvailability = jest.mocked(api.checkUsernameAvailability);
const mockedRegister = jest.mocked(api.register);

describe('RegisterPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

   global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({}),
    })
  ) as jest.Mock;


  it('renders the registration form', () => {
    render(<RegisterPage />);

    expect(screen.getByLabelText(/User Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Id/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirm Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Create an account/i })).toBeInTheDocument();
  });

 it('shows validation errors when fields are empty', async () => {
  render(<RegisterPage />);
  fireEvent.click(screen.getByRole('button', { name: /Create an account/i }));

  expect(await screen.findByText('Username is required.')).toBeInTheDocument();
  expect(await screen.findByText('Email is required.')).toBeInTheDocument();
  expect(await screen.findByText('Password is required.')).toBeInTheDocument();
  expect(await screen.findByText('Confirm password is required.')).toBeInTheDocument();
});

  it('validates username format', async () => {
    render(<RegisterPage />);

    const usernameInput = screen.getByLabelText(/User Name/i);
    fireEvent.change(usernameInput, { target: { value: '  ' } });
    fireEvent.keyUp(usernameInput);

    expect(await screen.findByText(/include atleast 3 characters/i)).toBeInTheDocument();
  });

  it('shows username availability success', async () => {
    mockedCheckUsernameAvailability.mockResolvedValue('available');
    render(<RegisterPage />);

    const usernameInput = screen.getByLabelText(/User Name/i);
    fireEvent.change(usernameInput, { target: { value: 'validUser' } });
    fireEvent.keyUp(usernameInput);

    expect(await screen.findByText(/Username is available/i)).toBeInTheDocument();
  });

  it('shows username taken error', async () => {
    mockedCheckUsernameAvailability.mockResolvedValue('taken');
    render(<RegisterPage />);

    const usernameInput = screen.getByLabelText(/User Name/i);
    fireEvent.change(usernameInput, { target: { value: 'takenUser' } });
    fireEvent.keyUp(usernameInput);

    expect(await screen.findByText(/Username is already taken/i)).toBeInTheDocument();
  });

  it('submits form and shows success message', async () => {
    mockedCheckUsernameAvailability.mockResolvedValue('available');
    mockedRegister.mockResolvedValue({}); // simulate API success

    render(<RegisterPage />);

    fireEvent.change(screen.getByLabelText(/User Name/i), { target: { value: 'newuser' } });
    fireEvent.keyUp(screen.getByLabelText(/User Name/i));
    fireEvent.change(screen.getByLabelText(/Email Id/i), { target: { value: 'user@example.com' } });
    fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: 'Test@1234' } });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'Test@1234' } });

    fireEvent.click(screen.getByRole('button', { name: /Create an account/i }));

    await waitFor(() => {
      expect(mockedRegister).toHaveBeenCalled();
      expect(screen.getByText(/Registration successful/i)).toBeInTheDocument();
    });
  });
});
