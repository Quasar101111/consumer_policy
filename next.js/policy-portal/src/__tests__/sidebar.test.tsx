import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CollapsibleSidebar from '@/components/sidebar';

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.ResizeObserver = ResizeObserver;
describe('CollapsibleSidebar', () => {
  beforeEach(() => {
    render(<CollapsibleSidebar />);
  });

  it('initially renders in collapsed state', () => {
    const btn = screen.getByRole('button', { name: /expand sidebar/i });
    expect(btn).toBeInTheDocument();

    const container = btn.parentElement;
    expect(container).toHaveStyle('width: 80px');
  });

  it('toggles between expanded and collapsed when clicked', () => {
    const btn = screen.getByRole('button', { name: /expand sidebar/i });

    fireEvent.click(btn);

    // After first click: expanded
    expect(screen.getByRole('button', { name: /collapse sidebar/i })).toBeInTheDocument();

    const containerAfterExpand = screen.getByRole('button', { name: /collapse sidebar/i }).parentElement;
    expect(containerAfterExpand).toHaveStyle('width: 250px');

    // Click again to collapse
    fireEvent.click(screen.getByRole('button', { name: /collapse sidebar/i }));
    expect(screen.getByRole('button', { name: /expand sidebar/i })).toBeInTheDocument();

    const containerAfterCollapse = screen.getByRole('button', { name: /expand sidebar/i }).parentElement;
    expect(containerAfterCollapse).toHaveStyle('width: 80px');
  });
});
