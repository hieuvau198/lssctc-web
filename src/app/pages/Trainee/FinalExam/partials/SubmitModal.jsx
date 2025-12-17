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
        <div className="w-16 h-16 mx-auto mb-4 bg-yellow-400 border-2 border-black flex items-center justify-center">
          <AlertCircle className="w-8 h-8 text-black" />
        </div>

        {/* Title */}
        <h3 className="text-xl font-black text-black uppercase mb-2">
          {t('exam.confirmSubmit', 'Confirm Submission')}
        </h3>
        <p className="text-neutral-600 mb-6">
          {t('exam.confirmSubmitDesc', 'You cannot change your answers after submission.')}
        </p>

        {/* Stats */}
        <div className="bg-neutral-50 border-2 border-black p-4 mb-6">
          <div className="flex justify-between items-center py-2 border-b-2 border-neutral-200">
            <span className="text-neutral-700 font-bold uppercase text-sm">{t('exam.totalQuestions', 'Total Questions')}</span>
            <span className="font-black text-black">{total}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b-2 border-neutral-200">
            <span className="flex items-center gap-2 text-neutral-700 font-bold uppercase text-sm">
              <CheckCircle className="w-4 h-4 text-black" />
              {t('exam.answered', 'Answered')}
            </span>
            <span className="font-black text-black">{answeredCount}</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="flex items-center gap-2 text-neutral-700 font-bold uppercase text-sm">
              <XCircle className="w-4 h-4 text-red-600" />
              {t('exam.notAnswered', 'Not Answered')}
            </span>
            <span className="font-black text-red-600">{unanswered}</span>
          </div>
        </div>

        {/* Warning if unanswered */}
        {unanswered > 0 && (
          <div className="mb-6 p-3 bg-yellow-50 border-2 border-yellow-400 text-left">
            <p className="text-yellow-800 text-sm">
              <span className="font-black uppercase">⚠️ {t('exam.warning', 'Warning')}:</span>{' '}
              {t('exam.unansweredWarning', 'You have {{count}} unanswered questions.', { count: unanswered })}
            </p>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={confirmLoading}
            className="flex-1 px-4 py-3 bg-white text-black font-bold uppercase border-2 border-black hover:bg-neutral-100 transition-all disabled:opacity-50"
          >
            {t('common.cancel', 'Cancel')}
          </button>
          <button
            onClick={onOk}
            disabled={confirmLoading}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-yellow-400 text-black font-bold uppercase border-2 border-black hover:scale-[1.02] transition-all disabled:opacity-50"
          >
            {confirmLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-black/30 border-t-black animate-spin" />
                {t('common.submitting', 'Submitting...')}
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                {t('exam.submit', 'Submit')}
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}
