/**
 * Advertisement (Oglas) form – used inside Drawer (add/edit).
 */
import React from 'react';
import { Form, Input, Button } from 'antd';

const { TextArea } = Input;

export default function AdvForm({ form, onFinish, loading, submitLabel = 'Sačuvaj', cancelLabel = 'Odustani', onCancel }) {
  return (
    <Form form={form} layout="vertical" onFinish={onFinish} autoComplete="off">
      <Form.Item name="title" label="Naslov" rules={[{ required: true }]}>
        <Input placeholder="Unesite naslov oglasa" />
      </Form.Item>
      <Form.Item name="full_text" label="Tekst oglasa" rules={[{ required: true }]}>
        <TextArea rows={6} placeholder="Unesite tekst oglasa" />
      </Form.Item>
      <Form.Item name="phone" label="Telefon" rules={[{ required: true }, { min: 9, message: 'Min. 9 cifara' }]}>
        <Input placeholder="Broj telefona" />
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
