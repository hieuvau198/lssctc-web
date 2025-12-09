import React from 'react';
import { Card, Radio, Checkbox, Space, Alert, Button } from 'antd';
import { LeftOutlined, RightOutlined, CheckOutlined } from '@ant-design/icons';

export default function QuestionCard({ question, value, onChange, onPrevious, onNext, isFirst, isLast, onSubmitClick, timeWarning, onSaveAnswers, saveLoading = false }) {
  if (!question) return null;

  return (
    <Card className="shadow-lg border-blue-100 bg-white/80 backdrop-blur-sm">
      <div className="mb-8">
        <div className="flex items-start gap-4 mb-6">
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white font-bold text-lg shadow-lg flex-shrink-0">{question.index}</span>
          <span className="text-xl font-semibold text-slate-800 flex-1 leading-relaxed">{question.questionText || question.name}</span>
        </div>

        {timeWarning && (
          <Alert message="Còn dưới 5 phút!" type="warning" showIcon className="mb-6 border-l-4 border-orange-400" />
        )}

        {question.isMultipleAnswers ? (
          <Checkbox.Group
            value={value || []}
            onChange={(checkedValues) => onChange(question.id, checkedValues)}
            className="w-full"
          >
            <Space direction="vertical" className="w-full" size="large">
              {question.options.map((option, idx) => (
                <Checkbox
                  key={option.id}
                  value={option.id}
                  className="w-full p-5 shadow-sm hover:shadow-md rounded-lg border border-slate-100"
                >
                  <span className="font-bold text-blue-600 mr-3 text-base">{String.fromCharCode(65 + idx)}.</span>
                  <span className="text-slate-700">{option.text || option.name}</span>
                </Checkbox>
              ))}
            </Space>
          </Checkbox.Group>
        ) : (
          <Radio.Group value={value} onChange={(e) => onChange(question.id, e.target.value)} className="w-full">
            <Space direction="vertical" className="w-full" size="large">
              {question.options.map((option, idx) => (
                <Radio
                  key={option.id}
                  value={option.id}
                  className="w-full p-5 shadow-sm hover:shadow-md rounded-lg border border-slate-100"
                  size="large"
                >
                  <span className="font-bold text-blue-600 mr-3 text-base">{String.fromCharCode(65 + idx)}.</span>
                  <span className="text-slate-700">{option.text || option.name}</span>
                </Radio>
              ))}
            </Space>
          </Radio.Group>
        )}
      </div>

      <div className="flex items-center justify-between pt-6 border-t-2 border-blue-100">
        <div className="flex items-center gap-3">
          <Button
            size="large"
            icon={<LeftOutlined />}
            onClick={onPrevious}
            disabled={isFirst}
            className="font-semibold shadow-sm hover:shadow-md"
          >
            Câu trước
          </Button>
          <Button size="large" onClick={onSaveAnswers} loading={saveLoading} disabled={saveLoading} className="font-medium shadow-sm">
            {saveLoading ? 'Đang lưu...' : 'Lưu'}
          </Button>
        </div>

        <div>
          {isLast ? (
            <Button
              type="primary"
              size="large"
              icon={<CheckOutlined />}
              onClick={onSubmitClick}
              className="font-semibold shadow-lg shadow-blue-200 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 border-0"
            >
              Nộp bài
            </Button>
          ) : (
            <Button
              type="primary"
              size="large"
              icon={<RightOutlined />}
              onClick={onNext}
              className="font-semibold shadow-lg shadow-blue-200"
            >
              Câu tiếp theo
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
