import React, { useState } from 'react';
import { Modal, Upload, Button, App, Row, Col, Card, Typography, Collapse } from 'antd';
import { FileSpreadsheet, Upload as UploadIcon, Download, Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { downloadTraineeTemplate, importTraineeFromExcel } from '../../../../apis/Admin/AdminUser';

const { Text } = Typography;

const ImportTraineeModal = ({ visible, onCancel, onSuccess }) => {
    const { modal, message } = App.useApp();
    const { t } = useTranslation();
    const [uploading, setUploading] = useState(false);
    const [fileList, setFileList] = useState([]);
    const [downloading, setDownloading] = useState(false);

    const handleDownloadTemplate = async () => {
        setDownloading(true);
        try {
            await downloadTraineeTemplate();
            message.success(t('admin.users.import.downloadSuccess'));
        } catch (error) {
            console.error('Download error:', error);
            message.error(error.message || t('admin.users.import.downloadFailed'));
        } finally {
            setDownloading(false);
        }
    };

    const handleImport = async () => {
        if (fileList.length === 0) {
            message.error(t('admin.users.import.selectFile'));
            return;
        }

        const file = fileList[0];
        setUploading(true);

        try {
            const result = await importTraineeFromExcel(file);
            const msg = result.message || '';

            // Check if there are skips or errors mentioned in the message
            // Example: "Import completed successfully. Imported 0 trainees. Skipped 3 duplicates/errors..."
            if (msg.includes('Skipped') || msg.includes('Errors') || msg.includes('Imported 0')) {
                modal.warning({
                    title: t('admin.users.import.importResult'),
                    content: (
                        <div className="max-h-[300px] overflow-auto whitespace-pre-wrap">
                            {msg}
                        </div>
                    ),
                    width: 600,
                    okType: 'default',
                    okText: "OK",
                    okButtonProps: {
                        className: "!bg-yellow-400 !text-black !border-black hover:!bg-yellow-500 font-bold uppercase"
                    },
                    onOk: () => {
                        setFileList([]);
                        onSuccess(); // Refresh list and close modal
                    }
                });
            } else {
                message.success(msg || t('admin.users.import.importSuccess'));
                setFileList([]);
                onSuccess();
            }
        } catch (error) {
            console.error('Import error:', error);
            message.error(error.response?.data?.message || error.message || t('admin.users.import.importFailed'));
        } finally {
            setUploading(false);
        }
    };

    const uploadProps = {
        onRemove: () => setFileList([]),
        beforeUpload: (file) => {
            const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.name.endsWith('.xlsx');
            if (!isExcel) {
                message.error(`${file.name} ${t('admin.users.import.invalidFile')}`);
                return Upload.LIST_IGNORE;
            }
            setFileList([file]);
            return false;
        },
        fileList,
        maxCount: 1,
    };

    const instructionItems = [
        {
            key: '1',
            label: <span className="font-medium flex items-center gap-2"><Info className="w-4 h-4" /> {t('admin.users.import.instructions')}</span>,
            children: (
                <div className="text-sm text-gray-600 space-y-4">
                    <div>
                        <h4 className="font-semibold text-gray-800 mb-2">{t('admin.users.import.instructions')}</h4>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>{t('admin.users.import.instructionsList.downloadTemplate')}</li>
                            <li>{t('admin.users.import.instructionsList.fillInfo')}</li>
                            <li>{t('admin.users.import.instructionsList.requiredFields')}: <Text strong>{t('admin.users.import.instructionsList.requiredFieldsList')}</Text>.</li>
                            <li>{t('admin.users.import.instructionsList.noChangeHeader')}</li>
                        </ul>
                    </div>
                </div>
            ),
        },
    ];

    return (
        <Modal
            open={visible}
            title={
                <div className="flex items-center gap-2">
                    <FileSpreadsheet className="w-5 h-5 text-green-600" />
                    <span>{t('admin.users.import.importTrainee')}</span>
                </div>
            }
            onCancel={onCancel}
            footer={[
                <Button key="cancel" onClick={onCancel}>
                    {t('common.cancel')}
                </Button>,
                <Button
                    key="import"
                    type="primary"
                    loading={uploading}
                    onClick={handleImport}
                    disabled={fileList.length === 0}
                >
                    {t('admin.users.import.importTraineeBtn')}
                </Button>,
            ]}
            width={700}
            centered
        >
            <div className="py-4 space-y-6">
                <Row gutter={24}>
                    <Col span={12}>
                        <Card size="small" title={`1. ${t('admin.users.import.uploadFile')}`} className="h-full bg-gray-50">
                            <Upload.Dragger {...uploadProps} className="w-full bg-white" height={120}>
                                <p className="ant-upload-drag-icon">
                                    <UploadIcon className="w-8 h-8 text-blue-500 mx-auto" />
                                </p>
                                <p className="ant-upload-text text-sm">{t('admin.users.import.dragOrClick')}</p>
                                <p className="ant-upload-hint text-xs text-gray-400">
                                    {t('admin.users.import.onlyXlsx')}
                                </p>
                            </Upload.Dragger>
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card size="small" title={`2. ${t('admin.users.import.needTemplate')}`} className="h-full bg-gray-50">
                            <div className="flex flex-col items-center justify-center h-[120px] gap-3">
                                <p className="text-gray-500 text-center text-sm px-4">
                                    {t('admin.users.import.downloadTemplateDesc')}
                                </p>
                                <Button
                                    icon={<Download className="w-4 h-4" />}
                                    onClick={handleDownloadTemplate}
                                    loading={downloading}
                                >
                                    {t('admin.users.import.downloadTemplate')}
                                </Button>
                            </div>
                        </Card>
                    </Col>
                </Row>

                <Collapse items={instructionItems} ghost size="small" />
            </div>
        </Modal>
    );
};

export default ImportTraineeModal;
