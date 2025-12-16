import React, { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [localCategories, setLocalCategories] = useState(categories || []);
  const [localLevels, setLocalLevels] = useState(levels || []);
  const [catsLoading, setCatsLoading] = useState(false);
  const [lvlsLoading, setLvlsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [bgImagePreview, setBgImagePreview] = useState(""); // Added state

  useEffect(() => {
    if (course && localCategories.length > 0 && localLevels.length > 0) {
      // Map category and level names to IDs
      const categoryId = course.categoryId || localCategories.find(c => c.label === course.category)?.value;
      const levelId = course.levelId || localLevels.find(l => l.label === course.level)?.value;

      form.setFieldsValue({
        name: course.name,
        description: course.description,
        categoryId: categoryId,
        levelId: levelId,
        price: course.price,
        isActive: course.isActive,
        imageUrl: course.imageUrl,
        durationHours: course.durationHours,
        courseCodeName: course.courseCodeName,
        backgroundImageUrl: course.backgroundImageUrl, // Map new field
      });
      // initialize preview when editing existing course
      setImagePreview(course.imageUrl || "");
      setBgImagePreview(course.backgroundImageUrl || ""); // Init preview
    }
  }, [course, form, localCategories, localLevels]);

  // ... (Load Categories/Levels useEffect - same as original)
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
      {/* ... (Name field logic remains same) */}
      {!embedded && (
        <Form.Item
          label={t('admin.courses.form.name')}
          name="name"
          rules={[{ required: true }]}
        >
           <Input showCount placeholder={t('admin.courses.form.namePlaceholder')} />
        </Form.Item>
      )}

      {/* Category and Level */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
        <Form.Item label={t('common.category')} name="categoryId" rules={[{ required: true }]}>
            <Select loading={catsLoading}>
            {localCategories.map((cat) => <Option key={cat.value} value={cat.value}>{cat.label}</Option>)}
            </Select>
        </Form.Item>
        <Form.Item label={t('common.level')} name="levelId" rules={[{ required: true }]}>
            <Select loading={lvlsLoading}>
            {localLevels.map((lvl) => <Option key={lvl.value} value={lvl.value}>{lvl.label}</Option>)}
            </Select>
        </Form.Item>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
        <Form.Item label={t('common.price')} name="price" rules={[{ required: true, type: 'number' }]}>
            <InputNumber step={0.01} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item label={t('admin.courses.form.durationHours')} name="durationHours" rules={[{ required: true, type: 'integer' }]}>
            <InputNumber style={{ width: "100%" }} />
        </Form.Item>
      </div>

      {/* Images Section: Main & Background */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-4 mt-2">
        {/* Main Image */}
        <div>
            <Form.Item
                label={t('admin.courses.form.imageUrl')}
                name="imageUrl"
                rules={[{ required: true, type: 'url' }]}
            >
                <Input onChange={(e) => {
                    const val = e.target.value;
                    form.setFieldsValue({ imageUrl: val });
                    setImagePreview(val);
                }} />
            </Form.Item>
            <div className="w-full h-32 flex items-center justify-center border rounded-md overflow-hidden bg-gray-50 mb-4">
            {imagePreview ? <Image src={imagePreview} height={128} /> : <span>No Preview</span>}
            </div>
        </div>

        {/* Background Image */}
        <div>
            <Form.Item
                label="Background Image URL"
                name="backgroundImageUrl"
                rules={[{ type: 'url' }]}
            >
                <Input onChange={(e) => {
                    const val = e.target.value;
                    form.setFieldsValue({ backgroundImageUrl: val });
                    setBgImagePreview(val);
                }} />
            </Form.Item>
            <div className="w-full h-32 flex items-center justify-center border rounded-md overflow-hidden bg-gray-50 mb-4">
            {bgImagePreview ? 
                <Image src={bgImagePreview} className="object-cover w-full h-full" /> : 
                <span className="text-gray-400 text-xs">No Background Preview</span>}
            </div>
        </div>
      </div>

      <Form.Item label={t('common.status')} name="isActive" valuePropName="checked">
        <Switch checkedChildren={t('common.active')} unCheckedChildren={t('common.inactive')} />
      </Form.Item>

      <Form.Item
        label={t('common.description')}
        name="description"
        rules={[{ required: true, max: 1000 }]}
      >
        <Input.TextArea rows={3} showCount />
      </Form.Item>
      
      {embedded && (
        <div className="md:col-span-2 mt-4 flex justify-end gap-3">
          <Button onClick={onCancel} disabled={confirmLoading}>{t('common.cancel')}</Button>
          <Button type="primary" loading={confirmLoading} onClick={handleOk} disabled={confirmLoading}>{t('common.save')}</Button>
        </div>
      )}
    </Form>
  );

  if (embedded) return formContent;

  return (
    <Modal
      title={t('admin.courses.editCourse')}
      open={open}
      onCancel={onCancel}
      onOk={handleOk}
      confirmLoading={confirmLoading}
      destroyOnClose
      width={800} // Wider modal
      footer={[
        <Button key="back" onClick={onCancel} disabled={confirmLoading}>{t('common.cancel')}</Button>,
        <Button key="submit" type="primary" loading={confirmLoading} onClick={handleOk} disabled={confirmLoading}>{t('admin.courses.updateCourse')}</Button>,
      ]}
    >
      {formContent}
    </Modal>
  );
};

export default EditCourse;