import React from 'react';
import { Card, Radio, Space, Alert, Button } from 'antd';
import { LeftOutlined, RightOutlined, CheckOutlined } from '@ant-design/icons';

export default function QuestionCard({ question, value, onChange, onPrevious, onNext, isFirst, isLast, onSubmitClick, timeWarning }) {
  if (!question) return null;

  return (
    <Card className="shadow-sm">
      <div className="mb-6">
        <div className="flex items-start gap-3 mb-4">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-semibold flex-shrink-0">{question.index}</span>
          <h2 className="text-lg font-medium text-slate-800 flex-1">{question.questionText}</h2>
        </div>

        {timeWarning && (
          <Alert message="Less than 5 minutes remaining!" type="warning" showIcon className="mb-4" />
        )}

        <Radio.Group value={value} onChange={(e) => onChange(question.id, e.target.value)} className="w-full">
          <Space direction="vertical" className="w-full" size="middle">
            {question.options.map((option) => (
              <Radio key={option.id} value={option.id} className="w-full p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                <span className="font-medium mr-2">{option.id.toUpperCase()}.</span>
                {option.text}
              </Radio>
            ))}
          </Space>
        </Radio.Group>
      </div>

      <div className="flex items-center justify-between pt-4 border-t">
        <Button size="large" icon={<LeftOutlined />} onClick={onPrevious} disabled={isFirst}>{'Previous'}</Button>

        {isLast ? (
          <Button type="primary" size="large" icon={<CheckOutlined />} onClick={onSubmitClick}>{'Submit Exam'}</Button>
        ) : (
          <Button type="primary" size="large" icon={<RightOutlined />} onClick={onNext}>{'Next'}</Button>
        )}
      </div>
    </Card>
  );
}
