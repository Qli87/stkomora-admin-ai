/**
 * News form – used inside Drawer (add/edit).
 */
import React, { useMemo } from 'react';
import { Form, Input, Select, Button, DatePicker, Upload, Typography } from 'antd';
import { UploadOutlined, FilePdfOutlined } from '@ant-design/icons';
import { useCategories } from '../../hooks/useCategories';

const { TextArea } = Input;
const { Link } = Typography;

export default function NewsForm({
  form,
  onFinish,
  loading,
  submitLabel = 'Sačuvaj',
  cancelLabel = 'Odustani',
  onCancel,
  existingFileUrl,
}) {
  const { data: categories = [] } = useCategories();
  const categoryOptions = useMemo(() => {
    return (Array.isArray(categories) ? categories : []).map((c) => ({
      value: c.id,
      label: c.name || c.title,
    }));
  }, [categories]);

  return (
    <Form form={form} layout="vertical" onFinish={onFinish} autoComplete="off">
      <Form.Item name="title" label="Naslov" rules={[{ required: true }]}>
        <Input placeholder="Naslov vijesti" />
      </Form.Item>
      <Form.Item name="category_id" label="Kategorija" rules={[{ required: true }]}>
        <Select options={categoryOptions} placeholder="Izaberite kategoriju" showSearch optionFilterProp="label" />
      </Form.Item>
      <Form.Item name="date" label="Datum">
        <DatePicker format="DD.MM.YYYY" style={{ width: '100%' }} placeholder="Izaberite datum" />
      </Form.Item>
      <Form.Item name="content" label="Sadržaj (kratak)">
        <TextArea rows={3} placeholder="Kratak sadržaj" />
      </Form.Item>
      <Form.Item name="full_text" label="Puni tekst">
        <TextArea rows={6} placeholder="Puni tekst vijesti" />
      </Form.Item>
      <Form.Item
        name="file"
        label="PDF fajl"
        valuePropName="fileList"
        getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
      >
        <Upload beforeUpload={() => false} maxCount={1} accept=".pdf">
          <Button icon={<UploadOutlined />}>Odaberi PDF fajl</Button>
        </Upload>
      </Form.Item>
      {existingFileUrl && (
        <div style={{ marginTop: -16, marginBottom: 16, fontSize: 13 }}>
          <FilePdfOutlined style={{ color: '#ff4d4f', marginRight: 6 }} />
          Trenutni fajl:{' '}
          <Link href={existingFileUrl} target="_blank" rel="noopener noreferrer">
            Preuzmi PDF
          </Link>
        </div>
      )}
      <Form.Item style={{ marginBottom: 0 }}>
        <Button type="primary" htmlType="submit" loading={loading} style={{ marginRight: 8 }}>
          {submitLabel}
        </Button>
        {onCancel && <Button onClick={onCancel}>{cancelLabel}</Button>}
      </Form.Item>
    </Form>
  );
}
