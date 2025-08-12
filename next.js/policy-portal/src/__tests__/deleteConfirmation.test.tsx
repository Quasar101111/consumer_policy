import { render, screen, fireEvent } from '@testing-library/react';
import DeletePolicy from '@/app/manage_policies/components/deletePolicyConfirm';

describe('DeletePolicy', () => {
  const mockProps = {
    open: true,
    onClose: jest.fn(),
    onConfirm: jest.fn(),
    policyId: 123
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders confirmation message when open', () => {
    render(<DeletePolicy {...mockProps} />);
    expect(screen.getByText(/Are you sure you want to delete this policy?/i)).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(<DeletePolicy {...mockProps} open={false} />);
    expect(screen.queryByText(/Are you sure you want to delete this policy?/i)).not.toBeInTheDocument();
  });

  it('calls onConfirm when confirm button is clicked', () => {
    render(<DeletePolicy {...mockProps} />);
    const confirmButton = screen.getByRole('button', { name: /Yes, I'm sure/i });
    fireEvent.click(confirmButton);
    expect(mockProps.onConfirm).toHaveBeenCalled();
  });

  it('calls onClose when cancel button is clicked', () => {
    render(<DeletePolicy {...mockProps} />);
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);
    expect(mockProps.onClose).toHaveBeenCalled();
  });
});