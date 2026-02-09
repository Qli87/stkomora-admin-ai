/**
 * 404 – functional component.
 */
import React from 'react';
import { Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { routes } from '../core/constants/routes';

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <Result
      status="404"
      title="404"
      subTitle="Stranica nije pronađena."
      extra={
        <Button type="primary" onClick={() => navigate(routes.home)}>
          Nazad na početnu
        </Button>
      }
    />
  );
}
