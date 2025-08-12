import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import ViewPolicy from '@/app/view_policy/page';
import * as api from '@/services/api';

jest.mock('@/services/api');
beforeAll(() => {
  global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

const mockPolicies = ['POL123456', 'POL789012'];
const mockDetails = {
  policyholder: {
    firstName: 'John',
    lastName: 'Doe',
    mobileNo: '9876543210',
    email: 'john@example.com',
    addressLine1: '123 Main St',
    addressLine2: 'Apt 4',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
    Aadhar: '123456789012',
    licenseNumber: 'MH12AB1234',
    panNumber: 'ABCDE1234F',
    accountNumber: '123456789',
    ifscCode: 'SBIN0001234',
    bankName: 'SBI',
    bankAddress: 'Branch St.',
  },
  policyDetails: {
    policyNumber: 'POL123456',
    policyEffectiveDt: '2023-01-01',
    policyExpirationDt: '2024-01-01',
    term: 1,
    status: 'Active',
    totalPremium: 10000,
    payPlan: 'Annual',
  },
  coverageDetails: {
    description: 'This is a test policy covering damage and theft.',
  },
  vehicleDetails: {
    policyNumber: 'POL123456',
    vehicleType: 'Car',
    registrationNumber: 'MH12XY1234',
    dateOfPurchase: '2022-01-01',
    rtoName: 'Mumbai RTO',
    city: 'Mumbai',
    state: 'Maharashtra',
    brand: 'Maruti',
    modelName: 'Swift',
    variant: 'VXI',
    bodyType: 'Hatchback',
    fuelType: 'Petrol',
    transmissionType: 'Manual',
    color: 'White',
    chasisNumber: 'CHS12345',
    engineNumber: 'ENG67890',
    cubicCapacity: '1197',
    seatingCapacity: '5',
    yearOfManufacture: '2021-01-01',
    idv: 500000,
    exShowroomPrice: 600000,
  },
};

describe('ViewPolicy Page', () => {
  beforeEach(() => {
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue('testuser');
    (api.viewPolicyNumbers as jest.Mock).mockResolvedValue(mockPolicies);
    (api.policyDetails as jest.Mock).mockResolvedValue(mockDetails);
  });

  it('renders policy dropdown', async () => {
    render(<ViewPolicy />);
    await waitFor(() => {
      expect(screen.getByText(/Select a Policy/i)).toBeInTheDocument();
    });
  });

  it('loads and displays policy details after selection', async () => {
    render(<ViewPolicy />);

    await waitFor(() => {
      expect(screen.getByText('Select a Policy')).toBeInTheDocument();
    });

    const dropdown = screen.getByRole('combobox');
    fireEvent.change(dropdown, { target: { value: 'POL123456' } });

    await waitFor(() => {
      expect(screen.getByText(/Policy Holder Details/i)).toBeInTheDocument();
      expect(screen.getByText('John')).toBeInTheDocument(); 
    });
  });

  it('switches tabs correctly', async () => {
    render(<ViewPolicy />);

    const dropdown = await screen.findByRole('combobox');
    fireEvent.change(dropdown, { target: { value: 'POL123456' } });

    await screen.findByText(/Policy Holder Details/i);

    fireEvent.click(screen.getByText(/Policy Details/i));
    expect(await screen.findByText(/Total Premium/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText(/Vehicle Details/i));
    expect(await screen.findByText(/Vehicle Type/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText(/Description/i));
    expect(await screen.findByText(/Coverage Details/i)).toBeInTheDocument();
  });
});
