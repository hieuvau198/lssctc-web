import React, { useState } from 'react';
import { Modal, Upload, Button, message, Alert, Input, InputNumber } from 'antd';
import { UploadOutlined, DownloadOutlined } from '@ant-design/icons';
import { FileSpreadsheet, Upload as UploadIcon, Download, Info, CheckCircle2, AlertCircle } from 'lucide-react';
import { downloadQuizTemplate, importQuizFromExcel } from '../../../../apis/Instructor/InstructorQuiz';

const { TextArea } = Input;

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
            message.error(error.message || 'Failed to download template. Please try again!');
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

        // Validate Pass Score Criteria (must be between 1 and 10)
        if (passScoreCriteria && (passScoreCriteria < 1 || passScoreCriteria > 10)) {
            message.error('Pass score must be between 1 and 10 points');
            return;
        }

        // Validate Time Limit (must be at least 1 minute)
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
            message.error(error.response?.data?.message || error.message || 'Import failed. Please check your file!');
        } finally {
            setUploading(false);
        }
    };

    const uploadProps = {
        onRemove: () => {
            setFileList([]);
        },
        beforeUpload: (file) => {
            const isExcel =
                file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
                file.name.endsWith('.xlsx');

            if (!isExcel) {
                message.error(`${file.name} is not a valid Excel file`);
                return Upload.LIST_IGNORE;
            }

            setFileList([file]);
            return false; // Prevent auto upload
        },
        fileList,
    };

    const handleCancel = () => {
        // Reset form on cancel
        setFileList([]);
        setQuizName('');
        setPassScoreCriteria(5);
        setTimelimitMinute(20);
        setDescription('');
        onCancel();
    };

    return (
        <Modal
            title={
                <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/30">
                        <FileSpreadsheet className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Import Quiz from Excel</h2>
                        <p className="text-sm text-gray-500 mt-0.5">Upload your quiz data quickly and easily</p>
                    </div>
                </div>
            }
            open={visible}
            onCancel={handleCancel}
            width={900}
            footer={null}
            className="import-quiz-modal"
            styles={{
                body: { padding: '24px' }
            }}
        >
            <div className="space-y-6">
                {/* Top Section: Two Columns with Enhanced Design */}
                <div className="grid grid-cols-2 gap-6">
                    {/* Left Column: Upload */}
                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                        <div className="relative border-2 border-dashed border-emerald-200 rounded-2xl p-8 bg-gradient-to-br from-emerald-50/50 to-teal-50/50 hover:border-emerald-400 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-100">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 rounded-lg bg-emerald-100">
                                    <UploadIcon className="w-5 h-5 text-emerald-600" />
                                </div>
                                <h3 className="text-base font-bold text-gray-800">Upload Excel File</h3>
                            </div>

                            <Upload {...uploadProps} maxCount={1}>
                                <Button
                                    icon={<UploadOutlined />}
                                    size="large"
                                    className="w-full h-12 rounded-xl font-semibold border-2 border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50 transition-all"
                                >
                                    Select Excel File (.xlsx)
                                </Button>
                            </Upload>

                            {fileList.length > 0 && (
                                <div className="mt-4 p-3 bg-white rounded-xl border border-emerald-200 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-emerald-700">File Selected</p>
                                            <p className="text-xs text-gray-600 truncate">{fileList[0].name}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Download Template */}
                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                        <div className="relative border-2 border-dashed border-blue-200 rounded-2xl p-8 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 hover:border-blue-400 transition-all duration-300 hover:shadow-lg hover:shadow-blue-100">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 rounded-lg bg-blue-100">
                                    <Download className="w-5 h-5 text-blue-600" />
                                </div>
                                <h3 className="text-base font-bold text-gray-800">Download Template</h3>
                            </div>

                            <Button
                                icon={<DownloadOutlined />}
                                onClick={handleDownloadTemplate}
                                loading={downloading}
                                size="large"
                                type="primary"
                                className="w-full h-12 rounded-xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 border-0 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all"
                            >
                                Download Template
                            </Button>

                            <div className="mt-4 p-3 bg-white/80 rounded-xl border border-blue-100">
                                <div className="flex items-start gap-2">
                                    <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                    <p className="text-xs text-gray-600 leading-relaxed">
                                        Download the template to see the required data structure and format
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quiz Metadata Form with Enhanced Design */}
                <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-2 mb-5">
                        <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full"></div>
                        <h3 className="text-lg font-bold text-gray-800">Quiz Information</h3>
                    </div>

                    <div className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Quiz Name <span className="text-red-500">*</span>
                            </label>
                            <Input
                                placeholder="e.g., Basic Safety Knowledge"
                                value={quizName}
                                onChange={(e) => setQuizName(e.target.value)}
                                size="large"
                                className="rounded-xl border-gray-300 hover:border-blue-400 focus:border-blue-500 transition-colors"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Pass Score (Points)
                                </label>
                                <InputNumber
                                    placeholder="e.g., 5"
                                    value={passScoreCriteria}
                                    onChange={setPassScoreCriteria}
                                    min={1}
                                    max={10}
                                    step={0.1}
                                    className="w-full rounded-xl"
                                    size="large"
                                />
                                <p className="text-xs text-gray-500 mt-1.5 flex items-center gap-1">
                                    <span className="w-1 h-1 rounded-full bg-gray-400"></span>
                                    Score needed to pass (1-10 points)
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Time Limit (Minutes)
                                </label>
                                <InputNumber
                                    placeholder="e.g., 20"
                                    value={timelimitMinute}
                                    onChange={setTimelimitMinute}
                                    min={1}
                                    max={180}
                                    className="w-full rounded-xl"
                                    size="large"
                                />
                                <p className="text-xs text-gray-500 mt-1.5 flex items-center gap-1">
                                    <span className="w-1 h-1 rounded-full bg-gray-400"></span>
                                    Maximum time allowed
                                </p>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Description
                            </label>
                            <TextArea
                                placeholder="Describe the purpose of this quiz"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={3}
                                className="rounded-xl border-gray-300 hover:border-blue-400 focus:border-blue-500 transition-colors"
                            />
                        </div>
                    </div>
                </div>

                {/* Instructions Section with Enhanced Design */}
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border-2 border-amber-200">
                    <div className="flex items-start gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-amber-100">
                            <Info className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-amber-900">Excel File Structure</h3>
                            <p className="text-sm text-amber-700 mt-0.5">Follow this format for successful import</p>
                        </div>
                    </div>

                    <div className="space-y-4 text-sm">
                        <div className="bg-white/60 rounded-xl p-4 border border-amber-200">
                            <p className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                Sheet "Questions": Contains question list
                            </p>
                            <ul className="space-y-1.5 ml-4 text-gray-700">
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-500 mt-1">•</span>
                                    <span><b>Column A</b>: Question name (required)</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-500 mt-1">•</span>
                                    <span><b>Column B</b>: Question description</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-500 mt-1">•</span>
                                    <span><b>Column C</b>: Question score (max 2 decimals)</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-500 mt-1">•</span>
                                    <span><b>Column D</b>: Allow multiple answers (TRUE/FALSE)</span>
                                </li>
                            </ul>
                        </div>

                        <div className="bg-white/60 rounded-xl p-4 border border-amber-200">
                            <p className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                Sheet "Options": Contains answer options
                            </p>
                            <ul className="space-y-1.5 ml-4 text-gray-700">
                                <li className="flex items-start gap-2">
                                    <span className="text-emerald-500 mt-1">•</span>
                                    <span><b>Column A</b>: Question number</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-emerald-500 mt-1">•</span>
                                    <span><b>Column B</b>: Option name (required)</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-emerald-500 mt-1">•</span>
                                    <span><b>Column C</b>: Option description</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-emerald-500 mt-1">•</span>
                                    <span><b>Column D</b>: Is correct answer (TRUE/FALSE)</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-emerald-500 mt-1">•</span>
                                    <span><b>Column E</b>: Display order</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-emerald-500 mt-1">•</span>
                                    <span><b>Column F</b>: Option score</span>
                                </li>
                            </ul>
                        </div>

                        <div className="bg-gradient-to-r from-rose-50 to-red-50 rounded-xl p-4 border-2 border-rose-200">
                            <div className="flex items-start gap-2">
                                <AlertCircle className="w-5 h-5 text-rose-600 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="font-bold text-rose-900 mb-2">Important Rules:</p>
                                    <ul className="space-y-1.5 text-rose-800">
                                        <li className="flex items-start gap-2">
                                            <span className="text-rose-500 mt-1">▸</span>
                                            <span>Total quiz score must equal <b>10 points</b></span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-rose-500 mt-1">▸</span>
                                            <span>Each question can have only <b>one correct answer</b></span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-rose-500 mt-1">▸</span>
                                            <span>Question scores can have maximum <b>2 decimal places</b></span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                    <Button
                        onClick={handleCancel}
                        size="large"
                        className="px-6 h-11 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="primary"
                        loading={uploading}
                        disabled={fileList.length === 0 || !quizName.trim()}
                        onClick={handleImport}
                        size="large"
                        className="px-8 h-11 rounded-xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 border-0 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {uploading ? 'Importing...' : 'Import Quiz'}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default ImportQuizModal;
