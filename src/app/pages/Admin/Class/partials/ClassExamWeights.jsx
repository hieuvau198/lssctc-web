import React, { useEffect, useState } from 'react';
import { Form, InputNumber, Button, Skeleton, App } from 'antd';
import { useTranslation } from 'react-i18next';
import { Scale, Save } from 'lucide-react';
import { getClassExamConfig, updateClassWeights } from '../../../../apis/FinalExam/FinalExamApi';

/**
 * Industrial Section Header (Reused for consistency)
 */
const SectionHeader = ({ icon: Icon, title }) => (
  <div className="flex items-center gap-3 mb-6">
    <div className="w-10 h-10 bg-yellow-400 flex items-center justify-center border-2 border-transparent shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <Icon className="w-5 h-5 text-black" />
    </div>
    <span className="text-xl font-black uppercase tracking-tight text-neutral-900 m-0">
      {title}
    </span>
  </div>
);

const ClassExamWeights = ({ classId }) => {
  const { t } = useTranslation();
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (classId) {
      loadConfig();
    }
  }, [classId]);

  const loadConfig = async () => {
    setLoading(true);
    try {
      const data = await getClassExamConfig(classId);
      if (data) {
        form.setFieldsValue({
          theoryWeight: data.theoryWeight,
          simulationWeight: data.simulationWeight,
          practicalWeight: data.practicalWeight
        });
        calculateTotal({
          theoryWeight: data.theoryWeight,
          simulationWeight: data.simulationWeight,
          practicalWeight: data.practicalWeight
        });
      }
    } catch (error) {
      console.error("Failed to load class exam config", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = (values) => {
    const t = (Number(values.theoryWeight) || 0) + (Number(values.simulationWeight) || 0) + (Number(values.practicalWeight) || 0);
    setTotal(parseFloat(t.toFixed(2)));
  };

  const handleValuesChange = (_, allValues) => {
    calculateTotal(allValues);
  };

  const onFinish = async (values) => {
    setSaving(true);
    try {
      await updateClassWeights(classId, values);
      message.success("Exam weights updated successfully");
    } catch (error) {
        const errMsg = error?.response?.data?.message || error?.message || "Failed to update weights";
        message.error(errMsg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="p-6 border-2 border-neutral-100 bg-white">
        <Skeleton active paragraph={{ rows: 3 }} />
    </div>
  );

  return (
    <div id="class-weights" className="p-6 border-2 border-neutral-100 bg-white shadow-sm hover:shadow-md transition-shadow">
      <SectionHeader icon={Scale} title={t('admin.classes.weights.title', 'Exam Weights')} />
      
      <div className="flex flex-col xl:flex-row gap-8">
        <div className="flex-1">
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 text-sm text-blue-800">
                <span className="font-bold">Configuration Note:</span> Define the weightage for each exam component. 
                Values must be strictly between 0 and 1. The total should ideally sum to 1.0 (100%).
            </div>

            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                onValuesChange={handleValuesChange}
            >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Form.Item
                        label={<span className="font-bold uppercase text-xs">Theory Weight</span>}
                        name="theoryWeight"
                        rules={[
                            { required: true, message: 'Required' },
                            { type: 'number', min: 0.000001, max: 0.999999, message: 'Must be > 0 and < 1' }
                        ]}
                    >
                        <InputNumber 
                            step={0.1} 
                            min={0.01} 
                            max={0.99} 
                            className="w-full font-mono font-bold" 
                            style={{ borderRadius: 0 }}
                            placeholder="e.g 0.3"
                        />
                    </Form.Item>

                    <Form.Item
                        label={<span className="font-bold uppercase text-xs">Simulation Weight</span>}
                        name="simulationWeight"
                        rules={[
                            { required: true, message: 'Required' },
                            { type: 'number', min: 0.000001, max: 0.999999, message: 'Must be > 0 and < 1' }
                        ]}
                    >
                        <InputNumber 
                            step={0.1} 
                            min={0.01} 
                            max={0.99} 
                            className="w-full font-mono font-bold"
                            style={{ borderRadius: 0 }} 
                            placeholder="e.g 0.4"
                        />
                    </Form.Item>

                    <Form.Item
                        label={<span className="font-bold uppercase text-xs">Practical Weight</span>}
                        name="practicalWeight"
                        rules={[
                            { required: true, message: 'Required' },
                            { type: 'number', min: 0.000001, max: 0.999999, message: 'Must be > 0 and < 1' }
                        ]}
                    >
                        <InputNumber 
                            step={0.1} 
                            min={0.01} 
                            max={0.99} 
                            className="w-full font-mono font-bold" 
                            style={{ borderRadius: 0 }}
                            placeholder="e.g 0.3"
                        />
                    </Form.Item>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-neutral-100">
                    <div className="flex items-center gap-2 bg-neutral-100 px-3 py-1">
                        <span className="font-bold uppercase text-xs text-neutral-500">Total:</span>
                        <span className={`font-mono text-lg font-black ${Math.abs(total - 1) < 0.001 ? 'text-green-600' : 'text-orange-500'}`}>
                            {total}
                        </span>
                    </div>

                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={saving}
                        icon={<Save size={16} />}
                        className="bg-black hover:bg-neutral-800 border-none rounded-none h-10 px-6 font-bold uppercase tracking-wider flex items-center gap-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:shadow-none transition-all"
                    >
                        Update Configuration
                    </Button>
                </div>
            </Form>
        </div>
        
        {/* Visual Bar Side */}
        <div className="w-full xl:w-64 shrink-0 bg-neutral-50 border-2 border-neutral-200 p-4">
            <h4 className="font-bold uppercase text-xs text-neutral-500 mb-3 border-b border-neutral-200 pb-2">Distribution Preview</h4>
            <div className="space-y-4">
                {[
                    { label: 'Theory', color: 'bg-blue-500', name: 'theoryWeight' },
                    { label: 'Simulation', color: 'bg-yellow-500', name: 'simulationWeight' },
                    { label: 'Practical', color: 'bg-green-500', name: 'practicalWeight' }
                ].map((item) => {
                    const val = form.getFieldValue(item.name) || 0;
                    return (
                        <div key={item.name}>
                            <div className="flex justify-between text-xs mb-1">
                                <span className="font-bold text-neutral-600 uppercase">{item.label}</span>
                                <span className="font-mono">{Math.round(val * 100)}%</span>
                            </div>
                            <div className="h-3 bg-neutral-200 w-full border border-neutral-300">
                                <div 
                                    className={`h-full ${item.color}`} 
                                    style={{ width: `${Math.min(val * 100, 100)}%` }} 
                                />
                            </div>
                        </div>
                    );
                })}
                <div className="pt-2 text-[10px] text-neutral-400 italic text-center">
                    Visual representation of score distribution
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ClassExamWeights;