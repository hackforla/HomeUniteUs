import DashboardOutlined from '@mui/icons-material/DashboardOutlined';

import {DashboardLayout} from './DashboardLayout';

const navItems = [
  {title: 'Dashboard', icon: <DashboardOutlined />, href: '/coordinator'},
];

export const CoordinatorDashboardLayout = () => {
  return <DashboardLayout navItems={navItems} />;
};
