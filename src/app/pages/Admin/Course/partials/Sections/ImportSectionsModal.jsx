// src/app/pages/Admin/Course/partials/Sections/ImportSectionsModal.jsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Upload, message } from 'antd';
import { Upload as UploadIcon, FileSpreadsheet, X, Info } from 'lucide-react';
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
      return false;
    },
    fileList,
  };

  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      footer={null}
      closable={false}
      width={600}
      styles={{
        content: { padding: 0, borderRadius: 0 },
        body: { padding: 0 },
      }}
    >
      {/* Industrial Header */}
      <div className="bg-black p-4 flex items-center justify-between border-b-4 border-yellow-400">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-yellow-400 flex items-center justify-center">
            <FileSpreadsheet className="w-5 h-5 text-black" />
          </div>
          <div>
            <h3 className="text-white font-black uppercase text-lg leading-none m-0">
              {t('admin.courses.sections.importTitle')}
            </h3>
            <p className="text-neutral-400 text-xs font-mono mt-1 m-0">
              ID: {courseId}
            </p>
          </div>
        </div>
        <button
          onClick={onCancel}
          className="text-neutral-400 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="p-6 space-y-6">
        {/* Custom Instructions Box */}
        <div className="bg-blue-50 border-2 border-blue-200 p-4 flex gap-3">
          <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div className="text-sm text-blue-900">
            <p className="font-bold mb-2 uppercase tracking-wide text-blue-800">
              {t('admin.courses.sections.templateInstructions')}
            </p>
            <ul className="list-disc pl-4 space-y-1 text-blue-800">
              <li>{t('admin.courses.sections.templateRow1') || "Download the template, fill each row, then upload the file."}</li>
              <li>{t('admin.courses.sections.templateColumnA') || "Column A: Section Name"}</li>
              <li>{t('admin.courses.sections.templateColumnB') || "Column B: Order (Optional)"}</li>
              <li>{t('admin.courses.sections.templateColumnC') || "Column C: Duration (in minutes)"}</li>
            </ul>
          </div>
        </div>

        {/* Styled Upload Area */}
        <div className="border-2 border-dashed border-neutral-300 bg-neutral-50 hover:bg-white hover:border-black transition-all p-8 text-center group">
          <Upload {...props} maxCount={1}>
            <div className="flex flex-col items-center gap-3 cursor-pointer">
              <div className="w-12 h-12 rounded-full bg-neutral-200 group-hover:bg-yellow-400 transition-colors flex items-center justify-center">
                <UploadIcon className="w-6 h-6 text-neutral-600 group-hover:text-black" />
              </div>
              <span className="font-bold uppercase text-sm tracking-wider text-neutral-600 group-hover:text-black">
                {fileList.length > 0 ? "Change Excel File" : t('admin.courses.sections.selectExcel')}
              </span>
              {fileList.length > 0 && (
                <span className="text-xs font-mono text-green-600 bg-green-100 px-2 py-1 rounded-none border border-green-200">
                  {fileList[0].name}
                </span>
              )}
            </div>
          </Upload>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-neutral-100">
          <button
            onClick={onCancel}
            className="px-5 py-2.5 bg-white border-2 border-neutral-300 text-neutral-600 font-bold uppercase tracking-wider hover:border-black hover:text-black transition-all text-xs"
          >
            {t('common.cancel')}
          </button>
          <button
            onClick={handleUpload}
            disabled={uploading || fileList.length === 0}
            className="px-5 py-2.5 bg-yellow-400 border-2 border-yellow-400 text-black font-black uppercase tracking-wider hover:bg-yellow-500 hover:border-yellow-500 hover:shadow-md transition-all text-xs flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading && <div className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin" />}
            {t('admin.courses.sections.import')}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ImportSectionsModal;