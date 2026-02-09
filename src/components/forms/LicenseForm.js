/**
 * License form – used in Licenses list drawer (add/edit).
 */
import React, { useMemo } from 'react';
import { Form, Input, Select, DatePicker, Button } from 'antd';
import { useMembers } from '../../hooks/useMembers';

const LICENSE_TYPE_OPTIONS = [
  { value: 'permanent', label: 'Stalna' },
  { value: 'temporary', label: 'Privremena' },
];

export default function LicenseForm({
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
      <Form.Item name="member_id" label="Stomatolog (član)" rules={[{ required: true, message: 'Izaberite stomatologa' }]}>
        <Select
          options={memberOptions}
          placeholder="Izaberite stomatologa"
          showSearch
          optionFilterProp="label"
        />
      </Form.Item>
      <Form.Item name="type" label="Tip licence" rules={[{ required: true }]}>
        <Select options={LICENSE_TYPE_OPTIONS} placeholder="Stalna ili Privremena" />
      </Form.Item>
      <Form.Item name="license_number" label="Broj licence">
        <Input placeholder="Broj licence" />
      </Form.Item>
      <Form.Item name="expires_at" label="Datum isticanja">
        <DatePicker format="DD.MM.YYYY" style={{ width: '100%' }} placeholder="Datum isticanja (za privremenu)" />
      </Form.Item>
      <Form.Item name="kind" label="Vrsta licence">
        <Input placeholder="Vrsta licence (opciono)" />
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
