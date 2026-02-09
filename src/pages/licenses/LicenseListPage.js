/**
 * Licenses list – table + side Drawer for add/edit.
 */
import React, { useMemo, useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { Table, Input, Button, Space, Modal, Typography, message, Drawer, Spin, Form } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import {
  useLicenses,
  useLicense,
  useAddLicense,
  useUpdateLicense,
  useDeleteLicense,
} from '../../hooks/useLicenses';
import LicenseForm from '../../components/forms/LicenseForm';

const { Search } = Input;
const { Text } = Typography;

const LICENSE_TYPE_LABELS = { permanent: 'Stalna', temporary: 'Privremena' };

export default function LicenseListPage() {
  const { data: licenses = [], isLoading, error } = useLicenses();
  const deleteLicense = useDeleteLicense();
  const addLicense = useAddLicense();
  const updateLicense = useUpdateLicense();
  const [searchText, setSearchText] = useState('');
  const [deleteModal, setDeleteModal] = useState({ visible: false, item: null });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState('add');
  const [editingId, setEditingId] = useState(null);
  const [form] = Form.useForm();

  const { data: editingItem, isLoading: loadingItem } = useLicense(editingId);

  useEffect(() => {
    if (!editingItem || drawerMode !== 'edit') return;
    form.setFieldsValue({
      member_id: editingItem.member_id ?? editingItem.member?.id,
      type: editingItem.type,
      license_number: editingItem.license_number,
      expires_at: editingItem.expires_at ? dayjs(editingItem.expires_at) : null,
      kind: editingItem.kind,
    });
  }, [editingItem, drawerMode, form]);

  const filteredLicenses = useMemo(() => {
    if (!searchText.trim()) return licenses;
    const lower = searchText.toLowerCase();
    return licenses.filter(
      (l) =>
        (l.license_number && l.license_number.toLowerCase().includes(lower)) ||
        (l.member?.name && l.member.name.toLowerCase().includes(lower)) ||
        (l.member?.surname && l.member.surname.toLowerCase().includes(lower))
    );
  }, [licenses, searchText]);

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
      await deleteLicense.mutateAsync(deleteModal.item.id);
      message.success('Licenca je obrisana');
      setDeleteModal({ visible: false, item: null });
    } catch (e) {
      message.error(e?.message || 'Greška pri brisanju');
    }
  };

  const onFormFinish = async (values) => {
    try {
      const payload = {
        member_id: values.member_id,
        type: values.type,
        license_number: values.license_number || null,
        expires_at: values.expires_at
          ? (values.expires_at.format ? values.expires_at.format('YYYY-MM-DD') : values.expires_at)
          : null,
        kind: values.kind || null,
      };
      if (drawerMode === 'add') {
        await addLicense.mutateAsync(payload);
        message.success('Licenca je dodata');
      } else {
        await updateLicense.mutateAsync({ id: editingId, ...payload });
        message.success('Licenca je ažurirana');
      }
      closeDrawer();
    } catch (e) {
      message.error(e?.message || 'Greška');
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60, fixed: 'left' },
    {
      title: 'Stomatolog',
      key: 'member',
      width: 150,
      ellipsis: true,
      render: (_, r) =>
        r.member ? `${r.member.name || ''} ${r.member.surname || ''}`.trim() : '–',
    },
    {
      title: 'Tip',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (v) => LICENSE_TYPE_LABELS[v] || v || '–',
    },
    { title: 'Broj licence', dataIndex: 'license_number', key: 'license_number', width: 120 },
    {
      title: 'Isticanje',
      dataIndex: 'expires_at',
      key: 'expires_at',
      width: 110,
      render: (v) => (v ? new Date(v).toLocaleDateString() : '–'),
    },
    {
      title: 'Akcije',
      key: 'actions',
      width: 100,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Button type="link" icon={<EditOutlined />} onClick={() => openEditDrawer(record)} title="Izmijeni" />
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

  const formLoading = addLicense.isPending || updateLicense.isPending;
  const drawerContent =
    drawerMode === 'edit' && loadingItem ? (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 24 }}>
        <Spin />
      </div>
    ) : (
      <LicenseForm
        form={form}
        onFinish={onFormFinish}
        loading={formLoading}
        submitLabel={drawerMode === 'add' ? 'Dodaj' : 'Izmijeni'}
        onCancel={closeDrawer}
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
        <Text strong style={{ fontSize: 18 }}>
          Pregled licenci
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
            Dodaj licencu
          </Button>
        </Space>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={filteredLicenses}
          loading={isLoading}
          scroll={{ x: 640 }}
          pagination={{
            pageSize: 15,
            showSizeChanger: true,
            showTotal: (t) => `Ukupno: ${t}`,
            size: 'default',
          }}
          size="small"
          locale={{ emptyText: error ? 'Greška pri učitavanju' : 'Nema licenci' }}
        />
      </div>
      <Modal
        title="Potvrda brisanja"
        open={deleteModal.visible}
        onOk={handleDelete}
        onCancel={() => setDeleteModal({ visible: false, item: null })}
        okText="Obriši"
        cancelText="Odustani"
        confirmLoading={deleteLicense.isPending}
        okButtonProps={{ danger: true }}
      >
        Da li ste sigurni da želite obrisati licencu #{deleteModal.item?.id}?
      </Modal>
      <Drawer
        title={drawerMode === 'add' ? 'Dodaj licencu' : 'Izmijeni licencu'}
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
