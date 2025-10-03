import React, { useState } from "react";
import {
  Modal,
  Form,
  Input,
  InputNumber,
  DatePicker,
  Button,
  Alert,
  Popconfirm,
  Space,
} from "antd";
import dayjs from "dayjs";
import {
  updateClass,
  deleteClass,
} from "../../../../apis/ProgramManager/ClassApi";

/**
 * @param {Object} props
 * @param {boolean} props.open
 * @param {Function} props.onClose
 * @param {Function} props.onCancel
 * @param {Function} props.onUpdate
 * @param {boolean} props.confirmLoading
 * @param {boolean} props.embedded
 * @param {Object} props.classItem
 * @param {Function} props.onUpdated
 * @param {Function} props.onDeleted
 */
const EditDeleteClassForm = ({
  open,
  onClose,
  onCancel,
  onUpdate,
  confirmLoading,
  embedded = false,
  classItem,
  onUpdated,
  onDeleted,
}) => {
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const handleFinish = async (values) => {
    if (embedded && onUpdate) {
      // Use the parent's handler
      onUpdate(values);
      return;
    }

    // Original modal logic
    setSaving(true);
    setError(null);
    try {
      await updateClass(classItem.id, {
        name: values.name,
        startDate: values.startDate.toISOString(),
        endDate: values.endDate.toISOString(),
        capacity: values.capacity,
        description: values.description,
        classCode: values.classCode,
      });
      onUpdated?.();
      onClose();
    } catch (err) {
      setError(
        err?.response?.data?.message || err?.message || "Failed to update class"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    setDeleteError(null);
    try {
      await deleteClass(classItem.id);
      onDeleted?.();
      onClose();
    } catch (err) {
      setDeleteError(
        err?.response?.data?.message || err?.message || "Failed to delete class"
      );
    } finally {
      setDeleting(false);
    }
  };

  const formContent = (
    <>
      {error && (
        <Alert type="error" message={error} showIcon className="mb-2" />
      )}
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{
          name: classItem?.name,
          startDate: classItem?.startDate ? dayjs(classItem.startDate) : null,
          endDate: classItem?.endDate ? dayjs(classItem.endDate) : null,
          capacity: classItem?.capacity,
          description: classItem?.description,
          classCode: classItem?.classCode?.name || classItem?.classCode || "",
        }}
      >
        <Form.Item
          label="Class Name"
          name="name"
          rules={[{ required: true, message: "Please enter class name" }]}
        >
          <Input placeholder="Class name" />
        </Form.Item>
        <Form.Item
          label="Start Date"
          name="startDate"
          rules={[{ required: true, message: "Please select start date" }]}
        >
          <DatePicker className="w-full" />
        </Form.Item>
        <Form.Item
          label="End Date"
          name="endDate"
          rules={[{ required: true, message: "Please select end date" }]}
        >
          <DatePicker className="w-full" />
        </Form.Item>
        <Form.Item
          label="Capacity"
          name="capacity"
          rules={[
            {
              required: true,
              type: "number",
              min: 1,
              message: "Capacity must be at least 1",
            },
          ]}
        >
          <InputNumber min={1} className="w-full" />
        </Form.Item>
        <Form.Item
          label="Class Code"
          name="classCode"
          rules={[{ required: true, message: "Please enter class code" }]}
        >
          <Input placeholder="Class code" />
        </Form.Item>
        <Form.Item label="Description" name="description">
          <Input.TextArea rows={2} placeholder="Description" />
        </Form.Item>
        <Form.Item>
          <Space>
            <Button onClick={onCancel || onClose}>Cancel</Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={embedded ? confirmLoading : saving}
            >
              Update Class
            </Button>
          </Space>
        </Form.Item>
      </Form>
      {!embedded && (
        <div className="mt-4">
          {deleteError && (
            <Alert type="error" message={deleteError} showIcon className="mb-2" />
          )}
          <Popconfirm
            title="Are you sure to delete this class?"
            onConfirm={handleDelete}
            okText="Yes"
            cancelText="No"
          >
            <Button danger loading={deleting} block>
              Delete Class
            </Button>
          </Popconfirm>
        </div>
      )}
    </>
  );

  if (embedded) {
    return formContent;
  }

  return (
    <Modal
      open={open}
      title="Edit Class"
      onCancel={onClose}
      footer={null}
      destroyOnClose
    >
      {formContent}
    </Modal>
  );
};

export default EditDeleteClassForm;
