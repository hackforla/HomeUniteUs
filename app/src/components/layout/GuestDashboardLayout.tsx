import DashboardOutlined from '@mui/icons-material/DashboardOutlined';
import TaskOutlined from '@mui/icons-material/TaskOutlined';
import DocumentScannerOutlined from '@mui/icons-material/DocumentScannerOutlined';
import ContactsOutlined from '@mui/icons-material/ContactsOutlined';
import SettingsOutlined from '@mui/icons-material/SettingsOutlined';

import {DashboardLayout} from './DashboardLayout';

const navItems = [
  {title: 'Dashboard', icon: <DashboardOutlined />, href: '/guest'},
  {title: 'My Tasks', icon: <TaskOutlined />, href: '/guest/tasks'},
  {
    title: 'My Documents',
    icon: <DocumentScannerOutlined />,
    href: '/guest/documents',
  },
  {title: 'My Contacts', icon: <ContactsOutlined />, href: '/guest/contacts'},
  {title: 'Settings', icon: <SettingsOutlined />, href: '/guest/settings'},
  {title: 'Application', icon: <TaskOutlined />, href: '/guest/application'},
];

export const GuestDashboardLayout = () => {
  return <DashboardLayout navItems={navItems} />;
};
