import React, { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { Modal, Form, Input, InputNumber, Select, Button, Image, message } from "antd";
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
  const [bgImagePreview, setBgImagePreview] = useState(""); // Added state for background image preview
  const [localCategories, setLocalCategories] = useState(categories || []);
  const [localLevels, setLocalLevels] = useState(levels || []);
  const [catsLoading, setCatsLoading] = useState(false);
  const [lvlsLoading, setLvlsLoading] = useState(false);

  useEffect(() => {
    // initialize preview if initial value exists
    const init = form.getFieldValue("imageUrl");
    if (init) setImagePreview(init);
    
    // Initialize background image preview
    const initBg = form.getFieldValue("backgroundImageUrl");
    if (initBg) setBgImagePreview(initBg);
  }, [form]);

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

  const handleFinish = (values) => {
    onCreate(values);
  };

  const handleFinishFailed = (errorInfo) => {
    const errorMessages = errorInfo.errorFields.map(field => field.errors[0]).join(". ");
    message.error(`${t('common.reqField') || t('admin.courses.form.validationFailed')}: ${errorMessages}`);
  };

  const handleOk = () => {
    form.submit();
  };

  const formContent = (
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        name: "",
        courseCode: "",
        description: "",
        categoryId: undefined,
        levelId: undefined,
        price: undefined,
        imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2sUcEWdSaINXf8E4hmy7obh3B1w0-l_T8Tw&s", // Default from DTO
        backgroundImageUrl: "https://templates.framework-y.com/lightwire/images/wide-1.jpg", // Default from DTO
        durationHours: undefined,
      }}
      disabled={confirmLoading}
      onFinish={handleFinish}
      onFinishFailed={handleFinishFailed}
      scrollToFirstError
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
        <Form.Item
          label={t('admin.courses.form.name')}
          name="name"
          validateTrigger={['onBlur', 'onChange']}
          rules={[
            { required: true, message: t('admin.courses.form.nameRequired') },
            { min: 3, message: t('admin.courses.form.nameMin') },
            { max: 200, message: t('admin.courses.form.nameMax') }
          ]}
        >
          <Input showCount placeholder={t('admin.courses.form.namePlaceholder')} />
        </Form.Item>

        <Form.Item
          label={t('admin.courses.form.courseCode')}
          name="courseCode"
          validateTrigger={['onBlur', 'onChange']}
          rules={[
            { required: true, message: t('admin.courses.form.courseCodeRequired') },
            { max: 50, message: t('admin.courses.form.courseCodeMax') }
          ]}
        >
          <Input showCount placeholder={t('admin.courses.form.courseCodePlaceholder')} />
        </Form.Item>

        <Form.Item
          label={t('common.category')}
          name="categoryId"
          validateTrigger={['onBlur', 'onChange']}
          rules={[{ required: true, message: t('admin.courses.form.categoryRequired') }]}
        >
          <Select
            placeholder={t('admin.courses.form.categoryPlaceholder')}
            showSearch
            allowClear
            loading={catsLoading}
            optionFilterProp="children"
          >
            {localCategories.map((cat) => (
              <Option key={cat.value} value={cat.value}>{cat.label}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label={t('common.level')}
          name="levelId"
          validateTrigger={['onBlur', 'onChange']}
          rules={[{ required: true, message: t('admin.courses.form.levelRequired') }]}
        >
          <Select
            placeholder={t('admin.courses.form.levelPlaceholder')}
            showSearch
            allowClear
            loading={lvlsLoading}
            optionFilterProp="children"
          >
            {localLevels.map((lvl) => (
              <Option key={lvl.value} value={lvl.value}>{lvl.label}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label={t('common.price')}
          name="price"
          validateTrigger={['onBlur', 'onChange']}
          rules={[{ type: 'number', min: 0, max: 1000000000, message: t('admin.courses.form.priceRange') }]}
        >
          <InputNumber step={0.01} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label={t('admin.courses.form.durationHours')}
          name="durationHours"
          validateTrigger={['onBlur', 'onChange']}
          rules={[{ required: true, message: t('admin.courses.form.durationRequired') }]}
        >
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>
      </div>

      {/* Image URLs Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
        <div>
          <Form.Item
            label={t('admin.courses.form.imageUrl')}
            name="imageUrl"
            validateTrigger={['onBlur', 'onChange']}
            rules={[
              { required: true, message: t('admin.courses.form.imageUrlRequired') },
              { type: 'url', message: t('admin.courses.form.imageUrlInvalid') }
            ]}
          >
            <Input
              placeholder="https://example.com/image.jpg"
              onChange={(e) => {
                const val = e.target.value;
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
                  fallback="data:image/svg+xml;utf8,%3Csvg..."
                />
              ) : (
                <div className="text-sm text-gray-500 px-2 text-center">{t('admin.courses.form.preview')}</div>
              )}
            </div>
          </Form.Item>
        </div>

        {/* Added Background Image URL Field */}
        <div>
          <Form.Item
            label="Background Image URL" // You might want to add translation key later: t('admin.courses.form.backgroundImageUrl')
            name="backgroundImageUrl"
            validateTrigger={['onBlur', 'onChange']}
            rules={[
               { type: 'url', message: t('admin.courses.form.urlInvalid') }
            ]}
          >
            <Input
              placeholder="https://example.com/bg-image.jpg"
              onChange={(e) => {
                const val = e.target.value;
                form.setFieldsValue({ backgroundImageUrl: val });
                setBgImagePreview(val);
              }}
            />
          </Form.Item>

          <Form.Item label="Background Preview">
            <div className="w-full h-36 flex items-center justify-center border rounded-md overflow-hidden bg-gray-50">
              {bgImagePreview ? (
                <Image
                  src={bgImagePreview}
                  alt="Background Preview"
                  allowClear
                  className="object-cover w-full h-full"
                  fallback="data:image/svg+xml;utf8,%3Csvg..."
                />
              ) : (
                <div className="text-sm text-gray-500 px-2 text-center">No background preview</div>
              )}
            </div>
          </Form.Item>
        </div>
      </div>

      <Form.Item
        label={t('common.description')}
        name="description"
        validateTrigger={['onBlur', 'onChange']}
        rules={[
          { required: true, message: t('admin.courses.form.descriptionRequired') },
          { max: 1000, message: t('admin.courses.form.descriptionMax') }
        ]}
      >
        <Input.TextArea
          rows={3}
          showCount
          placeholder={t('admin.courses.form.descriptionPlaceholder')}
        />
      </Form.Item>

      {embedded && (
        <div className="flex justify-end gap-3 mt-4">
          <Button onClick={onCancel}>{t('common.cancel')}</Button>
          <Button type="primary" loading={confirmLoading} htmlType="submit">{t('admin.courses.addCourse')}</Button>
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
      width={800} // Increased width for better layout
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