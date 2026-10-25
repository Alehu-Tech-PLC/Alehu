'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api';

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setLoading(true);
    setError('');
    try {
      const result = await authApi.login(String(form.get('email')), String(form.get('password')));
      localStorage.setItem('alehu_access_token', result.data.access_token);
      localStorage.setItem('alehu_refresh_token', result.data.refresh_token);
      localStorage.setItem('alehu_user', JSON.stringify(result.data.user));
      router.push('/app');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sign in');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-4">
      <label className="block text-sm font-medium">
        Email
        <input required type="email" name="email" defaultValue="admin@alehu.com" className="mt-1 w-full rounded-2xl border border-navy/15 bg-white px-4 py-3" />
      </label>
      <label className="block text-sm font-medium">
        Password
        <input required type="password" name="password" defaultValue="Admin123!" className="mt-1 w-full rounded-2xl border border-navy/15 bg-white px-4 py-3" />
      </label>
      {error && <p className="text-sm text-coral">{error}</p>}
      <button disabled={loading} className="w-full rounded-full bg-navy py-3 font-semibold text-cream">
        {loading ? 'Checking…' : 'Enter dashboard'}
      </button>
    </form>
  );
}
