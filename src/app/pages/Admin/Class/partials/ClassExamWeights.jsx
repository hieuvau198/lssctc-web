import React, { useEffect, useState, useMemo } from 'react';
import { Form, InputNumber, Button, Skeleton, App, Alert } from 'antd';
import { useTranslation } from 'react-i18next';
import { Scale, Save, RotateCcw } from 'lucide-react';
import { getClassExamConfig, updateClassWeights } from '../../../../apis/FinalExam/FinalExamApi';

/**
 * Helper to fix JS floating point math (e.g. 0.1 + 0.2 = 0.300000004)
 */
const fixFloat = (num) => parseFloat(num.toFixed(2));

const ClassExamWeights = ({ classId }) => {
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
    // Check if fields exist and are strictly greater than 0
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
      
      // Handle the complex GET response structure
      if (data && data.partialConfigs) {
        
        // Helper to find weight from the array and convert % to decimal (30.0 -> 0.3)
        // We assume GET returns percentages (30.0) based on your log, so we divide by 100 for the UI
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
        message.error("Failed to load exam weights.");
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
      message.error("The total weight must equal 1.0 (100%)");
      return;
    }

    setSubmitting(true);
    try {
      // FIX: Send the flat object directly (e.g. { theoryWeight: 0.1, ... })
      // Based on your finding, the backend accepts this flat structure and these decimal values.
      const payload = {
        theoryWeight: values.theoryWeight,
        simulationWeight: values.simulationWeight,
        practicalWeight: values.practicalWeight
      };

      await updateClassWeights(classId, payload);
      
      message.success("Exam weights updated successfully");
      setInitialData(values); // Update initial data to new saved values
      setIsDirty(false);
    } catch (error) {
      console.error("Update Error:", error);
      const errMsg = error?.response?.data?.message || "Failed to update weights";
      message.error(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle form changes to set Dirty state
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
      <div className="p-6 border-2 border-neutral-100 bg-white">
        <Skeleton active paragraph={{ rows: 3 }} />
      </div>
    );
  }

  return (
    <div id="class-weights" className="p-6 border-2 border-neutral-100 bg-white shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-yellow-400 flex items-center justify-center border-2 border-transparent shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <Scale className="w-5 h-5 text-black" />
        </div>
        <span className="text-xl font-black uppercase tracking-tight text-neutral-900 m-0">
          {t('admin.classes.weights.title', 'Exam Weights')}
        </span>
      </div>

      <div className="flex flex-col xl:flex-row gap-8">
        {/* Left: Form */}
        <div className="flex-1">
          <Alert
            message="Configuration Rules"
            description="Set the weight for each exam component. Values must be decimals between 0 and 1. The total must sum to 1.0."
            type="info"
            showIcon
            className="mb-6 border-blue-200 bg-blue-50 text-blue-800"
          />

          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            onValuesChange={onValuesChange}
            initialValues={{ theoryWeight: 0, simulationWeight: 0, practicalWeight: 0 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['Theory', 'Simulation', 'Practical'].map((type) => {
                const fieldName = `${type.toLowerCase()}Weight`;
                return (
                  <Form.Item
                    key={fieldName}
                    label={<span className="font-bold uppercase text-xs">{type} Weight</span>}
                    name={fieldName}
                    rules={[
                      { required: true, message: 'Required' },
                      { type: 'number', min: 0.0001, max: 0.9999, message: 'Must be > 0 and < 1' }
                    ]}
                  >
                    <InputNumber
                      step={0.1}
                      min={0}
                      max={1}
                      className="w-full font-mono font-bold"
                      style={{ borderRadius: 0 }}
                      placeholder="e.g. 0.3"
                    />
                  </Form.Item>
                );
              })}
            </div>

            {/* Total & Actions */}
            <div className="flex flex-wrap items-center justify-between mt-6 pt-6 border-t border-neutral-100 gap-4">
              
              {/* Total Display */}
              <div className={`flex items-center gap-3 px-4 py-2 border-2 ${isTotalValid ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                <span className="font-bold uppercase text-xs text-neutral-500">Total Weight:</span>
                <span className={`font-mono text-xl font-black ${isTotalValid ? 'text-green-700' : 'text-red-600'}`}>
                  {total} / 1
                </span>
                {!isTotalValid && <span className="text-xs text-red-500 font-bold uppercase">(Invalid)</span>}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                 <Button
                  onClick={handleReset}
                  disabled={!isDirty || loading}
                  icon={<RotateCcw size={14} />}
                  className="rounded-none border-neutral-300 text-neutral-500 hover:text-black hover:border-black"
                >
                  Reset
                </Button>
                
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={submitting}
                  disabled={!isDirty || !isTotalValid || !isPartialValid} 
                  icon={<Save size={16} />}
                  className="bg-black hover:bg-neutral-800 border-none rounded-none h-10 px-6 font-bold uppercase tracking-wider flex items-center gap-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:shadow-none transition-all disabled:opacity-50 disabled:shadow-none disabled:translate-y-0"
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </Form>
        </div>

        {/* Right: Visual Preview */}
        <div className="w-full xl:w-72 shrink-0 bg-neutral-50 border-2 border-neutral-200 p-5">
          <h4 className="font-bold uppercase text-xs text-neutral-500 mb-4 border-b border-neutral-200 pb-2">Weight Distribution</h4>
          <div className="space-y-5">
            {[
              { label: 'Theory', color: 'bg-blue-500', name: 'theoryWeight' },
              { label: 'Simulation', color: 'bg-yellow-400', name: 'simulationWeight' },
              { label: 'Practical', color: 'bg-green-500', name: 'practicalWeight' }
            ].map((item) => {
              const val = form.getFieldValue(item.name) || 0;
              const percent = Math.round(val * 100);
              return (
                <div key={item.name}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="font-bold text-neutral-700 uppercase tracking-wide">{item.label}</span>
                    <span className="font-mono font-bold">{percent}%</span>
                  </div>
                  <div className="h-4 bg-white w-full border border-neutral-300 p-0.5">
                    <div
                      className={`h-full ${item.color} transition-all duration-300`}
                      style={{ width: `${Math.min(percent, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="mt-6 pt-4 border-t border-neutral-200 text-center">
            <span className="text-[10px] text-neutral-400 uppercase font-bold tracking-widest">
              Total Allocation
            </span>
            <div className="mt-1 font-mono text-2xl font-black text-neutral-800">
              {Math.round(total * 100)}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassExamWeights;