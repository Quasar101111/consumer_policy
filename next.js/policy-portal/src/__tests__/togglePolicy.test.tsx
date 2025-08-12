import { render, screen, fireEvent } from '@testing-library/react';
import PolicyButtons from '@/app/manage_policies/components/policyButtons';

describe('PolicyButtons', () => {
  const mockProps = {
    status: 'Active' as const,
    onDelete: jest.fn(),
    onToggle: jest.fn(),
    policyId: 123
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders delete button and toggle switch', () => {
    render(<PolicyButtons {...mockProps} />);
    expect(screen.getByText(/delete/i)).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('calls onDelete when delete button is clicked', () => {
    render(<PolicyButtons {...mockProps} />);
    const deleteButton = screen.getByText(/delete/i);
    fireEvent.click(deleteButton);
    expect(mockProps.onDelete).toHaveBeenCalled();
  });

  it('calls onToggle when toggle switch is clicked', () => {
    render(<PolicyButtons {...mockProps} />);
    const toggleSwitch = screen.getByRole('checkbox');
    fireEvent.click(toggleSwitch);
    expect(mockProps.onToggle).toHaveBeenCalled();
  });

  it('renders correct toggle state for Active status', () => {
    render(<PolicyButtons {...mockProps} status="Active" />);
    const toggleSwitch = screen.getByRole('checkbox');
    expect(toggleSwitch).toBeChecked();
  });

  it('renders correct toggle state for Inactive status', () => {
    render(<PolicyButtons {...mockProps} status="Inactive" />);
    const toggleSwitch = screen.getByRole('checkbox');
    expect(toggleSwitch).not.toBeChecked();
  });
});