import React, { useState } from 'react';
import { Modal, Upload, Button, Input, InputNumber, Row, Col, Collapse, Typography, Card, Divider, App } from 'antd';
import { FileSpreadsheet, Upload as UploadIcon, Download, Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { downloadQuizTemplate, importQuizFromExcel } from '../../../../apis/Instructor/InstructorQuiz';

const { Text } = Typography;

const ImportQuizModal = ({ visible, onCancel, onSuccess }) => {
    const { t } = useTranslation();
    const { message } = App.useApp();
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
            const errorMsg = error.response?.data?.message ||
                error.response?.data?.title ||
                (typeof error.response?.data === 'string' ? error.response.data : '') ||
                error.message ||
                t('instructor.quizzes.messages.importFailed');
            message.error(errorMsg);
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
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-yellow-400 border-2 border-black flex items-center justify-center">
                        <FileSpreadsheet className="w-5 h-5 text-black" />
                    </div>
                    <span className="font-black text-xl uppercase tracking-tight">{t('instructor.quizzes.import.title')}</span>
                </div>
            }
            onCancel={onCancel}
            footer={null}
            width={800}
            centered
            className="industrial-modal"
            closeIcon={<div className="w-8 h-8 flex items-center justify-center border-2 border-transparent hover:border-black hover:bg-neutral-100 transition-all"><div className="text-xl font-bold">×</div></div>}
            styles={{
                content: {
                    border: '2px solid #000',
                    borderRadius: 0,
                    padding: 0,
                    overflow: 'hidden',
                    boxShadow: '8px 8px 0px 0px rgba(0,0,0,1)'
                },
                header: {
                    background: '#fff',
                    padding: '20px 24px',
                    borderBottom: '2px solid #000',
                    marginBottom: 0,
                    borderRadius: 0,
                },
                body: {
                    padding: 24,
                    background: '#fff'
                }
            }}
        >
            <style>{`
                .industrial-input, .industrial-input-number {
                    border: 2px solid #e5e5e5 !important;
                    border-radius: 0 !important;
                    transition: all 0.2s;
                }
                .industrial-input:hover, .industrial-input:focus, 
                .industrial-input-number:hover, .industrial-input-number:focus,
                .industrial-input-number-focused {
                    border-color: #000 !important;
                    box-shadow: none !important;
                }
                .industrial-card {
                    border: 2px solid #000 !important;
                    border-radius: 0 !important;
                }
                .industrial-card .ant-card-head {
                    border-bottom: 2px solid #000 !important;
                    border-radius: 0 !important;
                    background: #f5f5f5 !important;
                    min-height: 48px;
                }
                .industrial-card .ant-card-head-title {
                    text-transform: uppercase;
                    font-weight: 700;
                    font-size: 14px;
                }
                .industrial-modal .ant-upload.ant-upload-drag {
                    border: 2px dashed #d9d9d9 !important;
                    border-radius: 0 !important;
                    background: #fff !important;
                }
                .industrial-modal .ant-upload.ant-upload-drag:hover {
                    border-color: #facc15 !important;
                }
            `}</style>

            <div className="space-y-6">
                {/* 1. Quiz Information */}
                <div className="bg-white border-2 border-black p-0">
                    <div className="h-1 bg-yellow-400" />
                    <div className="px-4 py-3 border-b-2 border-neutral-200 bg-neutral-50 flex items-center justify-between">
                        <span className="font-bold uppercase text-sm tracking-wider">{t('instructor.quizzes.import.quizInfo')}</span>
                    </div>
                    <div className="p-4">
                        <Row gutter={24}>
                            <Col span={12}>
                                <div className="mb-4">
                                    <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-neutral-600">
                                        {t('instructor.quizzes.form.quizName')} <span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                        placeholder={t('instructor.quizzes.form.quizNamePlaceholder')}
                                        value={quizName}
                                        onChange={(e) => setQuizName(e.target.value)}
                                        className="h-10 industrial-input font-medium"
                                    />
                                </div>
                                <div className="mb-0">
                                    <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-neutral-600">
                                        {t('instructor.quizzes.form.description')}
                                    </label>
                                    <Input.TextArea
                                        placeholder={t('instructor.quizzes.form.descriptionPlaceholder')}
                                        rows={4}
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="industrial-input font-medium"
                                        style={{ resize: 'none' }}
                                    />
                                </div>
                            </Col>
                            <Col span={12}>
                                <div className="mb-4">
                                    <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-neutral-600">
                                        {t('instructor.quizzes.form.passScore')}
                                    </label>
                                    <InputNumber
                                        min={1}
                                        max={10}
                                        value={passScoreCriteria}
                                        onChange={setPassScoreCriteria}
                                        className="w-full h-10 industrial-input-number pt-1 font-bold"
                                    />
                                    <p className="text-xs text-neutral-400 mt-1">{t('instructor.quizzes.form.passScoreHelp')}</p>
                                </div>
                                <div className="mb-0">
                                    <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-neutral-600">
                                        {t('instructor.quizzes.form.timeLimitLabel')}
                                    </label>
                                    <InputNumber
                                        min={1}
                                        value={timelimitMinute}
                                        onChange={setTimelimitMinute}
                                        className="w-full h-10 industrial-input-number pt-1 font-bold"
                                    />
                                    <p className="text-xs text-neutral-400 mt-1">{t('instructor.quizzes.form.timeLimitHelp')}</p>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>

                {/* 2. File Upload & Template */}
                <Row gutter={24}>
                    <Col span={12}>
                        <Card size="small" title={t('instructor.quizzes.import.uploadFile')} className="h-full industrial-card shadow-none">
                            <Upload.Dragger {...uploadProps} className="w-full bg-white group border-none" height={140} showUploadList={false}>
                                {fileList.length > 0 ? (
                                    <div className="py-4">
                                        <FileSpreadsheet className="w-10 h-10 text-green-600 mx-auto mb-2" />
                                        <p className="font-bold text-neutral-800">{fileList[0].name}</p>
                                        <p className="text-xs text-neutral-400 mt-1">{(fileList[0].size / 1024).toFixed(1)} KB</p>
                                        <Button size="small" danger className="mt-2" onClick={(e) => { e.stopPropagation(); setFileList([]); }}>Remove</Button>
                                    </div>
                                ) : (
                                    <div className="py-4">
                                        <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-yellow-100 transition-colors">
                                            <UploadIcon className="w-6 h-6 text-neutral-400 group-hover:text-yellow-600" />
                                        </div>
                                        <p className="font-bold text-neutral-800 mb-1">{t('instructor.quizzes.import.clickOrDrag')}</p>
                                        <p className="text-xs text-neutral-400">{t('instructor.quizzes.import.xlsxOnly')}</p>
                                    </div>
                                )}
                            </Upload.Dragger>
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card size="small" title={t('instructor.quizzes.import.needTemplate')} className="h-full industrial-card shadow-none">
                            <div className="flex flex-col items-center justify-center h-[140px] gap-4 bg-neutral-50 border-2 border-dashed border-neutral-200">
                                <p className="text-neutral-500 text-center text-sm px-8 font-medium">
                                    {t('instructor.quizzes.import.downloadTemplateDesc')}
                                </p>
                                <button
                                    onClick={handleDownloadTemplate}
                                    disabled={downloading}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-black font-bold uppercase text-xs hover:bg-neutral-100 active:translate-y-0.5 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none"
                                >
                                    {downloading ? <span className="animate-spin">⏳</span> : <Download className="w-4 h-4" />}
                                    {t('instructor.quizzes.import.downloadTemplate')}
                                </button>
                            </div>
                        </Card>
                    </Col>
                </Row>

                {/* 3. Instructions */}
                <div className="border-2 border-neutral-200 bg-white">
                    <Collapse
                        items={instructionItems}
                        ghost
                        size="small"
                        expandIconPosition="end"
                        className="bg-white"
                    />
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t-2 border-neutral-100">
                    <button
                        onClick={onCancel}
                        className="px-6 py-2.5 bg-white text-black font-bold uppercase text-sm border-2 border-neutral-300 hover:border-black hover:bg-neutral-50 transition-colors"
                    >
                        {t('instructor.quizzes.import.cancel')}
                    </button>
                    <button
                        onClick={handleImport}
                        disabled={fileList.length === 0 || !quizName.trim() || uploading}
                        className="px-6 py-2.5 bg-yellow-400 text-black font-black uppercase text-sm border-2 border-black hover:bg-yellow-500 active:translate-y-0.5 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {uploading && <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />}
                        {t('instructor.quizzes.import.importQuiz')}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default ImportQuizModal;
