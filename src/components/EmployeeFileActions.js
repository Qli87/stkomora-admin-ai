/**
 * View, Download, Print buttons for employee files (personal_id, contract).
 */
import React, { useState } from 'react';
import { Button, Space, message } from 'antd';
import { EyeOutlined, DownloadOutlined, PrinterOutlined } from '@ant-design/icons';
import { employeesApi } from '../core/api/employees';

export default function EmployeeFileActions({ employeeId, field, filePath, label }) {
  const [loading, setLoading] = useState(null);

  if (!filePath || !employeeId) return null;

  const handleView = async () => {
    setLoading('view');
    try {
      const blob = await employeesApi.fetchFileBlob(employeeId, field, 'inline');
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank', 'noopener,noreferrer');
      setTimeout(() => URL.revokeObjectURL(url), 60000);
    } catch (e) {
      message.error(e?.message || 'Greška pri pregledu fajla');
    } finally {
      setLoading(null);
    }
  };

  const handleDownload = async () => {
    setLoading('download');
    try {
      const blob = await employeesApi.fetchFileBlob(employeeId, field, 'attachment');
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filePath.split('/').pop() || `${field}.pdf`;
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
      const blob = await employeesApi.fetchFileBlob(employeeId, field, 'inline');
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

  return (
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
    </Space>
  );
}
