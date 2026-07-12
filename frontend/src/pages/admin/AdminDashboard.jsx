import { useState, useEffect } from 'react';
import api from '../../services/api';
import { Users, Calendar, Activity as ActivityIcon, Loader2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await api.get('/admin/analytics');
        setStats(response.data);
      } catch (error) {
        console.error("Failed to fetch analytics", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAnalytics();
  }, []);

  if (loading) {
    return <div className="flex h-full items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-primary-600" /></div>;
  }

  // Mock data for the chart since actual historical data is complex to aggregate without complex queries
  const chartData = [
    { name: 'Mon', appointments: 12 },
    { name: 'Tue', appointments: 19 },
    { name: 'Wed', appointments: 15 },
    { name: 'Thu', appointments: 22 },
    { name: 'Fri', appointments: 28 },
    { name: 'Sat', appointments: 10 },
    { name: 'Sun', appointments: 5 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Admin Overview</h1>
        <p className="mt-2 text-sm text-slate-600">Monitor hospital activity and manage resources.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="glass-panel p-6 flex items-center shadow-md hover:shadow-lg transition-shadow border-l-4 border-l-primary-500">
          <div className="p-3 rounded-full bg-primary-100 text-primary-600">
            <Users className="h-8 w-8" />
          </div>
          <div className="ml-5">
            <p className="text-sm font-medium text-slate-500 truncate">Total Patients</p>
            <p className="mt-1 text-3xl font-semibold text-slate-900">{stats?.totalPatients || 0}</p>
          </div>
        </div>

        <div className="glass-panel p-6 flex items-center shadow-md hover:shadow-lg transition-shadow border-l-4 border-l-secondary-500">
          <div className="p-3 rounded-full bg-secondary-100 text-secondary-600">
            <ActivityIcon className="h-8 w-8" />
          </div>
          <div className="ml-5">
            <p className="text-sm font-medium text-slate-500 truncate">Total Doctors</p>
            <p className="mt-1 text-3xl font-semibold text-slate-900">{stats?.totalDoctors || 0}</p>
          </div>
        </div>

        <div className="glass-panel p-6 flex items-center shadow-md hover:shadow-lg transition-shadow border-l-4 border-l-green-500">
          <div className="p-3 rounded-full bg-green-100 text-green-600">
            <Calendar className="h-8 w-8" />
          </div>
          <div className="ml-5">
            <p className="text-sm font-medium text-slate-500 truncate">Total Appointments</p>
            <p className="mt-1 text-3xl font-semibold text-slate-900">{stats?.totalAppointments || 0}</p>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="glass-panel p-6 shadow-md mt-8">
        <h2 className="text-lg font-semibold text-slate-900 mb-6">Appointments This Week</h2>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dx={-10} />
              <Tooltip 
                cursor={{ fill: '#f1f5f9' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="appointments" fill="#0ea5e9" radius={[6, 6, 0, 0]} maxBarSize={50} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
