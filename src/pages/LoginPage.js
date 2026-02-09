/**
 * Modern login page – Stomatološke komore Crne Gore.
 * Split layout: branding left, form right.
 */
import React, { useEffect } from 'react';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { routes } from '../core/constants/routes';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, loginLoading, loginError, isAuthenticated } = useAuth();

  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate(routes.home, { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    if (loginError) message.error(loginError);
  }, [loginError]);

  const onFinish = async (values) => {
    try {
      await login({ email: values.email, password: values.password });
    } catch {
      // Error shown via loginError / message
    }
  };

  if (isAuthenticated) return null;

  return (
    <div className="login-page-wrap">
      {/* Left/top: branding – blue panel, logo in white/transparent */}
      <div
        className="login-page-branding"
        style={{
          background: 'linear-gradient(160deg, #0d47a1 0%, #1565c0 50%, #1976d2 100%)',
        }}
      >
        <div style={{ textAlign: 'center', width: '100%' }}>
          <img
            src={`${process.env.PUBLIC_URL || ''}/logo.png`}
            alt="Stomatološka komora"
            style={{
              width: 120,
              height: 'auto',
              marginBottom: 24,
              objectFit: 'contain',
              filter: 'brightness(0) invert(1)',
              opacity: 0.95,
            }}
          />
          <h1
            style={{
              color: '#fff',
              fontSize: 22,
              fontWeight: 600,
              lineHeight: 1.35,
              margin: 0,
              marginBottom: 8,
            }}
          >
            Stomatološke komore<br />Crne Gore
          </h1>
          <p
            style={{
              color: 'rgba(255,255,255,0.85)',
              fontSize: 14,
              margin: 0,
            }}
          >
            Administracija
          </p>
        </div>
      </div>

      {/* Right/bottom: form */}
      <div className="login-page-form-wrap">
        <div className="login-page-form-inner">
          <h2
            style={{
              fontSize: 24,
              fontWeight: 600,
              color: '#1a1a1a',
              marginBottom: 8,
            }}
          >
            Prijava
          </h2>
          <p
            style={{
              color: '#666',
              fontSize: 14,
              marginBottom: 32,
            }}
          >
            Unesite podatke za pristup administraciji
          </p>
          <Form
            name="login"
            onFinish={onFinish}
            layout="vertical"
            size="large"
            autoComplete="off"
            requiredMark={false}
          >
            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Unesite e-mail' },
                { type: 'email', message: 'Unesite ispravan e-mail' },
              ]}
            >
              <Input
                prefix={<UserOutlined style={{ color: '#999' }} />}
                placeholder="E-mail adresa"
                style={{ borderRadius: 8 }}
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Unesite lozinku' }]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: '#999' }} />}
                placeholder="Lozinka"
                style={{ borderRadius: 8 }}
              />
            </Form.Item>
            <Form.Item style={{ marginBottom: 16 }}>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={loginLoading}
                style={{
                  height: 48,
                  borderRadius: 8,
                  fontSize: 16,
                  fontWeight: 500,
                  background: '#1565c0',
                  borderColor: '#1565c0',
                }}
              >
                Prijavi se
              </Button>
            </Form.Item>
            <div style={{ textAlign: 'center' }}>
              <a
                href="/login"
                style={{
                  color: '#1976d2',
                  fontSize: 14,
                }}
              >
                Zaboravili ste lozinku?
              </a>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
