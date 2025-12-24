import React, { useState } from 'react';
import { Form, Input, Button, Select, Upload } from 'antd';
import { useTranslation } from 'react-i18next';
import { Upload as UploadIcon, Link as LinkIcon, FileText } from 'lucide-react';

const { TextArea } = Input;
const { Option } = Select;

const MaterialForm = ({ initialValues, onFinish, loading, onCancel }) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [type, setType] = useState(initialValues?.learningMaterialType || 'Link');

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const handleFinish = (values) => {
    // Transform upload object to raw file if type is File
    const payload = { ...values };
    if (values.learningMaterialType === 'File' && values.upload && values.upload.length > 0) {
        payload.file = values.upload[0].originFileObj;
    }
    onFinish(payload);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        learningMaterialType: 'Link',
        ...initialValues,
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
        <Form.Item
            name="learningMaterialType"
            label={<span className="font-bold uppercase text-xs">{t('common.type', 'Type')}</span>}
            rules={[{ required: true }]}
        >
            <Select 
                onChange={setType}
                className="border-neutral-400"
            >
                <Option value="Link">
                    <div className="flex items-center gap-2">
                        <LinkIcon size={14} />
                        <span>Link (URL)</span>
                    </div>
                </Option>
                <Option value="File">
                    <div className="flex items-center gap-2">
                        <FileText size={14} />
                        <span>File Upload</span>
                    </div>
                </Option>
            </Select>
        </Form.Item>
      </div>

      {type === 'Link' ? (
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
                required: !initialValues?.url, // Required if creating new or if no existing URL (which implies no existing file in this simplistic logic)
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

      {initialValues && type === 'File' && initialValues.url && (
         <div className="mb-6 p-3 bg-neutral-100 border border-neutral-300 rounded text-sm">
            <span className="font-bold text-xs uppercase block text-neutral-500 mb-1">Current File:</span>
            <a href={initialValues.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">
                {initialValues.url}
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