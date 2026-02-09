/**
 * Main app layout: Ant Design Layout with Sider + Header + Content.
 * On mobile: drawer menu instead of sidebar.
 */
import React, { useState } from 'react';
import { Layout, Menu, Dropdown, Avatar, Space, Drawer, Button } from 'antd';
import { Grid } from 'antd';
import {
  UserOutlined,
  TeamOutlined,
  IdcardOutlined,
  FileTextOutlined,
  BellOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MenuOutlined,
  HomeOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { routes } from '../../core/constants/routes';

const { useBreakpoint } = Grid;
const { Header, Sider, Content } = Layout;

const sidebarItems = [
  {
    key: routes.home,
    icon: <HomeOutlined />,
    label: 'Početna stranica',
  },
  {
    key: 'members',
    icon: <TeamOutlined />,
    label: 'Članovi komore',
    children: [
      { key: routes.membersList, label: 'Spisak članova' },
      { key: routes.licensesList, label: 'Licence' },
    ],
  },
  {
    key: 'news',
    icon: <FileTextOutlined />,
    label: 'Vijesti',
    children: [{ key: routes.news, label: 'Pregled vijesti' }],
  },
  {
    key: routes.advertisments,
    icon: <BellOutlined />,
    label: 'Oglasi',
    children: [{ key: routes.advertisments, label: 'Pregled oglasa' }],
  },
  {
    key: routes.employeesList,
    icon: <IdcardOutlined />,
    label: 'Zaposleni',
  },
  {
    key: routes.consultantsList,
    icon: <TeamOutlined />,
    label: 'Saradnici',
  },
  {
    key: routes.congress,
    icon: <FileTextOutlined />,
    label: 'Kongres',
  },
];

function flattenKeys(items) {
  const keys = [];
  items.forEach((item) => {
    if (item.children) {
      item.children.forEach((c) => keys.push(c.key));
    } else {
      keys.push(item.key);
    }
  });
  return keys;
}

export default function AppLayout() {
  const breakpoints = useBreakpoint();
  const isMobile = !breakpoints.lg;
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const onMenuSelect = ({ key }) => {
    if (key && key.startsWith('/')) {
      navigate(key);
      if (isMobile) setMobileMenuOpen(false);
    }
  };

  let selectedKeys = flattenKeys(sidebarItems).filter((path) =>
    location.pathname.startsWith(path)
  );
  if (selectedKeys.length === 0 && (location.pathname.includes('/izmjeniClana') || location.pathname.includes('/dodajClana'))) {
    selectedKeys = [routes.membersList];
  }

  const userMenuItems = [
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Odjava',
      onClick: logout,
    },
  ];

  const menuContent = (
    <>
      <div
        style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '8px 12px',
          color: isMobile ? '#1a1a1a' : '#fff',
          borderBottom: isMobile ? '1px solid #f0f0f0' : 'none',
          marginBottom: 8,
        }}
      >
        <img
          src={`${process.env.PUBLIC_URL || ''}/logo.png`}
          alt="Logo"
          style={{
            height: 44,
            width: 'auto',
            objectFit: 'contain',
            flexShrink: 0,
          }}
        />
        <span style={{ fontSize: 13, lineHeight: 1.2, fontWeight: 600 }}>
          Stomatološke komore Crne Gore
        </span>
      </div>
      <Menu
        theme={isMobile ? 'light' : 'dark'}
        mode="inline"
        selectedKeys={selectedKeys}
        items={sidebarItems}
        onClick={onMenuSelect}
        style={{ borderRight: 0 }}
      />
    </>
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {!isMobile && (
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <div
            style={{
              height: 64,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              padding: collapsed ? 8 : '8px 12px',
              color: '#fff',
              textAlign: collapsed ? 'center' : 'left',
            }}
          >
            <img
              src={`${process.env.PUBLIC_URL || ''}/logo.png`}
              alt="Logo"
              style={{
                height: collapsed ? 36 : 44,
                width: 'auto',
                objectFit: 'contain',
                flexShrink: 0,
              }}
            />
            {!collapsed && (
              <span style={{ fontSize: 13, lineHeight: 1.2, fontWeight: 600 }}>
                Stomatološke komore Crne Gore
              </span>
            )}
          </div>
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={selectedKeys}
            items={sidebarItems}
            onClick={onMenuSelect}
          />
        </Sider>
      )}
      <Layout>
        <Header
          style={{
            padding: isMobile ? '0 12px' : '0 16px',
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {isMobile ? (
            <Button
              type="text"
              icon={<MenuOutlined style={{ fontSize: 20 }} />}
              onClick={() => setMobileMenuOpen(true)}
              style={{ padding: '4px 8px' }}
            />
          ) : (
            React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
              style: { fontSize: 18 },
              onClick: () => setCollapsed(!collapsed),
            })
          )}
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <Space style={{ cursor: 'pointer' }}>
              <Avatar icon={<UserOutlined />} size={isMobile ? 'small' : 'default'} />
              {!isMobile && <span>Administrator</span>}
            </Space>
          </Dropdown>
        </Header>
        <Content className="app-layout-content">
          <Outlet />
        </Content>
      </Layout>
      {isMobile && (
        <Drawer
          title={null}
          placement="left"
          onClose={() => setMobileMenuOpen(false)}
          open={mobileMenuOpen}
          bodyStyle={{ padding: 0 }}
          width={280}
        >
          {menuContent}
        </Drawer>
      )}
    </Layout>
  );
}
