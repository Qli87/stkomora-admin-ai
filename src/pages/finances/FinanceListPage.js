/**
 * Finances list – table + side Drawer for add/edit + details drawer.
 */
import React, { useMemo, useState, useEffect } from 'react';
import {
  Table, Input, Button, Space, Modal, Typography, message,
  Drawer, Spin, Form, Select, Tag,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import {
  useFinances,
  useFinance,
  useAddFinance,
  useUpdateFinance,
  useDeleteFinance,
  useMemberFinanceDetails,
} from '../../hooks/useFinances';
import { useMembers } from '../../hooks/useMembers';
import FinanceForm from '../../components/forms/FinanceForm';

const { Search } = Input;
const { Text } = Typography;

function fmtMoney(v) {
  const n = Number(v);
  return isNaN(n) ? '0.00' : n.toFixed(2);
}

/* ───── Details Drawer Content ───── */
function MemberDetailsContent({ memberId }) {
  const { data, isLoading } = useMemberFinanceDetails(memberId);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 24 }}>
        <Spin />
      </div>
    );
  }

  if (!data) return <Text type="secondary">Nema podataka</Text>;

  const columns = [
    {
      title: 'Datum',
      dataIndex: 'date',
      key: 'date',
      render: (v) => (v ? dayjs(v).format('DD.MM.YYYY') : '–'),
    },
    {
      title: 'Opis',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (v) => v || '–',
    },
    {
      title: 'Duguje',
      dataIndex: 'duguje',
      key: 'duguje',
      align: 'right',
      render: (v) => (
        <span style={{ display: 'block', textAlign: 'right' }}>
          <Text type={Number(v) > 0 ? 'danger' : undefined}>{fmtMoney(v)}</Text>
        </span>
      ),
    },
    {
      title: 'Potražuje',
      dataIndex: 'potrazuje',
      key: 'potrazuje',
      align: 'right',
      render: (v) => (
        <span style={{ display: 'block', textAlign: 'right' }}>
          <Text type={Number(v) > 0 ? 'success' : undefined}>{fmtMoney(v)}</Text>
        </span>
      ),
    },
  ];

  const total = Number(data.total);

  return (
    <>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={data.records || []}
        pagination={data.records?.length > 20 ? { pageSize: 20, size: 'small' } : false}
        size="small"
        bordered
        locale={{ emptyText: 'Nema stavki' }}
      />
      <div
        style={{
          marginTop: 16,
          padding: '14px 20px',
          background: total > 0 ? '#fff2f0' : total < 0 ? '#f6ffed' : '#fafafa',
          border: `1px solid ${total > 0 ? '#ffccc7' : total < 0 ? '#b7eb8f' : '#f0f0f0'}`,
          borderRadius: 8,
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
        }}
      >
        <Text
          strong
          style={{
            fontSize: 16,
            color: total > 0 ? '#cf1322' : total < 0 ? '#389e0d' : undefined,
          }}
        >
          Ukupno: {fmtMoney(data.total)} €
        </Text>
      </div>
    </>
  );
}

