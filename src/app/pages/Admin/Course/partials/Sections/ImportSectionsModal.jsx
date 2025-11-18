// src/app/pages/Admin/Course/partials/Sections/ImportSectionsModal.jsx
import React, { useState } from 'react';
import { Modal, Upload, Button, message, Alert } from 'antd';
import { UploadOutlined, FileExcelOutlined } from '@ant-design/icons';
import { importSections } from '../../../../../apis/ProgramManager/SectionApi';

const ImportSectionsModal = ({ visible, onCancel, onSuccess, courseId }) => {
  const [uploading, setUploading] = useState(false);
  const [fileList, setFileList] = useState([]);

  const handleUpload = async () => {
    if (fileList.length === 0) return;

    const file = fileList[0];
    setUploading(true);

    try {
      await importSections(courseId, file);
      message.success('Sections imported successfully');
      setFileList([]);
      onSuccess();
    } catch (error) {
      message.error(error.response?.data?.message || 'Import failed');
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
        message.error(`${file.name} is not an Excel file`);
        return Upload.LIST_IGNORE;
      }
      setFileList([file]);
      return false; // Prevent auto upload
    },
    fileList,
  };

  return (
    <Modal
      title="Import Sections from Excel"
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>Cancel</Button>,
        <Button key="submit" type="primary" loading={uploading} disabled={fileList.length === 0} onClick={handleUpload}>
          Import
        </Button>,
      ]}
    >
      <div className="space-y-4">
        <Alert
          message="Template Instructions"
          description={
            <ul className="list-disc pl-4 text-sm">
              <li>Row 1: Headers (Title, Description, Duration) - Skipped</li>
              <li>Column A: <b>Section Title</b> (Required)</li>
              <li>Column B: Description (Optional)</li>
              <li>Column C: Duration in minutes (Number)</li>
            </ul>
          }
          type="info"
          showIcon
        />
        
        <Upload {...props} maxCount={1}>
          <Button icon={<UploadOutlined />}>Select Excel File (.xlsx)</Button>
        </Upload>
      </div>
    </Modal>
  );
};

export default ImportSectionsModal;