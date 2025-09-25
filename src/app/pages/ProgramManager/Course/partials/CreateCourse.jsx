import React from "react";
import { Modal, Form, Input, InputNumber, Select, Button } from "antd";

const { Option } = Select;

const CreateCourse = ({
  open,
  onCancel,
  onCreate,
  confirmLoading,
  categories = [],
  levels = [],
}) => {
  const [form] = Form.useForm();

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        onCreate(values);
      })
      .catch(() => {});
  };

  return (
    <Modal
      title="Add New Course"
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
          Add Course
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          name: "",
          description: "",
          categoryId: undefined,
          levelId: undefined,
          price: undefined,
          imageUrl: "",
          durationHours: undefined,
          courseCodeName: "",
        }}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please enter course name" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: "Please enter description" }]}
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
          label="Image URL"
          name="imageUrl"
          rules={[{ required: true, message: "Please enter image URL" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Duration (hours)"
          name="durationHours"
          rules={[{ required: true, message: "Please enter duration" }]}
        >
          <InputNumber min={1} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          label="Course Code"
          name="courseCodeName"
          rules={[{ required: true, message: "Please enter course code" }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateCourse;
