import React, { useState } from 'react';
import { Modal, Upload, Button, message, Input, InputNumber, Row, Col, Collapse, Typography, Card, Divider } from 'antd';
import { FileSpreadsheet, Upload as UploadIcon, Download, Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { downloadQuizTemplate, importQuizFromExcel } from '../../../../apis/Instructor/InstructorQuiz';

const { Text } = Typography;

const ImportQuizModal = ({ visible, onCancel, onSuccess }) => {
    const { t } = useTranslation();
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
            message.success(t('instructor.quizzes.messages.templateDownloadSuccess'));
        } catch (error) {
            console.error('Download error:', error);
            message.error(error.message || t('instructor.quizzes.messages.templateDownloadFailed'));
        } finally {
            setDownloading(false);
        }
    };

    const handleImport = async () => {
        if (fileList.length === 0) {
            message.error(t('instructor.quizzes.messages.selectExcelFile'));
            return;
        }
        if (!quizName.trim()) {
            message.error(t('instructor.quizzes.messages.enterQuizName'));
            return;
        }
        if (passScoreCriteria && (passScoreCriteria < 1 || passScoreCriteria > 10)) {
            message.error(t('instructor.quizzes.messages.passScoreRange'));
            return;
        }
        if (timelimitMinute && timelimitMinute < 1) {
            message.error(t('instructor.quizzes.messages.timeLimitMin'));
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

            message.success(result.message || t('instructor.quizzes.messages.importSuccess'));

            // Reset form
            setFileList([]);
            setQuizName('');
            setPassScoreCriteria(5);
            setTimelimitMinute(20);
            setDescription('');

            onSuccess();
        } catch (error) {
            console.error('Import error:', error);
            message.error(error.response?.data?.message || error.message || t('instructor.quizzes.messages.importFailed'));
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
            label: <span className="font-medium flex items-center gap-2"><Info className="w-4 h-4" /> {t('instructor.quizzes.import.instructions.title')}</span>,
            children: (
                <div className="text-sm text-gray-600 space-y-4">
                    <div>
                        <h4 className="font-semibold text-gray-800 mb-2">{t('instructor.quizzes.import.instructions.questionsSheet')}</h4>
                        <ul className="list-disc pl-5 space-y-1">
                            <li><Text strong>Col A:</Text> {t('instructor.quizzes.import.instructions.questionsColA').replace('Col A: ', '')}</li>
                            <li><Text strong>Col B:</Text> {t('instructor.quizzes.import.instructions.questionsColB').replace('Col B: ', '')}</li>
                            <li><Text strong>Col C:</Text> {t('instructor.quizzes.import.instructions.questionsColC').replace('Col C: ', '')}</li>
                            <li><Text strong>Col D:</Text> {t('instructor.quizzes.import.instructions.questionsColD').replace('Col D: ', '')}</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-800 mb-2">{t('instructor.quizzes.import.instructions.optionsSheet')}</h4>
                        <ul className="list-disc pl-5 space-y-1">
                            <li><Text strong>Col A:</Text> {t('instructor.quizzes.import.instructions.optionsColA').replace('Col A: ', '')}</li>
                            <li><Text strong>Col B:</Text> {t('instructor.quizzes.import.instructions.optionsColB').replace('Col B: ', '')}</li>
                            <li><Text strong>Col C:</Text> {t('instructor.quizzes.import.instructions.optionsColC').replace('Col C: ', '')}</li>
                            <li><Text strong>Col D:</Text> {t('instructor.quizzes.import.instructions.optionsColD').replace('Col D: ', '')}</li>
                            <li><Text strong>Col E:</Text> {t('instructor.quizzes.import.instructions.optionsColE').replace('Col E: ', '')}</li>
                            <li><Text strong>Col F:</Text> {t('instructor.quizzes.import.instructions.optionsColF').replace('Col F: ', '')}</li>
                        </ul>
                    </div>
                    <div className="bg-blue-50 p-3 rounded border border-blue-100">
                        <h4 className="font-semibold text-blue-800 mb-1">{t('instructor.quizzes.import.instructions.importantRules')}</h4>
                        <ul className="list-disc pl-5 text-blue-700">
                            <li>{t('instructor.quizzes.import.instructions.rule1')}</li>
                            <li>{t('instructor.quizzes.import.instructions.rule2')}</li>
                            <li>{t('instructor.quizzes.import.instructions.rule3')}</li>
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
                    <span>{t('instructor.quizzes.import.title')}</span>
                </div>
            }
            onCancel={onCancel}
            footer={[
                <Button key="cancel" onClick={onCancel}>
                    {t('instructor.quizzes.import.cancel')}
                </Button>,
                <Button
                    key="import"
                    type="primary"
                    loading={uploading}
                    onClick={handleImport}
                    disabled={fileList.length === 0 || !quizName.trim()}
                >
                    {t('instructor.quizzes.import.importQuiz')}
                </Button>,
            ]}
            width={800}
            centered
        >
            <div className="py-4 space-y-4">

                {/* 1. Middle Section: Quiz Information Form */}
                <div>
                    <h3 className="font-medium text-gray-800 mb-4 pb-2">{t('instructor.quizzes.import.quizInfo')}</h3>
                    <Row gutter={24}>
                        <Col span={12}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t('instructor.quizzes.form.quizName')} <span className="text-red-500">*</span></label>
                                <Input
                                    placeholder={t('instructor.quizzes.form.quizNamePlaceholder')}
                                    value={quizName}
                                    onChange={(e) => setQuizName(e.target.value)}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t('instructor.quizzes.form.description')}</label>
                                <Input.TextArea
                                    placeholder={t('instructor.quizzes.form.descriptionPlaceholder')}
                                    rows={3}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>
                        </Col>
                        <Col span={12}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t('instructor.quizzes.form.passScore')}</label>
                                <InputNumber
                                    min={1}
                                    max={10}
                                    value={passScoreCriteria}
                                    onChange={setPassScoreCriteria}
                                    className="w-full"
                                />
                                <p className="text-xs text-gray-400 mt-1">{t('instructor.quizzes.form.passScoreHelp')}</p>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t('instructor.quizzes.form.timeLimitLabel')}</label>
                                <InputNumber
                                    min={1}
                                    value={timelimitMinute}
                                    onChange={setTimelimitMinute}
                                    className="w-full"
                                />
                                <p className="text-xs text-gray-400 mt-1">{t('instructor.quizzes.form.timeLimitHelp')}</p>
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
                        <Card size="small" title={t('instructor.quizzes.import.uploadFile')} className="h-full bg-gray-50">
                            <Upload.Dragger {...uploadProps} className="w-full bg-white" height={120}>
                                <p className="ant-upload-drag-icon">
                                    <UploadIcon className="w-8 h-8 text-blue-500 mx-auto" />
                                </p>
                                <p className="ant-upload-text text-sm">{t('instructor.quizzes.import.clickOrDrag')}</p>
                                <p className="ant-upload-hint text-xs text-gray-400">
                                    {t('instructor.quizzes.import.xlsxOnly')}
                                </p>
                            </Upload.Dragger>
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card size="small" title={t('instructor.quizzes.import.needTemplate')} className="h-full bg-gray-50">
                            <div className="flex flex-col items-center justify-center h-[120px] gap-3">
                                <p className="text-gray-500 text-center text-sm px-4">
                                    {t('instructor.quizzes.import.downloadTemplateDesc')}
                                </p>
                                <Button
                                    icon={<Download className="w-4 h-4" />}
                                    onClick={handleDownloadTemplate}
                                    loading={downloading}
                                >
                                    {t('instructor.quizzes.import.downloadTemplate')}
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
