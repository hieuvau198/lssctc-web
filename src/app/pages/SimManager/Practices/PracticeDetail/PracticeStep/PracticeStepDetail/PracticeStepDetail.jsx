// src\app\pages\SimManager\Practices\PracticeDetail\PracticeStep\PracticeStepDetail\PracticeStepDetail.jsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  getPracticeStepComponents,
  createPracticeStepComponent,
  deletePracticeStepComponent,
} from '../../../../../../apis/SimulationManager/SimulationManagerPracticeApi';
import { getComponents } from '../../../../../../apis/SimulationManager/SimulationManagerComponentApi';

export default function PracticeStepDetail({
  step,
  onEdit,
  onDelete,
  initiallyOpen = false,
}) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(initiallyOpen);
  const [componentLoading, setComponentLoading] = useState(false);
  const [components, setComponents] = useState(null);

  // For Add Component Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [availableComponents, setAvailableComponents] = useState([]);
  const [selectedComponentId, setSelectedComponentId] = useState('');

  const fetchComponents = () => {
    setComponentLoading(true);
    getPracticeStepComponents(step.id)
      .then((data) => setComponents(data))
      .finally(() => setComponentLoading(false));
  };

  const handleToggle = () => {
    if (!open && !components) {
      fetchComponents();
    }
    setOpen((prev) => !prev);
  };

  const handleAddComponent = async () => {
    setShowAddModal(true);
    // Fetch available components (first page, 50 items, adjust as needed)
    const data = await getComponents(1, 50);
    setAvailableComponents(data.items || []);
    setSelectedComponentId('');
  };

  const handleAddConfirm = async () => {
    if (!selectedComponentId) return;
    // Choose order: append to end, or ask user for order
    const order =
      (components?.length ? Math.max(...components.map((c) => c.componentOrder || 0)) + 1 : 1);
    await createPracticeStepComponent({
      practiceStepId: step.id,
      simulationComponentId: Number(selectedComponentId),
      componentOrder: order,
    });
    setShowAddModal(false);
    fetchComponents();
  };

  const handleRemoveComponent = async (compId) => {
    if (window.confirm(t('simManager.practiceSteps.removeComponentConfirm'))) {
      await deletePracticeStepComponent(compId);
      fetchComponents();
    }
  };

  return (
    <li className="bg-slate-50 border p-2 mb-2">
      {/* Step header (dropdown toggle) */}
      <div className="flex items-center cursor-pointer" onClick={handleToggle}>
        <span className="mr-2">{open ? '▼' : '▶'}</span>
        <span className="font-semibold">{step.stepName}</span>
        <span className="text-xs text-slate-400 ml-4">{t('simManager.practiceSteps.order')}: {step.stepOrder}</span>
      </div>
      <div className="ml-6 mt-1">
        {step.stepDescription && (
          <div className="text-xs text-slate-700 mb-1">{step.stepDescription}</div>
        )}
        {step.expectedResult && (
          <div className="text-xs text-slate-500">{t('simManager.practiceSteps.expectedResult')}: {step.expectedResult}</div>
        )}
        <div className="mt-1 flex gap-2">
          <button
            className="text-blue-600 hover:underline"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(step);
            }}
          >
            {t('simManager.practiceSteps.edit')}
          </button>
          <button
            className="text-red-500 hover:underline"
            onClick={(e) => {
              e.stopPropagation();
              if (window.confirm(t('simManager.practiceSteps.deleteStepConfirm'))) onDelete(step.id);
            }}
          >
            {t('simManager.practiceSteps.delete')}
          </button>
          <button
            className="text-green-600 hover:underline"
            onClick={(e) => {
              e.stopPropagation();
              handleAddComponent();
            }}
          >
            {t('simManager.practiceSteps.addComponent')}
          </button>
        </div>
      </div>

      {/* Dropdown for components */}
      {open && (
        <div className="mt-3 ml-8">
          {componentLoading && !components ? (
            <div>{t('simManager.practiceSteps.loadingComponents')}</div>
          ) : components && components.length > 0 ? (
            <ul className="border-l-2 border-green-200 pl-4 space-y-1">
              {components.map((comp) => (
                <li key={comp.id} className="text-sm flex items-center gap-2">
                  {comp.imageUrl && (
                    <img
                      src={comp.imageUrl}
                      alt=""
                      className="w-8 h-8 object-cover rounded"
                    />
                  )}
                  <span className="font-medium">
                    {comp.simulationComponentName}
                  </span>
                  {comp.description && (
                    <span className="text-slate-500 ml-2">{comp.description}</span>
                  )}
                  <span className="text-xs text-slate-400 ml-2">
                    {t('simManager.practiceSteps.order')}: {comp.componentOrder}
                  </span>
                  <button
                    className="ml-2 text-red-400 hover:underline"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveComponent(comp.id);
                    }}
                  >
                    {t('simManager.practiceSteps.remove')}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-slate-400">
              {t('simManager.practiceSteps.noComponents')}
            </div>
          )}
        </div>
      )}

      {/* Modal/Select for add component */}
      {showAddModal && (
        <div className="fixed top-0 left-0 w-full h-full z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-5 rounded shadow-lg min-w-[320px]">
            <h3 className="text-lg mb-2 font-semibold">{t('simManager.practiceSteps.assignComponent')}</h3>
            <select
              className="border p-2 w-full"
              value={selectedComponentId}
              onChange={(e) => setSelectedComponentId(e.target.value)}
            >
              <option value="">{t('simManager.practiceSteps.selectComponent')}</option>
              {availableComponents.map((comp) => (
                <option key={comp.id} value={comp.id}>
                  {comp.name}
                </option>
              ))}
            </select>
            <div className="mt-4 flex justify-end gap-2">
              <button
                className="bg-slate-200 px-4 py-1 rounded"
                onClick={() => setShowAddModal(false)}
              >
                {t('simManager.practiceSteps.cancel')}
              </button>
              <button
                className="bg-blue-600 text-white px-4 py-1 rounded"
                onClick={handleAddConfirm}
                disabled={!selectedComponentId}
              >
                {t('simManager.practiceSteps.add')}
              </button>
            </div>
          </div>
        </div>
      )}
    </li>
  );
}

