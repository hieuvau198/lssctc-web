// src/app/pages/Admin/Course/partials/Sections/ImportSectionsModal.jsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Upload, Button, message, Alert } from 'antd';
import { UploadOutlined, FileExcelOutlined } from '@ant-design/icons';
import { importSections } from '../../../../../apis/ProgramManager/SectionApi';

const ImportSectionsModal = ({ visible, onCancel, onSuccess, courseId }) => {
  const { t } = useTranslation();
  const [uploading, setUploading] = useState(false);
  const [fileList, setFileList] = useState([]);

  const handleUpload = async () => {
    if (fileList.length === 0) return;

    const file = fileList[0];
    setUploading(true);

    try {
      await importSections(courseId, file);
      message.success(t('admin.courses.sections.importSuccess'));
      setFileList([]);
      onSuccess();
    } catch (error) {
      message.error(error.response?.data?.message || t('admin.courses.sections.importError'));
    } finally {
      setUploading(false);
    }
  };

  const props = {
    onRemove: (file) => {
      setFileList([]);
    },
    beforeUpload: (file) => {
      const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.name.endsWith('.xlsx');
      if (!isExcel) {
        message.error(t('admin.courses.sections.notExcelFile', { name: file.name }));
        return Upload.LIST_IGNORE;
      }
      setFileList([file]);
      return false; // Prevent auto upload
    },
    fileList,
  };

  return (
    <Modal
      title={t('admin.courses.sections.importTitle')}
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>{t('common.cancel')}</Button>,
        <Button key="submit" type="primary" loading={uploading} disabled={fileList.length === 0} onClick={handleUpload}>
          {t('admin.courses.sections.import')}
        </Button>,
      ]}
    >
      <div className="space-y-4">
        <Alert
          message={t('admin.courses.sections.templateInstructions')}
          description={
            <ul className="list-disc pl-4 text-sm">
              <li>{t('admin.courses.sections.templateRow1')}</li>
              <li>{t('admin.courses.sections.templateColumnA')}</li>
              <li>{t('admin.courses.sections.templateColumnB')}</li>
              <li>{t('admin.courses.sections.templateColumnC')}</li>
            </ul>
          }
          type="info"
          showIcon
        />
        
        <Upload {...props} maxCount={1}>
          <Button icon={<UploadOutlined />}>{t('admin.courses.sections.selectExcel')}</Button>
        </Upload>
      </div>
    </Modal>
  );
};

export default ImportSectionsModal;