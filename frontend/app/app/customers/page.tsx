'use client';

import { FormEvent, useEffect, useState } from 'react';
import { DashboardShell } from '@/components/DashboardShell';
import { api, Customer } from '@/lib/api';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);

  function load() {
    api<{ customers: Customer[] }>('/customers?per_page=50').then((result) => setCustomers(result.data.customers));
  }

  useEffect(() => {
    load();
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    await api('/customers', {
      method: 'POST',
      body: JSON.stringify({
        name: form.get('name'),
        email: form.get('email'),
        phone: form.get('phone'),
      }),
    });
    event.currentTarget.reset();
    load();
  }

  return (
    <DashboardShell>
      <h1 className="font-display text-4xl text-navy">Schools, daycares, families</h1>
      <form onSubmit={onSubmit} className="mt-6 grid gap-3 rounded-3xl bg-white p-5 shadow-card md:grid-cols-4">
        <input required name="name" placeholder="Organization or family" className="rounded-2xl border border-navy/15 px-4 py-3" />
        <input required type="email" name="email" placeholder="Email" className="rounded-2xl border border-navy/15 px-4 py-3" />
        <input name="phone" placeholder="Phone" className="rounded-2xl border border-navy/15 px-4 py-3" />
        <button className="rounded-full bg-navy font-semibold text-cream">Add guardian account</button>
      </form>
      <ul className="mt-6 grid gap-4 md:grid-cols-2">
        {customers.map((customer) => (
          <li key={customer.id} className="rounded-3xl bg-white p-5 shadow-card">
            <p className="font-display text-2xl text-navy">{customer.name}</p>
            <p className="text-sm text-navy/70">{customer.email}</p>
            <p className="text-sm text-navy/70">{customer.phone}</p>
          </li>
        ))}
      </ul>
    </DashboardShell>
  );
}
