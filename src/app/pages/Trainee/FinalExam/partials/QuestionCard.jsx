import React from 'react';
import { Radio, Checkbox, Space } from 'antd';
import { ChevronLeft, ChevronRight, Send, Save, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function QuestionCard({ question, value, onChange, onPrevious, onNext, isFirst, isLast, onSubmitClick, timeWarning, onSaveAnswers, saveLoading = false }) {
  const { t } = useTranslation();

  if (!question) return null;

  return (
    <div className="bg-white border-2 border-black overflow-hidden">
      {/* Yellow Top Bar */}
      <div className="h-1 bg-yellow-400" />

      <div className="p-6">
        {/* Question Header */}
        <div className="flex items-start gap-4 mb-6">
          <span className="inline-flex items-center justify-center w-12 h-12 bg-yellow-400 border-2 border-black text-black font-black text-lg flex-shrink-0">
            {question.index}
          </span>
          <div className="flex-1">
            <span className="text-lg font-bold text-black leading-relaxed">
              {question.questionText || question.name}
            </span>
            {question.description && (
              <p className="text-sm text-neutral-600 mt-2">{question.description}</p>
            )}
          </div>
        </div>

        {/* Time Warning */}
        {timeWarning && (
          <div className="flex items-center gap-3 mb-6 p-4 bg-yellow-50 border-2 border-yellow-400">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            <span className="text-yellow-800 font-bold uppercase">{t('exam.lowTimeWarning', 'Less than 5 minutes remaining!')}</span>
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
                      className={`w-full p-4 border-2 transition-all duration-200 hover:shadow-md ${isSelected
                        ? 'border-yellow-400 bg-yellow-50'
                        : 'border-neutral-300 bg-white hover:border-neutral-400'
                        }`}
                    >
                      <span className={`font-black mr-3 text-base ${isSelected ? 'text-black' : 'text-neutral-500'}`}>
                        {String.fromCharCode(65 + idx)}.
                      </span>
                      <span className="text-neutral-800">{option.text || option.name}</span>
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
                      className={`w-full p-4 border-2 transition-all duration-200 hover:shadow-md ${isSelected
                        ? 'border-yellow-400 bg-yellow-50'
                        : 'border-neutral-300 bg-white hover:border-neutral-400'
                        }`}
                    >
                      <span className={`font-black mr-3 text-base ${isSelected ? 'text-black' : 'text-neutral-500'}`}>
                        {String.fromCharCode(65 + idx)}.
                      </span>
                      <span className="text-neutral-800">{option.text || option.name}</span>
                    </Radio>
                  );
                })}
              </Space>
            </Radio.Group>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-6 border-t-2 border-neutral-200">
          <div className="flex items-center gap-3">
            <button
              onClick={onPrevious}
              disabled={isFirst}
              className={`flex items-center gap-2 px-5 py-2.5 font-bold text-sm uppercase transition-all border-2 ${isFirst
                ? 'bg-neutral-100 text-neutral-400 border-neutral-200 cursor-not-allowed'
                : 'bg-white text-black border-black hover:bg-neutral-100'
                }`}
            >
              <ChevronLeft className="w-4 h-4" />
              {t('exam.previous', 'Previous')}
            </button>
            <button
              onClick={onSaveAnswers}
              disabled={saveLoading}
              className="flex items-center gap-2 px-4 py-2.5 bg-neutral-100 border-2 border-neutral-300 text-neutral-700 font-bold text-sm uppercase hover:bg-neutral-200 transition-all"
            >
              <Save className="w-4 h-4" />
              {saveLoading ? t('common.saving', 'Saving...') : t('common.save', 'Save')}
            </button>
          </div>

          <div>
            {isLast ? (
              <button
                onClick={onSubmitClick}
                className="flex items-center gap-2 px-6 py-2.5 bg-yellow-400 text-black font-bold uppercase border-2 border-black hover:scale-[1.02] transition-all"
              >
                <Send className="w-4 h-4" />
                {t('exam.submitExam', 'Submit Exam')}
              </button>
            ) : (
              <button
                onClick={onNext}
                className="flex items-center gap-2 px-6 py-2.5 bg-yellow-400 text-black font-bold uppercase border-2 border-black hover:scale-[1.02] transition-all"
              >
                {t('exam.next', 'Next')}
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
