'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { DashboardShell } from '@/components/DashboardShell';
import { api, Customer } from '@/lib/api';

type CustomerFormData = {
  name: string;
  email: string;
  phone: string;
  address: string;
};

type EditCustomerData = {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
};

const DEFAULT_FORM: CustomerFormData = {
  name: 'Global Net Inggtesthiluc',
  email: 'info@globalnet.com',
  phone: '+1-800-555-0199',
  address: '100 Technology Blvd, Silicon Valley, CA',
};

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [formData, setFormData] = useState<CustomerFormData>(DEFAULT_FORM);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterPhone, setFilterPhone] = useState<string>('all'); // 'all' | 'has_phone' | 'no_phone'
  const [filterAddress, setFilterAddress] = useState<string>('all'); // 'all' | 'has_address' | 'no_address'
  const [sortBy, setSortBy] = useState<string>('id_asc'); // 'id_asc' | 'id_desc' | 'name_asc' | 'name_desc'

  // Edit Feature State
  const [editingCustomer, setEditingCustomer] = useState<EditCustomerData | null>(null);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [editError, setEditError] = useState<string>('');

  function loadCustomers() {
    setIsLoading(true);
    api<{ customers: Customer[] }>('/customers?per_page=100')
      .then((result) => {
        setCustomers(result.data.customers || []);
        setError('');
      })
      .catch((err) => {
        setError(err.message || 'Failed to fetch customer accounts');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  useEffect(() => {
    loadCustomers();
  }, []);

  // Real-time On-type Search and Auto-Filter
  const filteredCustomers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    const filtered = customers.filter((customer) => {
      // On-type text search
      if (q) {
        const matchesName = customer.name?.toLowerCase().includes(q);
        const matchesEmail = customer.email?.toLowerCase().includes(q);
        const matchesPhone = customer.phone?.toLowerCase().includes(q);
        const matchesAddress = customer.address?.toLowerCase().includes(q);
        const matchesId = `customer #${customer.id}`.includes(q) || String(customer.id) === q;

        if (!matchesName && !matchesEmail && !matchesPhone && !matchesAddress && !matchesId) {
          return false;
        }
      }

      // Filter by Phone
      if (filterPhone === 'has_phone' && !customer.phone?.trim()) return false;
      if (filterPhone === 'no_phone' && customer.phone?.trim()) return false;

      // Filter by Address
      if (filterAddress === 'has_address' && !customer.address?.trim()) return false;
      if (filterAddress === 'no_address' && customer.address?.trim()) return false;

      return true;
    });

    // Sort order
    return filtered.sort((a, b) => {
      if (sortBy === 'id_desc') return b.id - a.id;
      if (sortBy === 'name_asc') return a.name.localeCompare(b.name);
      if (sortBy === 'name_desc') return b.name.localeCompare(a.name);
      return a.id - b.id; // default id_asc
    });
  }, [customers, searchQuery, filterPhone, filterAddress, sortBy]);

  const hasActiveFilters = searchQuery.trim() !== '' || filterPhone !== 'all' || filterAddress !== 'all' || sortBy !== 'id_asc';

  function handleResetFilters() {
    setSearchQuery('');
    setFilterPhone('all');
    setFilterAddress('all');
    setSortBy('id_asc');
  }

  // Create Customer Handler
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.trim() || null,
      address: formData.address.trim() || null,
    };

    try {
      await api<{ customer: Customer }>('/customers', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      setSuccess(`Account "${payload.name}" (${payload.email}) registered successfully.`);
      loadCustomers();
    } catch (err: unknown) {
      const apiErr = err as { message?: string; errors?: Record<string, string[]> };
      let errorMsg = apiErr.message || 'Failed to create customer';
      if (apiErr.errors && typeof apiErr.errors === 'object') {
        const details = Object.entries(apiErr.errors)
          .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`)
          .join(' | ');
        if (details) {
          errorMsg = `${errorMsg} (${details})`;
        }
      }
      setError(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  }

  // Open Edit Modal
  function handleOpenEdit(customer: Customer) {
    setEditError('');
    setEditingCustomer({
      id: customer.id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone || '',
      address: customer.address || '',
    });
  }

  // Update Customer Handler
  async function handleUpdateCustomer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editingCustomer) return;

    setEditError('');
    setIsUpdating(true);

    const payload = {
      name: editingCustomer.name.trim(),
      email: editingCustomer.email.trim().toLowerCase(),
      phone: editingCustomer.phone.trim() || null,
      address: editingCustomer.address.trim() || null,
    };

    try {
      const response = await api<{ customer: Customer }>(`/customers/${editingCustomer.id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });

      setSuccess(`Customer "${payload.name}" updated successfully.`);
      const updated = response.data.customer;

      setCustomers((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
      setEditingCustomer(null);
    } catch (err: unknown) {
      const apiErr = err as { message?: string; errors?: Record<string, string[]> };
      let errorMsg = apiErr.message || 'Failed to update customer';
      if (apiErr.errors && typeof apiErr.errors === 'object') {
        const details = Object.entries(apiErr.errors)
          .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`)
          .join(' | ');
        if (details) {
          errorMsg = `${errorMsg} (${details})`;
        }
      }
      setEditError(errorMsg);
    } finally {
      setIsUpdating(false);
    }
  }

  // Delete Customer Handler
  async function handleDelete(customerId: number, customerName: string) {
    if (!window.confirm(`Are you sure you want to delete customer "${customerName}"? Any linked devices will no longer be attached to this account.`)) {
      return;
    }

    setDeletingId(customerId);
    setError('');
    setSuccess('');

    try {
      await api(`/customers/${customerId}`, {
        method: 'DELETE',
      });
      setSuccess(`Customer "${customerName}" was deleted.`);
      setCustomers((prev) => prev.filter((c) => c.id !== customerId));
    } catch (err: unknown) {
      const apiErr = err as { message?: string };
      setError(apiErr.message || 'Failed to delete customer');
    } finally {
      setDeletingId(null);
    }
  }

  function handleResetDefault() {
    setFormData(DEFAULT_FORM);
    setError('');
    setSuccess('');
  }

  return (
    <DashboardShell>
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-display text-4xl text-navy">Guardians & Organizations</h1>
          <p className="mt-1 text-sm text-navy/70">
            Manage customer accounts, schools, daycares, enterprise partners, and family guardians.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-teal-soft px-3 py-1 text-xs font-semibold text-teal">
            {customers.length} {customers.length === 1 ? 'Customer' : 'Customers'}
          </span>
          {hasActiveFilters && (
            <span className="rounded-full bg-sand px-3 py-1 text-xs font-semibold text-navy/80">
              Filtered: {filteredCustomers.length}
            </span>
          )}
        </div>
      </div>

      {/* Global Alerts */}
      {error && (
        <div className="mt-4 flex items-start gap-3 rounded-2xl border border-coral/30 bg-coral/10 p-4 text-sm text-coral">
          <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <p className="font-semibold">Error</p>
            <p>{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="mt-4 flex items-start gap-3 rounded-2xl border border-teal/30 bg-teal/10 p-4 text-sm text-teal-deep">
          <svg className="h-5 w-5 shrink-0 text-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <div>
            <p className="font-semibold">Success</p>
            <p>{success}</p>
          </div>
        </div>
      )}

      {/* Create Customer Card */}
      <div className="mt-6 rounded-3xl bg-white p-6 shadow-card">
        <div className="flex flex-col gap-2 border-b border-navy/10 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-xl text-navy">Add Customer Account</h2>
            <p className="text-xs text-navy/60">
              API Endpoint: <code className="rounded bg-sand/60 px-1.5 py-0.5 text-navy font-mono">POST /api/customers</code>
            </p>
          </div>
          <button
            type="button"
            onClick={handleResetDefault}
            className="text-xs font-semibold text-teal hover:underline self-start sm:self-auto"
          >
            Reset to Sample Payload
          </button>
        </div>

        <form onSubmit={onSubmit} className="mt-5 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Name */}
            <div>
              <label htmlFor="customer-name" className="block text-xs font-semibold text-navy/70 mb-1.5">
                Organization / Name <span className="text-coral">*</span>
              </label>
              <input
                id="customer-name"
                required
                type="text"
                name="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Global Net Inggtesthiluc"
                className="w-full rounded-2xl border border-navy/15 bg-white px-4 py-2.5 text-sm text-navy placeholder:text-navy/40 focus:border-teal focus:outline-none"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="customer-email" className="block text-xs font-semibold text-navy/70 mb-1.5">
                Email Address <span className="text-coral">*</span>
              </label>
              <input
                id="customer-email"
                required
                type="email"
                name="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="e.g. info@globalnet.com"
                className="w-full rounded-2xl border border-navy/15 bg-white px-4 py-2.5 text-sm text-navy placeholder:text-navy/40 focus:border-teal focus:outline-none"
              />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="customer-phone" className="block text-xs font-semibold text-navy/70 mb-1.5">
                Phone Number
              </label>
              <input
                id="customer-phone"
                type="text"
                name="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="e.g. +1-800-555-0199"
                className="w-full rounded-2xl border border-navy/15 bg-white px-4 py-2.5 text-sm text-navy placeholder:text-navy/40 focus:border-teal focus:outline-none"
              />
            </div>

            {/* Address */}
            <div>
              <label htmlFor="customer-address" className="block text-xs font-semibold text-navy/70 mb-1.5">
                Physical / HQ Address
              </label>
              <input
                id="customer-address"
                type="text"
                name="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="e.g. 100 Technology Blvd, Silicon Valley, CA"
                className="w-full rounded-2xl border border-navy/15 bg-white px-4 py-2.5 text-sm text-navy placeholder:text-navy/40 focus:border-teal focus:outline-none"
              />
            </div>
          </div>

          {/* Payload Preview & Submit Row */}
          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
            <details className="text-xs text-navy/70 group">
              <summary className="cursor-pointer font-medium hover:text-navy">
                Preview JSON Payload
              </summary>
              <pre className="mt-2 rounded-2xl bg-cream p-3 font-mono text-xs text-navy overflow-x-auto border border-navy/10">
{JSON.stringify(
  {
    name: formData.name,
    email: formData.email,
    phone: formData.phone,
    address: formData.address,
  },
  null,
  2
)}
              </pre>
            </details>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center rounded-full bg-navy px-6 py-3 font-semibold text-cream transition hover:bg-navy/90 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Registering...
                </>
              ) : (
                'Add Account'
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Search & Auto-Filter Control Bar */}
      <div className="mt-8 rounded-3xl bg-white p-5 shadow-card">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Live On-type Search Input */}
          <div className="relative flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-navy/40">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, phone, address, or customer ID..."
              className="w-full rounded-2xl border border-navy/15 bg-cream/30 py-2.5 pl-11 pr-10 text-sm text-navy placeholder:text-navy/40 focus:border-teal focus:bg-white focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-navy/40 hover:text-navy"
                title="Clear search"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Phone Filter */}
            <div className="flex items-center gap-1.5">
              <label htmlFor="filter-phone" className="text-xs font-semibold text-navy/60">
                Phone:
              </label>
              <select
                id="filter-phone"
                value={filterPhone}
                onChange={(e) => setFilterPhone(e.target.value)}
                className="rounded-2xl border border-navy/15 bg-white px-3 py-2 text-xs font-medium text-navy focus:border-teal focus:outline-none"
              >
                <option value="all">All Contacts</option>
                <option value="has_phone">With Phone</option>
                <option value="no_phone">No Phone</option>
              </select>
            </div>

            {/* Address Filter */}
            <div className="flex items-center gap-1.5">
              <label htmlFor="filter-address" className="text-xs font-semibold text-navy/60">
                Address:
              </label>
              <select
                id="filter-address"
                value={filterAddress}
                onChange={(e) => setFilterAddress(e.target.value)}
                className="rounded-2xl border border-navy/15 bg-white px-3 py-2 text-xs font-medium text-navy focus:border-teal focus:outline-none"
              >
                <option value="all">All Locations</option>
                <option value="has_address">With Address</option>
                <option value="no_address">No Address</option>
              </select>
            </div>

            {/* Sort Order */}
            <div className="flex items-center gap-1.5">
              <label htmlFor="sort-by" className="text-xs font-semibold text-navy/60">
                Sort:
              </label>
              <select
                id="sort-by"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-2xl border border-navy/15 bg-white px-3 py-2 text-xs font-medium text-navy focus:border-teal focus:outline-none"
              >
                <option value="id_asc">ID (Oldest first)</option>
                <option value="id_desc">ID (Newest first)</option>
                <option value="name_asc">Name (A-Z)</option>
                <option value="name_desc">Name (Z-A)</option>
              </select>
            </div>

            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="rounded-2xl border border-coral/30 bg-coral/10 px-3 py-2 text-xs font-semibold text-coral transition hover:bg-coral/20"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* Counter and Active Filter Indicators */}
        <div className="mt-3 flex flex-wrap items-center justify-between border-t border-navy/10 pt-3 text-xs text-navy/60">
          <div>
            Showing <span className="font-semibold text-navy">{filteredCustomers.length}</span> of{' '}
            <span className="font-semibold text-navy">{customers.length}</span> total accounts
          </div>
          {hasActiveFilters && (
            <div className="flex items-center gap-2">
              <span className="font-medium text-teal">Active filters applied</span>
            </div>
          )}
        </div>
      </div>

      {/* Customer Directory Table */}
      <div className="mt-6 overflow-hidden rounded-3xl bg-white shadow-card">
        <div className="flex items-center justify-between border-b border-navy/10 px-6 py-4">
          <div className="flex items-center gap-3">
            <h2 className="font-display text-xl text-navy">Customer Directory</h2>
            <span className="rounded-full bg-teal-soft px-2.5 py-0.5 text-xs font-semibold text-teal">
              {filteredCustomers.length} accounts
            </span>
          </div>
          <button
            type="button"
            onClick={loadCustomers}
            disabled={isLoading}
            className="text-xs font-semibold text-teal hover:underline"
          >
            {isLoading ? 'Refreshing...' : 'Refresh List'}
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-teal-soft text-navy">
              <tr>
                <th className="px-5 py-3 font-semibold">ID</th>
                <th className="px-5 py-3 font-semibold">Customer / Org</th>
                <th className="px-5 py-3 font-semibold">Email</th>
                <th className="px-5 py-3 font-semibold">Phone</th>
                <th className="px-5 py-3 font-semibold">Address</th>
                <th className="px-5 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && customers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-navy/60">
                    <div className="inline-flex items-center gap-2">
                      <svg className="h-4 w-4 animate-spin text-teal" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Loading customer directory...
                    </div>
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center">
                    <p className="font-display text-lg text-navy">No customer accounts yet</p>
                    <p className="mt-1 text-xs text-navy/60">
                      Submit the form above to register your first customer account.
                    </p>
                  </td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center">
                    <p className="font-display text-lg text-navy">No matching customers found</p>
                    <p className="mt-1 text-xs text-navy/60">
                      Try adjusting your search terms or clearing the active filters.
                    </p>
                    <button
                      type="button"
                      onClick={handleResetFilters}
                      className="mt-3 inline-block rounded-full bg-navy px-4 py-1.5 text-xs font-semibold text-cream"
                    >
                      Reset All Filters
                    </button>
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="border-t border-navy/10 transition hover:bg-cream/40">
                    <td className="px-5 py-3.5 font-mono text-xs font-semibold text-navy/70">
                      #{customer.id}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-navy">{customer.name}</div>
                    </td>
                    <td className="px-5 py-3.5">
                      <a href={`mailto:${customer.email}`} className="text-teal hover:underline">
                        {customer.email}
                      </a>
                    </td>
                    <td className="px-5 py-3.5 text-navy/80">
                      {customer.phone ? (
                        <span>{customer.phone}</span>
                      ) : (
                        <span className="text-navy/40">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-navy/70 max-w-xs truncate">
                      {customer.address ? (
                        <span>{customer.address}</span>
                      ) : (
                        <span className="text-navy/40">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(customer)}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-teal hover:underline"
                        >
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(customer.id, customer.name)}
                          disabled={deletingId === customer.id}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-coral hover:underline disabled:opacity-50"
                        >
                          {deletingId === customer.id ? (
                            'Deleting...'
                          ) : (
                            <>
                              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Delete
                            </>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Customer Modal */}
      {editingCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl border border-navy/10 my-8">
            <div className="flex items-center justify-between border-b border-navy/10 pb-4">
              <div>
                <h3 className="font-display text-xl text-navy">Edit Customer Account</h3>
                <p className="text-xs text-navy/60">
                  Updating Customer #{editingCustomer.id} via <code className="font-mono">PUT /api/customers/{editingCustomer.id}</code>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingCustomer(null)}
                className="rounded-full p-1 text-navy/50 hover:bg-cream hover:text-navy"
                title="Close modal"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {editError && (
              <div className="mt-4 flex items-start gap-2 rounded-2xl border border-coral/30 bg-coral/10 p-3 text-xs text-coral">
                <svg className="h-4 w-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>{editError}</span>
              </div>
            )}

            <form onSubmit={handleUpdateCustomer} className="mt-5 space-y-4">
              <div>
                <label htmlFor="edit-customer-name" className="block text-xs font-semibold text-navy/70 mb-1">
                  Organization / Name <span className="text-coral">*</span>
                </label>
                <input
                  id="edit-customer-name"
                  required
                  type="text"
                  value={editingCustomer.name}
                  onChange={(e) => setEditingCustomer({ ...editingCustomer, name: e.target.value })}
                  className="w-full rounded-2xl border border-navy/15 bg-white px-4 py-2.5 text-sm text-navy focus:border-teal focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="edit-customer-email" className="block text-xs font-semibold text-navy/70 mb-1">
                  Email Address <span className="text-coral">*</span>
                </label>
                <input
                  id="edit-customer-email"
                  required
                  type="email"
                  value={editingCustomer.email}
                  onChange={(e) => setEditingCustomer({ ...editingCustomer, email: e.target.value })}
                  className="w-full rounded-2xl border border-navy/15 bg-white px-4 py-2.5 text-sm text-navy focus:border-teal focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="edit-customer-phone" className="block text-xs font-semibold text-navy/70 mb-1">
                  Phone Number
                </label>
                <input
                  id="edit-customer-phone"
                  type="text"
                  value={editingCustomer.phone}
                  onChange={(e) => setEditingCustomer({ ...editingCustomer, phone: e.target.value })}
                  className="w-full rounded-2xl border border-navy/15 bg-white px-4 py-2.5 text-sm text-navy focus:border-teal focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="edit-customer-address" className="block text-xs font-semibold text-navy/70 mb-1">
                  Physical / HQ Address
                </label>
                <input
                  id="edit-customer-address"
                  type="text"
                  value={editingCustomer.address}
                  onChange={(e) => setEditingCustomer({ ...editingCustomer, address: e.target.value })}
                  className="w-full rounded-2xl border border-navy/15 bg-white px-4 py-2.5 text-sm text-navy focus:border-teal focus:outline-none"
                />
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-navy/10">
                <button
                  type="button"
                  onClick={() => setEditingCustomer(null)}
                  className="rounded-full px-5 py-2.5 text-sm font-semibold text-navy/70 hover:bg-cream"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="inline-flex items-center justify-center rounded-full bg-teal px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-deep disabled:opacity-50"
                >
                  {isUpdating ? (
                    <>
                      <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
