import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { 
  HomeIcon, 
  TicketIcon, 
  ChartBarIcon, 
  UsersIcon, 
  QuestionMarkCircleIcon, 
  Cog6ToothIcon 
} from '@heroicons/react/24/outline';

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  const getNavItems = () => {
    const items = [
      { name: 'Dashboard', path: '/dashboard', icon: HomeIcon, roles: ['STUDENT', 'STAFF', 'ADMIN'] },
      { name: 'Tickets', path: '/dashboard/tickets', icon: TicketIcon, roles: ['STUDENT', 'STAFF', 'ADMIN'] },
      { name: 'Reports', path: '/dashboard/reports', icon: ChartBarIcon, roles: ['STAFF', 'ADMIN'] },
      { name: 'Users', path: '/dashboard/users', icon: UsersIcon, roles: ['ADMIN'] },
      { name: 'FAQs Mgmt', path: '/dashboard/faqs', icon: QuestionMarkCircleIcon, roles: ['ADMIN'] },
      { name: 'Settings', path: '/dashboard/settings', icon: Cog6ToothIcon, roles: ['STUDENT', 'STAFF', 'ADMIN'] },
    ];
    return items.filter(item => item.roles.includes(user?.role));
  };

  const navItems = getNavItems();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col hidden md:flex">
      <div className="h-16 flex items-center px-6 border-b border-gray-100">
        <span className="font-bold text-xl text-primary-600">IPB Helpdesk</span>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path) && 
            (item.path !== '/dashboard' || location.pathname === '/dashboard');
          
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive 
                  ? 'bg-primary-50 text-primary-700' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon className={`mr-3 flex-shrink-0 h-5 w-5 ${isActive ? 'text-primary-600' : 'text-gray-400'}`} />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
