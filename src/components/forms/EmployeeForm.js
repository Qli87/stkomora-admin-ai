/**
 * Employee form – used in Drawer (add/edit). Includes file uploads.
 */
import React from 'react';
import { Form, Input, DatePicker, Upload, Button, message } from 'antd';
import { UploadOutlined, FileTextOutlined } from '@ant-design/icons';
import EmployeeFileActions from '../EmployeeFileActions';

export default function EmployeeForm({
  form,
  onFinish,
  loading,
  submitLabel = 'Sačuvaj',
  cancelLabel = 'Odustani',
  onCancel,
  editingEmployeeId,
  existingPersonalId,
  existingContract,
}) {
  const normFile = (e) => {
    if (Array.isArray(e)) return e;
    return e?.fileList || [];
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish} autoComplete="off">
      <Form.Item name="jmbg" label="JMBG" rules={[{ required: true, len: 13, message: 'JMBG mora imati 13 cifara' }]}>
        <Input placeholder="13 cifara" maxLength={13} />
      </Form.Item>
      <Form.Item name="name" label="Ime" rules={[{ required: true }]}>
        <Input placeholder="Ime" />
      </Form.Item>
      <Form.Item name="surname" label="Prezime" rules={[{ required: true }]}>
        <Input placeholder="Prezime" />
      </Form.Item>
      <Form.Item name="email" label="E-mail" rules={[{ required: true }, { type: 'email' }]}>
        <Input placeholder="E-mail" type="email" />
      </Form.Item>
      <Form.Item name="phone" label="Telefon">
        <Input placeholder="Broj telefona" />
      </Form.Item>
      <Form.Item name="date_of_birth" label="Datum rođenja">
        <DatePicker format="DD.MM.YYYY" style={{ width: '100%' }} placeholder="Datum rođenja" />
      </Form.Item>
      <Form.Item
        name="personal_id"
        label="Lična karta / pasoš (PDF ili slika)"
        valuePropName="fileList"
        getValueFromEvent={normFile}
        getValueProps={(v) => (Array.isArray(v) ? { fileList: v } : { fileList: [] })}
        extra={
          editingEmployeeId && existingPersonalId && (
            <EmployeeFileActions
              employeeId={editingEmployeeId}
              field="personal_id"
              filePath={existingPersonalId}
            />
          )
        }
      >
        <Upload
          maxCount={1}
          beforeUpload={(file) => {
            const isPdf = file.type === 'application/pdf';
            const isImage = ['image/jpeg', 'image/jpg', 'image/png'].includes(file.type);
            if (!isPdf && !isImage) {
              message.error('Samo PDF ili JPEG/PNG fajlovi su dozvoljeni.');
              return Upload.LIST_IGNORE;
            }
            return false;
          }}
          accept=".pdf,.jpg,.jpeg,.png"
        >
          <Button icon={<UploadOutlined />}>Izaberi fajl</Button>
        </Upload>
      </Form.Item>
      <Form.Item
        name="contract"
        label="Ugovor o radu (PDF ili slika)"
        valuePropName="fileList"
        getValueFromEvent={normFile}
        getValueProps={(v) => (Array.isArray(v) ? { fileList: v } : { fileList: [] })}
        extra={
          editingEmployeeId && existingContract && (
            <EmployeeFileActions
              employeeId={editingEmployeeId}
              field="contract"
              filePath={existingContract}
            />
          )
        }
      >
        <Upload
          maxCount={1}
          beforeUpload={(file) => {
            const isPdf = file.type === 'application/pdf';
            const isImage = ['image/jpeg', 'image/jpg', 'image/png'].includes(file.type);
            if (!isPdf && !isImage) {
              message.error('Samo PDF ili JPEG/PNG fajlovi su dozvoljeni.');
              return Upload.LIST_IGNORE;
            }
            return false;
          }}
          accept=".pdf,.jpg,.jpeg,.png"
        >
          <Button icon={<FileTextOutlined />}>Izaberi fajl</Button>
        </Upload>
      </Form.Item>
      <Form.Item style={{ marginBottom: 0 }}>
        <Button type="primary" htmlType="submit" loading={loading} style={{ marginRight: 8 }}>
          {submitLabel}
        </Button>
        {onCancel && <Button onClick={onCancel}>{cancelLabel}</Button>}
      </Form.Item>
    </Form>
  );
}
