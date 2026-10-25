'use client';

import { FormEvent, useState } from 'react';
import { api } from '@/lib/api';

export function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setStatus('loading');
    try {
      await api('/contact', {
        method: 'POST',
        body: JSON.stringify({
          name: form.get('name'),
          email: form.get('email'),
          organization: form.get('organization'),
          message: form.get('message'),
        }),
      });
      setStatus('ok');
      setMessage('Received. We will reply from the Alehu team.');
      event.currentTarget.reset();
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Could not send the inquiry.');
    }
  }

  return (
    <form onSubmit={onSubmit} className="rounded-3xl bg-white p-6 shadow-card">
      <label className="block text-sm font-medium">
        Name
        <input required name="name" className="mt-1 w-full rounded-2xl border border-navy/15 bg-cream px-4 py-3" />
      </label>
      <label className="mt-4 block text-sm font-medium">
        Email
        <input required type="email" name="email" className="mt-1 w-full rounded-2xl border border-navy/15 bg-cream px-4 py-3" />
      </label>
      <label className="mt-4 block text-sm font-medium">
        Organization
        <input name="organization" className="mt-1 w-full rounded-2xl border border-navy/15 bg-cream px-4 py-3" />
      </label>
      <label className="mt-4 block text-sm font-medium">
        Message
        <textarea required name="message" rows={5} className="mt-1 w-full rounded-2xl border border-navy/15 bg-cream px-4 py-3" />
      </label>
      <button
        disabled={status === 'loading'}
        className="mt-5 w-full rounded-full bg-navy py-3 font-semibold text-cream disabled:opacity-60"
      >
        {status === 'loading' ? 'Sending…' : 'Send inquiry'}
      </button>
      {message && <p className={`mt-3 text-sm ${status === 'ok' ? 'text-teal' : 'text-coral'}`}>{message}</p>}
    </form>
  );
}
