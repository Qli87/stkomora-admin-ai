/**
 * Member form fields – used inside Drawer (add/edit).
 */
import React, { useMemo, useState } from 'react';
import { Form, Input, Select, Button, Space, DatePicker } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useCities } from '../../hooks/useMembers';
import { useCompanies } from '../../hooks/useCompanies';
import CompanyCreateModal from './CompanyCreateModal';

const SEX_OPTIONS = [
  { value: 1, label: 'muški' },
  { value: 2, label: 'ženski' },
];

function CompanySelectWithAdd({ value, onChange, onAddClick, ...selectProps }) {
  return (
    <Space.Compact style={{ width: '100%' }}>
      <Select
        value={value}
        onChange={onChange}
        style={{ flex: 1 }}
        {...selectProps}
      />
      <Button
        type="default"
        icon={<PlusOutlined />}
        onClick={onAddClick}
        title="Dodaj novu ordinaciju"
      />
    </Space.Compact>
  );
}

const CITY_OPTIONS = [
  { value: 1, label: 'Andrijevica' }, { value: 2, label: 'Bar' }, { value: 3, label: 'Berane' },
  { value: 4, label: 'Bijelo Polje' }, { value: 5, label: 'Budva' }, { value: 6, label: 'Cetinje' },
  { value: 7, label: 'Danilovgrad' }, { value: 8, label: 'Gusinje' }, { value: 9, label: 'Herceg Novi' },
  { value: 10, label: 'Kolašin' }, { value: 11, label: 'Kotor' }, { value: 12, label: 'Mojkovac' },
  { value: 13, label: 'Nikšić' }, { value: 14, label: 'Petnjica' }, { value: 15, label: 'Plav' },
  { value: 16, label: 'Plužine' }, { value: 17, label: 'Pljevlja' }, { value: 18, label: 'Podgorica' },
  { value: 19, label: 'Rožaje' }, { value: 20, label: 'Šavnik' }, { value: 21, label: 'Tivat' },
  { value: 22, label: 'Tuzi' }, { value: 23, label: 'Ulcinj' }, { value: 24, label: 'Zeta' }, { value: 25, label: 'Žabljak' },
];

export default function MemberForm({ form, onFinish, loading, submitLabel = 'Sačuvaj', cancelLabel = 'Odustani', onCancel, editingMemberId }) {
  const [companyModalOpen, setCompanyModalOpen] = useState(false);
  const { data: cities = [] } = useCities();
  const { data: companies = [] } = useCompanies();

  const cityOptions = useMemo(() => {
    if (Array.isArray(cities) && cities[0]?.id != null) {
      return cities.map((c) => ({ value: c.id, label: c.name || c.label }));
    }
    return CITY_OPTIONS;
  }, [cities]);

  const companyOptions = useMemo(() => {
    if (!Array.isArray(companies)) return [];
    return companies.map((c) => ({ value: c.id, label: c.name || `Ordinacija #${c.id}` }));
  }, [companies]);

  const handleCompanyCreated = (company) => {
    form.setFieldValue('company_id', company.id);
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish} autoComplete="off">
      <Form.Item name="name" label="Ime" rules={[{ required: true }]}>
        <Input placeholder="Unesite ime" />
      </Form.Item>
      <Form.Item name="surname" label="Prezime" rules={[{ required: true }]}>
        <Input placeholder="Unesite prezime" />
      </Form.Item>
      <Form.Item name="sex" label="Rod" rules={[{ required: true }]}>
        <Select options={SEX_OPTIONS} placeholder="Izaberite rod" />
      </Form.Item>
      <Form.Item name="dateOfBirth" label="Datum rođenja" rules={[{ required: true }]}>
        <DatePicker format="DD.MM.YYYY" placeholder="Izaberite datum" style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item name="speciality" label="Specijalnost" rules={[{ required: true }]}>
        <Input placeholder="Specijalnost" />
      </Form.Item>
      <Form.Item name="company_id" label="Ordinacija (ustanova)">
        <CompanySelectWithAdd
          options={companyOptions}
          onAddClick={() => setCompanyModalOpen(true)}
          placeholder="Izaberite ordinaciju"
          showSearch
          optionFilterProp="label"
          allowClear
        />
      </Form.Item>
      <Form.Item name="city_id" label="Grad" rules={[{ required: true }]}>
        <Select options={cityOptions} placeholder="Izaberite grad" showSearch optionFilterProp="label" />
      </Form.Item>
      <Form.Item name="faximil" label="Br. faksimila">
        <Input placeholder="Broj faksimila" allowClear />
      </Form.Item>
      <Form.Item name="email" label="E-mail" rules={[{ required: true }, { type: 'email' }]}>
        <Input placeholder="E-mail" />
      </Form.Item>
      <Form.Item name="phone" label="Telefon" rules={[{ required: true }, { min: 9, message: 'Min. 9 cifara' }]}>
        <Input placeholder="Broj telefona" />
      </Form.Item>
      <Form.Item style={{ marginBottom: 0 }}>
        <Button type="primary" htmlType="submit" loading={loading} style={{ marginRight: 8 }}>
          {submitLabel}
        </Button>
        {onCancel && (
          <Button onClick={onCancel}>{cancelLabel}</Button>
        )}
      </Form.Item>
      <CompanyCreateModal
        open={companyModalOpen}
        onClose={() => setCompanyModalOpen(false)}
        onCreated={handleCompanyCreated}
        memberId={editingMemberId}
      />
    </Form>
  );
}
