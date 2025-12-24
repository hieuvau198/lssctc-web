import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, Upload, Radio } from 'antd';
import { useTranslation } from 'react-i18next';
import { Upload as UploadIcon, Link as LinkIcon, FileText, Video } from 'lucide-react';

const { TextArea } = Input;
const { Option } = Select;

const MaterialForm = ({ initialValues, onFinish, loading, onCancel }) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  
  // Determine initial source type based on URL pattern (heuristic for Firebase Storage)
  const isLikelyFile = (url) => url && url.includes('firebasestorage.googleapis.com');
  
  const [sourceType, setSourceType] = useState('Link');

  useEffect(() => {
    if (initialValues) {
      setSourceType(isLikelyFile(initialValues.url) ? 'File' : 'Link');
      form.setFieldsValue({
        ...initialValues,
        sourceType: isLikelyFile(initialValues.url) ? 'File' : 'Link',
        // Ensure learningMaterialType is set correctly (Video/Document)
        learningMaterialType: initialValues.learningMaterialType
      });
    } else {
        setSourceType('Link');
        form.resetFields();
    }
  }, [initialValues, form]);

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const handleFinish = (values) => {
    const payload = { ...values };
    
    // Extract file object if source is File
    if (values.sourceType === 'File' && values.upload && values.upload.length > 0) {
        payload.file = values.upload[0].originFileObj;
    }
    
    // Ensure we are passing the source type explicitly so the parent knows which API to call
    payload.sourceType = values.sourceType;
    
    onFinish(payload);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        learningMaterialType: 'Document', // Default API value
        sourceType: 'Link',               // Default UI value
      }}
      onFinish={handleFinish}
      requiredMark="optional"
    >
      <Form.Item
        name="name"
        label={<span className="font-bold uppercase text-xs">{t('common.name', 'Material Name')}</span>}
        rules={[{ required: true, message: t('common.required', 'This field is required') }]}
      >
        <Input 
            placeholder="e.g. Safety Guidelines 2024" 
            className="border-neutral-400 focus:border-black focus:ring-black" 
        />
      </Form.Item>

      <Form.Item
        name="description"
        label={<span className="font-bold uppercase text-xs">{t('common.description', 'Description')}</span>}
      >
        <TextArea 
            rows={3} 
            placeholder="Brief description of the material..." 
            className="border-neutral-400 focus:border-black focus:ring-black"
        />
      </Form.Item>

      <div className="grid grid-cols-2 gap-4">
        {/* API Field: Content Type (Video vs Document) */}
        <Form.Item
            name="learningMaterialType"
            label={<span className="font-bold uppercase text-xs">{t('common.contentType', 'Content Type')}</span>}
            rules={[{ required: true }]}
        >
            <Select className="border-neutral-400">
                <Option value="Document">
                    <div className="flex items-center gap-2">
                        <FileText size={14} />
                        <span>Document</span>
                    </div>
                </Option>
                <Option value="Video">
                    <div className="flex items-center gap-2">
                        <Video size={14} />
                        <span>Video</span>
                    </div>
                </Option>
            </Select>
        </Form.Item>

        {/* UI Field: Source Type (Link vs File) */}
        <Form.Item
            name="sourceType"
            label={<span className="font-bold uppercase text-xs">{t('common.source', 'Source')}</span>}
            rules={[{ required: true }]}
        >
            <Select 
                onChange={setSourceType}
                className="border-neutral-400"
            >
                <Option value="Link">
                    <div className="flex items-center gap-2">
                        <LinkIcon size={14} />
                        <span>External Link</span>
                    </div>
                </Option>
                <Option value="File">
                    <div className="flex items-center gap-2">
                        <UploadIcon size={14} />
                        <span>File Upload</span>
                    </div>
                </Option>
            </Select>
        </Form.Item>
      </div>

      {/* Conditional Inputs based on Source Type */}
      {sourceType === 'Link' ? (
        <Form.Item
          name="url"
          label={<span className="font-bold uppercase text-xs">{t('common.url', 'URL Address')}</span>}
          rules={[
            { required: true, message: t('common.required', 'This field is required') },
            { type: 'url', message: t('common.invalidUrl', 'Please enter a valid URL') }
          ]}
        >
          <Input 
            prefix={<LinkIcon size={14} className="text-neutral-400" />} 
            placeholder="https://example.com/resource" 
            className="border-neutral-400 focus:border-black focus:ring-black"
          />
        </Form.Item>
      ) : (
        <Form.Item
          name="upload"
          label={<span className="font-bold uppercase text-xs">{t('common.file', 'File')}</span>}
          valuePropName="fileList"
          getValueFromEvent={normFile}
          rules={[
            { 
                required: !initialValues?.url || (initialValues?.url && !isLikelyFile(initialValues.url)), 
                message: t('common.required', 'Please upload a file') 
            }
          ]}
        >
          <Upload 
            maxCount={1} 
            beforeUpload={() => false}
            listType="picture-card"
            className="w-full"
          >
             <div className="flex flex-col items-center justify-center text-neutral-500">
                <UploadIcon size={24} className="mb-2" />
                <div className="text-xs uppercase font-bold">Click to Upload</div>
             </div>
          </Upload>
        </Form.Item>
      )}

      {initialValues && sourceType === 'File' && initialValues.url && (
         <div className="mb-6 p-3 bg-neutral-100 border border-neutral-300 rounded text-sm">
            <span className="font-bold text-xs uppercase block text-neutral-500 mb-1">Current File:</span>
            <a href={initialValues.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">
                {initialValues.url ? initialValues.url.split('?')[0].split('/').pop() : 'View File'}
            </a>
         </div>
      )}

      <div className="flex items-center gap-3 pt-6 mt-6 border-t border-neutral-200">
        <Button 
            className="flex-1 h-10 font-bold uppercase border-2 border-black hover:text-black hover:border-black"
            onClick={onCancel}
        >
            {t('common.cancel', 'Cancel')}
        </Button>
        <Button 
            type="primary" 
            htmlType="submit" 
            loading={loading}
            className="flex-1 h-10 bg-yellow-400 text-black border-2 border-black font-bold uppercase hover:bg-yellow-500 hover:text-black hover:border-black shadow-none"
        >
            {initialValues ? t('common.update', 'Update') : t('common.create', 'Create')}
        </Button>
      </div>
    </Form>
  );
};

export default MaterialForm;