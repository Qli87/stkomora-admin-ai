/**
 * Add member – functional component, Ant Design Form.
 * Server state: useAddMember, useCities (React Query).
 */
import React, { useMemo } from 'react';
import { Form, Input, Select, Button, Card, message, DatePicker } from 'antd';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { useAddMember, useCities } from '../../hooks/useMembers';
import { routes } from '../../core/constants/routes';

const SEX_OPTIONS = [
  { value: 1, label: 'muški' },
  { value: 2, label: 'ženski' },
];

const CITY_OPTIONS = [
  { value: 1, label: 'Andrijevica' },
  { value: 2, label: 'Bar' },
  { value: 3, label: 'Berane' },
  { value: 4, label: 'Bijelo Polje' },
  { value: 5, label: 'Budva' },
  { value: 6, label: 'Cetinje' },
  { value: 7, label: 'Danilovgrad' },
  { value: 8, label: 'Gusinje' },
  { value: 9, label: 'Herceg Novi' },
  { value: 10, label: 'Kolašin' },
  { value: 11, label: 'Kotor' },
  { value: 12, label: 'Mojkovac' },
  { value: 13, label: 'Nikšić' },
  { value: 14, label: 'Petnjica' },
  { value: 15, label: 'Plav' },
  { value: 16, label: 'Plužine' },
  { value: 17, label: 'Pljevlja' },
  { value: 18, label: 'Podgorica' },
  { value: 19, label: 'Rožaje' },
  { value: 20, label: 'Šavnik' },
  { value: 21, label: 'Tivat' },
  { value: 22, label: 'Tuzi' },
  { value: 23, label: 'Ulcinj' },
  { value: 24, label: 'Zeta' },
  { value: 25, label: 'Žabljak' },
];

export default function MemberAddPage() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const addMember = useAddMember();
  const { data: cities = [] } = useCities();

  const cityOptions = useMemo(() => {
    if (Array.isArray(cities) && cities[0]?.id != null) {
      return cities.map((c) => ({ value: c.id, label: c.name || c.label }));
    }
    return CITY_OPTIONS;
  }, [cities]);

  const onFinish = async (values) => {
    try {
      const dob = values.dateOfBirth ? dayjs(values.dateOfBirth).format('YYYY-MM-DD') : null;
      await addMember.mutateAsync({
        name: values.name,
        surname: values.surname,
        sex: typeof values.sex === 'object' ? values.sex?.label : values.sex,
        date_of_birth: dob,
        speciality: values.speciality,
        faximil: values.faximil,
        phone: values.phone,
        email: values.email,
        city_id: values.city_id,
        company: values.company,
      });
      message.success('Član je uspješno dodan');
      form.resetFields();
      navigate(routes.membersList);
    } catch (e) {
      message.error(e?.message || 'Greška pri dodavanju člana');
    }
  };

  return (
    <Card title="Dodaj člana komore" style={{ maxWidth: 600 }}>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
      >
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
        <Form.Item name="company" label="Naziv ustanove" rules={[{ required: true }]}>
          <Input placeholder="Unesite naziv ustanove" />
        </Form.Item>
        <Form.Item name="city_id" label="Grad" rules={[{ required: true }]}>
          <Select options={cityOptions} placeholder="Izaberite grad" showSearch optionFilterProp="label" />
        </Form.Item>
        <Form.Item name="faximil" label="Br. faksimila">
          <Input placeholder="Broj faksimila" />
        </Form.Item>
        <Form.Item name="email" label="E-mail" rules={[{ required: true }, { type: 'email' }]}>
          <Input placeholder="E-mail" />
        </Form.Item>
        <Form.Item name="phone" label="Telefon" rules={[{ required: true }, { min: 9, message: 'Min. 9 cifara' }]}>
          <Input placeholder="Broj telefona" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={addMember.isPending}>
            Dodaj
          </Button>
          <Button style={{ marginLeft: 8 }} onClick={() => navigate(routes.membersList)}>
            Odustani
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}
