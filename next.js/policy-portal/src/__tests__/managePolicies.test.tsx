import React from 'react';
import { render, screen, waitFor, fireEvent, act, within } from '@testing-library/react';
import ManagePolicies from '@/app/manage_policies/page';

import * as api from '@/services/api';
import { toast } from 'react-toastify';


class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.ResizeObserver = ResizeObserver;
// Mock API service methods
jest.mock('@/services/api');
jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
    promise: jest.fn(),
  },
  ToastContainer: () => <div data-testid="toast-container" />,
}));

// Mock next/navigation useRouter (if navigation related tests needed)
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe('ManagePolicies', () => {
  // Sample mock data
  const mockPolicies = [
    { policyId: 1, policyNumber: 'POL123', status: 'Active' },
    { policyId: 2, policyNumber: 'POL456', status: 'Inactive' },
    { policyId: 3, policyNumber: 'POL789', status: 'Active' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    Storage.prototype.getItem = jest.fn((key) => (key === 'username' ? 'testUser' : null));

  });



test('renders loading state initially and then policies', async () => {
 const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

(api.policyNumbersWithStatus as jest.Mock).mockImplementation(async () => {
  await delay(50); // keep loading state visible briefly
  return mockPolicies;
});

  render(<ManagePolicies />);

  expect(await screen.findByText(/Loading.../i)).toBeInTheDocument();

  await waitFor(() => expect(api.policyNumbersWithStatus).toHaveBeenCalled());
  

  expect(screen.getByText('POL123')).toBeInTheDocument();
  expect(screen.getByText('POL456')).toBeInTheDocument();
  expect(screen.queryByText(/loading.../i)).not.toBeInTheDocument();
});


  test('renders "No policies found" if empty list', async () => {
    (api.policyNumbersWithStatus as jest.Mock).mockResolvedValue([]);

    render(<ManagePolicies />);

    await waitFor(() => expect(api.policyNumbersWithStatus).toHaveBeenCalled());

    expect(screen.getByText(/no policies found./i)).toBeInTheDocument();
  });



//  test('toggles policy status and shows toast.promise notifications', async () => {
//   (api.policyNumbersWithStatus as jest.Mock).mockResolvedValue(mockPolicies);

//   const toggleMock = jest.fn(() => Promise.resolve());
//   (api.togglePolicyStatus as jest.Mock).mockImplementation(toggleMock);

//   const toastPromiseMock = jest.fn();
//   (toast.promise as jest.Mock).mockImplementation((promise, msgs) => {
//     promise.then().catch();
//     toastPromiseMock(promise, msgs);
//     return promise;
//   });

//   render(<ManagePolicies />);

//   await waitFor(() => expect(api.policyNumbersWithStatus).toHaveBeenCalled());
// const secondPolicyRow = screen.getByText('POL456').closest('tr');
//   expect(secondPolicyRow).toBeInTheDocument();

//     const toggleCheckbox = secondPolicyRow?.querySelector('input[type="checkbox"]') as HTMLInputElement;
//   expect(toggleCheckbox).toBeInTheDocument();
//   expect(toggleCheckbox.checked).toBe(false);

//    await act(async () => {
//     fireEvent.change(toggleCheckbox, { target: { checked: true } });
//   });

//    expect(toggleMock).toHaveBeenCalledWith(2);

//    expect(toast.promise).toHaveBeenCalled();
//   expect(toastPromiseMock).toHaveBeenCalled();

//    await waitFor(() => {
//     expect(secondPolicyRow).toHaveTextContent('Active');
//   });

//   await act(async () => {
//     fireEvent.change(toggleCheckbox, { target: { checked: false } });
//   });

//   expect(toggleMock).toHaveBeenCalledWith(2);

//   await waitFor(() => {
//     expect(secondPolicyRow).toHaveTextContent('Inactive');
//   });
// });


//   test('confirm delete calls deletePolicy API and shows toast error', async () => {
//     (api.policyNumbersWithStatus as jest.Mock).mockResolvedValue(mockPolicies);

//     const deleteMock = jest.fn().mockResolvedValue('Delete successful');
//     (api.deletePolicy as jest.Mock).mockImplementation(deleteMock);

//     render(<ManagePolicies />);

//     await waitFor(() => expect(api.policyNumbersWithStatus).toHaveBeenCalled());
//  const deleteButton = screen.getAllByText(/delete/i);
//  const deletepolicy = deleteButton[0];
//     fireEvent.click(deletepolicy);
    


//     await waitFor(() => expect(deleteMock).toHaveBeenCalled());

   
//     expect(toast.error).toHaveBeenCalled();

//   });
});
