import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Pagination from '../components/Pagination/Pagination';

describe('Pagination', () => {
  it('renders nothing when totalPages is 1 or less', () => {
    const { container } = render(
      <Pagination page={0} totalPages={1} onPageChange={() => {}} />
    );
    expect(container.innerHTML).toBe('');
  });

  it('renders page buttons for each page', () => {
    render(<Pagination page={0} totalPages={3} onPageChange={() => {}} />);
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('highlights the current page', () => {
    render(<Pagination page={1} totalPages={3} onPageChange={() => {}} />);
    const currentPage = screen.getByText('2');
    expect(currentPage.className).toContain('from-blue-600');
  });

  it('calls onPageChange when a page button is clicked', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Pagination page={0} totalPages={3} onPageChange={handleChange} />);
    await user.click(screen.getByText('3'));
    expect(handleChange).toHaveBeenCalledWith(2);
  });

  it('disables previous button on first page', () => {
    render(<Pagination page={0} totalPages={3} onPageChange={() => {}} />);
    const prevButton = screen.getAllByRole('button')[0];
    expect(prevButton).toBeDisabled();
  });

  it('disables next button on last page', () => {
    render(<Pagination page={2} totalPages={3} onPageChange={() => {}} />);
    const buttons = screen.getAllByRole('button');
    const nextButton = buttons[buttons.length - 1];
    expect(nextButton).toBeDisabled();
  });

  it('shows ellipsis for large page counts', () => {
    render(<Pagination page={5} totalPages={10} onPageChange={() => {}} />);
    const ellipses = screen.getAllByText('...');
    expect(ellipses.length).toBeGreaterThanOrEqual(1);
  });

  it('navigates to previous page', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Pagination page={2} totalPages={5} onPageChange={handleChange} />);
    const prevButton = screen.getAllByRole('button')[0];
    await user.click(prevButton);
    expect(handleChange).toHaveBeenCalledWith(1);
  });

  it('navigates to next page', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Pagination page={0} totalPages={5} onPageChange={handleChange} />);
    const buttons = screen.getAllByRole('button');
    const nextButton = buttons[buttons.length - 1];
    await user.click(nextButton);
    expect(handleChange).toHaveBeenCalledWith(1);
  });
});
