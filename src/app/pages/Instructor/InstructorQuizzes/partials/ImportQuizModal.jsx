import React, { useState } from 'react';
import { Modal, Upload, Button, message, Input, InputNumber, Row, Col, Collapse, Typography, Card, Divider } from 'antd';
import { FileSpreadsheet, Upload as UploadIcon, Download, Info } from 'lucide-react';
import { downloadQuizTemplate, importQuizFromExcel } from '../../../../apis/Instructor/InstructorQuiz';

const { Text } = Typography;

const ImportQuizModal = ({ visible, onCancel, onSuccess }) => {
    const [uploading, setUploading] = useState(false);
    const [fileList, setFileList] = useState([]);
    const [quizName, setQuizName] = useState('');
    const [passScoreCriteria, setPassScoreCriteria] = useState(5);
    const [timelimitMinute, setTimelimitMinute] = useState(20);
    const [description, setDescription] = useState('');
    const [downloading, setDownloading] = useState(false);

    const handleDownloadTemplate = async () => {
        setDownloading(true);
        try {
            await downloadQuizTemplate();
            message.success('Template downloaded successfully');
        } catch (error) {
            console.error('Download error:', error);
            message.error(error.message || 'Failed to download template.');
        } finally {
            setDownloading(false);
        }
    };

    const handleImport = async () => {
        if (fileList.length === 0) {
            message.error('Please select an Excel file');
            return;
        }
        if (!quizName.trim()) {
            message.error('Please enter quiz name');
            return;
        }
        if (passScoreCriteria && (passScoreCriteria < 1 || passScoreCriteria > 10)) {
            message.error('Pass score must be between 1 and 10 points');
            return;
        }
        if (timelimitMinute && timelimitMinute < 1) {
            message.error('Time limit must be at least 1 minute');
            return;
        }

        const file = fileList[0];
        setUploading(true);

        try {
            const result = await importQuizFromExcel({
                file: file,
                name: quizName.trim(),
                passScoreCriteria: passScoreCriteria || undefined,
                timelimitMinute: timelimitMinute || undefined,
                description: description?.trim() || undefined,
            });

            message.success(result.message || 'Quiz imported successfully!');

            // Reset form
            setFileList([]);
            setQuizName('');
            setPassScoreCriteria(5);
            setTimelimitMinute(20);
            setDescription('');

            onSuccess();
        } catch (error) {
            console.error('Import error:', error);
            message.error(error.response?.data?.message || error.message || 'Import failed.');
        } finally {
            setUploading(false);
        }
    };

    const uploadProps = {
        onRemove: () => setFileList([]),
        beforeUpload: (file) => {
            const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.name.endsWith('.xlsx');
            if (!isExcel) {
                message.error(`${file.name} is not a valid Excel file`);
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
            label: <span className="font-medium flex items-center gap-2"><Info className="w-4 h-4" /> Excel File Structure Instructions</span>,
            children: (
                <div className="text-sm text-gray-600 space-y-4">
                    <div>
                        <h4 className="font-semibold text-gray-800 mb-2">Sheet "Questions"</h4>
                        <ul className="list-disc pl-5 space-y-1">
                            <li><Text strong>Col A:</Text> Question name (required)</li>
                            <li><Text strong>Col B:</Text> Question description</li>
                            <li><Text strong>Col C:</Text> Question score (max 2 decimals)</li>
                            <li><Text strong>Col D:</Text> Allow multiple answers (TRUE/FALSE)</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-800 mb-2">Sheet "Options"</h4>
                        <ul className="list-disc pl-5 space-y-1">
                            <li><Text strong>Col A:</Text> Question number (must match row number in Questions sheet)</li>
                            <li><Text strong>Col B:</Text> Option name (required)</li>
                            <li><Text strong>Col C:</Text> Option description</li>
                            <li><Text strong>Col D:</Text> Is correct answer (TRUE/FALSE)</li>
                            <li><Text strong>Col E:</Text> Display order</li>
                            <li><Text strong>Col F:</Text> Option score</li>
                        </ul>
                    </div>
                    <div className="bg-blue-50 p-3 rounded border border-blue-100">
                        <h4 className="font-semibold text-blue-800 mb-1">Important Rules:</h4>
                        <ul className="list-disc pl-5 text-blue-700">
                            <li>Total score of all questions should equal 10.</li>
                            <li>Each question must have at least one correct answer.</li>
                            <li>Scores can have a maximum of 2 decimal places.</li>
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
                    <span>Import Quiz from Excel</span>
                </div>
            }
            onCancel={onCancel}
            footer={[
                <Button key="cancel" onClick={onCancel}>
                    Cancel
                </Button>,
                <Button
                    key="import"
                    type="primary"
                    loading={uploading}
                    onClick={handleImport}
                    disabled={fileList.length === 0 || !quizName.trim()}
                >
                    Import Quiz
                </Button>,
            ]}
            width={800}
            centered
        >
            <div className="py-4 space-y-4">

                {/* 1. Middle Section: Quiz Information Form */}
                <div>
                    <h3 className="font-medium text-gray-800 mb-4 pb-2">1. Quiz Information</h3>
                    <Row gutter={24}>
                        <Col span={12}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Quiz Name <span className="text-red-500">*</span></label>
                                <Input
                                    placeholder="Enter quiz name"
                                    value={quizName}
                                    onChange={(e) => setQuizName(e.target.value)}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <Input.TextArea
                                    placeholder="Optional description"
                                    rows={3}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>
                        </Col>
                        <Col span={12}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Pass Score (1-10)</label>
                                <InputNumber
                                    min={1}
                                    max={10}
                                    value={passScoreCriteria}
                                    onChange={setPassScoreCriteria}
                                    className="w-full"
                                />
                                <p className="text-xs text-gray-400 mt-1">Minimum score required to pass.</p>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Time Limit (minutes)</label>
                                <InputNumber
                                    min={1}
                                    value={timelimitMinute}
                                    onChange={setTimelimitMinute}
                                    className="w-full"
                                />
                                <p className="text-xs text-gray-400 mt-1">Total duration of the quiz.</p>
                            </div>
                        </Col>
                    </Row>
                </div>

                <div>
                    <Divider size="small" />
                </div>

                {/* 2. Top Section: Upload & Download */}
                <Row gutter={24}>
                    <Col span={12}>
                        <Card size="small" title="2. Upload File" className="h-full bg-gray-50">
                            <Upload.Dragger {...uploadProps} className="w-full bg-white" height={120}>
                                <p className="ant-upload-drag-icon">
                                    <UploadIcon className="w-8 h-8 text-blue-500 mx-auto" />
                                </p>
                                <p className="ant-upload-text text-sm">Click or drag file here</p>
                                <p className="ant-upload-hint text-xs text-gray-400">
                                    .xlsx files only
                                </p>
                            </Upload.Dragger>
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card size="small" title="3. Need a Template?" className="h-full bg-gray-50">
                            <div className="flex flex-col items-center justify-center h-[120px] gap-3">
                                <p className="text-gray-500 text-center text-sm px-4">
                                    Download the standard Excel template to ensure correct format.
                                </p>
                                <Button
                                    icon={<Download className="w-4 h-4" />}
                                    onClick={handleDownloadTemplate}
                                    loading={downloading}
                                >
                                    Download Template
                                </Button>
                            </div>
                        </Card>
                    </Col>
                </Row>

                {/* 3. Bottom Section: Instructions */}
                <Collapse items={instructionItems} ghost size="small" />
            </div>
        </Modal>
    );
};

export default ImportQuizModal;
