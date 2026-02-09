/**
 * Placeholder for routes not yet migrated to the new stack.
 */
import React from 'react';
import { Typography } from 'antd';

const { Title } = Typography;

export default function PlaceholderPage({ title = 'Stranica u izradi' }) {
  return (
    <div>
      <Title level={3}>{title}</Title>
      <p>Ova stranica će biti dostupna nakon migracije.</p>
    </div>
  );
}
