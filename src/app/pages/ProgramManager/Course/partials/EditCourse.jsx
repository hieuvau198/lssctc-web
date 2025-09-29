// src\app\pages\ProgramManager\Course\partials\EditCourse.jsx

import React, { useEffect } from "react";
import { Modal, Form, Input, InputNumber, Select, Switch, Button } from "antd";

const { Option } = Select;

const EditCourse = ({
  open,
  onCancel,
  onUpdate,
  confirmLoading,
  course,
  categories = [],
  levels = [],
  embedded = false,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (course) {
      form.setFieldsValue({
        name: course.name,
        description: course.description,
        categoryId: course.categoryId,
        levelId: course.levelId,
        price: course.price,
        isActive: course.isActive,
        imageUrl: course.imageUrl,
        durationHours: course.durationHours,
        courseCodeName: course.courseCodeName,
      });
    }
  }, [course, form]);

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        onUpdate(values);
      })
      .catch(() => {});
  };

  const formContent = (
    <Form
      form={form}
      layout="vertical"
      className={
        embedded ? "grid grid-cols-1 md:grid-cols-2 gap-x-6" : undefined
      }
    >
      {embedded && (
        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please enter course name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Course Code"
            name="courseCodeName"
            rules={[{ required: true, message: "Please enter course code" }]}
          >
            <Input />
          </Form.Item>
        </div>
      )}
      {!embedded && (
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please enter course name" }]}
        >
          <Input />
        </Form.Item>
      )}
      {!embedded && (
        <Form.Item
          label="Course Code"
          name="courseCodeName"
          rules={[{ required: true, message: "Please enter course code" }]}
        >
          <Input />
        </Form.Item>
      )}
      <Form.Item
        label="Description"
        name="description"
        rules={[{ required: true, message: "Please enter description" }]}
        className={embedded ? "md:col-span-2" : undefined}
      >
        <Input.TextArea rows={3} />
      </Form.Item>
      <Form.Item
        label="Category"
        name="categoryId"
        rules={[{ required: true, message: "Please select category" }]}
      >
        <Select placeholder="Select category">
          {categories.length > 0 ? (
            categories.map((cat) => (
              <Option key={cat.value} value={cat.value}>
                {cat.label}
              </Option>
            ))
          ) : (
            <Option value={1}>Safety & Regulations</Option>
          )}
        </Select>
      </Form.Item>
      <Form.Item
        label="Level"
        name="levelId"
        rules={[{ required: true, message: "Please select level" }]}
      >
        <Select placeholder="Select level">
          {levels.length > 0 ? (
            levels.map((lvl) => (
              <Option key={lvl.value} value={lvl.value}>
                {lvl.label}
              </Option>
            ))
          ) : (
            <Option value={1}>Entry</Option>
          )}
        </Select>
      </Form.Item>
      <Form.Item
        label="Price"
        name="price"
        rules={[{ required: true, message: "Please enter price" }]}
      >
        <InputNumber min={0} style={{ width: "100%" }} />
      </Form.Item>
      <Form.Item
        label="Duration (hours)"
        name="durationHours"
        rules={[{ required: true, message: "Please enter duration" }]}
      >
        <InputNumber min={1} style={{ width: "100%" }} />
      </Form.Item>
      <Form.Item
        label="Image URL"
        name="imageUrl"
        rules={[{ required: true, message: "Please enter image URL" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item label="Active" name="isActive" valuePropName="checked">
        <Switch />
      </Form.Item>
      {embedded && (
        <div className="md:col-span-2 mt-4 flex justify-end gap-3">
          <Button onClick={onCancel}>Cancel</Button>
          <Button type="primary" loading={confirmLoading} onClick={handleOk}>
            Save
          </Button>
        </div>
      )}
    </Form>
  );

  if (embedded) return formContent;

  return (
    <Modal
      title="Edit Course"
      open={open}
      onCancel={onCancel}
      onOk={handleOk}
      confirmLoading={confirmLoading}
      destroyOnClose
      footer={[
        <Button key="back" onClick={onCancel}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={confirmLoading}
          onClick={handleOk}
        >
          Update Course
        </Button>,
      ]}
    >
      {formContent}
    </Modal>
  );
};

export default EditCourse;
