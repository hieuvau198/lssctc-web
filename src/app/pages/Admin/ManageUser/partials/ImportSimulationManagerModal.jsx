import { App, Button, Card, Col, Collapse, Modal, Row, Typography, Upload } from 'antd';
import { Download, FileSpreadsheet, Info, Upload as UploadIcon } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { downloadSimulationManagerTemplate, importSimulationManagerFromExcel } from '../../../../apis/Admin/AdminUser';

const { Text } = Typography;

const ImportSimulationManagerModal = ({ visible, onCancel, onSuccess }) => {
    const { modal, message } = App.useApp();
    const { t } = useTranslation();
    const [uploading, setUploading] = useState(false);
    const [fileList, setFileList] = useState([]);
    const [downloading, setDownloading] = useState(false);

    const handleDownloadTemplate = async () => {
        setDownloading(true);
        try {
            await downloadSimulationManagerTemplate();
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
            const result = await importSimulationManagerFromExcel(file);
            const msg = result.message || '';

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
                        onSuccess();
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
                    <div className="w-6 h-6 bg-yellow-400 border border-black flex items-center justify-center">
                        <FileSpreadsheet className="w-3.5 h-3.5 text-black" />
                    </div>
                    <span className="font-bold uppercase text-sm">{t('admin.users.import.importSimManager')}</span>
                </div>
            }
            onCancel={onCancel}
            footer={[
                <Button key="cancel" onClick={onCancel} className="border-2 border-black text-black font-bold uppercase hover:bg-neutral-100 rounded-none h-9 text-xs">
                    {t('common.cancel')}
                </Button>,
                <Button
                    key="import"
                    type="primary"
                    loading={uploading}
                    onClick={handleImport}
                    disabled={fileList.length === 0}
                    className="bg-yellow-400 border-2 border-black text-black font-bold uppercase hover:!bg-yellow-500 hover:!border-black hover:!text-black rounded-none h-9 text-xs shadow-none"
                >
                    {t('admin.users.import.importSimManagerBtn')}
                </Button>,
            ]}
            width={700}
            centered
            className="industrial-modal"
        >
            <div className="space-y-6">
                <Row gutter={24}>
                    <Col span={12}>
                        <div className="h-full border border-neutral-200 bg-neutral-50 p-4">
                            <h4 className="font-bold uppercase text-xs mb-3 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-black"></span>
                                1. {t('admin.users.import.uploadFile')}
                            </h4>
                            <Upload.Dragger {...uploadProps} className="!rounded-none !border-2 !border-dashed !border-neutral-300 hover:!border-black !bg-white group" height={120}>
                                <p className="ant-upload-drag-icon">
                                    <UploadIcon className="w-8 h-8 text-neutral-400 group-hover:text-black transition-colors mx-auto" />
                                </p>
                                <p className="ant-upload-text text-sm font-medium">{t('admin.users.import.dragOrClick')}</p>
                                <p className="ant-upload-hint text-xs text-neutral-400">
                                    {t('admin.users.import.onlyXlsx')}
                                </p>
                            </Upload.Dragger>
                        </div>
                    </Col>
                    <Col span={12}>
                        <div className="h-full border border-neutral-200 bg-neutral-50 p-4">
                            <h4 className="font-bold uppercase text-xs mb-3 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-black"></span>
                                2. {t('admin.users.import.needTemplate')}
                            </h4>
                            <div className="flex flex-col items-center justify-center h-[120px] gap-3 border border-neutral-200 bg-white">
                                <p className="text-neutral-500 text-center text-xs px-4 font-medium">
                                    {t('admin.users.import.downloadTemplateDesc')}
                                </p>
                                <Button
                                    icon={<Download className="w-3.5 h-3.5" />}
                                    onClick={handleDownloadTemplate}
                                    loading={downloading}
                                    className="border-2 border-black text-black font-bold uppercase hover:bg-yellow-50 rounded-none h-8 text-[10px]"
                                >
                                    {t('admin.users.import.downloadTemplate')}
                                </Button>
                            </div>
                        </div>
                    </Col>
                </Row>

                <Collapse
                    items={instructionItems}
                    ghost
                    size="small"
                    className="border border-neutral-200 bg-neutral-50 [&_.ant-collapse-header]:!items-center [&_.ant-collapse-header]:!py-2"
                />
            </div>
        </Modal>
    );
};

export default ImportSimulationManagerModal;
