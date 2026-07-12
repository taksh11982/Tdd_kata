import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchBar from '../components/SearchBar/SearchBar';

describe('SearchBar', () => {
  it('renders the search toggle button', () => {
    render(<SearchBar onSearch={() => {}} />);
    expect(screen.getByText('Search Vehicles')).toBeInTheDocument();
  });

  it('expands the search form when toggle is clicked', async () => {
    const user = userEvent.setup();
    render(<SearchBar onSearch={() => {}} />);

    await user.click(screen.getByText('Search Vehicles'));

    expect(screen.getByPlaceholderText('e.g. Toyota')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e.g. Camry')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e.g. Sedan')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('0')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('No limit')).toBeInTheDocument();
  });

  it('calls onSearch with filter params when form is submitted', async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} />);

    await user.click(screen.getByText('Search Vehicles'));
    await user.type(screen.getByPlaceholderText('e.g. Toyota'), 'Toyota');
    await user.type(screen.getByPlaceholderText('e.g. Sedan'), 'Sedan');
    await user.click(screen.getByText('Search'));

    expect(onSearch).toHaveBeenCalledWith({ make: 'Toyota', category: 'Sedan' });
  });

  it('calls onSearch with empty object when clear is clicked', async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} />);

    await user.click(screen.getByText('Search Vehicles'));
    await user.type(screen.getByPlaceholderText('e.g. Toyota'), 'Toyota');
    await user.click(screen.getByText('Search'));

    expect(onSearch).toHaveBeenCalledWith({ make: 'Toyota' });

    await user.click(screen.getByText('Clear filters'));

    expect(onSearch).toHaveBeenCalledWith({});
  });

  it('does not send empty string filters', async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} />);

    await user.click(screen.getByText('Search Vehicles'));
    await user.click(screen.getByText('Search'));

    expect(onSearch).toHaveBeenCalledWith({});
  });

  it('shows "Active" badge when filters are applied', async () => {
    const user = userEvent.setup();
    render(<SearchBar onSearch={() => {}} />);

    await user.click(screen.getByText('Search Vehicles'));
    await user.type(screen.getByPlaceholderText('e.g. Toyota'), 'Toyota');

    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('sends price range filters', async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} />);

    await user.click(screen.getByText('Search Vehicles'));
    await user.type(screen.getByPlaceholderText('0'), '10000');
    await user.type(screen.getByPlaceholderText('No limit'), '50000');
    await user.click(screen.getByText('Search'));

    expect(onSearch).toHaveBeenCalledWith({ minPrice: '10000', maxPrice: '50000' });
  });
});
