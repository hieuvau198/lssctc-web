import React, { useState, useEffect, useCallback } from 'react';
import { Table, Modal, Form, InputNumber, App, DatePicker, Input } from 'antd';
import { useTranslation } from 'react-i18next';
import { Edit3, Plus, MinusCircle, ClipboardList } from 'lucide-react';
import dayjs from 'dayjs';
import FinalExamApi from '../../../../../apis/FinalExam/FinalExamApi';
import PartialApi from '../../../../../apis/FinalExam/PartialApi';
import DayTimeFormat from '../../../../../components/DayTimeFormat/DayTimeFormat';

export default function AdminPEConfig({ classId, readOnly }) {
  const { t } = useTranslation();
  const { message } = App.useApp();
  const [loading, setLoading] = useState(false);
  const [configs, setConfigs] = useState([]);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState(null);
  const [form] = Form.useForm();

  const fetchConfig = useCallback(async () => {
    setLoading(true);
    try {
      const response = await FinalExamApi.getClassExamConfig(classId);
      const peConfigs = response.partialConfigs?.filter(c => c.type === 'Practical') || [];
      setConfigs(peConfigs);
    } catch (error) {
      message.error('Failed to load PE config');
    } finally {
      setLoading(false);
    }
  }, [classId, message]);

  useEffect(() => { if (classId) fetchConfig(); }, [classId, fetchConfig]);

  const handleEdit = (record) => {
    setSelectedConfig(record);
    form.setFieldsValue({
      ...record,
      timeRange: [record.startTime ? dayjs(record.startTime) : null, record.endTime ? dayjs(record.endTime) : null],
      checklistConfig: record.checklist || []
    });
    setCreateModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedConfig(null);
    form.resetFields();
    setCreateModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        classId: parseInt(classId),
        type: 'Practical',
        examWeight: values.examWeight,
        duration: values.duration,
        startTime: values.timeRange?.[0]?.format('YYYY-MM-DDTHH:mm:ss'),
        endTime: values.timeRange?.[1]?.format('YYYY-MM-DDTHH:mm:ss'),
        checklistConfig: values.checklistConfig
      };

      if (selectedConfig) await PartialApi.updateClassPartialConfig(payload);
      else await PartialApi.createClassPartial(payload);

      message.success(t('admin.finalExam.saveSuccess', 'Saved successfully'));
      setCreateModalOpen(false);
      fetchConfig();
    } catch (err) {
      message.error(t('admin.finalExam.saveFailed', 'Save failed'));
    }
  };

  const columns = [
    {
      title: <span className="uppercase font-black text-xs">{t('admin.finalExam.examName', 'Exam Content')}</span>,
      key: 'name',
      render: (_, record) => (
        <div className="font-bold text-black uppercase flex items-center gap-2">
          <ClipboardList className="w-4 h-4" />
          {t('admin.finalExam.practicalWith', 'Practical Checklist')} ({record.checklist?.length || 0} items)
        </div>
      ),
    },
    {
      title: <span className="uppercase font-black text-xs">{t('admin.finalExam.duration', 'Duration')}</span>,
      dataIndex: 'duration',
      align: 'center',
      render: (val) => <span className="font-bold">{val} min</span>,
    },
    {
      title: <span className="uppercase font-black text-xs">{t('admin.finalExam.weight', 'Weight')}</span>,
      dataIndex: 'examWeight',
      align: 'center',
      render: (val) => <span className="font-bold">{val}%</span>,
    },
    {
      title: <span className="uppercase font-black text-xs">{t('admin.finalExam.time', 'Time Range')}</span>,
      dataIndex: 'startTime',
      render: (val) => val ? <span className="text-neutral-600 font-mono text-xs"><DayTimeFormat value={val} showTime /></span> : '-',
    },
    {
      title: <span className="uppercase font-black text-xs">{t('common.action')}</span>,
      key: 'actions',
      width: 80,
      render: (_, record) => (
        <button
          onClick={() => handleEdit(record)}
          disabled={readOnly}
          className="w-8 h-8 border-2 border-black bg-white hover:bg-yellow-400 text-black flex items-center justify-center transition-all disabled:opacity-50"
        >
          <Edit3 className="w-4 h-4" />
        </button>
      ),
    },
  ];

  return (
    <div>
      {configs.length === 0 && !readOnly && (
        <div className="mb-4 flex justify-end">
          <button onClick={handleCreate} className="h-9 px-4 flex items-center gap-2 bg-yellow-400 text-black font-bold uppercase text-xs border-2 border-black hover:bg-yellow-500 transition-all">
            <Plus className="w-4 h-4" /> {t('admin.finalExam.createConfig', 'Create Config')}
          </button>
        </div>
      )}
      <Table
        columns={columns}
        dataSource={configs}
        rowKey="type"
        loading={loading}
        pagination={false}
        className="border-2 border-neutral-200 [&_.ant-table-thead>tr>th]:bg-neutral-100 [&_.ant-table-thead>tr>th]:uppercase [&_.ant-table-thead>tr>th]:font-black [&_.ant-table-thead>tr>th]:text-xs"
      />

      <Modal
        title={<span className="font-black uppercase">{t('admin.finalExam.peConfig', 'Practical Exam Configuration')}</span>}
        open={createModalOpen}
        onCancel={() => setCreateModalOpen(false)}
        onOk={handleSave}
        width={700}
        okButtonProps={{ className: 'bg-black text-white font-bold uppercase' }}
      >
        <Form form={form} layout="vertical" className="pt-4">
          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="duration" label="Duration (min)" rules={[{ required: true }]}>
              <InputNumber min={1} className="w-full" />
            </Form.Item>
            <Form.Item name="examWeight" label="Weight (%)" rules={[{ required: true }]}>
              <InputNumber min={0} max={100} className="w-full" />
            </Form.Item>
          </div>
          <Form.Item name="timeRange" label="Time Range" rules={[{ required: true }]}>
            <DatePicker.RangePicker showTime format="DD-MM-YYYY HH:mm" className="w-full" />
          </Form.Item>

          <div className="mt-6 mb-4 font-bold uppercase text-xs tracking-wider text-neutral-500 border-b border-neutral-200 pb-2">
            Checklist Items
          </div>

          <Form.List name="checklistConfig">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <div key={key} className="flex gap-3 items-start mb-3">
                    <Form.Item {...restField} name={[name, 'name']} rules={[{ required: true }]} className="flex-1 mb-0">
                      <Input placeholder="Criteria Name" />
                    </Form.Item>
                    <Form.Item {...restField} name={[name, 'description']} className="flex-1 mb-0">
                      <Input placeholder="Description" />
                    </Form.Item>
                    <button type="button" onClick={() => remove(name)} className="w-8 h-8 flex items-center justify-center text-red-500 border border-red-200 hover:bg-red-50">
                      <MinusCircle className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <Form.Item>
                  <button type="button" onClick={() => add()} className="w-full py-2 border border-dashed border-neutral-400 text-neutral-500 hover:text-black hover:border-black font-bold text-xs uppercase">
                    + Add Criteria
                  </button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form>
      </Modal>
    </div>
  );
}