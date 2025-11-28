import { ArrowLeft, BookOpen, Video, Save, X, Link as LinkIcon, FileText } from 'lucide-react';
import { Button, Card, Form, Input, App } from 'antd';
import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { createMaterial } from '../../../../apis/Instructor/InstructorMaterialsApi';

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export default function AddMaterials({ onSuccess }) {
  const navigate = useNavigate();
  const { modal } = App.useApp();
  const query = useQuery();
  const sectionId = query.get('sectionId') || '';
  const classId = query.get('classId') || '';

  const [form] = Form.useForm();
  const [selectedType, setSelectedType] = useState(1); // 1: Document, 2: Video

  const onFinish = async (values) => {
    try {
      const payload = {
        name: values.title,
        description: values.description,
        materialUrl: values.url,
        learningMaterialType: selectedType === 1 ? 'Document' : 'Video',
        sectionId: sectionId || undefined,
        classId: classId || undefined,
      };

      await createMaterial(payload);

      modal.success({
        title: 'Success',
        content: 'Material created successfully',
        okText: 'Return to List',
        centered: true,
        icon: <div className="p-2 bg-green-50 rounded-full mr-2"><Save className="w-6 h-6 text-green-500" /></div>,
        onOk: () => {
          navigate('/instructor/materials', { replace: true });
        }
      });
    } catch (e) {
      console.error('Create material error', e);

      let errorMsg = e?.message || 'Failed to create material';
      if (e?.response?.data) {
        const data = e.response.data;
        if (data.errors && typeof data.errors === 'object') {
          const errorList = [];
          for (const [field, messages] of Object.entries(data.errors)) {
            if (Array.isArray(messages)) {
              errorList.push(`${field}: ${messages[0]}`);
            }
          }
          if (errorList.length > 0) {
            errorMsg = errorList.join('\n');
          }
        } else if (data.message) {
          errorMsg = data.message;
        } else if (data.title) {
          errorMsg = data.title;
        }
      }

      modal.error({
        title: 'Error Creating Material',
        content: errorMsg,
        okText: 'Close',
        centered: true,
      });
    }
  };

  const onCancel = () => navigate(-1);

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 md:p-8 font-sans animate-in fade-in duration-500">
      {/* Header */}
      <div className="w-full mb-8">
        <button
          onClick={onCancel}
          className="group flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors mb-6"
        >
          <div className="p-2 rounded-lg bg-white border border-gray-200 group-hover:border-blue-200 group-hover:bg-blue-50 transition-all">
            <ArrowLeft className="w-4 h-4" />
          </div>
          <span className="font-medium">Back to Materials</span>
        </button>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
              Create New Material
            </h1>
            <p className="text-gray-500 text-lg">
              Add a new learning resource for your students.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full">
        <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
          <div className="p-8 md:p-10">
            <Form
              form={form}
              layout="vertical"
              initialValues={{ typeId: 1 }}
              onFinish={onFinish}
              className="space-y-8"
            >
              {/* Material Type Selection */}
              <div className="space-y-4">
                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">
                  Material Type
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div
                    onClick={() => setSelectedType(1)}
                    className={`cursor-pointer relative p-6 rounded-2xl border-2 transition-all duration-300 ${selectedType === 1
                      ? 'border-blue-600 bg-blue-50/50'
                      : 'border-gray-100 bg-gray-50/50 hover:border-blue-200 hover:bg-blue-50/30'
                      }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl ${selectedType === 1 ? 'bg-blue-600 text-white' : 'bg-white text-gray-400'}`}>
                        <BookOpen className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className={`text-lg font-bold mb-1 ${selectedType === 1 ? 'text-blue-900' : 'text-gray-900'}`}>Document</h3>
                        <p className="text-sm text-gray-500">Add reading materials, PDFs, or articles.</p>
                      </div>
                      {selectedType === 1 && (
                        <div className="absolute top-4 right-4 w-3 h-3 bg-blue-600 rounded-full animate-pulse" />
                      )}
                    </div>
                  </div>

                  <div
                    onClick={() => setSelectedType(2)}
                    className={`cursor-pointer relative p-6 rounded-2xl border-2 transition-all duration-300 ${selectedType === 2
                      ? 'border-blue-600 bg-blue-50/50'
                      : 'border-gray-100 bg-gray-50/50 hover:border-blue-200 hover:bg-blue-50/30'
                      }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl ${selectedType === 2 ? 'bg-blue-600 text-white' : 'bg-white text-gray-400'}`}>
                        <Video className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className={`text-lg font-bold mb-1 ${selectedType === 2 ? 'text-blue-900' : 'text-gray-900'}`}>Video</h3>
                        <p className="text-sm text-gray-500">Add video lectures or tutorials.</p>
                      </div>
                      {selectedType === 2 && (
                        <div className="absolute top-4 right-4 w-3 h-3 bg-blue-600 rounded-full animate-pulse" />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-8">
                {/* Title Input */}
                <Form.Item
                  label={<span className="text-sm font-bold text-gray-700 uppercase tracking-wide">Title</span>}
                  name="title"
                  rules={[{ required: true, message: 'Please enter a title' }]}
                  className="mb-0"
                >
                  <Input
                    size="large"
                    prefix={<FileText className="w-4 h-4 text-gray-400 mr-2" />}
                    placeholder="e.g., Introduction to React Hooks"
                    className="h-12 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 hover:border-blue-300 transition-all font-medium"
                  />
                </Form.Item>

                {/* URL Input */}
                <Form.Item
                  label={<span className="text-sm font-bold text-gray-700 uppercase tracking-wide">Resource URL</span>}
                  name="url"
                  rules={[
                    { required: true, message: 'Please enter the URL' },
                    { type: 'url', message: 'Please enter a valid URL' }
                  ]}
                  className="mb-0"
                >
                  <Input
                    size="large"
                    prefix={<LinkIcon className="w-4 h-4 text-gray-400 mr-2" />}
                    placeholder="https://..."
                    className="h-12 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 hover:border-blue-300 transition-all font-medium"
                  />
                </Form.Item>

                {/* Description Input */}
                <Form.Item
                  label={<span className="text-sm font-bold text-gray-700 uppercase tracking-wide">Description</span>}
                  name="description"
                  className="mb-0"
                >
                  <Input.TextArea
                    rows={4}
                    placeholder="Briefly describe what this material covers..."
                    className="!rounded-xl !border-gray-200 focus:!border-blue-500 focus:!ring-2 focus:!ring-blue-200 hover:!border-blue-300 transition-all font-medium p-4"
                  />
                </Form.Item>
              </div>

              <input type="hidden" value={sectionId} readOnly />
              <input type="hidden" value={classId} readOnly />

              {/* Actions */}
              <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-100">
                <Button
                  size="large"
                  onClick={onCancel}
                  className="!h-12 !px-8 !rounded-xl !font-bold !text-gray-600 hover:!text-gray-800 hover:!bg-gray-100 !border-transparent"
                >
                  Cancel
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  icon={<Save className="w-4 h-4" />}
                  className="!h-12 !px-8 !rounded-xl !font-bold !bg-blue-600 hover:!bg-blue-700 !shadow-lg !shadow-blue-600/30 transition-all hover:!scale-105"
                >
                  Create Material
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
