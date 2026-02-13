/**
 * Finance form fields – used inside Drawer (add/edit).
 */
import React, { useMemo } from 'react';
import { Form, Input, InputNumber, Select, DatePicker, Button } from 'antd';
import { useMembers } from '../../hooks/useMembers';

export default function FinanceForm({
  form,
  onFinish,
  loading,
  submitLabel = 'Sačuvaj',
  cancelLabel = 'Odustani',
  onCancel,
}) {
  const { data: members = [] } = useMembers();

  const memberOptions = useMemo(() => {
    if (!Array.isArray(members)) return [];
    return members.map((m) => ({
      value: m.id,
      label: `${m.name || ''} ${m.surname || ''}`.trim() || `Član #${m.id}`,
    }));
  }, [members]);

  return (
    <Form form={form} layout="vertical" onFinish={onFinish} autoComplete="off">
      <Form.Item name="member_id" label="Član" rules={[{ required: true, message: 'Izaberite člana' }]}>
        <Select
          options={memberOptions}
          placeholder="Izaberite člana"
          showSearch
          optionFilterProp="label"
        />
      </Form.Item>
      <Form.Item name="date" label="Datum" rules={[{ required: true, message: 'Unesite datum' }]}>
        <DatePicker format="DD.MM.YYYY" style={{ width: '100%' }} placeholder="Izaberite datum" />
      </Form.Item>
      <Form.Item name="duguje" label="Duguje">
        <InputNumber
          min={0}
          step={0.01}
          precision={2}
          style={{ width: '100%' }}
          placeholder="0.00"
          addonAfter="€"
        />
      </Form.Item>
      <Form.Item name="potrazuje" label="Potražuje">
        <InputNumber
          min={0}
          step={0.01}
          precision={2}
          style={{ width: '100%' }}
          placeholder="0.00"
          addonAfter="€"
        />
      </Form.Item>
      <Form.Item name="description" label="Opis">
        <Input.TextArea rows={3} placeholder="Opis stavke" maxLength={512} showCount />
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
