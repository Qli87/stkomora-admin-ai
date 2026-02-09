/**
 * Advertisements (Oglasi) list – table + side Drawer for add/edit.
 */
import React, { useMemo, useState, useEffect } from 'react';
import { Table, Input, Button, Space, Modal, Typography, message, Drawer, Spin, Form, Tooltip } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import {
  useAdvertisments,
  useAdvertisment,
  useAddAdvertisment,
  useUpdateAdvertisment,
  useDeleteAdvertisment,
} from '../../hooks/useAdvertisments';
import AdvForm from '../../components/forms/AdvForm';

const { Search } = Input;
const { Text } = Typography;

export default function AdvListPage() {
  const { data: advList = [], isLoading, error } = useAdvertisments();
  const deleteAdv = useDeleteAdvertisment();
  const addAdv = useAddAdvertisment();
  const updateAdv = useUpdateAdvertisment();
  const [searchText, setSearchText] = useState('');
  const [deleteModal, setDeleteModal] = useState({ visible: false, item: null });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState('add');
  const [editingId, setEditingId] = useState(null);
  const [form] = Form.useForm();

  const { data: editingItem, isLoading: loadingItem } = useAdvertisment(editingId);

  useEffect(() => {
    if (!editingItem || drawerMode !== 'edit') return;
    form.setFieldsValue({
      title: editingItem.title,
      full_text: editingItem.full_text,
      phone: editingItem.phone,
    });
  }, [editingItem, drawerMode, form]);

  const filteredAdv = useMemo(() => {
    if (!searchText.trim()) return advList;
    const lower = searchText.toLowerCase();
    return advList.filter((a) => a.title && a.title.toLowerCase().includes(lower));
  }, [advList, searchText]);

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
      await deleteAdv.mutateAsync(deleteModal.item.id);
      message.success('Oglas je obrisan');
      setDeleteModal({ visible: false, item: null });
    } catch (e) {
      message.error(e?.message || 'Greška pri brisanju');
    }
  };

  const onFormFinish = async (values) => {
    try {
      if (drawerMode === 'add') {
        await addAdv.mutateAsync({
          title: values.title,
          full_text: values.full_text,
          phone: values.phone,
        });
        message.success('Oglas je dodan');
      } else {
        await updateAdv.mutateAsync({
          id: editingId,
          title: values.title,
          full_text: values.full_text,
          phone: values.phone,
        });
        message.success('Oglas je ažuriran');
      }
      closeDrawer();
    } catch (e) {
      message.error(e?.message || 'Greška');
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60, fixed: 'left' },
    {
      title: 'Naslov',
      dataIndex: 'title',
      key: 'title',
      width: 220,
      ellipsis: { showTitle: false },
      render: (title) =>
        title ? (
          <Tooltip placement="topLeft" title={title}>
            <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</span>
          </Tooltip>
        ) : (
          '–'
        ),
    },
    {
      title: 'Tekst',
      key: 'text',
      width: 200,
      ellipsis: { showTitle: false },
      render: (_, r) => {
        const text = r.full_text ? String(r.full_text).slice(0, 60) + (r.full_text.length > 60 ? '…' : '') : '–';
        return (
          <Tooltip placement="topLeft" title={r.full_text || '–'}>
            <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis' }}>{text}</span>
          </Tooltip>
        );
      },
    },
    { title: 'Tel', dataIndex: 'phone', key: 'phone', width: 115 },
    {
      title: 'Datum',
      dataIndex: 'date',
      key: 'date',
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

  const formLoading = addAdv.isPending || updateAdv.isPending;
  const drawerContent =
    drawerMode === 'edit' && loadingItem ? (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 24 }}>
        <Spin />
      </div>
    ) : (
      <AdvForm
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
          Pregled oglasa
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
            Dodaj oglas
          </Button>
        </Space>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={filteredAdv}
          loading={isLoading}
          scroll={{ x: 720 }}
          pagination={{
            pageSize: 15,
            showSizeChanger: true,
            showTotal: (t) => `Ukupno: ${t}`,
            size: 'default',
          }}
          size="small"
          locale={{ emptyText: error ? 'Greška pri učitavanju' : 'Nema oglasa' }}
        />
      </div>
      <Modal
        title="Potvrda brisanja"
        open={deleteModal.visible}
        onOk={handleDelete}
        onCancel={() => setDeleteModal({ visible: false, item: null })}
        okText="Obriši"
        cancelText="Odustani"
        confirmLoading={deleteAdv.isPending}
        okButtonProps={{ danger: true }}
      >
        Da li ste sigurni da želite obrisati oglas: {deleteModal.item?.title}?
      </Modal>
      <Drawer
        title={drawerMode === 'add' ? 'Dodaj oglas' : 'Izmijeni oglas'}
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
