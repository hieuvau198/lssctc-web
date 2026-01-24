import React, { useEffect, useState } from 'react';
import { 
  Form, 
  Input, 
  Button, 
  Switch, 
  App, 
  Spin, 
  Image,
  Typography,
  Upload,
  Card
} from 'antd';
import { Save, RotateCcw, Settings as SettingsIcon, Upload as UploadIcon, Download as DownloadIcon, FileCode } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getSimSettings, updateSimSettings, uploadSimSource, downloadSimSource } from '../../../apis/SimulationManager/SimSettingsApi';

const { TextArea } = Input;
const { Text } = Typography;

export default function SimulatorSettings() {
  const { t } = useTranslation();
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await getSimSettings();
      if (response && response.success) {
        const data = response.data;
        form.setFieldsValue({
          ...data,
          isActive: data.isActive ?? false
        });
        setImageUrl(data.imageUrl);
      } else {
        message.error('Không thể tải cài đặt');
      }
    } catch (error) {
      console.error(error);
      message.error('Đã xảy ra lỗi khi tải cài đặt');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onFinish = async (values) => {
    setSubmitting(true);
    try {
      const payload = {
        ...values,
        id: 0 
      };
      
      const response = await updateSimSettings(payload);
      if (response && response.success) {
        message.success('Cập nhật cài đặt thành công');
        setImageUrl(values.imageUrl);
      } else {
        message.error(response?.message || 'Cập nhật thất bại');
      }
    } catch (error) {
      console.error(error);
      message.error('Đã xảy ra lỗi khi cập nhật cài đặt');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    form.resetFields();
    fetchSettings();
  };

  const handleUpload = async (file) => {
    setUploading(true);
    try {
      const response = await uploadSimSource(file);
      if (response && response.success) {
        message.success('Tải lên nguồn thành công');
        // Update the sourceUrl field with the new URL from backend
        form.setFieldValue('sourceUrl', response.data.sourceUrl);
      } else {
        message.error(response?.message || 'Tải lên thất bại');
      }
    } catch (error) {
      console.error(error);
      message.error('Đã xảy ra lỗi trong quá trình tải lên');
    } finally {
      setUploading(false);
    }
    return false; // Prevent default upload behavior
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const response = await downloadSimSource();
      
      // Create a blob link to trigger the download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      // Try to get filename from content-disposition header if available, otherwise default
      const contentDisposition = response.headers['content-disposition'];
      let fileName = 'simulation-source.zip'; // Default name
      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename="?(.+)"?/);
        if (fileNameMatch && fileNameMatch.length === 2)
          fileName = fileNameMatch[1];
      }
      
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      message.error('Không thể tải xuống tệp nguồn. Tệp có thể không tồn tại.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col overflow-y-auto">
      {/* Header - Industrial Theme */}
      <div className="flex-none bg-neutral-700 border-2 border-black p-5 mb-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] mx-4 mt-4">
        <div className="h-1 bg-yellow-400 -mx-5 -mt-5 mb-4" />
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-yellow-400 border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)]">
            <SettingsIcon className="w-6 h-6 text-black" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white uppercase tracking-tight m-0 leading-none">
              Cài đặt Mô phỏng
            </h1>
            <p className="text-yellow-400 text-sm mt-1 font-medium">
              Cấu hình chung cho môi trường mô phỏng
            </p>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 px-4 pb-6 space-y-6">
        
        {/* Main Settings Form */}
        <div className="bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] relative max-w-5xl mx-auto">
          <div className="h-1 bg-yellow-400 absolute top-0 left-0 right-0" />
          
          <Spin spinning={loading}>
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              initialValues={{ isActive: true }}
              className="mt-2"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Left Column: Basic Info */}
                <div className="space-y-4">
                  <div className="bg-neutral-100 p-4 border border-neutral-200 rounded-sm">
                    <h3 className="font-bold text-lg border-b border-neutral-300 pb-2 mb-4 uppercase">Thông tin chung</h3>
                    
                    <Form.Item
                      label={<span className="font-semibold text-neutral-700">Tên trình mô phỏng</span>}
                      name="name"
                      rules={[{ required: true, message: 'Vui lòng nhập tên trình mô phỏng' }]}
                    >
                      <Input placeholder="Vd: Mô phỏng Cần cẩu 2026" size="large" className="border-neutral-400" />
                    </Form.Item>

                    <Form.Item
                      label={<span className="font-semibold text-neutral-700">Mã cài đặt</span>}
                      name="settingCode"
                    >
                      <Input placeholder="Mã duy nhất cho cấu hình này" className="border-neutral-400" />
                    </Form.Item>

                    <Form.Item
                      label={<span className="font-semibold text-neutral-700">Mô tả</span>}
                      name="description"
                    >
                      <TextArea 
                        rows={4} 
                        placeholder="Mô tả môi trường mô phỏng..." 
                        className="border-neutral-400"
                      />
                    </Form.Item>

                    {/* System Status hidden as requested */}
                    {/* <Form.Item
                      label={<span className="font-semibold text-neutral-700">Trạng thái hệ thống</span>}
                      name="isActive"
                      valuePropName="checked"
                    >
                      <div className="flex items-center gap-3 bg-white p-3 border border-neutral-300 inline-flex">
                        <Switch disabled />
                        <span className="text-sm text-neutral-500">
                          Bật tắt để kích hoạt/vô hiệu hóa cấu hình này trên toàn hệ thống
                        </span>
                      </div>
                    </Form.Item> */}
                  </div>
                </div>

                {/* Right Column: URLs and Media */}
                <div className="space-y-4">
                  <div className="bg-neutral-100 p-4 border border-neutral-200 rounded-sm h-full">
                    <h3 className="font-bold text-lg border-b border-neutral-300 pb-2 mb-4 uppercase">Tài nguyên & Hình ảnh</h3>

                    <Form.Item
                      label={<span className="font-semibold text-neutral-700">URL Nguồn (Tự động tạo)</span>}
                      name="sourceUrl"
                      extra={<span className="text-xs text-neutral-500">URL này được tạo tự động khi bạn tải lên tệp nguồn.</span>}
                    >
                      <Input 
                        disabled
                        prefix={<span className="text-gray-400 mr-1">🔗</span>} 
                        placeholder="Chưa có nguồn nào được tải lên" 
                        className="border-neutral-400 bg-gray-50 text-gray-500 cursor-not-allowed"
                      />
                    </Form.Item>

                    <Form.Item
                      label={<span className="font-semibold text-neutral-700">URL Hình ảnh xem trước</span>}
                      name="imageUrl"
                    >
                      <Input 
                        placeholder="https://..." 
                        onChange={(e) => setImageUrl(e.target.value)} 
                        className="border-neutral-400"
                      />
                    </Form.Item>

                    <div className="mt-4 p-2 border-2 border-dashed border-neutral-300 bg-white text-center min-h-[200px] flex items-center justify-center relative group overflow-hidden">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt="Preview"
                          className="max-h-64 object-contain mx-auto"
                          fallback="https://placehold.co/600x400?text=No+Image"
                        />
                      ) : (
                        <div className="text-neutral-400 flex flex-col items-center">
                          <span className="text-4xl mb-2">🖼️</span>
                          <span>Không có hình ảnh xem trước</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-end gap-4 mt-8 pt-6 border-t-2 border-neutral-200">
                <Button 
                  icon={<RotateCcw className="w-4 h-4" />} 
                  onClick={handleReset}
                  size="large"
                  className="font-semibold border-2 border-neutral-300 text-neutral-600 hover:border-neutral-800 hover:text-neutral-800"
                >
                  Đặt lại
                </Button>
                
                <button
                  type="submit"
                  disabled={submitting}
                  onClick={form.submit}
                  className="group inline-flex items-center gap-2 px-6 py-3 bg-yellow-400 text-black font-bold uppercase tracking-wider text-sm border-2 border-black hover:bg-yellow-500 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <Spin size="small" className="mr-2" />
                  ) : (
                    <Save className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  )}
                  Lưu thay đổi
                </button>
              </div>
            </Form>
          </Spin>
        </div>

        {/* Source File Management Section */}
        <div className="bg-neutral-800 border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] relative max-w-5xl mx-auto text-white">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-neutral-700 border border-neutral-600 rounded">
              <FileCode className="w-8 h-8 text-yellow-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold uppercase tracking-wide text-yellow-400">Quản lý Nguồn Ứng dụng</h3>
              <p className="text-neutral-400 text-sm mt-1 mb-4">
                Quản lý tệp build mô phỏng cốt lõi tại đây. Việc tải lên tệp mới sẽ tự động thay thế tệp hiện có và cập nhật URL nguồn.
              </p>
              
              <div className="flex flex-wrap gap-4 mt-2">
                <Upload 
                  beforeUpload={handleUpload} 
                  showUploadList={false}
                  disabled={uploading}
                >
                  <Button 
                    size="large"
                    loading={uploading}
                    className="bg-white text-black border-none hover:bg-gray-200 font-bold flex items-center gap-2 h-12 px-6"
                    icon={!uploading && <UploadIcon className="w-4 h-4" />}
                  >
                    {uploading ? 'Đang tải lên...' : 'Tải lên bản build mới'}
                  </Button>
                </Upload>

                <Button 
                  size="large"
                  onClick={handleDownload}
                  loading={downloading}
                  className="bg-transparent text-white border-2 border-white hover:bg-white hover:text-black font-bold flex items-center gap-2 h-12 px-6"
                  icon={!downloading && <DownloadIcon className="w-4 h-4" />}
                >
                  Tải xuống bản build hiện tại
                </Button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}