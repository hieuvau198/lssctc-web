import React, { useEffect, useState } from "react";
import {
  getPracticeStepsByPracticeId,
  createPracticeStep,
  updatePracticeStep,
  deletePracticeStep,
} from '../../../../../apis/SimulationManager/SimulationManagerPracticeApi';
import CreateUpdateStep from "./CreateUpdateStep";
import PracticeStep from "./PracticeStep";

export default function PracticeSteps({ practiceId }) {
  const [steps, setSteps] = useState([]);
  const [stepsLoading, setStepsLoading] = useState(true);
  const [stepsError, setStepsError] = useState(null);

  // Step editing/creating state
  const [showStepForm, setShowStepForm] = useState(false);
  const [editingStep, setEditingStep] = useState(null);

  // Load steps
  const loadSteps = () => {
    setStepsLoading(true);
    getPracticeStepsByPracticeId(practiceId)
      .then(setSteps)
      .catch(() => setStepsError("Could not fetch practice steps"))
      .finally(() => setStepsLoading(false));
  };

  useEffect(() => {
    if (practiceId) loadSteps();
    // eslint-disable-next-line
  }, [practiceId]);

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

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-base font-semibold">Practice Steps</h3>
        <button
          className="bg-green-600 text-white px-3 py-1 text-sm"
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
          practiceId={practiceId}
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
            <PracticeStep
              key={step.id}
              step={step}
              onEdit={(step) => {
                setEditingStep(step);
                setShowStepForm(true);
              }}
              onDelete={handleStepDelete}
            />
          ))}
        </ol>
      )}
    </div>
  );
}
