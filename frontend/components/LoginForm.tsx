'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api';

/** Maps a user's role name to their home dashboard path. */
function dashboardForRole(role: string | null): string {
  switch (role) {
    case 'parent':         return '/parent';
    case 'police_officer': return '/police_officer';
    case 'admin':          return '/admin';
    default:               return '/app';
  }
}

export function LoginForm({
  defaultEmail = 'admin@alehu.com',
  defaultPassword = 'Admin123!',
}: {
  defaultEmail?: string;
  defaultPassword?: string;
}) {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setLoading(true);
    setError('');
    try {
      const result = await authApi.login(
        String(form.get('email')),
        String(form.get('password')),
      );
      localStorage.setItem('alehu_access_token', result.data.access_token);
      localStorage.setItem('alehu_refresh_token', result.data.refresh_token);
      localStorage.setItem('alehu_user', JSON.stringify(result.data.user));
      router.push(dashboardForRole(result.data.user.role));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sign in');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-4">
      <label className="block text-sm font-medium" style={{ color: 'var(--color-ink)' }}>
        Email
        <input
          required
          type="email"
          name="email"
          defaultValue={defaultEmail}
          className="mt-1 w-full rounded-2xl border px-4 py-3 transition focus:outline-none focus:ring-2 focus:ring-rose/40"
          style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)', color: 'var(--color-ink)' }}
        />
      </label>
      <label className="block text-sm font-medium" style={{ color: 'var(--color-ink)' }}>
        Password
        <input
          required
          type="password"
          name="password"
          defaultValue={defaultPassword}
          className="mt-1 w-full rounded-2xl border px-4 py-3 transition focus:outline-none focus:ring-2 focus:ring-rose/40"
          style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)', color: 'var(--color-ink)' }}
        />
      </label>
      {error && <p className="text-sm text-coral">{error}</p>}
      <button
        disabled={loading}
        className="btn-primary w-full py-3 text-base"
      >
        {loading ? 'Checking…' : 'Enter dashboard'}
      </button>
    </form>
  );
}
