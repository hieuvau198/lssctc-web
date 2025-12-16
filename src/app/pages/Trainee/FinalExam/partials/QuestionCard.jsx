import React from 'react';
import { Radio, Checkbox, Space } from 'antd';
import { ChevronLeft, ChevronRight, Send, Save, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function QuestionCard({ question, value, onChange, onPrevious, onNext, isFirst, isLast, onSubmitClick, timeWarning, onSaveAnswers, saveLoading = false }) {
  const { t } = useTranslation();

  if (!question) return null;

  return (
    <div className="bg-white/90 backdrop-blur-sm border border-slate-200/60 rounded-2xl overflow-hidden shadow-lg shadow-slate-200/50">
      {/* Gradient Top Bar */}
      <div className="h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-500" />

      <div className="p-6">
        {/* Question Header */}
        <div className="flex items-start gap-4 mb-6">
          <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white font-bold text-lg shadow-lg shadow-cyan-200 flex-shrink-0">
            {question.index}
          </span>
          <div className="flex-1">
            <span className="text-lg font-semibold text-slate-800 leading-relaxed">
              {question.questionText || question.name}
            </span>
            {question.description && (
              <p className="text-sm text-slate-500 mt-2">{question.description}</p>
            )}
          </div>
        </div>

        {/* Time Warning */}
        {timeWarning && (
          <div className="flex items-center gap-3 mb-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <span className="text-amber-700 font-medium">{t('exam.lowTimeWarning', 'Còn dưới 5 phút!')}</span>
          </div>
        )}

        {/* Answer Options */}
        <div className="mb-8">
          {question.isMultipleAnswers ? (
            <Checkbox.Group
              value={value || []}
              onChange={(checkedValues) => onChange(question.id, checkedValues)}
              className="w-full"
            >
              <Space direction="vertical" className="w-full" size="middle">
                {question.options.map((option, idx) => {
                  const isSelected = Array.isArray(value) && value.includes(option.id);
                  return (
                    <Checkbox
                      key={option.id}
                      value={option.id}
                      className={`w-full p-4 rounded-xl border-2 transition-all duration-300 hover:shadow-md ${isSelected
                          ? 'border-cyan-400 bg-gradient-to-r from-cyan-50 to-blue-50 shadow-md'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                    >
                      <span className={`font-bold mr-3 text-base ${isSelected ? 'text-cyan-600' : 'text-slate-500'}`}>
                        {String.fromCharCode(65 + idx)}.
                      </span>
                      <span className="text-slate-700">{option.text || option.name}</span>
                    </Checkbox>
                  );
                })}
              </Space>
            </Checkbox.Group>
          ) : (
            <Radio.Group value={value} onChange={(e) => onChange(question.id, e.target.value)} className="w-full">
              <Space direction="vertical" className="w-full" size="middle">
                {question.options.map((option, idx) => {
                  const isSelected = value === option.id;
                  return (
                    <Radio
                      key={option.id}
                      value={option.id}
                      className={`w-full p-4 rounded-xl border-2 transition-all duration-300 hover:shadow-md ${isSelected
                          ? 'border-cyan-400 bg-gradient-to-r from-cyan-50 to-blue-50 shadow-md'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                    >
                      <span className={`font-bold mr-3 text-base ${isSelected ? 'text-cyan-600' : 'text-slate-500'}`}>
                        {String.fromCharCode(65 + idx)}.
                      </span>
                      <span className="text-slate-700">{option.text || option.name}</span>
                    </Radio>
                  );
                })}
              </Space>
            </Radio.Group>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-100">
          <div className="flex items-center gap-3">
            <button
              onClick={onPrevious}
              disabled={isFirst}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${isFirst
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:shadow-md'
                }`}
            >
              <ChevronLeft className="w-4 h-4" />
              {t('exam.previous', 'Câu trước')}
            </button>
            <button
              onClick={onSaveAnswers}
              disabled={saveLoading}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200 text-slate-600 rounded-xl font-medium text-sm hover:shadow-md transition-all duration-300"
            >
              <Save className="w-4 h-4" />
              {saveLoading ? t('common.saving', 'Đang lưu...') : t('common.save', 'Lưu')}
            </button>
          </div>

          <div>
            {isLast ? (
              <button
                onClick={onSubmitClick}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-200 hover:shadow-xl hover:shadow-emerald-300 transition-all duration-300 hover:scale-105"
              >
                <Send className="w-4 h-4" />
                {t('exam.submitExam', 'Nộp bài')}
              </button>
            ) : (
              <button
                onClick={onNext}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-cyan-200 hover:shadow-xl hover:shadow-cyan-300 transition-all duration-300 hover:scale-105"
              >
                {t('exam.next', 'Câu tiếp theo')}
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
