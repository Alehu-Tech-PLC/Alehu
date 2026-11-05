'use client';

import { FormEvent, useState } from 'react';
import { api } from '@/lib/api';

export function ContactForm() {
  const [status, setStatus]   = useState<'idle' | 'loading' | 'ok' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setStatus('loading');
    try {
      await api('/contact', {
        method: 'POST',
        body: JSON.stringify({
          name: form.get('name'), email: form.get('email'),
          organization: form.get('organization'), message: form.get('message'),
        }),
      });
      setStatus('ok');
      setMessage('Received. We will reply from the Alehu Technologies team.');
      e.currentTarget.reset();
    } catch (err) {
      setStatus('error');
      setMessage(err instanceof Error ? err.message : 'Could not send the inquiry.');
    }
  }

  return (
    <form onSubmit={onSubmit} className="card p-6 space-y-4">
      {(['Name','Email','Organization'] as const).map((label) => (
        <label key={label} className="block text-sm font-medium" style={{ color: 'var(--ink)' }}>
          {label}
          <input
            required={label !== 'Organization'}
            type={label === 'Email' ? 'email' : 'text'}
            name={label.toLowerCase()}
            className="input mt-1"
          />
        </label>
      ))}
      <label className="block text-sm font-medium" style={{ color: 'var(--ink)' }}>
        Message
        <textarea required name="message" rows={5} className="input mt-1 resize-none" />
      </label>
      <button type="submit" disabled={status === 'loading'} className="btn w-full py-3">
        {status === 'loading' ? 'Sending…' : 'Send inquiry'}
      </button>
      {message && (
        <p className="rounded-xl px-3 py-2 text-sm"
          style={{
            background: status === 'ok' ? 'var(--accent-bg)' : 'rgba(201,48,64,0.08)',
            color: status === 'ok' ? 'var(--accent)' : 'var(--danger)',
          }}>
          {message}
        </p>
      )}
    </form>
  );
}
