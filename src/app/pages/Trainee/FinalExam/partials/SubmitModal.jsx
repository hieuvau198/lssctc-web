import React from 'react';
import { Modal } from 'antd';
import { AlertCircle, CheckCircle, XCircle, Send } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function SubmitModal({ open, onOk, onCancel, total, answeredCount, confirmLoading }) {
  const { t } = useTranslation();
  const unanswered = total - answeredCount;

  return (
    <Modal
      open={open}
      onOk={onOk}
      onCancel={onCancel}
      confirmLoading={confirmLoading}
      footer={null}
      closable={!confirmLoading}
      maskClosable={!confirmLoading}
      centered
      className="modern-modal"
    >
      <div className="text-center py-4">
        {/* Icon */}
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-2xl flex items-center justify-center">
          <AlertCircle className="w-8 h-8 text-cyan-600" />
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-slate-800 mb-2">
          {t('exam.confirmSubmit', 'Xác nhận nộp bài')}
        </h3>
        <p className="text-slate-500 mb-6">
          {t('exam.confirmSubmitDesc', 'Bạn không thể thay đổi câu trả lời sau khi nộp bài.')}
        </p>

        {/* Stats */}
        <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-4 mb-6">
          <div className="flex justify-between items-center py-2 border-b border-slate-200">
            <span className="text-slate-600">{t('exam.totalQuestions', 'Tổng số câu hỏi')}</span>
            <span className="font-bold text-slate-800">{total}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-slate-200">
            <span className="flex items-center gap-2 text-slate-600">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              {t('exam.answered', 'Đã trả lời')}
            </span>
            <span className="font-bold text-emerald-600">{answeredCount}</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="flex items-center gap-2 text-slate-600">
              <XCircle className="w-4 h-4 text-red-500" />
              {t('exam.notAnswered', 'Chưa trả lời')}
            </span>
            <span className="font-bold text-red-600">{unanswered}</span>
          </div>
        </div>

        {/* Warning if unanswered */}
        {unanswered > 0 && (
          <div className="mb-6 p-3 bg-amber-50 border border-amber-200 rounded-xl text-left">
            <p className="text-amber-700 text-sm">
              <span className="font-semibold">⚠️ {t('exam.warning', 'Cảnh báo')}:</span>{' '}
              {t('exam.unansweredWarning', 'Bạn còn {{count}} câu chưa trả lời.', { count: unanswered })}
            </p>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={confirmLoading}
            className="flex-1 px-4 py-3 bg-slate-100 text-slate-600 font-semibold rounded-xl hover:bg-slate-200 transition-all duration-300 disabled:opacity-50"
          >
            {t('common.cancel', 'Hủy')}
          </button>
          <button
            onClick={onOk}
            disabled={confirmLoading}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-cyan-200 hover:shadow-xl hover:shadow-cyan-300 transition-all duration-300 disabled:opacity-50"
          >
            {confirmLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {t('common.submitting', 'Đang nộp...')}
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                {t('exam.submit', 'Nộp bài')}
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}
