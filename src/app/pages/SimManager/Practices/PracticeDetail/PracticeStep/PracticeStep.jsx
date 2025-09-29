// src\app\pages\SimManager\Practices\PracticeDetail\PracticeStep\PracticeStep.jsx

import React, { useState } from 'react';
import { 
    getPracticeStepComponents
} from '../../../../../apis/SimulationManager/SimulationManagerPracticeApi';

export default function PracticeStep({
  step,
  onEdit,
  onDelete,
  initiallyOpen = false,
}) {
  const [open, setOpen] = useState(initiallyOpen);
  const [componentLoading, setComponentLoading] = useState(false);
  const [components, setComponents] = useState(null);

  const handleToggle = () => {
    if (!open && !components) {
      setComponentLoading(true);
      getPracticeStepComponents(step.id)
        .then((data) => setComponents(data))
        .finally(() => setComponentLoading(false));
    }
    setOpen((prev) => !prev);
  };

  return (
    <li className="bg-slate-50 border p-2 mb-2">
      {/* Step header (dropdown toggle) */}
      <div
        className="flex items-center cursor-pointer"
        onClick={handleToggle}
      >
        <span className="mr-2">{open ? '▼' : '▶'}</span>
        <span className="font-semibold">{step.stepName}</span>
        <span className="text-xs text-slate-400 ml-4">Order: {step.stepOrder}</span>
      </div>
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
              onEdit(step);
            }}
          >
            Edit
          </button>
          <button
            className="text-red-500 hover:underline"
            onClick={(e) => {
              e.stopPropagation();
              if (window.confirm('Delete this step?')) onDelete(step.id);
            }}
          >
            Delete
          </button>
        </div>
      </div>
      {/* Dropdown for components */}
      {open && (
        <div className="mt-3 ml-8">
          {componentLoading && !components ? (
            <div>Loading components...</div>
          ) : components && components.length > 0 ? (
            <ul className="border-l-2 border-green-200 pl-4 space-y-1">
              {components.map((comp) => (
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
  );
}
