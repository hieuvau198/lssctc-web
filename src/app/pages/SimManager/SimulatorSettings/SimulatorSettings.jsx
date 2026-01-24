import React, { useEffect, useState } from 'react';
import { 
  Form, 
  Input, 
  Button, 
  Switch, 
  App, 
  Spin, 
  Image,
  Typography
} from 'antd';
import { Save, RotateCcw, Settings as SettingsIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getSimSettings, updateSimSettings } from '../../../apis/SimulationManager/SimSettingsApi';

const { TextArea } = Input;
const { Text } = Typography;

export default function SimulatorSettings() {
  const { t } = useTranslation();
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await getSimSettings();
      if (response && response.success) {
        const data = response.data;
        form.setFieldsValue({
          ...data,
          isActive: data.isActive ?? false
        });
        setImageUrl(data.imageUrl);
      } else {
        message.error('Failed to load settings');
      }
    } catch (error) {
      console.error(error);
      message.error('An error occurred while loading settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onFinish = async (values) => {
    setSubmitting(true);
    try {
      const payload = {
        ...values,
        id: 0 
      };
      
      const response = await updateSimSettings(payload);
      if (response && response.success) {
        message.success('Settings updated successfully');
        setImageUrl(values.imageUrl);
      } else {
        message.error(response?.message || 'Update failed');
      }
    } catch (error) {
      console.error(error);
      message.error('An error occurred while updating settings');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    form.resetFields();
    fetchSettings();
  };

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col overflow-y-auto">
      {/* Header - Industrial Theme */}
      <div className="flex-none bg-neutral-700 border-2 border-black p-5 mb-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] mx-4 mt-4">
        <div className="h-1 bg-yellow-400 -mx-5 -mt-5 mb-4" />
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-yellow-400 border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)]">
            <SettingsIcon className="w-6 h-6 text-black" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white uppercase tracking-tight m-0 leading-none">
              Simulator Settings
            </h1>
            <p className="text-yellow-400 text-sm mt-1 font-medium">
              Global configuration for the simulation environment
            </p>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 px-4 pb-6">
        <div className="bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] relative max-w-5xl mx-auto">
          {/* Decorative top bar for the card */}
          <div className="h-1 bg-yellow-400 absolute top-0 left-0 right-0" />
          
          <Spin spinning={loading}>
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              initialValues={{ isActive: true }}
              className="mt-2"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Left Column: Basic Info */}
                <div className="space-y-4">
                  <div className="bg-neutral-100 p-4 border border-neutral-200 rounded-sm">
                    <h3 className="font-bold text-lg border-b border-neutral-300 pb-2 mb-4 uppercase">General Information</h3>
                    
                    <Form.Item
                      label={<span className="font-semibold text-neutral-700">Simulator Name</span>}
                      name="name"
                      rules={[{ required: true, message: 'Please enter the simulator name' }]}
                    >
                      <Input placeholder="e.g. Crane Simulator 2026" size="large" className="border-neutral-400" />
                    </Form.Item>

                    <Form.Item
                      label={<span className="font-semibold text-neutral-700">Setting Code</span>}
                      name="settingCode"
                    >
                      <Input placeholder="Unique code for this configuration" className="border-neutral-400" />
                    </Form.Item>

                    <Form.Item
                      label={<span className="font-semibold text-neutral-700">Description</span>}
                      name="description"
                    >
                      <TextArea 
                        rows={4} 
                        placeholder="Describe the simulation environment..." 
                        className="border-neutral-400"
                      />
                    </Form.Item>

                    <Form.Item
                      label={<span className="font-semibold text-neutral-700">System Status</span>}
                      name="isActive"
                      valuePropName="checked"
                    >
                      <div className="flex items-center gap-3 bg-white p-3 border border-neutral-300 inline-flex">
                        <Switch />
                        <span className="text-sm text-neutral-500">
                          Toggle to enable/disable this configuration globally
                        </span>
                      </div>
                    </Form.Item>
                  </div>
                </div>

                {/* Right Column: URLs and Media */}
                <div className="space-y-4">
                  <div className="bg-neutral-100 p-4 border border-neutral-200 rounded-sm h-full">
                    <h3 className="font-bold text-lg border-b border-neutral-300 pb-2 mb-4 uppercase">Resources & Media</h3>

                    <Form.Item
                      label={<span className="font-semibold text-neutral-700">Source URL (WebGL/Build)</span>}
                      name="sourceUrl"
                      extra={<span className="text-xs text-neutral-500">Direct link to the WebGL build or simulation entry point.</span>}
                    >
                      <Input 
                        prefix={<span className="text-gray-400 mr-1">🔗</span>} 
                        placeholder="https://..." 
                        className="border-neutral-400"
                      />
                    </Form.Item>

                    <Form.Item
                      label={<span className="font-semibold text-neutral-700">Preview Image URL</span>}
                      name="imageUrl"
                    >
                      <Input 
                        placeholder="https://..." 
                        onChange={(e) => setImageUrl(e.target.value)} 
                        className="border-neutral-400"
                      />
                    </Form.Item>

                    <div className="mt-4 p-2 border-2 border-dashed border-neutral-300 bg-white text-center min-h-[200px] flex items-center justify-center relative group overflow-hidden">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt="Preview"
                          className="max-h-64 object-contain mx-auto"
                          fallback="https://placehold.co/600x400?text=No+Image"
                        />
                      ) : (
                        <div className="text-neutral-400 flex flex-col items-center">
                          <span className="text-4xl mb-2">🖼️</span>
                          <span>No image preview</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-end gap-4 mt-8 pt-6 border-t-2 border-neutral-200">
                <Button 
                  icon={<RotateCcw className="w-4 h-4" />} 
                  onClick={handleReset}
                  size="large"
                  className="font-semibold border-2 border-neutral-300 text-neutral-600 hover:border-neutral-800 hover:text-neutral-800"
                >
                  Reset Form
                </Button>
                
                <button
                  type="submit"
                  disabled={submitting}
                  onClick={form.submit}
                  className="group inline-flex items-center gap-2 px-6 py-3 bg-yellow-400 text-black font-bold uppercase tracking-wider text-sm border-2 border-black hover:bg-yellow-500 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <Spin size="small" className="mr-2" />
                  ) : (
                    <Save className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  )}
                  Save Changes
                </button>
              </div>
            </Form>
          </Spin>
        </div>
      </div>
    </div>
  );
}