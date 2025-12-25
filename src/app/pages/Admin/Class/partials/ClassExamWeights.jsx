import React, { useEffect, useState, useMemo } from 'react';
import { Form, InputNumber, Button, Skeleton, App, Alert } from 'antd';
import { useTranslation } from 'react-i18next';
import { Scale, Save, RotateCcw, Info } from 'lucide-react';
import { getClassExamConfig, updateClassWeights } from '../../../../apis/FinalExam/FinalExamApi';

/**
 * Helper to fix JS floating point math (e.g. 0.1 + 0.2 = 0.300000004)
 */
const fixFloat = (num) => parseFloat(num.toFixed(2));

const ClassExamWeights = ({ classId, readOnly }) => {
  const { t } = useTranslation();
  const { message } = App.useApp();
  const [form] = Form.useForm();

  // State
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [initialData, setInitialData] = useState(null);
  const [isDirty, setIsDirty] = useState(false);

  // Watch form values for real-time calculations
  const values = Form.useWatch([], form);

  // Calculate Total dynamically
  const total = useMemo(() => {
    if (!values) return 0;
    const { theoryWeight, simulationWeight, practicalWeight } = values;
    const sum = (theoryWeight || 0) + (simulationWeight || 0) + (practicalWeight || 0);
    return fixFloat(sum);
  }, [values]);

  // Validation status for the Total
  const isTotalValid = Math.abs(total - 1.0) < 0.001;

  // Validation status for individual fields (Must be > 0)
  const isPartialValid = useMemo(() => {
    if (!values) return false;
    const { theoryWeight, simulationWeight, practicalWeight } = values;
    return (theoryWeight > 0) && (simulationWeight > 0) && (practicalWeight > 0);
  }, [values]);

  // 1. Fetch Data on Mount
  useEffect(() => {
    if (classId) {
      fetchConfig();
    }
  }, [classId]);

  const fetchConfig = async () => {
    setLoading(true);
    try {
      const data = await getClassExamConfig(classId);
      if (data && data.partialConfigs) {
        const getWeight = (type) => {
          const config = data.partialConfigs.find(item => item.type === type);
          return config ? fixFloat(config.examWeight / 100) : 0;
        };

        const formattedData = {
          theoryWeight: getWeight('Theory'),
          simulationWeight: getWeight('Simulation'),
          practicalWeight: getWeight('Practical')
        };

        setInitialData(formattedData);
        form.setFieldsValue(formattedData);
        setIsDirty(false);
      }
    } catch (error) {
      if (error?.response?.status !== 404) {
        message.error(t('admin.classes.weights.loadFailed'));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (initialData) {
      form.setFieldsValue(initialData);
      setIsDirty(false);
    } else {
      form.resetFields();
    }
  };

  const onFinish = async (values) => {
    if (!isTotalValid) {
      message.error(t('admin.classes.weights.totalMustEqual'));
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        theoryWeight: values.theoryWeight,
        simulationWeight: values.simulationWeight,
        practicalWeight: values.practicalWeight
      };

      await updateClassWeights(classId, payload);

      message.success(t('admin.classes.weights.updateSuccess'));
      setInitialData(values);
      setIsDirty(false);
    } catch (error) {
      console.error("Update Error:", error);
      const errMsg = error?.response?.data?.message || t('admin.classes.weights.updateFailed');
      message.error(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const onValuesChange = (changedValues, allValues) => {
    const hasChanged = initialData && (
      allValues.theoryWeight !== initialData.theoryWeight ||
      allValues.simulationWeight !== initialData.simulationWeight ||
      allValues.practicalWeight !== initialData.practicalWeight
    );
    setIsDirty(!!hasChanged);
  };

  if (loading) {
    return (
      <div className="p-6 border-2 border-slate-200 bg-white">
        <Skeleton active paragraph={{ rows: 3 }} />
      </div>
    );
  }

  return (
    <div id="class-weights" className="p-6 border-2 border-slate-200 bg-white">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 border-b-2 border-slate-100 pb-4">
        <div className="w-8 h-8 bg-black flex items-center justify-center text-yellow-400">
          <Scale size={18} strokeWidth={2.5} />
        </div>
        <span className="text-xl font-bold uppercase tracking-wide text-slate-900">
          {t('admin.classes.weights.title', 'Exam Weights')}
        </span>
      </div>

      <div className="flex flex-col xl:flex-row gap-8">
        {/* Left: Form */}
        <div className="flex-1">
          <div className="flex items-start gap-3 p-4 bg-slate-50 border border-slate-200 mb-6">
            <Info className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-slate-600">
              <p className="font-bold text-slate-800 uppercase text-xs mb-1">{t('admin.classes.weights.configRules')}</p>
              {t('admin.classes.weights.configDesc')}
            </div>
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            onValuesChange={onValuesChange}
            initialValues={{ theoryWeight: 0, simulationWeight: 0, practicalWeight: 0 }}
            disabled={readOnly}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {['Theory', 'Simulation', 'Practical'].map((type) => {
                const fieldName = `${type.toLowerCase()}Weight`;
                return (
                  <Form.Item
                    key={fieldName}
                    label={<span className="font-bold uppercase text-xs text-slate-500 tracking-wider">{t(`admin.classes.weights.${type.toLowerCase()}`)} {t('admin.classes.weights.weight')}</span>}
                    name={fieldName}
                    className="mb-0"
                    rules={[
                      { required: true, message: t('common.required', 'Required') },
                      { type: 'number', min: 0.0001, max: 0.9999, message: '> 0' }
                    ]}
                  >
                    <InputNumber
                      step={0.1}
                      min={0}
                      max={1}
                      className="w-full font-mono font-bold text-lg !bg-white !border-slate-300 focus:!border-black !rounded-none focus:!shadow-none h-12 flex items-center"
                      placeholder="0.0"
                      disabled={readOnly}
                    />
                  </Form.Item>
                );
              })}
            </div>

            {/* Total & Actions */}
            <div className="flex flex-wrap items-center justify-between mt-8 pt-6 border-t-2 border-slate-100 gap-4">

              {/* Total Display */}
              <div className="flex items-center gap-4">
                <span className="font-bold uppercase text-xs text-slate-400 tracking-wider">
                  {t('admin.classes.weights.totalWeight')}:
                </span>
                <div className={`flex items-center gap-2 px-3 py-1 border-2 ${isTotalValid ? 'border-slate-300 bg-slate-100 text-slate-400' : 'border-slate-300 bg-slate-100 text-slate-400'}`}>
                  <span className="font-mono text-xl font-bold">
                    {total.toFixed(2)}
                  </span>
                  <span className="text-sm font-medium opacity-60">/ 1.00</span>
                </div>
                {!isTotalValid && (
                  <span className="text-xs font-bold uppercase text-slate-500 bg-slate-200 px-2 py-1">
                    {t('admin.classes.weights.invalid')}
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              {!readOnly && (
                <div className="flex items-center gap-3">
                  <Button
                    onClick={handleReset}
                    disabled={!isDirty || loading}
                    icon={<RotateCcw size={14} />}
                    className="h-10 px-4 rounded-none border-2 border-slate-200 text-slate-500 font-bold uppercase hover:!border-black hover:!text-black transition-all"
                  >
                    {t('admin.classes.weights.reset')}
                  </Button>

                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={submitting}
                    disabled={!isDirty || !isTotalValid || !isPartialValid}
                    icon={<Save size={16} />}
                    className="h-10 px-6 rounded-none bg-yellow-400 text-black border-2 border-yellow-500 font-bold uppercase hover:!bg-yellow-500 hover:!text-black shadow-sm disabled:opacity-50 disabled:bg-slate-200 disabled:border-slate-200 disabled:text-slate-400"
                  >
                    {t('admin.classes.weights.saveChanges')}
                  </Button>
                </div>
              )}
            </div>
          </Form>
        </div>

        {/* Right: Visual Preview - Industrial Monochrome */}
        <div className="w-full xl:w-72 shrink-0 bg-slate-50 border-2 border-slate-200 p-6">
          <h4 className="font-bold uppercase text-xs text-slate-400 tracking-wider mb-6 pb-2 border-b border-slate-200">
            {t('admin.classes.weights.distribution')}
          </h4>
          <div className="space-y-6">
            {[
              { label: 'Theory', color: 'bg-black', name: 'theoryWeight' },
              { label: 'Simulation', color: 'bg-slate-500', name: 'simulationWeight' },
              { label: 'Practical', color: 'bg-yellow-400', name: 'practicalWeight' } // Yellow as the only accent
            ].map((item) => {
              const val = form.getFieldValue(item.name) || 0;
              const percent = Math.round(val * 100);
              return (
                <div key={item.name}>
                  <div className="flex justify-between text-xs mb-2">
                    <span className="font-bold text-slate-800 uppercase tracking-wide">{t(`admin.classes.weights.${item.label.toLowerCase()}`)}</span>
                    <span className="font-mono font-bold text-slate-600">{percent}%</span>
                  </div>
                  <div className="h-3 bg-white w-full border border-slate-300 p-0.5">
                    <div
                      className={`h-full ${item.color} transition-all duration-300`}
                      style={{ width: `${Math.min(percent, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>


        </div>
      </div>
    </div>
  );
};

export default ClassExamWeights;