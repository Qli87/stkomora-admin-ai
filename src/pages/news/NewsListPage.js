/**
 * News list – table + side Drawer for add/edit.
 */
import React, { useMemo, useState, useEffect } from 'react';
import { Table, Input, Button, Space, Modal, Typography, message, Drawer, Spin, Form, Tooltip } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNews, useNewsItem, useAddNews, useUpdateNews, useDeleteNews } from '../../hooks/useNews';
import NewsForm from '../../components/forms/NewsForm';
import dayjs from 'dayjs';

const { Search } = Input;
const { Text } = Typography;

export default function NewsListPage() {
  const { data: newsList = [], isLoading, error } = useNews();
  const deleteNews = useDeleteNews();
  const addNews = useAddNews();
  const updateNews = useUpdateNews();
  const [searchText, setSearchText] = useState('');
  const [deleteModal, setDeleteModal] = useState({ visible: false, item: null });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState('add');
  const [editingId, setEditingId] = useState(null);
  const [form] = Form.useForm();

  const { data: editingItem, isLoading: loadingItem } = useNewsItem(editingId);

  useEffect(() => {
    if (!editingItem || drawerMode !== 'edit') return;
    form.setFieldsValue({
      title: editingItem.title,
      category_id: editingItem.category_id ?? editingItem.category?.id,
      date: editingItem.date ? dayjs(editingItem.date) : null,
      content: editingItem.content,
      full_text: editingItem.full_text,
    });
  }, [editingItem, drawerMode, form]);

  const filteredNews = useMemo(() => {
    if (!searchText.trim()) return newsList;
    const lower = searchText.toLowerCase();
    return newsList.filter((n) => (n.title && n.title.toLowerCase().includes(lower)));
  }, [newsList, searchText]);

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
      await deleteNews.mutateAsync(deleteModal.item.id);
      message.success('Vijest je obrisana');
      setDeleteModal({ visible: false, item: null });
    } catch (e) {
      message.error(e?.message || 'Greška pri brisanju');
    }
  };

  const onFormFinish = async (values) => {
    try {
      if (drawerMode === 'add') {
        await addNews.mutateAsync({
          title: values.title,
          category_id: values.category_id,
          category_name: values.category_name || '',
          date: values.date ? values.date.format('YYYY-MM-DD') : null,
          content: values.content || '',
          full_text: values.full_text || '',
        });
        message.success('Vijest je dodana');
      } else {
        await updateNews.mutateAsync({
          id: editingId,
          title: values.title,
          category_id: values.category_id,
          date: values.date ? values.date.format('YYYY-MM-DD') : null,
          content: values.content || '',
          full_text: values.full_text || '',
        });
        message.success('Vijest je ažurirana');
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
      width: 240,
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
      title: 'Kategorija',
      key: 'category',
      width: 120,
      ellipsis: true,
      render: (_, r) => r.category?.name ?? r.category_name ?? '–',
    },
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

  const formLoading = addNews.isPending || updateNews.isPending;
  const drawerContent =
    drawerMode === 'edit' && loadingItem ? (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 24 }}>
        <Spin />
      </div>
    ) : (
      <NewsForm
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
          Pregled vijesti
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
            Dodaj vijest
          </Button>
        </Space>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={filteredNews}
          loading={isLoading}
          scroll={{ x: 600 }}
          pagination={{
            pageSize: 15,
            showSizeChanger: true,
            showTotal: (t) => `Ukupno: ${t}`,
            size: 'default',
          }}
          size="small"
          locale={{ emptyText: error ? 'Greška pri učitavanju' : 'Nema vijesti' }}
        />
      </div>
      <Modal
        title="Potvrda brisanja"
        open={deleteModal.visible}
        onOk={handleDelete}
        onCancel={() => setDeleteModal({ visible: false, item: null })}
        okText="Obriši"
        cancelText="Odustani"
        confirmLoading={deleteNews.isPending}
        okButtonProps={{ danger: true }}
      >
        Da li ste sigurni da želite obrisati vijest: {deleteModal.item?.title}?
      </Modal>
      <Drawer
        title={drawerMode === 'add' ? 'Dodaj vijest' : 'Izmijeni vijest'}
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
