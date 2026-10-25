'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { DashboardShell } from '@/components/DashboardShell';
import { api, Device, Customer } from '@/lib/api';

type DeviceFormData = {
  name: string;
  serial_number: string;
  device_type: string;
  status: string;
  customer_id: number;
};

type EditDeviceFormData = {
  id: number;
  name: string;
  serial_number: string;
  device_type: string;
  status: string;
  customer_id: number;
  firmware_version: string;
  battery_level: string;
};

const DEFAULT_FORM: DeviceFormData = {
  name: 'Core Firewall 01',
  serial_number: 'FW-ALEHU-2026',
  device_type: 'firewall',
  status: 'active',
  customer_id: 1,
};

export default function DevicesPage() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [formData, setFormData] = useState<DeviceFormData>(DEFAULT_FORM);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCustomerId, setFilterCustomerId] = useState<string>('all');

  // Edit Feature State
  const [editingDevice, setEditingDevice] = useState<EditDeviceFormData | null>(null);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [editError, setEditError] = useState<string>('');

  function loadDevices() {
    setIsLoading(true);
    api<{ devices: Device[] }>('/devices?per_page=100')
      .then((result) => {
        setDevices(result.data.devices || []);
        setError('');
      })
      .catch((err) => {
        setError(err.message || 'Failed to fetch devices');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  function loadCustomers() {
    api<{ customers: Customer[] }>('/customers?per_page=100')
      .then((result) => {
        setCustomers(result.data.customers || []);
      })
      .catch(() => {
        // Customer loading is optional
      });
  }

  useEffect(() => {
    loadDevices();
    loadCustomers();
  }, []);

  // Compute distinct device types for auto-filter options
  const distinctTypes = useMemo(() => {
    const types = new Set<string>();
    devices.forEach((d) => {
      if (d.device_type) types.add(d.device_type.toLowerCase());
    });
    // Add common fallback types if not present
    ['firewall', 'wearable', 'router', 'switch', 'gateway', 'server'].forEach((t) => types.add(t));
    return Array.from(types).sort();
  }, [devices]);

  // Real-time Auto-filtered and searched devices
  const filteredDevices = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return devices.filter((device) => {
      // Search matching (name, serial, type, status, firmware, or customer info)
      if (q) {
        const matchesName = device.name?.toLowerCase().includes(q);
        const matchesSerial = device.serial_number?.toLowerCase().includes(q);
        const matchesType = device.device_type?.toLowerCase().includes(q);
        const matchesStatus = device.status?.toLowerCase().includes(q);
        const matchesFirmware = device.firmware_version?.toLowerCase().includes(q);
        const matchesCustomerId = device.customer_id ? `customer #${device.customer_id}`.includes(q) : false;

        const customer = customers.find((c) => c.id === device.customer_id);
        const matchesCustomerName = customer ? customer.name.toLowerCase().includes(q) : false;

        if (
          !matchesName &&
          !matchesSerial &&
          !matchesType &&
          !matchesStatus &&
          !matchesFirmware &&
          !matchesCustomerId &&
          !matchesCustomerName
        ) {
          return false;
        }
      }

      // Filter by Type
      if (filterType !== 'all') {
        if ((device.device_type || '').toLowerCase() !== filterType.toLowerCase()) {
          return false;
        }
      }

      // Filter by Status
      if (filterStatus !== 'all') {
        if ((device.status || '').toLowerCase() !== filterStatus.toLowerCase()) {
          return false;
        }
      }

      // Filter by Customer
      if (filterCustomerId !== 'all') {
        if (device.customer_id !== Number(filterCustomerId)) {
          return false;
        }
      }

      return true;
    });
  }, [devices, customers, searchQuery, filterType, filterStatus, filterCustomerId]);

  const hasActiveFilters = searchQuery.trim() !== '' || filterType !== 'all' || filterStatus !== 'all' || filterCustomerId !== 'all';

  function handleResetFilters() {
    setSearchQuery('');
    setFilterType('all');
    setFilterStatus('all');
    setFilterCustomerId('all');
  }

  // Create Device Handler
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    const payload = {
      name: formData.name.trim(),
      serial_number: formData.serial_number.trim(),
      device_type: formData.device_type.trim() || 'firewall',
      status: formData.status.trim() || 'active',
      customer_id: Number(formData.customer_id) || 1,
    };

    try {
      await api<{ device: Device }>('/devices', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      setSuccess(`Device "${payload.name}" (${payload.serial_number}) registered successfully.`);
      loadDevices();
    } catch (err: unknown) {
      const apiErr = err as { message?: string; errors?: Record<string, string[]> };
      let errorMsg = apiErr.message || 'Failed to register device';
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
  function handleOpenEdit(device: Device) {
    setEditError('');
    setEditingDevice({
      id: device.id,
      name: device.name,
      serial_number: device.serial_number,
      device_type: device.device_type || 'firewall',
      status: device.status || 'active',
      customer_id: device.customer_id || 1,
      firmware_version: device.firmware_version || '',
      battery_level: device.battery_level != null ? String(device.battery_level) : '',
    });
  }

  // Submit Edit Form Handler
  async function handleUpdateDevice(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editingDevice) return;

    setEditError('');
    setIsUpdating(true);

    const payload = {
      name: editingDevice.name.trim(),
      serial_number: editingDevice.serial_number.trim(),
      device_type: editingDevice.device_type.trim() || null,
      status: editingDevice.status.trim() || 'active',
      customer_id: editingDevice.customer_id ? Number(editingDevice.customer_id) : null,
      firmware_version: editingDevice.firmware_version.trim() || null,
      battery_level: editingDevice.battery_level !== '' ? parseInt(editingDevice.battery_level, 10) : null,
    };

    try {
      const response = await api<{ device: Device }>(`/devices/${editingDevice.id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });

      setSuccess(`Device "${payload.name}" updated successfully.`);
      const updated = response.data.device;

      setDevices((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
      setEditingDevice(null);
    } catch (err: unknown) {
      const apiErr = err as { message?: string; errors?: Record<string, string[]> };
      let errorMsg = apiErr.message || 'Failed to update device';
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

  // Delete Device Handler
  async function handleDelete(deviceId: number, deviceName: string) {
    if (!window.confirm(`Are you sure you want to delete "${deviceName}"?`)) {
      return;
    }

    setDeletingId(deviceId);
    setError('');
    setSuccess('');

    try {
      await api(`/devices/${deviceId}`, {
        method: 'DELETE',
      });
      setSuccess(`Device "${deviceName}" was deleted.`);
      setDevices((prev) => prev.filter((d) => d.id !== deviceId));
    } catch (err: unknown) {
      const apiErr = err as { message?: string };
      setError(apiErr.message || 'Failed to delete device');
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
          <h1 className="font-display text-4xl text-navy">Devices & Hardware</h1>
          <p className="mt-1 text-sm text-navy/70">
            Register, edit, search, and monitor network appliances, edge firewalls, and child safety devices.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-teal-soft px-3 py-1 text-xs font-semibold text-teal">
            {devices.length} {devices.length === 1 ? 'Device' : 'Devices'}
          </span>
          {hasActiveFilters && (
            <span className="rounded-full bg-sand px-3 py-1 text-xs font-semibold text-navy/80">
              Filtered: {filteredDevices.length}
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

      {/* Registration Card */}
      <div className="mt-6 rounded-3xl bg-white p-6 shadow-card">
        <div className="flex flex-col gap-2 border-b border-navy/10 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-xl text-navy">Register New Device</h2>
            <p className="text-xs text-navy/60">
              API Endpoint: <code className="rounded bg-sand/60 px-1.5 py-0.5 text-navy font-mono">POST /api/devices</code>
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
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {/* Device Name */}
            <div>
              <label htmlFor="device-name" className="block text-xs font-semibold text-navy/70 mb-1.5">
                Device Name <span className="text-coral">*</span>
              </label>
              <input
                id="device-name"
                required
                type="text"
                name="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Core Firewall 01"
                className="w-full rounded-2xl border border-navy/15 bg-white px-4 py-2.5 text-sm text-navy placeholder:text-navy/40 focus:border-teal focus:outline-none"
              />
            </div>

            {/* Serial Number */}
            <div>
              <label htmlFor="device-serial" className="block text-xs font-semibold text-navy/70 mb-1.5">
                Serial Number <span className="text-coral">*</span>
              </label>
              <input
                id="device-serial"
                required
                type="text"
                name="serial_number"
                value={formData.serial_number}
                onChange={(e) => setFormData({ ...formData, serial_number: e.target.value })}
                placeholder="e.g. FW-ALEHU-2026"
                className="w-full rounded-2xl border border-navy/15 bg-white px-4 py-2.5 text-sm font-mono text-navy placeholder:text-navy/40 focus:border-teal focus:outline-none"
              />
            </div>

            {/* Device Type */}
            <div>
              <label htmlFor="device-type" className="block text-xs font-semibold text-navy/70 mb-1.5">
                Device Type <span className="text-coral">*</span>
              </label>
              <input
                id="device-type"
                required
                type="text"
                list="device-types-list"
                name="device_type"
                value={formData.device_type}
                onChange={(e) => setFormData({ ...formData, device_type: e.target.value })}
                placeholder="e.g. firewall"
                className="w-full rounded-2xl border border-navy/15 bg-white px-4 py-2.5 text-sm text-navy placeholder:text-navy/40 focus:border-teal focus:outline-none"
              />
              <datalist id="device-types-list">
                <option value="firewall">Firewall</option>
                <option value="wearable">Wearable</option>
                <option value="gateway">Gateway</option>
                <option value="router">Router</option>
                <option value="switch">Switch</option>
                <option value="sensor">Sensor</option>
              </datalist>
            </div>

            {/* Status */}
            <div>
              <label htmlFor="device-status" className="block text-xs font-semibold text-navy/70 mb-1.5">
                Status <span className="text-coral">*</span>
              </label>
              <select
                id="device-status"
                name="status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full rounded-2xl border border-navy/15 bg-white px-4 py-2.5 text-sm text-navy focus:border-teal focus:outline-none"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="maintenance">Maintenance</option>
                <option value="offline">Offline</option>
              </select>
            </div>

            {/* Customer ID */}
            <div>
              <label htmlFor="customer-id" className="block text-xs font-semibold text-navy/70 mb-1.5">
                Customer ID <span className="text-coral">*</span>
              </label>
              <input
                id="customer-id"
                required
                type="number"
                min={1}
                name="customer_id"
                value={formData.customer_id}
                onChange={(e) => setFormData({ ...formData, customer_id: parseInt(e.target.value, 10) || 1 })}
                placeholder="1"
                className="w-full rounded-2xl border border-navy/15 bg-white px-4 py-2.5 text-sm text-navy placeholder:text-navy/40 focus:border-teal focus:outline-none"
              />
              {customers.length > 0 && (
                <p className="mt-1 truncate text-[11px] text-navy/60">
                  {customers.find((c) => c.id === formData.customer_id)
                    ? `Linked: ${customers.find((c) => c.id === formData.customer_id)?.name}`
                    : `Known customers: ${customers.map((c) => `#${c.id}`).slice(0, 4).join(', ')}`}
                </p>
              )}
            </div>
          </div>

          {/* Payload Preview & Submit Row */}
          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
            <details className="text-xs text-navy/70 group">
              <summary className="cursor-pointer font-medium hover:text-navy">
                Preview JSON Registration Payload
              </summary>
              <pre className="mt-2 rounded-2xl bg-cream p-3 font-mono text-xs text-navy overflow-x-auto border border-navy/10">
{JSON.stringify(
  {
    name: formData.name,
    serial_number: formData.serial_number,
    device_type: formData.device_type,
    status: formData.status,
    customer_id: Number(formData.customer_id),
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
                'Register Device'
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Search & Auto-Filter Control Bar */}
      <div className="mt-8 rounded-3xl bg-white p-5 shadow-card">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Live Search Input */}
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
              placeholder="Search by name, serial number, type, status, firmware, or customer..."
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
            {/* Filter by Type */}
            <div className="flex items-center gap-1.5">
              <label htmlFor="filter-type" className="text-xs font-semibold text-navy/60">
                Type:
              </label>
              <select
                id="filter-type"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="rounded-2xl border border-navy/15 bg-white px-3 py-2 text-xs font-medium text-navy focus:border-teal focus:outline-none"
              >
                <option value="all">All Types ({devices.length})</option>
                {distinctTypes.map((type) => {
                  const count = devices.filter((d) => (d.device_type || '').toLowerCase() === type).length;
                  return (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)} {count > 0 ? `(${count})` : ''}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Filter by Status */}
            <div className="flex items-center gap-1.5">
              <label htmlFor="filter-status" className="text-xs font-semibold text-navy/60">
                Status:
              </label>
              <select
                id="filter-status"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="rounded-2xl border border-navy/15 bg-white px-3 py-2 text-xs font-medium text-navy focus:border-teal focus:outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="maintenance">Maintenance</option>
                <option value="offline">Offline</option>
              </select>
            </div>

            {/* Filter by Customer */}
            {customers.length > 0 && (
              <div className="flex items-center gap-1.5">
                <label htmlFor="filter-customer" className="text-xs font-semibold text-navy/60">
                  Customer:
                </label>
                <select
                  id="filter-customer"
                  value={filterCustomerId}
                  onChange={(e) => setFilterCustomerId(e.target.value)}
                  className="rounded-2xl border border-navy/15 bg-white px-3 py-2 text-xs font-medium text-navy focus:border-teal focus:outline-none max-w-[170px] truncate"
                >
                  <option value="all">All Customers</option>
                  {customers.map((c) => (
                    <option key={c.id} value={String(c.id)}>
                      #{c.id} {c.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Clear All Filters Button */}
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

        {/* Results Counter and Active Indicators */}
        <div className="mt-3 flex flex-wrap items-center justify-between border-t border-navy/10 pt-3 text-xs text-navy/60">
          <div>
            Showing <span className="font-semibold text-navy">{filteredDevices.length}</span> of{' '}
            <span className="font-semibold text-navy">{devices.length}</span> total devices
          </div>
          {hasActiveFilters && (
            <div className="flex items-center gap-2">
              <span className="font-medium text-teal">Active filters applied</span>
            </div>
          )}
        </div>
      </div>

      {/* Devices List Table */}
      <div className="mt-6 overflow-hidden rounded-3xl bg-white shadow-card">
        <div className="flex items-center justify-between border-b border-navy/10 px-6 py-4">
          <div className="flex items-center gap-3">
            <h2 className="font-display text-xl text-navy">Inventory List</h2>
            <span className="rounded-full bg-teal-soft px-2.5 py-0.5 text-xs font-semibold text-teal">
              {filteredDevices.length} shown
            </span>
          </div>
          <button
            type="button"
            onClick={loadDevices}
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
                <th className="px-5 py-3 font-semibold">Name</th>
                <th className="px-5 py-3 font-semibold">Serial Number</th>
                <th className="px-5 py-3 font-semibold">Type</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold">Customer</th>
                <th className="px-5 py-3 font-semibold">Battery</th>
                <th className="px-5 py-3 font-semibold">Firmware</th>
                <th className="px-5 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && devices.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-10 text-center text-navy/60">
                    <div className="inline-flex items-center gap-2">
                      <svg className="h-4 w-4 animate-spin text-teal" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Loading devices inventory...
                    </div>
                  </td>
                </tr>
              ) : devices.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center">
                    <p className="font-display text-lg text-navy">No devices registered yet</p>
                    <p className="mt-1 text-xs text-navy/60">
                      Submit the form above to register your first device into the inventory.
                    </p>
                  </td>
                </tr>
              ) : filteredDevices.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center">
                    <p className="font-display text-lg text-navy">No matching devices found</p>
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
                filteredDevices.map((device) => {
                  const statusColors: Record<string, string> = {
                    active: 'bg-teal/15 text-teal-deep border-teal/20',
                    inactive: 'bg-sand text-navy/70 border-navy/10',
                    maintenance: 'bg-amber/15 text-amber border-amber/20',
                    offline: 'bg-coral/15 text-coral border-coral/20',
                  };
                  const statusClass = statusColors[device.status?.toLowerCase()] || statusColors.inactive;
                  const customer = customers.find((c) => c.id === device.customer_id);

                  return (
                    <tr key={device.id} className="border-t border-navy/10 transition hover:bg-cream/40">
                      <td className="px-5 py-3.5 font-medium text-navy">
                        <div className="flex items-center gap-2">
                          <span>{device.name}</span>
                          <span className="text-[10px] text-navy/40 font-mono">#{device.id}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 font-mono text-xs text-navy/80">{device.serial_number}</td>
                      <td className="px-5 py-3.5">
                        <span className="inline-block rounded-full bg-cream px-3 py-1 text-xs font-semibold uppercase tracking-wider text-navy/80 border border-navy/10">
                          {device.device_type || 'unspecified'}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusClass}`}>
                          <span className="h-1.5 w-1.5 rounded-full bg-current" />
                          {device.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-navy/80">
                        {device.customer_id ? (
                          <div className="flex flex-col">
                            <span className="font-medium text-teal">Customer #{device.customer_id}</span>
                            {customer && <span className="text-[11px] text-navy/50">{customer.name}</span>}
                          </div>
                        ) : (
                          <span className="text-navy/40">—</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-navy/80">
                        {device.battery_level != null ? `${device.battery_level}%` : '—'}
                      </td>
                      <td className="px-5 py-3.5 text-navy/70">
                        {device.firmware_version || '—'}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(device)}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-teal hover:underline"
                          >
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(device.id, device.name)}
                            disabled={deletingId === device.id}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-coral hover:underline disabled:opacity-50"
                          >
                            {deletingId === device.id ? (
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
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Device Modal */}
      {editingDevice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl border border-navy/10 my-8">
            <div className="flex items-center justify-between border-b border-navy/10 pb-4">
              <div>
                <h3 className="font-display text-xl text-navy">Edit Device</h3>
                <p className="text-xs text-navy/60">
                  Updating device ID #{editingDevice.id} via <code className="font-mono">PUT /api/devices/{editingDevice.id}</code>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingDevice(null)}
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

            <form onSubmit={handleUpdateDevice} className="mt-5 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Device Name */}
                <div>
                  <label htmlFor="edit-name" className="block text-xs font-semibold text-navy/70 mb-1">
                    Device Name <span className="text-coral">*</span>
                  </label>
                  <input
                    id="edit-name"
                    required
                    type="text"
                    value={editingDevice.name}
                    onChange={(e) => setEditingDevice({ ...editingDevice, name: e.target.value })}
                    className="w-full rounded-2xl border border-navy/15 bg-white px-4 py-2.5 text-sm text-navy focus:border-teal focus:outline-none"
                  />
                </div>

                {/* Serial Number */}
                <div>
                  <label htmlFor="edit-serial" className="block text-xs font-semibold text-navy/70 mb-1">
                    Serial Number <span className="text-coral">*</span>
                  </label>
                  <input
                    id="edit-serial"
                    required
                    type="text"
                    value={editingDevice.serial_number}
                    onChange={(e) => setEditingDevice({ ...editingDevice, serial_number: e.target.value })}
                    className="w-full rounded-2xl border border-navy/15 bg-white px-4 py-2.5 text-sm font-mono text-navy focus:border-teal focus:outline-none"
                  />
                </div>

                {/* Device Type */}
                <div>
                  <label htmlFor="edit-type" className="block text-xs font-semibold text-navy/70 mb-1">
                    Device Type
                  </label>
                  <input
                    id="edit-type"
                    type="text"
                    list="edit-device-types-list"
                    value={editingDevice.device_type}
                    onChange={(e) => setEditingDevice({ ...editingDevice, device_type: e.target.value })}
                    className="w-full rounded-2xl border border-navy/15 bg-white px-4 py-2.5 text-sm text-navy focus:border-teal focus:outline-none"
                  />
                  <datalist id="edit-device-types-list">
                    <option value="firewall">Firewall</option>
                    <option value="wearable">Wearable</option>
                    <option value="gateway">Gateway</option>
                    <option value="router">Router</option>
                    <option value="switch">Switch</option>
                    <option value="sensor">Sensor</option>
                    <option value="server">Server</option>
                  </datalist>
                </div>

                {/* Status */}
                <div>
                  <label htmlFor="edit-status" className="block text-xs font-semibold text-navy/70 mb-1">
                    Status
                  </label>
                  <select
                    id="edit-status"
                    value={editingDevice.status}
                    onChange={(e) => setEditingDevice({ ...editingDevice, status: e.target.value })}
                    className="w-full rounded-2xl border border-navy/15 bg-white px-4 py-2.5 text-sm text-navy focus:border-teal focus:outline-none"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="offline">Offline</option>
                  </select>
                </div>

                {/* Customer ID */}
                <div>
                  <label htmlFor="edit-customer" className="block text-xs font-semibold text-navy/70 mb-1">
                    Customer ID
                  </label>
                  <input
                    id="edit-customer"
                    type="number"
                    min={1}
                    value={editingDevice.customer_id}
                    onChange={(e) => setEditingDevice({ ...editingDevice, customer_id: parseInt(e.target.value, 10) || 1 })}
                    className="w-full rounded-2xl border border-navy/15 bg-white px-4 py-2.5 text-sm text-navy focus:border-teal focus:outline-none"
                  />
                  {customers.length > 0 && (
                    <p className="mt-1 text-[11px] text-navy/50 truncate">
                      {customers.find((c) => c.id === editingDevice.customer_id)
                        ? `Linked: ${customers.find((c) => c.id === editingDevice.customer_id)?.name}`
                        : `Customer ID #${editingDevice.customer_id}`}
                    </p>
                  )}
                </div>

                {/* Battery Level */}
                <div>
                  <label htmlFor="edit-battery" className="block text-xs font-semibold text-navy/70 mb-1">
                    Battery Level (%)
                  </label>
                  <input
                    id="edit-battery"
                    type="number"
                    min={0}
                    max={100}
                    placeholder="e.g. 85 (optional)"
                    value={editingDevice.battery_level}
                    onChange={(e) => setEditingDevice({ ...editingDevice, battery_level: e.target.value })}
                    className="w-full rounded-2xl border border-navy/15 bg-white px-4 py-2.5 text-sm text-navy focus:border-teal focus:outline-none"
                  />
                </div>

                {/* Firmware Version */}
                <div className="sm:col-span-2">
                  <label htmlFor="edit-firmware" className="block text-xs font-semibold text-navy/70 mb-1">
                    Firmware Version
                  </label>
                  <input
                    id="edit-firmware"
                    type="text"
                    placeholder="e.g. v2.4.1 (optional)"
                    value={editingDevice.firmware_version}
                    onChange={(e) => setEditingDevice({ ...editingDevice, firmware_version: e.target.value })}
                    className="w-full rounded-2xl border border-navy/15 bg-white px-4 py-2.5 text-sm text-navy focus:border-teal focus:outline-none"
                  />
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-navy/10">
                <button
                  type="button"
                  onClick={() => setEditingDevice(null)}
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
