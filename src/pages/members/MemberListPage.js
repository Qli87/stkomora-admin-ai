/**
 * Member list – table + side Drawer for add/edit.
 */
import React, { useMemo, useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Table, Input, Button, Space, Modal, Typography, message, Drawer, Spin, Form, Tooltip, Select } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useMembers, useDeleteMember, useAddMember, useUpdateMember, useMember } from '../../hooks/useMembers';
import { useCompanies } from '../../hooks/useCompanies';
import MemberForm from '../../components/forms/MemberForm';

const { Search } = Input;
const { Text } = Typography;

export default function MemberListPage() {
  const { data: members = [], isLoading, error } = useMembers();
  const { data: companies = [] } = useCompanies();
  const deleteMember = useDeleteMember();
  const addMember = useAddMember();
  const updateMember = useUpdateMember();
  const [searchText, setSearchText] = useState('');
  const [companyFilter, setCompanyFilter] = useState('all');
  const [deleteModal, setDeleteModal] = useState({ visible: false, member: null });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState('add'); // 'add' | 'edit'
  const [editingId, setEditingId] = useState(null);
  const [form] = Form.useForm();

  const { data: editingMember, isLoading: loadingMember } = useMember(editingId);

  useEffect(() => {
    if (!editingMember || drawerMode !== 'edit') return;
    // Convert sex string to integer for form (1 = muški, 2 = ženski)
    const sexValue = editingMember.sex === 'muški' ? 1 : editingMember.sex === 'ženski' ? 2 : undefined;
    form.setFieldsValue({
      name: editingMember.name,
      surname: editingMember.surname,
      sex: sexValue,
      dateOfBirth: (() => {
        const raw = editingMember.date_of_birth ?? editingMember.dateOfBirth;
        if (!raw) return null;
        const d = dayjs(raw);
        return d.isValid() ? d : null;
      })(),
      speciality: editingMember.speciality,
      company_id: editingMember.company_id ?? editingMember.primaryCompany?.id,
      city_id: editingMember.city?.id ?? editingMember.city_id,
      faximil: editingMember.fax_nbr ?? editingMember.faximil,
      email: editingMember.email,
      phone: editingMember.phone,
    });
  }, [editingMember, drawerMode, form]);

  const companyOptions = useMemo(() => {
    if (!Array.isArray(companies)) return [];
    const sorted = [...companies].sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    return [
      { value: 'all', label: 'Sve ordinacije' },
      ...sorted.map((c) => ({ value: c.id, label: c.name || `Ordinacija #${c.id}` })),
    ];
  }, [companies]);

  const selectedCompanyName = useMemo(() => {
    if (companyFilter === 'all') return null;
    const c = companies.find((x) => x.id === companyFilter);
    return c?.name || null;
  }, [companies, companyFilter]);

  const companyFilterDisplayText = companyFilter === 'all' ? 'Sve ordinacije' : (selectedCompanyName || '');
  const companySelectMeasureRef = useRef(null);
  const [companySelectWidth, setCompanySelectWidth] = useState(220);

  useLayoutEffect(() => {
    if (!companySelectMeasureRef.current) return;
    const textWidth = companySelectMeasureRef.current.offsetWidth;
    setCompanySelectWidth(Math.max(220, textWidth + 40));
  }, [companyFilterDisplayText]);

  const filteredMembers = useMemo(() => {
    let result = members;
    if (companyFilter !== 'all') {
      result = result.filter(
        (m) => (m.company_id === companyFilter || m.primaryCompany?.id === companyFilter)
      );
    }
    if (searchText.trim()) {
      const lower = searchText.toLowerCase();
      result = result.filter(
        (m) =>
          (m.name && m.name.toLowerCase().includes(lower)) ||
          (m.surname && m.surname.toLowerCase().includes(lower))
      );
    }
    return result;
  }, [members, searchText, companyFilter]);

  const openAddDrawer = () => {
    setDrawerMode('add');
    setEditingId(null);
    form.resetFields();
    setDrawerOpen(true);
  };

  const openEditDrawer = (record) => {
    setDrawerMode('edit');
    setEditingId(record.id);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setEditingId(null);
    form.resetFields();
  };

  const handleDelete = async () => {
    if (!deleteModal.member?.id) return;
    try {
      await deleteMember.mutateAsync(deleteModal.member.id);
      message.success('Član je obrisan');
      setDeleteModal({ visible: false, member: null });
    } catch (e) {
      message.error(e?.message || 'Greška pri brisanju');
    }
  };

  const onFormFinish = async (values) => {
    try {
      const dob = values.dateOfBirth ? dayjs(values.dateOfBirth).format('YYYY-MM-DD') : null;
      // Ensure sex is an integer (1 = muški, 2 = ženski)
      const sexValue = typeof values.sex === 'number' ? values.sex : (values.sex?.value || values.sex || 1);
      
      if (drawerMode === 'add') {
        await addMember.mutateAsync({
          name: values.name,
          surname: values.surname,
          sex: sexValue,
          date_of_birth: dob,
          speciality: values.speciality,
          fax_nbr: values.faximil || '',
          phone: values.phone,
          email: values.email || null,
          city_id: values.city_id,
          company_id: values.company_id || null,
        });
        message.success('Član je uspješno dodan');
      } else {
        // Ensure sex is an integer (1 = muški, 2 = ženski)
        const sexValue = typeof values.sex === 'number' ? values.sex : (values.sex?.value || values.sex || 1);
        
        await updateMember.mutateAsync({
          id: editingId,
          name: values.name,
          surname: values.surname,
          sex: sexValue,
          date_of_birth: dob,
          speciality: values.speciality,
          company_id: values.company_id || null,
          city_id: values.city_id,
          fax_nbr: values.faximil || '',
          email: values.email || null,
          phone: values.phone,
        });
        message.success('Podaci o članu su ažurirani');
      }
      closeDrawer();
    } catch (e) {
      message.error(e?.message || 'Greška');
    }
  };

  const columns = [
    {
      title: 'Licenca',
      dataIndex: 'licence',
      key: 'licence',
      width: 90,
      ellipsis: true,
      render: (v) => (Array.isArray(v) ? v.map((l) => l?.license_number || l).join(', ') : v ?? '–'),
    },
    { title: 'Ime', dataIndex: 'name', key: 'name', width: 110, ellipsis: true },
    { title: 'Prezime', dataIndex: 'surname', key: 'surname', width: 110, ellipsis: true },
    { title: 'Telefon', dataIndex: 'phone', key: 'phone', width: 115 },
    {
      title: 'E-mail',
      dataIndex: 'email',
      key: 'email',
      width: 180,
      ellipsis: { showTitle: false },
      render: (email) =>
        email ? (
          <Tooltip placement="topLeft" title={email}>
            <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis' }}>{email}</span>
          </Tooltip>
        ) : (
          '–'
        ),
    },
    {
      title: 'Grad',
      key: 'city',
      width: 110,
      ellipsis: true,
      render: (_, record) => (record.city?.name ?? record.city ?? '–'),
    },
    {
      title: 'Radno mjesto',
      key: 'company',
      width: 130,
      ellipsis: true,
      render: (_, record) => record.primaryCompany?.name ?? record.company ?? '–',
    },
    {
      title: 'Akcije',
      key: 'actions',
      width: 100,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => openEditDrawer(record)}
            title="Izmijeni člana"
          />
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => setDeleteModal({ visible: true, member: record })}
            title="Obriši člana"
          />
        </Space>
      ),
    },
  ];

  const formLoading = addMember.isPending || updateMember.isPending;
  const drawerContent =
    drawerMode === 'edit' && loadingMember ? (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 24 }}>
        <Spin />
      </div>
    ) : (
      <MemberForm
        form={form}
        onFinish={onFormFinish}
        loading={formLoading}
        submitLabel={drawerMode === 'add' ? 'Dodaj' : 'Izmijeni'}
        onCancel={closeDrawer}
        editingMemberId={drawerMode === 'edit' ? editingId : null}
      />
    );

  return (
    <div style={{ padding: '0 4px' }}>
      <div
        style={{
          marginBottom: 16,
          display: 'flex',
          flexWrap: 'wrap',
          gap: 12,
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <Text strong style={{ fontSize: 18 }}>
            Spisak članova komore
          </Text>
          {selectedCompanyName && (
            <div style={{ marginTop: 2 }}>
              <Text type="secondary" style={{ fontSize: 14 }}>
                Ordinacija: {selectedCompanyName}
              </Text>
            </div>
          )}
        </div>
        <Space wrap size="small">
          <span
            ref={companySelectMeasureRef}
            style={{
              position: 'absolute',
              visibility: 'hidden',
              whiteSpace: 'nowrap',
              fontSize: 14,
              fontFamily: 'inherit',
            }}
            aria-hidden
          >
            {companyFilterDisplayText}
          </span>
          <Select
            value={companyFilter}
            onChange={setCompanyFilter}
            style={{ width: companySelectWidth, minWidth: 220 }}
            options={companyOptions}
            showSearch
            optionFilterProp="label"
            placeholder="Ordinacija"
          />
          <Search
            placeholder="Pretraga..."
            allowClear
            onSearch={setSearchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 220, minWidth: 160 }}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={openAddDrawer}>
            Dodaj člana
          </Button>
        </Space>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={filteredMembers}
          loading={isLoading}
          scroll={{ x: 860 }}
          pagination={{
            pageSize: 15,
            showSizeChanger: true,
            showTotal: (t) => `Ukupno: ${t}`,
            size: 'default',
          }}
          size="small"
          locale={{ emptyText: error ? 'Greška pri učitavanju' : 'Nema članova' }}
        />
      </div>
      <Modal
        title="Potvrda brisanja"
        open={deleteModal.visible}
        onOk={handleDelete}
        onCancel={() => setDeleteModal({ visible: false, member: null })}
        okText="Obriši"
        cancelText="Odustani"
        confirmLoading={deleteMember.isPending}
        okButtonProps={{ danger: true }}
      >
        Da li ste sigurni da želite obrisati člana: {deleteModal.member?.name}{' '}
        {deleteModal.member?.surname}?
      </Modal>
      <Drawer
        title={drawerMode === 'add' ? 'Dodaj člana komore' : 'Izmijeni člana komore'}
        placement="right"
        width={420}
        open={drawerOpen}
        onClose={closeDrawer}
        destroyOnClose
      >
        {drawerContent}
      </Drawer>
    </div>
  );
}
