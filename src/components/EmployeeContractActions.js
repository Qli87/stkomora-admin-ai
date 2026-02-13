/**
 * View, Download, Print, Remove for a single employee contract.
 */
import React, { useState } from 'react';
import { Button, Space, Popconfirm, message } from 'antd';
import { EyeOutlined, DownloadOutlined, PrinterOutlined, DeleteOutlined } from '@ant-design/icons';
import { employeesApi } from '../core/api/employees';

export default function EmployeeContractActions({
  employeeId,
  contract,
  onRemoved,
  showRemove = false,
}) {
  const [loading, setLoading] = useState(null);

  const handleView = async () => {
    setLoading('view');
    try {
      const blob = await employeesApi.fetchContractBlob(employeeId, contract.id, 'inline');
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank', 'noopener,noreferrer');
      setTimeout(() => URL.revokeObjectURL(url), 60000);
    } catch (e) {
      message.error(e?.message || 'Greška pri pregledu');
    } finally {
      setLoading(null);
    }
  };

  const handleDownload = async () => {
    setLoading('download');
    try {
      const blob = await employeesApi.fetchContractBlob(employeeId, contract.id, 'attachment');
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = contract.contract?.split('/').pop() || `ugovor-${contract.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      message.error(e?.message || 'Greška pri preuzimanju');
    } finally {
      setLoading(null);
    }
  };

  const handlePrint = async () => {
    setLoading('print');
    try {
      const blob = await employeesApi.fetchContractBlob(employeeId, contract.id, 'inline');
      const url = URL.createObjectURL(blob);
      const printWindow = window.open(url, '_blank', 'noopener,noreferrer');
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.print();
          printWindow.onafterprint = () => printWindow.close();
        };
      }
      setTimeout(() => URL.revokeObjectURL(url), 60000);
    } catch (e) {
      message.error(e?.message || 'Greška pri štampi');
    } finally {
      setLoading(null);
    }
  };

  const handleRemove = async () => {
    setLoading('remove');
    try {
      await employeesApi.removeContract(employeeId, contract.id);
      message.success('Ugovor je obrisan');
      onRemoved?.();
    } catch (e) {
      message.error(e?.message || 'Greška pri brisanju');
    } finally {
      setLoading(null);
    }
  };

  const filename = contract.contract?.split('/').pop() || `Ugovor #${contract.id}`;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 12px',
        background: '#fafafa',
        borderRadius: 6,
        marginBottom: 6,
        border: '1px solid #f0f0f0',
      }}
    >
      <span style={{ fontSize: 13, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {filename}
      </span>
      <Space size="small">
        <Button
          type="link"
          size="small"
          icon={<EyeOutlined />}
          onClick={handleView}
          loading={loading === 'view'}
        >
          Pregled
        </Button>
        <Button
          type="link"
          size="small"
          icon={<DownloadOutlined />}
          onClick={handleDownload}
          loading={loading === 'download'}
        >
          Preuzmi
        </Button>
        <Button
          type="link"
          size="small"
          icon={<PrinterOutlined />}
          onClick={handlePrint}
          loading={loading === 'print'}
        >
          Štampaj
        </Button>
        {showRemove && (
          <Popconfirm
            title="Obriši ugovor?"
            onConfirm={handleRemove}
            okText="Da"
            cancelText="Ne"
          >
            <Button
              type="link"
              size="small"
              danger
              icon={<DeleteOutlined />}
              loading={loading === 'remove'}
            >
              Obriši
            </Button>
          </Popconfirm>
        )}
      </Space>
    </div>
  );
}
