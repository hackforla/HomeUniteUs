/* eslint-disable */
import {ReactNode} from 'react';
import DashboardOutlined from '@mui/icons-material/DashboardOutlined';
import TaskOutlined from '@mui/icons-material/TaskOutlined';
import DocumentScannerOutlined from '@mui/icons-material/DocumentScannerOutlined';
import ContactsOutlined from '@mui/icons-material/ContactsOutlined';
import SettingsOutlined from '@mui/icons-material/SettingsOutlined';

import {DashboardLayout} from './DashboardLayout';

const navItems = [
  {title: 'Dashboard', icon: <DashboardOutlined />, href: '/host'},
  {title: 'My Tasks', icon: <TaskOutlined />, href: '/host/tasks'},
  {
    title: 'My Documents',
    icon: <DocumentScannerOutlined />,
    href: '/host/documents',
  },
  {title: 'My Contacts', icon: <ContactsOutlined />, href: '/host/contacts'},
  {title: 'Settings', icon: <SettingsOutlined />, href: '/host/settings'},
];

interface HostDashboardLayoutProps {
  children?: ReactNode;
}

export const HostDashboardLayout = ({children}: HostDashboardLayoutProps) => {
  return <DashboardLayout navItems={navItems}>{children}</DashboardLayout>;
};