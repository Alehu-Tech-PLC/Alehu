'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api';

function dashboardForRole(role: string | null): string {
  switch (role) {
    case 'parent':         return '/parent';
    case 'police_officer': return '/police_officer';
    case 'admin':          return '/admin';
    default:               return '/app';
  }
}

export function LoginForm({
  defaultEmail    = 'admin@alehu.com',
  defaultPassword = 'Admin123!',
}: {
  defaultEmail?: string;
  defaultPassword?: string;
}) {
  const router = useRouter();
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setLoading(true); setError('');
    try {
      const res = await authApi.login(String(form.get('email')), String(form.get('password')));
      localStorage.setItem('alehu_access_token',  res.data.access_token);
      localStorage.setItem('alehu_refresh_token', res.data.refresh_token);
      localStorage.setItem('alehu_user', JSON.stringify(res.data.user));
      router.push(dashboardForRole(res.data.user.role));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sign in');
    } finally { setLoading(false); }
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-4">
      <label className="block text-sm font-medium" style={{ color: 'var(--ink)' }}>
        Email
        <input required type="email" name="email" defaultValue={defaultEmail} className="input mt-1" />
      </label>
      <label className="block text-sm font-medium" style={{ color: 'var(--ink)' }}>
        Password
        <input required type="password" name="password" defaultValue={defaultPassword} className="input mt-1" />
      </label>
      {error && (
        <p className="rounded-xl px-3 py-2 text-sm" style={{ background: 'rgba(201,48,64,0.08)', color: 'var(--danger)' }}>
          {error}
        </p>
      )}
      <button type="submit" disabled={loading} className="btn w-full py-3 text-base">
        {loading ? 'Signing in…' : 'Enter dashboard'}
      </button>
    </form>
  );
}
