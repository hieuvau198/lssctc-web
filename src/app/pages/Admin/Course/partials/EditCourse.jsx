import React, { useEffect, useState } from "react";
import { Modal, Form, Input, InputNumber, Select, Switch, Button, Image } from "antd";
import { fetchCourseCategories, fetchCourseLevels } from "../../../../apis/ProgramManager/CourseApi";

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
  const [localCategories, setLocalCategories] = useState(categories || []);
  const [localLevels, setLocalLevels] = useState(levels || []);
  const [catsLoading, setCatsLoading] = useState(false);
  const [lvlsLoading, setLvlsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState("");

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
      // initialize preview when editing existing course
      setImagePreview(course.imageUrl || "");
    }
  }, [course, form]);

  useEffect(() => {
    let mounted = true;

    async function loadCategories() {
      setCatsLoading(true);
      try {
        const data = await fetchCourseCategories();
        if (!mounted) return;
        const mapped = data.map((c) => ({ value: c.id, label: c.name }));
        setLocalCategories(mapped);
      } catch (err) {
        console.error('Failed to load categories', err);
      } finally {
        if (mounted) setCatsLoading(false);
      }
    }

    async function loadLevels() {
      setLvlsLoading(true);
      try {
        const data = await fetchCourseLevels();
        if (!mounted) return;
        const mapped = data.map((l) => ({ value: l.id, label: l.name }));
        setLocalLevels(mapped);
      } catch (err) {
        console.error('Failed to load levels', err);
      } finally {
        if (mounted) setLvlsLoading(false);
      }
    }

    loadCategories();
    loadLevels();

    return () => {
      mounted = false;
    };
  }, []);

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        onUpdate(values);
      })
      .catch(() => { });
  };

  const formContent = (
    <Form
      form={form}
      layout="vertical"
      className={
        embedded ? "grid grid-cols-1 md:grid-cols-2 gap-x-6" : undefined
      }
      disabled={confirmLoading}
    >
      {embedded && (
        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please enter course name" }]}
          >
            <Input 
              maxLength={50}
              showCount
              placeholder="Enter course name"
            />
          </Form.Item>
        </div>
      )}
      {!embedded && (
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please enter course name" }]}
        >
          <Input 
            maxLength={50}
            showCount
            placeholder="Enter course name"
          />
        </Form.Item>
      )}

      <Form.Item
        label="Category"
        name="categoryId"
        rules={[{ required: true, message: "Please select category" }]}
      >
        <Select
          placeholder="Select category"
          showSearch
          allowClear
          loading={catsLoading}
          notFoundContent="No categories"
          optionFilterProp="children"
          filterOption={(input, option) => (option?.children || '').toLowerCase().includes(input.toLowerCase())}
        >
          {localCategories.map((cat) => (
            <Option key={cat.value} value={cat.value}>
              {cat.label}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        label="Level"
        name="levelId"
        rules={[{ required: true, message: "Please select level" }]}
      >
        <Select
          placeholder="Select level"
          showSearch
          allowClear
          loading={lvlsLoading}
          notFoundContent="No levels"
          optionFilterProp="children"
          filterOption={(input, option) => (option?.children || '').toLowerCase().includes(input.toLowerCase())}
        >
          {localLevels.map((lvl) => (
            <Option key={lvl.value} value={lvl.value}>
              {lvl.label}
            </Option>
          ))}
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
        <Input
          onChange={(e) => {
            const val = e.target.value;
            form.setFieldsValue({ imageUrl: val });
            setImagePreview(val);
          }}
        />
      </Form.Item>
      <Form.Item label="Preview">
        <div className="w-36 h-36 flex items-center justify-center border rounded-md overflow-hidden bg-gray-50">
          {imagePreview ? (
            <Image
              src={imagePreview}
              alt="Preview"
              fallback="data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='128' height='96' viewBox='0 0 128 96'%3E%3Crect width='128' height='96' fill='%23f3f4f6'/%3E%3Ctext x='50%' y='50%' fill='%239ca3af' font-size='12' font-family='Arial' dominant-baseline='middle' text-anchor='middle'%3ENo preview%3C/text%3E%3C/svg%3E"
            />
          ) : (
            <div className="text-sm text-gray-500 px-2 text-center">Preview</div>
          )}
        </div>
      </Form.Item>
      <Form.Item label="Status" name="isActive" valuePropName="checked">
        <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
      </Form.Item>
      <Form.Item
        label="Description"
        name="description"
        rules={[{ required: true, message: "Please enter description" }]}
        className={embedded ? "md:col-span-2" : undefined}
      >
        <Input.TextArea rows={3} maxLength={500} showCount placeholder="Enter course description" />
      </Form.Item>
      {embedded && (
        <div className="md:col-span-2 mt-4 flex justify-end gap-3">
          <Button onClick={onCancel} disabled={confirmLoading}>Cancel</Button>
          <Button type="primary" loading={confirmLoading} onClick={handleOk} disabled={confirmLoading}>Save</Button>
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
        <Button key="back" onClick={onCancel} disabled={confirmLoading}>Cancel</Button>,
        <Button key="submit" type="primary" loading={confirmLoading} onClick={handleOk} disabled={confirmLoading}>Update Course</Button>,
      ]}
    >
      {formContent}
    </Modal>
  );
};

export default EditCourse;
