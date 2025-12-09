import React from 'react';
import { Modal, Descriptions } from 'antd';

export default function SubmitModal({ open, onOk, onCancel, total, answeredCount }) {
  return (
    <Modal title={'Confirm Submit'} open={open} onOk={onOk} onCancel={onCancel} okButtonProps={{ danger: true }}>
      <p>Are you sure you want to submit your exam? You cannot change your answers after submission.</p>
      <div className="mt-4 p-3 bg-slate-50 rounded">
        <div className="flex justify-between text-sm">
          <span>Total Questions:</span>
          <span className="font-semibold">{total}</span>
        </div>
        <div className="flex justify-between text-sm mt-2">
          <span>Answered:</span>
          <span className="font-semibold text-green-600">{answeredCount}</span>
        </div>
        <div className="flex justify-between text-sm mt-2">
          <span>Not answered:</span>
          <span className="font-semibold text-red-600">{total - answeredCount}</span>
        </div>
      </div>
    </Modal>
  );
}
