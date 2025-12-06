import React, { useState } from 'react';
import { Modal, Upload, Button, App, Row, Col, Card, Typography, Collapse } from 'antd';
import { FileSpreadsheet, Upload as UploadIcon, Download, Info } from 'lucide-react';
import { downloadTraineeTemplate, importTraineeFromExcel } from '../../../../apis/Admin/AdminUser';

const { Text } = Typography;

const ImportTraineeModal = ({ visible, onCancel, onSuccess }) => {
    const { modal, message } = App.useApp();
    const [uploading, setUploading] = useState(false);
    const [fileList, setFileList] = useState([]);
    const [downloading, setDownloading] = useState(false);

    const handleDownloadTemplate = async () => {
        setDownloading(true);
        try {
            await downloadTraineeTemplate();
            message.success('Tải file mẫu thành công');
        } catch (error) {
            console.error('Download error:', error);
            message.error(error.message || 'Tải file mẫu thất bại.');
        } finally {
            setDownloading(false);
        }
    };

    const handleImport = async () => {
        if (fileList.length === 0) {
            message.error('Vui lòng chọn file Excel');
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
                    title: 'Kết quả Import',
                    content: (
                        <div className="max-h-[300px] overflow-auto whitespace-pre-wrap">
                            {msg}
                        </div>
                    ),
                    width: 600,
                    onOk: () => {
                        setFileList([]);
                        onSuccess(); // Refresh list and close modal
                    }
                });
            } else {
                message.success(msg || 'Import học viên thành công!');
                setFileList([]);
                onSuccess();
            }
        } catch (error) {
            console.error('Import error:', error);
            message.error(error.response?.data?.message || error.message || 'Import thất bại.');
        } finally {
            setUploading(false);
        }
    };

    const uploadProps = {
        onRemove: () => setFileList([]),
        beforeUpload: (file) => {
            const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.name.endsWith('.xlsx');
            if (!isExcel) {
                message.error(`${file.name} không phải là file Excel hợp lệ`);
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
            label: <span className="font-medium flex items-center gap-2"><Info className="w-4 h-4" /> Hướng dẫn cấu trúc file Excel</span>,
            children: (
                <div className="text-sm text-gray-600 space-y-4">
                    <div>
                        <h4 className="font-semibold text-gray-800 mb-2">Hướng dẫn</h4>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Vui lòng tải file mẫu để đảm bảo đúng định dạng.</li>
                            <li>Điền thông tin học viên vào các cột tương ứng.</li>
                            <li>Các trường bắt buộc: <Text strong>Username, Email, Fullname, Password</Text>.</li>
                            <li>Không thay đổi hàng tiêu đề.</li>
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
                    <span>Import Học viên từ Excel</span>
                </div>
            }
            onCancel={onCancel}
            footer={[
                <Button key="cancel" onClick={onCancel}>
                    Hủy
                </Button>,
                <Button
                    key="import"
                    type="primary"
                    loading={uploading}
                    onClick={handleImport}
                    disabled={fileList.length === 0}
                >
                    Import Học viên
                </Button>,
            ]}
            width={700}
            centered
        >
            <div className="py-4 space-y-6">
                <Row gutter={24}>
                    <Col span={12}>
                        <Card size="small" title="1. Tải file lên" className="h-full bg-gray-50">
                            <Upload.Dragger {...uploadProps} className="w-full bg-white" height={120}>
                                <p className="ant-upload-drag-icon">
                                    <UploadIcon className="w-8 h-8 text-blue-500 mx-auto" />
                                </p>
                                <p className="ant-upload-text text-sm">Nhấn hoặc kéo thả file vào đây</p>
                                <p className="ant-upload-hint text-xs text-gray-400">
                                    Chỉ file .xlsx
                                </p>
                            </Upload.Dragger>
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card size="small" title="2. Cần file mẫu?" className="h-full bg-gray-50">
                            <div className="flex flex-col items-center justify-center h-[120px] gap-3">
                                <p className="text-gray-500 text-center text-sm px-4">
                                    Tải file mẫu chuẩn để đảm bảo đúng định dạng.
                                </p>
                                <Button
                                    icon={<Download className="w-4 h-4" />}
                                    onClick={handleDownloadTemplate}
                                    loading={downloading}
                                >
                                    Tải file mẫu
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
