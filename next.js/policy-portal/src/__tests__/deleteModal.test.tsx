import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DeleteModal from '@/components/modalDelete';

describe('DeleteModal', () => {
  const onCloseMock = jest.fn();
  const onConfirmMock = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });


  it('renders children and buttons when open is true', () => {
    render(
      <DeleteModal open={true} onClose={onCloseMock} onConfirm={onConfirmMock}>
        Confirm delete?
      </DeleteModal>
    );

    expect(screen.getByText('Confirm delete?')).toBeInTheDocument();

     expect(screen.getByRole('button', { name: /Yes, I'm sure/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /No, cancel/i })).toBeInTheDocument();

  });

  it('when I am sure" button is clicked', () => {
    render(
      <DeleteModal open={true} onClose={onCloseMock} onConfirm={onConfirmMock}>
        Confirm delete?
      </DeleteModal>
    );

    fireEvent.click(screen.getByRole('button', { name: /yes, i'm sure/i }));
    expect(onConfirmMock).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when "No, cancel" button is clicked', () => {
    render(
      <DeleteModal open={true} onClose={onCloseMock} onConfirm={onConfirmMock}>
        Confirm delete?
      </DeleteModal>
    );

    fireEvent.click(screen.getByRole('button', { name: /no, cancel/i }));
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when modal close button  is clicked', () => {
    render(
      <DeleteModal open={true} onClose={onCloseMock} onConfirm={onConfirmMock}>
        Confirm delete?
      </DeleteModal>
    );

    const closeButton = screen.getByRole('button', { name: /close modal/i });
    fireEvent.click(closeButton);
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });
});
