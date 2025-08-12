import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AddPolicyPage from '@/app/add_policy/page';
import * as api from '@/services/api';
import { toast } from 'react-toastify';
import '@testing-library/jest-dom';


jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));


jest.mock('@/services/api');


jest.mock('@/components/sidebar', () => () => <div data-testid="mock-sidebar" />);


jest.mock('react-toastify', () => {
  const original = jest.requireActual('react-toastify');
  return {
    ...original,
    toast: {
      warning: jest.fn(),
      error: jest.fn(),
      success: jest.fn(),
    },
    ToastContainer: () => <div />,
  };
});

describe('AddPolicyPage', () => {
  beforeEach(() => {
    localStorage.setItem('username', 'testuser');
    jest.clearAllMocks();
  });

  it('renders input fields and submit button', () => {
    render(<AddPolicyPage />);
    expect(screen.getByLabelText(/Policy Number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Chassis Number/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('shows warning if fields are empty on submit', async () => {
    render(<AddPolicyPage />);
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    // await waitFor(() => {
    //   expect(toast.warning).toHaveBeenCalledWith('Please fill in all required fields.');
    // });
     await waitFor(() => {
    expect(toast.warning).toHaveBeenCalled(); // Broad check
  });

  expect(toast.warning as jest.Mock).toHaveBeenCalledWith('Please fill in all required fields.');

  });

  it('calls findPolicy and displays result on valid input', async () => {
    (api.findPolicy as jest.Mock).mockResolvedValue({
      vehicle: {
        registrationNumber: 'MH12AB1234',
        dateOfPurchase: '2023-01-01',
        exShowroomPrice: 500000,
      },
      policy: {
        policyEffectiveDate: '2023-01-01',
        policyExpirationDate: '2024-01-01',
        totalPremium: 15000,
      },
    });

    render(<AddPolicyPage />);

    // fireEvent.change(screen.getByLabelText(/Policy Number/i), {
    //   target: { value: 'POL123' },
    // });
    // fireEvent.change(screen.getByLabelText(/Chassis Number/i), {
    //   target: { value: 'CH123' },
    // });

const inputs = screen.getAllByRole('textbox');
fireEvent.change(inputs[0], { target: { value: 'POL123' } });
fireEvent.change(inputs[1], { target: { value: 'CH123' } });


    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(api.findPolicy).toHaveBeenCalledWith({
        policyNumber: 'POL123',
        chassisNumber: 'CH123',
      });
    });

    expect(await screen.findByText(/Policy Found/i)).toBeInTheDocument();
    expect(screen.getByText(/Registration No/i)).toBeInTheDocument();
  });

  it('calls addPolicy and shows success toast', async () => {
    (api.findPolicy as jest.Mock).mockResolvedValue({
      vehicle: {
        registrationNumber: 'MH12AB1234',
        dateOfPurchase: '2023-01-01',
        exShowroomPrice: 500000,
      },
      policy: {
        policyEffectiveDate: '2023-01-01',
        policyExpirationDate: '2024-01-01',
        totalPremium: 15000,
      },
    });

    (api.addPolicy as jest.Mock).mockResolvedValue({ success: true });

    render(<AddPolicyPage />);

    fireEvent.change(screen.getByLabelText(/Policy Number/i), {
      target: { value: 'POL123' },
    });
    fireEvent.change(screen.getByLabelText(/Chassis Number/i), {
      target: { value: 'CH123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    
   await waitFor(() => {
  expect(screen.getByTestId('policy-found')).toBeInTheDocument();
});


   const addButton = await screen.findByRole('button', { name: /add this policy/i });

    fireEvent.click(addButton);

    await waitFor(() => {
      expect(api.addPolicy).toHaveBeenCalledWith('POL123', 'testuser');
      expect(toast.success).toHaveBeenCalledWith('Policy added successfully!');
    });
});
      
it('shows error toast if addPolicy fails', async () => {
  (api.findPolicy as jest.Mock).mockResolvedValue({
    vehicle: {
      registrationNumber: 'MH12AB1234',
      dateOfPurchase: '2023-01-01',
      exShowroomPrice: 500000,
    },
    policy: {
      policyEffectiveDate: '2023-01-01',
      policyExpirationDate: '2024-01-01',
      totalPremium: 15000,
    },
  });

  (api.addPolicy as jest.Mock).mockRejectedValue(new Error('Add failed'));

  render(<AddPolicyPage />);

  fireEvent.change(screen.getByLabelText(/Policy Number/i), {
    target: { value: 'POL123' },
  });
  fireEvent.change(screen.getByLabelText(/Chassis Number/i), {
    target: { value: 'CH123' },
  });

  fireEvent.click(screen.getByRole('button', { name: /submit/i }));

  await screen.findByText(content => content.includes('Policy Found'));

  const addButton = await screen.findByRole('button', { name: /add this policy/i });
  fireEvent.click(addButton);

  await waitFor(() => {
    expect(api.addPolicy).toHaveBeenCalledWith('POL123', 'testuser');
    expect(toast.error).toHaveBeenCalledWith('Add failed');  // Match mocked error message
  });
});

});
