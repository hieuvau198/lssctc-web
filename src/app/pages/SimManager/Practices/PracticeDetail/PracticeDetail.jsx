// src/app/pages/SimManager/Practices/PracticeDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getPracticeById,
  updatePractice,
  deletePractice,
  getPracticeStepsByPracticeId,
  createPracticeStep,
  updatePracticeStep,
  deletePracticeStep,
  getPracticeStepComponents 
} from '../../../../apis/SimulationManager/SimulationManagerPracticeApi';
import CreateUpdateStep from "./CreateUpdateStep";


export default function PracticeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Practice info
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);

  // Steps
  const [steps, setSteps] = useState([]);
  const [stepsLoading, setStepsLoading] = useState(true);
  const [stepsError, setStepsError] = useState(null);

  // Step editing/creating state
  const [showStepForm, setShowStepForm] = useState(false);
  const [editingStep, setEditingStep] = useState(null);

  // PracticeStepComponents
  const [openStepId, setOpenStepId] = useState(null); // Which step is open
  const [componentLoading, setComponentLoading] = useState(false);
  const [stepComponents, setStepComponents] = useState({}); // stepId => components



  // Load practice and steps
  const loadSteps = () => {
    setStepsLoading(true);
    getPracticeStepsByPracticeId(id)
      .then(setSteps)
      .catch(() => setStepsError('Could not fetch practice steps'))
      .finally(() => setStepsLoading(false));
  };

  useEffect(() => {
    setLoading(true);
    getPracticeById(id)
      .then((data) => {
        setForm(data);
        setLoading(false);
        loadSteps();
      })
      .catch(() => {
        setError('Could not fetch practice');
        setLoading(false);
      });
    // eslint-disable-next-line
  }, [id]);

  // Practice update/delete
  const handleUpdate = () => {
    setUpdating(true);
    updatePractice(id, form)
      .then(() => {
        alert('Updated!');
        setUpdating(false);
      })
      .catch(() => {
        alert('Update failed');
        setUpdating(false);
      });
  };

  const handleDelete = () => {
    if (!window.confirm('Delete this practice?')) return;
    setDeleting(true);
    deletePractice(id)
      .then(() => {
        navigate('/sim-manager/practices');
      })
      .catch(() => {
        alert('Delete failed');
        setDeleting(false);
      });
  };

  // Step create/update/delete handlers
  const handleStepSubmit = (data) => {
    const action = editingStep
      ? updatePracticeStep(editingStep.id, data)
      : createPracticeStep(data);

    action.then(() => {
      loadSteps();
      setShowStepForm(false);
      setEditingStep(null);
    });
  };

  const handleStepDelete = (stepId) => {
    deletePracticeStep(stepId).then(() => {
      loadSteps();
      setShowStepForm(false);
      setEditingStep(null);
    });
  };

  // PracticeStepComponents handlers
  const handleStepToggle = (stepId) => {
  if (openStepId === stepId) {
    setOpenStepId(null);
    return;
  }
  setOpenStepId(stepId);
  if (!stepComponents[stepId]) {
    setComponentLoading(true);
    getPracticeStepComponents(stepId)
      .then((components) => {
        setStepComponents((prev) => ({ ...prev, [stepId]: components }));
        setComponentLoading(false);
      })
      .catch(() => {
        setStepComponents((prev) => ({ ...prev, [stepId]: [] }));
        setComponentLoading(false);
      });
  }
};


  // UI logic
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!form) return null;

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Practice Detail</h2>
      <div className="bg-white border rounded-lg p-4 space-y-3">
        <div>
          <label className="block text-xs font-medium">Practice Name</label>
          <input
            className="w-full border rounded p-2"
            value={form.practiceName}
            onChange={e => setForm(f => ({ ...f, practiceName: e.target.value }))}
          />
        </div>
        <div>
          <label className="block text-xs font-medium">Description</label>
          <textarea
            className="w-full border rounded p-2"
            value={form.practiceDescription || ''}
            onChange={e => setForm(f => ({ ...f, practiceDescription: e.target.value }))}
          />
        </div>
        <div className="flex space-x-2">
          <div className="flex-1">
            <label className="block text-xs font-medium">Duration (min)</label>
            <input
              className="w-full border rounded p-2"
              type="number"
              value={form.estimatedDurationMinutes || ''}
              onChange={e => setForm(f => ({ ...f, estimatedDurationMinutes: e.target.value }))}
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-medium">Difficulty</label>
            <input
              className="w-full border rounded p-2"
              value={form.difficultyLevel || ''}
              onChange={e => setForm(f => ({ ...f, difficultyLevel: e.target.value }))}
            />
          </div>
        </div>
        <div className="flex space-x-2">
          <div className="flex-1">
            <label className="block text-xs font-medium">Max Attempts</label>
            <input
              className="w-full border rounded p-2"
              type="number"
              value={form.maxAttempts || ''}
              onChange={e => setForm(f => ({ ...f, maxAttempts: e.target.value }))}
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-medium">Status</label>
            <select
              className="w-full border rounded p-2"
              value={form.isActive ? 'true' : 'false'}
              onChange={e =>
                setForm(f => ({ ...f, isActive: e.target.value === 'true' }))
              }
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
        </div>
        <div className="flex space-x-2 mt-3">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={handleUpdate}
            disabled={updating}
          >
            Update
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            onClick={handleDelete}
            disabled={deleting}
          >
            Delete
          </button>
        </div>
      </div>
            {/* Steps section */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-base font-semibold">Practice Steps</h3>
          <button
            className="bg-green-600 text-white px-3 py-1 rounded text-sm"
            onClick={() => {
              setEditingStep(null);
              setShowStepForm(true);
            }}
          >
            Add Step
          </button>
        </div>

        {showStepForm && (
          <CreateUpdateStep
            step={editingStep}
            practiceId={id}
            onSubmit={handleStepSubmit}
            onDelete={handleStepDelete}
            onCancel={() => {
              setShowStepForm(false);
              setEditingStep(null);
            }}
          />
        )}

        {stepsLoading ? (
          <div>Loading steps...</div>
        ) : stepsError ? (
          <div className="text-red-500">{stepsError}</div>
        ) : steps.length === 0 ? (
          <div>No steps found for this practice.</div>
        ) : (
          <ol className="list-decimal pl-6 space-y-2">
  {steps.map((step) => (
    <li key={step.id} className="bg-slate-50 border rounded p-2 mb-2">
      {/* Step header (dropdown toggle) */}
      <div
        className="flex items-center cursor-pointer"
        onClick={() => handleStepToggle(step.id)}
      >
        <span className="mr-2">{openStepId === step.id ? '▼' : '▶'}</span>
        <span className="font-semibold">{step.stepName}</span>
        <span className="text-xs text-slate-400 ml-4">Order: {step.stepOrder}</span>
      </div>
      {/* Step details (description, expected result, edit/delete) */}
      <div className="ml-6 mt-1">
        {step.stepDescription && (
          <div className="text-xs text-slate-700 mb-1">{step.stepDescription}</div>
        )}
        {step.expectedResult && (
          <div className="text-xs text-slate-500">Expected: {step.expectedResult}</div>
        )}
        <div className="mt-1 flex gap-2">
          <button
            className="text-blue-600 hover:underline"
            onClick={(e) => {
              e.stopPropagation();
              setEditingStep(step);
              setShowStepForm(true);
            }}
          >
            Edit
          </button>
          <button
            className="text-red-500 hover:underline"
            onClick={(e) => {
              e.stopPropagation();
              if (window.confirm('Delete this step?')) handleStepDelete(step.id);
            }}
          >
            Delete
          </button>
        </div>
      </div>
      {/* Dropdown for components */}
      {openStepId === step.id && (
        <div className="mt-3 ml-8">
          {componentLoading && !stepComponents[step.id] ? (
            <div>Loading components...</div>
          ) : stepComponents[step.id] && stepComponents[step.id].length > 0 ? (
            <ul className="border-l-2 border-green-200 pl-4 space-y-1">
              {stepComponents[step.id].map((comp) => (
                <li key={comp.id} className="text-sm flex items-center gap-2">
                  {comp.imageUrl && (
                    <img src={comp.imageUrl} alt="" className="w-8 h-8 object-cover rounded" />
                  )}
                  <span className="font-medium">{comp.simulationComponentName}</span>
                  {comp.description && (
                    <span className="text-slate-500 ml-2">{comp.description}</span>
                  )}
                  <span className="text-xs text-slate-400 ml-2">Order: {comp.componentOrder}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-slate-400">No components assigned for this step.</div>
          )}
        </div>
      )}
    </li>
  ))}
</ol>

        )}
      </div>
    </div>
  );
}
