import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Login from '../pages/Login/Login';
import { AuthProvider } from '../context/AuthContext';

vi.mock('../services/api', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
  },
}));

const renderLogin = () => {
  return render(
    <MemoryRouter initialEntries={['/login']}>
      <AuthProvider>
        <Login />
      </AuthProvider>
    </MemoryRouter>
  );
};

describe('Login Page', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('renders the login form', () => {
    renderLogin();
    expect(screen.getByText('Welcome back')).toBeInTheDocument();
    expect(screen.getByText('Sign in to your account')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('renders a link to register page', () => {
    renderLogin();
    expect(screen.getByText('Create one')).toHaveAttribute('href', '/register');
  });

  it('shows error when submitting with empty fields', async () => {
    const user = userEvent.setup();
    renderLogin();

    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(screen.getByPlaceholderText('you@example.com')).toBeRequired();
    expect(screen.getByPlaceholderText('Enter your password')).toBeRequired();
  });

  it('displays auth_error from localStorage', () => {
    localStorage.setItem('auth_error', 'Session expired');
    renderLogin();
    expect(screen.getByText('Session expired')).toBeInTheDocument();
    expect(localStorage.getItem('auth_error')).toBeNull();
  });

  it('allows typing email and password', async () => {
    const user = userEvent.setup();
    renderLogin();

    await user.type(screen.getByPlaceholderText('you@example.com'), 'test@example.com');
    await user.type(screen.getByPlaceholderText('Enter your password'), 'password123');

    expect(screen.getByPlaceholderText('you@example.com')).toHaveValue('test@example.com');
    expect(screen.getByPlaceholderText('Enter your password')).toHaveValue('password123');
  });
});
