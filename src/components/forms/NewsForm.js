/**
 * News form – used inside Drawer (add/edit).
 */
import React, { useMemo } from 'react';
import { Form, Input, Select, Button, DatePicker } from 'antd';
import { useCategories } from '../../hooks/useCategories';

const { TextArea } = Input;

export default function NewsForm({ form, onFinish, loading, submitLabel = 'Sačuvaj', cancelLabel = 'Odustani', onCancel }) {
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
      <Form.Item style={{ marginBottom: 0 }}>
        <Button type="primary" htmlType="submit" loading={loading} style={{ marginRight: 8 }}>
          {submitLabel}
        </Button>
        {onCancel && <Button onClick={onCancel}>{cancelLabel}</Button>}
      </Form.Item>
    </Form>
  );
}
