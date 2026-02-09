/**
 * External Consultants list – table + side Drawer for add/edit.
 */
import React, { useMemo, useState, useEffect } from 'react';
import { Table, Input, Button, Space, Modal, Typography, message, Drawer, Spin, Form, Tooltip } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import {
  useExternalConsultants,
  useExternalConsultant,
  useAddExternalConsultant,
  useUpdateExternalConsultant,
  useDeleteExternalConsultant,
  useAddConsultantContract,
} from '../../hooks/useExternalConsultants';
import ExternalConsultantForm from '../../components/forms/ExternalConsultantForm';
import dayjs from 'dayjs';

const { Search } = Input;
const { Text } = Typography;

export default function ConsultantListPage() {
  const { data: consultants = [], isLoading, error } = useExternalConsultants();
  const deleteConsultant = useDeleteExternalConsultant();
  const addConsultant = useAddExternalConsultant();
  const updateConsultant = useUpdateExternalConsultant();
  const [searchText, setSearchText] = useState('');
  const [deleteModal, setDeleteModal] = useState({ visible: false, item: null });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState('add');
  const [editingId, setEditingId] = useState(null);
  const [form] = Form.useForm();

  const { data: editingItem, isLoading: loadingItem, refetch } = useExternalConsultant(editingId);

  useEffect(() => {
    if (!editingItem || drawerMode !== 'edit') return;
    form.setFieldsValue({
      jmbg: editingItem.jmbg,
      name: editingItem.name,
      surname: editingItem.surname,
      email: editingItem.email,
      phone: editingItem.phone,
      date_of_birth: editingItem.date_of_birth ? dayjs(editingItem.date_of_birth) : null,
    });
  }, [editingItem, drawerMode, form]);

  const filteredConsultants = useMemo(() => {
    if (!searchText.trim()) return consultants;
    const lower = searchText.toLowerCase();
    return consultants.filter(
      (c) =>
        (c.name && c.name.toLowerCase().includes(lower)) ||
        (c.surname && c.surname.toLowerCase().includes(lower)) ||
        (c.email && c.email.toLowerCase().includes(lower)) ||
        (c.jmbg && String(c.jmbg).includes(lower))
    );
  }, [consultants, searchText]);

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
    if (!deleteModal.item?.id) return;
    try {
      await deleteConsultant.mutateAsync(deleteModal.item.id);
      message.success('Konsultant je obrisan');
      setDeleteModal({ visible: false, item: null });
    } catch (e) {
      message.error(e?.message || 'Greška pri brisanju');
    }
  };

  const addContractMutation = useAddConsultantContract(editingId);

  const handleAddContract = async (file) => {
    if (!editingId) return;
    try {
      await addContractMutation.mutateAsync(file);
      message.success('Ugovor je dodat');
      form.setFieldValue('contracts', []); // clear upload
      refetch();
    } catch (e) {
      message.error(e?.message || 'Greška pri dodavanju ugovora');
    }
  };

  const onFormFinish = async (values) => {
    try {
      const payload = {
        jmbg: values.jmbg,
        name: values.name,
        surname: values.surname,
        email: values.email,
        phone: values.phone || null,
        date_of_birth: values.date_of_birth
          ? values.date_of_birth.format('YYYY-MM-DD')
          : null,
        personal_id: values.personal_id,
      };
      if (drawerMode === 'add') {
        payload.contracts = values.contracts;
        await addConsultant.mutateAsync(payload);
        message.success('Konsultant je dodat');
      } else {
        payload.contracts = values.contracts;
        await updateConsultant.mutateAsync({ id: editingId, ...payload });
        message.success('Podaci o konsultantu su ažurirani');
      }
      closeDrawer();
    } catch (e) {
      message.error(e?.message || 'Greška');
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60, fixed: 'left' },
    { title: 'JMBG', dataIndex: 'jmbg', key: 'jmbg', width: 115 },
    { title: 'Ime', dataIndex: 'name', key: 'name', width: 110, ellipsis: true },
    { title: 'Prezime', dataIndex: 'surname', key: 'surname', width: 110, ellipsis: true },
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
          '—'
        ),
    },
    {
      title: 'Ugovori',
      key: 'contracts',
      width: 90,
      render: (_, record) => (record.contracts?.length || 0) + ' ugovora',
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
            title="Izmijeni"
          />
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => setDeleteModal({ visible: true, item: record })}
            title="Obriši"
          />
        </Space>
      ),
    },
  ];

  const formLoading = addConsultant.isPending || updateConsultant.isPending;
  const drawerContent =
    drawerMode === 'edit' && loadingItem ? (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 24 }}>
        <Spin />
      </div>
    ) : (
      <ExternalConsultantForm
        form={form}
        onFinish={onFormFinish}
        loading={formLoading}
        submitLabel={drawerMode === 'add' ? 'Dodaj' : 'Izmijeni'}
        onCancel={closeDrawer}
        editingConsultantId={drawerMode === 'edit' ? editingId : null}
        existingPersonalId={editingItem?.personal_id}
        existingContracts={editingItem?.contracts}
        onContractAdded={handleAddContract}
        onContractRemoved={() => refetch()}
        addContractLoading={addContractMutation?.isPending}
      />
    );

  return (
    <div style={{ padding: '0 4px' }}>
      <div
        style={{
          marginBottom: 16,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', justifyContent: 'space-between' }}>
          <Text strong style={{ fontSize: 18 }}>
            Saradnici
          </Text>
          <Space wrap size="small">
            <Search
              placeholder="Pretraga..."
              allowClear
              onSearch={setSearchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 220, minWidth: 160 }}
            />
            <Button type="primary" icon={<PlusOutlined />} onClick={openAddDrawer}>
              Dodaj saradnika
            </Button>
          </Space>
        </div>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={filteredConsultants}
          loading={isLoading}
          scroll={{ x: 680 }}
          pagination={{
            pageSize: 15,
            showSizeChanger: true,
            showTotal: (t) => `Ukupno: ${t}`,
            size: 'default',
          }}
          size="small"
          locale={{ emptyText: error ? 'Greška pri učitavanju' : 'Nema saradnika' }}
        />
      </div>
      <Modal
        title="Potvrda brisanja"
        open={deleteModal.visible}
        onOk={handleDelete}
        onCancel={() => setDeleteModal({ visible: false, item: null })}
        okText="Obriši"
        cancelText="Odustani"
        confirmLoading={deleteConsultant.isPending}
        okButtonProps={{ danger: true }}
      >
        Da li ste sigurni da želite obrisati konsultanta: {deleteModal.item?.name}{' '}
        {deleteModal.item?.surname}?
      </Modal>
      <Drawer
        title={drawerMode === 'add' ? 'Dodaj saradnika' : 'Izmijeni saradnika'}
        placement="right"
        width={480}
        open={drawerOpen}
        onClose={closeDrawer}
        destroyOnClose
      >
        {drawerContent}
      </Drawer>
    </div>
  );
}