/* ───── Main Page ───── */
export default function FinanceListPage() {
  const { data: finances = [], isLoading, error } = useFinances();
  const deleteFinance = useDeleteFinance();
  const addFinance = useAddFinance();
  const updateFinance = useUpdateFinance();

  const [searchText, setSearchText] = useState('');
  const [memberFilter, setMemberFilter] = useState('all');
  const [deleteModal, setDeleteModal] = useState({ visible: false, item: null });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState('add');
  const [editingId, setEditingId] = useState(null);
  const [detailsMemberId, setDetailsMemberId] = useState(null);
  const [detailsMemberName, setDetailsMemberName] = useState('');
  const [form] = Form.useForm();

  const { data: editingItem, isLoading: loadingItem } = useFinance(editingId);

  useEffect(() => {
    if (!editingItem || drawerMode !== 'edit') return;
    form.setFieldsValue({
      member_id: editingItem.user_id ?? editingItem.user?.id ?? editingItem.member_id ?? editingItem.member?.id,
      date: editingItem.date ? dayjs(editingItem.date) : null,
      duguje: Number(editingItem.duguje),
      potrazuje: Number(editingItem.potrazuje),
      description: editingItem.description ?? '',
    });
  }, [editingItem, drawerMode, form]);

  /* Build member filter options */
  const memberFilterOptions = useMemo(() => {
    const map = new Map();
    finances.forEach((f) => {
      const user = f.user || f.member; // Support both user (new) and member (legacy)
      if (user?.id) {
        map.set(user.id, `${user.name || ''} ${user.surname || ''}`.trim());
      }
    });
    const sorted = [...map.entries()].sort((a, b) => a[1].localeCompare(b[1]));
    return [
      { value: 'all', label: 'Svi članovi' },
      ...sorted.map(([id, name]) => ({ value: id, label: name })),
    ];
  }, [finances]);

  const filteredFinances = useMemo(() => {
    let result = finances;
    if (memberFilter !== 'all') {
      result = result.filter((f) => {
        const userId = f.user_id ?? f.user?.id ?? f.member_id ?? f.member?.id;
        return userId === memberFilter;
      });
    }
    if (searchText.trim()) {
      const lower = searchText.toLowerCase();
      result = result.filter((f) => {
        const user = f.user || f.member; // Support both user (new) and member (legacy)
        return (
          (user?.name && user.name.toLowerCase().includes(lower)) ||
          (user?.surname && user.surname.toLowerCase().includes(lower)) ||
          (f.description && f.description.toLowerCase().includes(lower))
        );
      });
    }
    return result;
  }, [finances, searchText, memberFilter]);

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

  const openDetails = (record) => {
    const user = record.user || record.member; // Support both user (new) and member (legacy)
    const memberId = record.user_id ?? user?.id ?? record.member_id;
    const name = user
      ? `${user.name || ''} ${user.surname || ''}`.trim()
      : '';
    setDetailsMemberId(memberId);
    setDetailsMemberName(name);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setEditingId(null);
    form.resetFields();
  };

  const handleDelete = async () => {
    if (!deleteModal.item?.id) return;
    try {
      await deleteFinance.mutateAsync(deleteModal.item.id);
      message.success('Stavka je obrisana');
      setDeleteModal({ visible: false, item: null });
    } catch (e) {
      message.error(e?.message || 'Greška pri brisanju');
    }
  };

  const onFormFinish = async (values) => {
    try {
      const payload = {
        user_id: values.member_id, // member_id from form is actually user_id now
        date: values.date ? dayjs(values.date).format('YYYY-MM-DD') : null,
        duguje: values.duguje ?? 0,
        potrazuje: values.potrazuje ?? 0,
        description: values.description?.trim() || null,
      };
      if (drawerMode === 'add') {
        await addFinance.mutateAsync(payload);
        message.success('Stavka je dodana');
      } else {
        await updateFinance.mutateAsync({ id: editingId, ...payload });
        message.success('Stavka je ažurirana');
      }
      closeDrawer();
    } catch (e) {
      message.error(e?.message || 'Greška');
    }
  };

  const columns = [
    {
      title: 'Datum',
      dataIndex: 'date',
      key: 'date',
      width: 110,
      render: (v) => (v ? dayjs(v).format('DD.MM.YYYY') : '–'),
    },
    {
      title: 'Član',
      key: 'user',
      width: 160,
      ellipsis: true,
      render: (_, r) => {
        const user = r.user || r.member; // Support both user (new) and member (legacy)
        return user ? `${user.name || ''} ${user.surname || ''}`.trim() : '–';
      },
    },
    {
      title: 'Opis',
      dataIndex: 'description',
      key: 'description',
      width: 180,
      ellipsis: true,
      responsive: ['lg'],
      render: (v) => v || '–',
    },
    {
      title: 'Duguje',
      dataIndex: 'duguje',
      key: 'duguje',
      width: 100,
      align: 'right',
      responsive: ['md'],
      render: (v) => {
        const n = Number(v);
        return (
          <span style={{ display: 'block', textAlign: 'right' }}>
            {n > 0 ? <Tag color="red">{fmtMoney(n)}</Tag> : fmtMoney(n)}
          </span>
        );
      },
    },
    {
      title: 'Potražuje',
      dataIndex: 'potrazuje',
      key: 'potrazuje',
      width: 100,
      align: 'right',
      responsive: ['md'],
      render: (v) => {
        const n = Number(v);
        return (
          <span style={{ display: 'block', textAlign: 'right' }}>
            {n > 0 ? <Tag color="green">{fmtMoney(n)}</Tag> : fmtMoney(n)}
          </span>
        );
      },
    },
    {
      title: 'Ukupno',
      key: 'total',
      width: 100,
      align: 'right',
      render: (_, r) => {
        const t = Number(r.duguje) - Number(r.potrazuje);
        return (
          <Text strong style={{ color: t > 0 ? '#cf1322' : t < 0 ? '#389e0d' : undefined }}>
            {fmtMoney(t)}
          </Text>
        );
      },
    },
    {
      title: 'Akcije',
      key: 'actions',
      width: 100,
      render: (_, record) => (
        <Space size={0}>
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => openDetails(record)}
            title="Detalji"
          />
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => openEditDrawer(record)}
            title="Izmijeni"
          />
          <Button
            type="link"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => setDeleteModal({ visible: true, item: record })}
            title="Obriši"
          />
        </Space>
      ),
    },
  ];

  const formLoading = addFinance.isPending || updateFinance.isPending;
  const drawerContent =
    drawerMode === 'edit' && loadingItem ? (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 24 }}>
        <Spin />
      </div>
    ) : (
      <FinanceForm
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
          Finansije
        </Text>
        <Space wrap size="small">
          <Select
            value={memberFilter}
            onChange={setMemberFilter}
            style={{ width: 180 }}
            options={memberFilterOptions}
            showSearch
            optionFilterProp="label"
          />
          <Search
            placeholder="Pretraga..."
            allowClear
            onSearch={setSearchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 220, minWidth: 160 }}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={openAddDrawer}>
            Dodaj stavku
          </Button>
        </Space>
      </div>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={filteredFinances}
        loading={isLoading}
        pagination={{
          pageSize: 15,
          showSizeChanger: true,
          showTotal: (t) => `Ukupno: ${t}`,
          size: 'default',
        }}
        size="middle"
        locale={{ emptyText: error ? 'Greška pri učitavanju' : 'Nema stavki' }}
        onRow={(record) => ({
          onClick: (e) => {
            // Don't open details when clicking action buttons
            if (e.target.closest('button') || e.target.closest('a')) return;
            openDetails(record);
          },
          style: { cursor: 'pointer' },
        })}
      />

      {/* Delete modal */}
      <Modal
        title="Potvrda brisanja"
        open={deleteModal.visible}
        onOk={handleDelete}
        onCancel={() => setDeleteModal({ visible: false, item: null })}
        okText="Obriši"
        cancelText="Odustani"
        confirmLoading={deleteFinance.isPending}
        okButtonProps={{ danger: true }}
      >
        Da li ste sigurni da želite obrisati ovu stavku?
      </Modal>

      {/* Add / Edit drawer */}
      <Drawer
        title={drawerMode === 'add' ? 'Dodaj stavku' : 'Izmijeni stavku'}
        placement="right"
        width={420}
        open={drawerOpen}
        onClose={closeDrawer}
        destroyOnClose
      >
        {drawerContent}
      </Drawer>

      {/* Member details drawer */}
      <Drawer
        title={`Detalji – ${detailsMemberName || 'Član'}`}
        placement="right"
        width={560}
        open={!!detailsMemberId}
        onClose={() => setDetailsMemberId(null)}
        destroyOnClose
      >
        {detailsMemberId && <MemberDetailsContent memberId={detailsMemberId} />}
      </Drawer>
    </div>
  );
}
