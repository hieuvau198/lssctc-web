// src\app\pages\SimManager\Settings\partials\UpdateComponent.jsx

import React, { useState } from 'react';
import { updateComponent } from '../../../../apis/SimulationManager/SimulationManagerComponentApi';

export default function UpdateComponent({ component, onUpdated, onCancel }) {
  const [form, setForm] = useState({
    name: component.name,
    description: component.description,
    imageUrl: component.imageUrl,
    isActive: component.isActive,
  });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({
      ...f,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    try {
      await updateComponent(component.id, form);
      onUpdated && onUpdated(); // reload parent
    } catch (ex) {
      setErr(ex.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white border rounded-lg max-w-lg w-full">
      <div className="font-bold text-lg mb-2">Update Component</div>
      {err && <div className="text-red-500">{err}</div>}
      <div className="mb-2">
        <label className="block font-semibold mb-1">Name</label>
        <input name="name" value={form.name} onChange={handleChange} className="w-full border rounded px-2 py-1" required />
      </div>
      <div className="mb-2">
        <label className="block font-semibold mb-1">Description</label>
        <textarea name="description" value={form.description} onChange={handleChange} className="w-full border rounded px-2 py-1" rows={2} />
      </div>
      <div className="mb-2">
        <label className="block font-semibold mb-1">Image URL</label>
        <input name="imageUrl" value={form.imageUrl} onChange={handleChange} className="w-full border rounded px-2 py-1" />
        {form.imageUrl && (
          <img src={form.imageUrl} alt="preview" className="mt-2 max-h-40 rounded shadow" />
        )}
      </div>
      <div className="mb-2 flex items-center gap-2">
        <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} id="isActive" />
        <label htmlFor="isActive" className="font-semibold">Active</label>
      </div>
      <div className="flex gap-2 mt-4">
        <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700">
          {loading ? 'Updating...' : 'Update'}
        </button>
        <button type="button" onClick={onCancel} className="border px-4 py-1 rounded">
          Cancel
        </button>
      </div>
    </form>
  );
}
