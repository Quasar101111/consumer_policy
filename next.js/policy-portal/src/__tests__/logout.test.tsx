import { render } from '@testing-library/react';
import Logout from '@/app/logout/page'; // Adjust the path based on your file structure
import { useRouter } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('Logout', () => {
  const pushMock = jest.fn();

  beforeEach(() => {
    // Mock useRouter
    (useRouter as jest.Mock).mockReturnValue({
      push: pushMock,
    });

    // Set localStorage items before test
    localStorage.setItem('username', 'testuser');
    localStorage.setItem('token', 'testtoken');
  });

  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('removes localStorage items and redirects to login', () => {
    render(<Logout />);

    expect(localStorage.getItem('username')).toBeNull();
    expect(localStorage.getItem('token')).toBeNull();

    expect(pushMock).toHaveBeenCalledWith('/login');
  });
});
