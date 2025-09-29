// src\app\pages\SimManager\Practices\PracticeDetail\PracticeStep\CreateUpdateStep.jsx
import React, { useState, useEffect } from 'react';

export default function CreateUpdateStep({
  step,
  practiceId,
  onSubmit,
  onDelete,
  onCancel,
}) {
  const [form, setForm] = useState({
    stepName: '',
    stepDescription: '',
    expectedResult: '',
    stepOrder: '',
  });

  useEffect(() => {
    if (step) {
      setForm({
        stepName: step.stepName || '',
        stepDescription: step.stepDescription || step.description || '',
        expectedResult: step.expectedResult || '',
        stepOrder: step.stepOrder || step.order || '',
      });
    }
  }, [step]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({
      ...f,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // For create: needs practiceId, for update: don't include it
    if (step) {
      // Update payload (no practiceId, must match BE shape)
      onSubmit({
        stepName: form.stepName,
        stepDescription: form.stepDescription,
        expectedResult: form.expectedResult,
        stepOrder: form.stepOrder ? Number(form.stepOrder) : 0,
      });
    } else {
      // Create payload (with practiceId)
      onSubmit({
        practiceId: Number(practiceId),
        stepName: form.stepName,
        stepDescription: form.stepDescription,
        expectedResult: form.expectedResult,
        stepOrder: form.stepOrder ? Number(form.stepOrder) : 0,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded-lg border">
      <div>
        <label className="block text-xs font-medium">Step Name</label>
        <input
          type="text"
          name="stepName"
          value={form.stepName}
          onChange={handleChange}
          className="w-full border rounded p-2"
          required
        />
      </div>
      <div>
        <label className="block text-xs font-medium">Step Description</label>
        <textarea
          name="stepDescription"
          value={form.stepDescription}
          onChange={handleChange}
          className="w-full border rounded p-2"
          required
        />
      </div>
      <div>
        <label className="block text-xs font-medium">Expected Result</label>
        <input
          type="text"
          name="expectedResult"
          value={form.expectedResult}
          onChange={handleChange}
          className="w-full border rounded p-2"
        />
      </div>
      <div>
        <label className="block text-xs font-medium">Order</label>
        <input
          type="number"
          name="stepOrder"
          value={form.stepOrder}
          onChange={handleChange}
          className="w-full border rounded p-2"
        />
      </div>
      <div className="flex gap-2 mt-3">
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {step ? "Update Step" : "Create Step"}
        </button>
        {step && (
          <button
            type="button"
            onClick={() => { if (window.confirm('Delete this step?')) onDelete(step.id); }}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Delete
          </button>
        )}
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

