import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Modal from '@/components/modal';

describe('Modal', () => {
  const onCloseMock = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('does not render when open is false', () => {
    const { container } = render(
      <Modal open={false} onClose={onCloseMock}>
        <div>Modal Content</div>
      </Modal>
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders children and close button when open is true', () => {
    render(
      <Modal open={true} onClose={onCloseMock}>
        <div>Modal Content</div>
      </Modal>
    );

    expect(screen.getByText('Modal Content')).toBeInTheDocument();

   
    const closeButton = screen.getByRole('button', { name: /close modal/i });
    expect(closeButton).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    render(
      <Modal open={true} onClose={onCloseMock}>
        <div>Modal Content</div>
      </Modal>
    );

    const closeButton = screen.getByRole('button', { name: /close modal/i });
    fireEvent.click(closeButton);

    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  it('applies custom className when provided', () => {
    const className = 'custom-modal-class';
    const { container } = render(
      <Modal open={true} onClose={onCloseMock} className={className}>
        <div>Content</div>
      </Modal>
    );
    const modalContent = container.querySelector('div.bg-white');
    expect(modalContent).toHaveClass(className);
  });
});
