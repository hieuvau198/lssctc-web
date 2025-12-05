import React, { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { Modal, Form, Input, InputNumber, Select, Button, Image } from "antd";
import { fetchCourseCategories, fetchCourseLevels } from "../../../../apis/ProgramManager/CourseApi";

const { Option } = Select;

const CreateCourse = ({
  open,
  onCancel,
  onCreate,
  confirmLoading,
  categories = [],
  levels = [],
  embedded = false,
}) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [imagePreview, setImagePreview] = useState("");
  const [localCategories, setLocalCategories] = useState(categories || []);
  const [localLevels, setLocalLevels] = useState(levels || []);
  const [catsLoading, setCatsLoading] = useState(false);
  const [lvlsLoading, setLvlsLoading] = useState(false);

  useEffect(() => {
    // initialize preview if initial value exists
    const init = form.getFieldValue("imageUrl");
    if (init) setImagePreview(init);
  }, [form]);

  useEffect(() => {
    let mounted = true;

    async function loadCategories() {
      setCatsLoading(true);
      try {
        const data = await fetchCourseCategories();
        if (!mounted) return;
        // map to { value, label }
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
        onCreate(values);
      })
      .catch(() => { });
  };

  const formContent = (
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
      disabled={confirmLoading}
      className={embedded ? "grid grid-cols-1 md:grid-cols-2 gap-x-6" : undefined}
    >
      {embedded && (
        <div className="md:col-span-2 grid grid-cols-4 md:grid-cols-2 gap-6">
          <Form.Item label={t('admin.courses.form.name')} name="name" rules={[{ required: true, message: t('admin.courses.form.nameRequired') }]} className={embedded ? "md:col-span-2" : undefined}>
            <Input
              maxLength={120}
              showCount
              placeholder={t('admin.courses.form.namePlaceholder')}
            />
          </Form.Item>
        </div>
      )}
      {!embedded && (
        <Form.Item label={t('admin.courses.form.name')} name="name" rules={[{ required: true, message: t('admin.courses.form.nameRequired') }]} className={embedded ? "md:col-span-2" : undefined}>
          <Input
            maxLength={120}
            showCount
            placeholder={t('admin.courses.form.namePlaceholder')}
          />
        </Form.Item>
      )}
      <Form.Item label={t('common.category')} name="categoryId" rules={[{ required: true, message: t('admin.courses.form.categoryRequired') }]}>
        <Select
          placeholder={t('admin.courses.form.categoryPlaceholder')}
          showSearch
          allowClear
          loading={catsLoading}
          notFoundContent={t('admin.courses.form.noCategories')}
          optionFilterProp="children"
          filterOption={(input, option) => (option?.children || '').toLowerCase().includes(input.toLowerCase())}
        >
          {localCategories.map((cat) => (
            <Option key={cat.value} value={cat.value}>{cat.label}</Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item label={t('common.level')} name="levelId" rules={[{ required: true, message: t('admin.courses.form.levelRequired') }]}>
        <Select
          placeholder={t('admin.courses.form.levelPlaceholder')}
          showSearch
          allowClear
          loading={lvlsLoading}
          notFoundContent={t('admin.courses.form.noLevels')}
          optionFilterProp="children"
          filterOption={(input, option) => (option?.children || '').toLowerCase().includes(input.toLowerCase())}
        >
          {localLevels.map((lvl) => (
            <Option key={lvl.value} value={lvl.value}>{lvl.label}</Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item label={t('common.price')} name="price" rules={[{ required: true, message: t('admin.courses.form.priceRequired') }]}>
        <InputNumber min={1} max={9999999999} style={{ width: "100%" }} />
      </Form.Item>
      <Form.Item label={t('admin.courses.form.durationHours')} name="durationHours" rules={[{ required: true, message: t('admin.courses.form.durationRequired') }]}>
        <InputNumber min={1} style={{ width: "100%" }} />
      </Form.Item>
      <Form.Item label={t('admin.courses.form.imageUrl')} name="imageUrl" rules={[{ required: true, message: t('admin.courses.form.imageUrlRequired') }]}>
        <Input
          maxLength={300}
          placeholder="https://example.com/image.jpg"
          onChange={(e) => {
            const val = e.target.value;
            // update form value and preview state
            form.setFieldsValue({ imageUrl: val });
            setImagePreview(val);
          }}
        />
      </Form.Item>
      <Form.Item label={t('admin.courses.form.preview')}>
        <div className="w-36 h-36 flex items-center justify-center border rounded-md overflow-hidden bg-gray-50">
          {imagePreview ? (
            <Image
              src={imagePreview}
              alt="Preview"
              allowClear
              fallback="data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='128' height='96' viewBox='0 0 128 96'%3E%3Crect width='128' height='96' fill='%23f3f4f6'/%3E%3Ctext x='50%' y='50%' fill='%239ca3af' font-size='12' font-family='Arial' dominant-baseline='middle' text-anchor='middle'%3ENo preview%3C/text%3E%3C/svg%3E"
            />
          ) : (
            <div className="text-sm text-gray-500 px-2 text-center">{t('admin.courses.form.preview')}</div>
          )}
        </div>
      </Form.Item>
      {/* img review */}
      <Form.Item label={t('common.description')} name="description" rules={[{ required: true, message: t('admin.courses.form.descriptionRequired') }]} className={embedded ? "md:col-span-2" : undefined}>
        <Input.TextArea
          rows={3}
          maxLength={500}
          showCount
          placeholder={t('admin.courses.form.descriptionPlaceholder')}
        />
      </Form.Item>
      {embedded && (
        <div className="md:col-span-2 mt-4 flex justify-end gap-3">
          <Button onClick={onCancel}>{t('common.cancel')}</Button>
          <Button type="primary" loading={confirmLoading} onClick={handleOk}>{t('admin.courses.addCourse')}</Button>
        </div>
      )}
    </Form>
  );

  if (embedded) return formContent;

  return (
    <Modal
      title={t('admin.courses.addNewCourse')}
      open={open}
      onCancel={onCancel}
      onOk={handleOk}
      confirmLoading={confirmLoading}
      destroyOnClose
      footer={[
        <Button key="back" onClick={onCancel}>{t('common.cancel')}</Button>,
        <Button key="submit" type="primary" loading={confirmLoading} onClick={handleOk}>{t('admin.courses.addCourse')}</Button>,
      ]}
    >
      {formContent}
    </Modal>
  );
};

export default CreateCourse;
