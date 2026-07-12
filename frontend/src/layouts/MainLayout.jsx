import { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { LogOut, Menu, X, Home, Calendar, Users, Activity, FileText, Settings, HeartPulse, Building2 } from 'lucide-react';
import ProfileModal from '../components/ProfileModal';

const MainLayout = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const role = user?.roles[0]; // e.g., ROLE_ADMIN

  const getNavItems = () => {
    switch (role) {
      case 'ROLE_ADMIN':
        return [
          { name: 'Dashboard', path: '/admin', icon: Activity },
          { name: 'Doctors', path: '/admin/doctors', icon: Users },
          { name: 'Departments', path: '/admin/departments', icon: Building2 },
        ];
      case 'ROLE_DOCTOR':
        return [
          { name: 'Schedule', path: '/doctor', icon: Calendar },
          { name: 'Patients', path: '/doctor/patients', icon: Users },
          { name: 'Prescriptions', path: '/doctor/prescriptions', icon: FileText },
        ];
      case 'ROLE_PATIENT':
        return [
          { name: 'My Appointments', path: '/patient', icon: Calendar },
          { name: 'Book Appointment', path: '/patient/book', icon: HeartPulse },
          { name: 'Medical Records', path: '/patient/records', icon: FileText },
          { name: 'Doctor Details', path: '/patient/doctors', icon: Users },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  const roleColors = {
    'ROLE_ADMIN': 'bg-slate-900',
    'ROLE_DOCTOR': 'bg-primary-700',
    'ROLE_PATIENT': 'bg-secondary-700',
  };

  const sidebarColor = roleColors[role] || 'bg-slate-800';

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-slate-900/50 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 ${sidebarColor} text-white transform transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-auto lg:flex lg:w-64 lg:flex-col shadow-xl ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-16 shrink-0 items-center px-6 bg-black/10 border-b border-white/10">
          <Activity className="h-8 w-8 text-white opacity-90" />
          <span className="ml-3 text-xl font-bold tracking-tight">CareConnect</span>
        </div>
        
        <div className="flex flex-1 flex-col overflow-y-auto px-4 py-6">
          <nav className="flex-1 space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path || (location.pathname.startsWith(item.path) && item.path !== '/admin' && item.path !== '/doctor' && item.path !== '/patient');
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`group flex items-center rounded-xl px-3 py-3 text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-white/20 text-white shadow-sm backdrop-blur-md' 
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className={`mr-3 h-5 w-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-white/70 group-hover:text-white'}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-white/10 p-4 bg-black/10">
          <div 
            className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-white/10 cursor-pointer transition-colors"
            onClick={() => setProfileModalOpen(true)}
          >
            <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-lg shadow-inner">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold truncate w-32">{user?.email}</span>
              <span className="text-xs text-white/60">{role?.replace('ROLE_', '')}</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="mt-4 w-full flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Topbar */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white/70 backdrop-blur-md px-4 sm:px-6 shadow-sm z-10">
          <button
            type="button"
            className="text-slate-500 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 lg:hidden rounded-lg p-1"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="flex flex-1 justify-end px-4">
            {/* Topbar items can go here */}
          </div>
        </header>

        {/* Main scrollable area */}
        <main className="flex-1 overflow-y-auto bg-slate-50 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
      
      {/* Modals */}
      <ProfileModal isOpen={profileModalOpen} onClose={() => setProfileModalOpen(false)} />
    </div>
  );
};

export default MainLayout;
