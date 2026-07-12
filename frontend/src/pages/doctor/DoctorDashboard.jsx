import { useState, useEffect } from 'react';
import api from '../../services/api';
import { Calendar, Clock, CheckCircle, XCircle, Loader2, FileText } from 'lucide-react';
import { format, isSameWeek, parseISO } from 'date-fns';

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedApt, setExpandedApt] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const [aptRes, rxRes] = await Promise.all([
          api.get('/doctor/appointments'),
          api.get('/doctor/prescriptions')
        ]);
        setAppointments(aptRes.data);
        setPrescriptions(rxRes.data);
      } catch (error) {
        console.error("Failed to fetch appointments", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAppointments();
  }, []);

  const handleConfirm = async (e, id) => {
    e.stopPropagation();
    try {
      await api.put(`/doctor/appointments/${id}/confirm`);
      setAppointments(appointments.map(a => a.id === id ? { ...a, appointmentStatus: 'CONFIRMED' } : a));
    } catch (error) {
      console.error("Failed to confirm appointment", error);
    }
  };

  const handleCancel = async (e, id) => {
    e.stopPropagation();
    try {
      await api.put(`/doctor/appointments/${id}/cancel`);
      setAppointments(appointments.map(a => a.id === id ? { ...a, appointmentStatus: 'CANCELLED' } : a));
    } catch (error) {
      console.error("Failed to cancel appointment", error);
    }
  };

  if (loading) {
    return <div className="flex h-full items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-primary-600" /></div>;
  }

  const now = new Date();
  
  // Filter for 'this week' schedule
  const thisWeekAppointments = appointments.filter(a => {
    const aptDate = parseISO(a.date);
    // isSameWeek compares by default to week starting Sunday
    return isSameWeek(aptDate, now);
  });
  
  const thisWeekActive = thisWeekAppointments.filter(a => a.appointmentStatus === 'PENDING' || a.appointmentStatus === 'CONFIRMED');
  const thisWeekPastOrCancelled = thisWeekAppointments.filter(a => a.appointmentStatus === 'COMPLETED' || a.appointmentStatus === 'CANCELLED');

  const upcomingAppointments = appointments.filter(a => a.appointmentStatus === 'PENDING' || a.appointmentStatus === 'CONFIRMED');

  // Map prescriptions to patient names
  const recentPrescriptions = prescriptions.slice(0, 4).map(rx => {
    const apt = appointments.find(a => a.id === rx.appointmentId);
    return {
      ...rx,
      patientName: apt ? apt.patientName : 'Unknown Patient'
    };
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Doctor Schedule</h1>
        <p className="mt-2 text-sm text-slate-600">Manage your appointments and availability.</p>
      </div>

      {/* Top Section - Horizontal Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-6 shadow-md border-t-4 border-t-primary-500 flex justify-between items-center">
          <div>
            <h3 className="text-sm font-medium text-slate-500">Pending Appointments</h3>
            <p className="mt-2 text-4xl font-bold text-slate-900">{upcomingAppointments.length}</p>
          </div>
          <Clock className="w-12 h-12 text-primary-200" />
        </div>
        
        <div className="glass-panel p-6 shadow-md border-t-4 border-t-secondary-500 flex justify-between items-center">
           <div>
             <h3 className="text-sm font-medium text-slate-500">Total Consultations</h3>
             <p className="mt-2 text-4xl font-bold text-slate-900">{appointments.filter(a => a.appointmentStatus === 'COMPLETED').length}</p>
           </div>
           <CheckCircle className="w-12 h-12 text-secondary-200" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* This Week's Active Schedule Section */}
          <div className="glass-panel shadow-md overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-200 bg-white/50">
              <h2 className="text-lg font-semibold text-slate-900 flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-primary-500" />
                This Week's Active Appointments (Pending & Confirmed)
              </h2>
            </div>
            
            <div className="divide-y divide-slate-100">
              {thisWeekActive.length === 0 ? (
                <div className="p-8 text-center text-slate-500">No active appointments scheduled for this week.</div>
              ) : (
                thisWeekActive.map((apt) => (
                  <div key={apt.id} className="cursor-pointer" onClick={() => setExpandedApt(expandedApt === apt.id ? null : apt.id)}>
                    <div className="p-6 hover:bg-slate-50/50 transition-colors flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-lg">
                          {apt.patientName.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-md font-medium text-slate-900">{apt.patientName}</h3>
                          <div className="flex items-center text-sm text-slate-500 mt-1">
                            <Clock className="w-4 h-4 mr-1" />
                            {apt.date} at {apt.time}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        {apt.appointmentStatus === 'PENDING' && (
                          <>
                            <button onClick={(e) => handleConfirm(e, apt.id)} className="btn-primary text-xs py-1.5 px-3">Keep</button>
                            <button onClick={(e) => handleCancel(e, apt.id)} className="btn-secondary text-red-600 bg-red-50 hover:bg-red-100 text-xs py-1.5 px-3">Reject</button>
                          </>
                        )}
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                          apt.appointmentStatus === 'COMPLETED' ? 'bg-green-50 text-green-700 border-green-200' :
                          apt.appointmentStatus === 'CANCELLED' ? 'bg-red-50 text-red-700 border-red-200' :
                          apt.appointmentStatus === 'CONFIRMED' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                          'bg-yellow-50 text-yellow-700 border-yellow-200'
                        }`}>
                          {apt.appointmentStatus}
                        </span>
                      </div>
                    </div>
                    {/* Accordion Details */}
                    {expandedApt === apt.id && (
                      <div className="px-6 pb-6 pt-2 bg-slate-50 border-t border-slate-100 text-sm animate-in slide-in-from-top-2">
                        <p className="font-semibold text-slate-700 mb-1">Problem / Reason for visit:</p>
                        <p className="text-slate-600 mb-3">{apt.reason || 'No reason provided'}</p>
                        
                        {apt.appointmentStatus === 'CANCELLED' && apt.cancellationReason && (
                          <div className="p-3 bg-red-50 rounded-lg border border-red-100">
                            <p className="font-semibold text-red-800 mb-1 flex items-center">
                              <XCircle className="w-4 h-4 mr-1" /> Cancelled by Patient
                            </p>
                            <p className="text-red-700">Reason: {apt.cancellationReason}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Completed & Cancelled Section */}
          <div className="glass-panel shadow-md overflow-hidden mt-6">
            <div className="px-6 py-5 border-b border-slate-200 bg-white/50">
              <h2 className="text-lg font-semibold text-slate-900 flex items-center">
                <CheckCircle className="mr-2 h-5 w-5 text-secondary-500" />
                This Week's Completed & Cancelled
              </h2>
            </div>
            
            <div className="divide-y divide-slate-100">
              {thisWeekPastOrCancelled.length === 0 ? (
                <div className="p-8 text-center text-slate-500">No completed or cancelled appointments this week.</div>
              ) : (
                thisWeekPastOrCancelled.map((apt) => (
                  <div key={apt.id} className="cursor-pointer" onClick={() => setExpandedApt(expandedApt === apt.id ? null : apt.id)}>
                    <div className="p-6 hover:bg-slate-50/50 transition-colors flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`h-12 w-12 rounded-full flex items-center justify-center font-bold text-lg ${apt.appointmentStatus === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {apt.patientName.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-md font-medium text-slate-900">{apt.patientName}</h3>
                          <div className="flex items-center text-sm text-slate-500 mt-1">
                            <Clock className="w-4 h-4 mr-1" />
                            {apt.date} at {apt.time}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                          apt.appointmentStatus === 'COMPLETED' ? 'bg-green-50 text-green-700 border-green-200' :
                          'bg-red-50 text-red-700 border-red-200'
                        }`}>
                          {apt.appointmentStatus}
                        </span>
                      </div>
                    </div>
                    {/* Accordion Details */}
                    {expandedApt === apt.id && (
                      <div className="px-6 pb-6 pt-2 bg-slate-50 border-t border-slate-100 text-sm animate-in slide-in-from-top-2">
                        <p className="font-semibold text-slate-700 mb-1">Problem / Reason for visit:</p>
                        <p className="text-slate-600 mb-3">{apt.reason || 'No reason provided'}</p>
                        
                        {apt.appointmentStatus === 'CANCELLED' && apt.cancellationReason && (
                          <div className="p-3 bg-red-50 rounded-lg border border-red-100">
                            <p className="font-semibold text-red-800 mb-1 flex items-center">
                              <XCircle className="w-4 h-4 mr-1" /> Cancelled by Patient
                            </p>
                            <p className="text-red-700">Reason: {apt.cancellationReason}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar: Recent Prescriptions */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-panel shadow-md overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-200 bg-white/50">
              <h2 className="text-lg font-semibold text-slate-900 flex items-center">
                <FileText className="mr-2 h-5 w-5 text-primary-500" />
                Recently Prescribed
              </h2>
            </div>
            
            <div className="p-4 space-y-3">
              {recentPrescriptions.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-4">No recent prescriptions.</p>
              ) : (
                recentPrescriptions.map(rx => (
                  <div key={rx.id} className="bg-slate-50 rounded-xl p-4 border border-slate-100 shadow-sm flex items-start gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center font-bold text-primary-700 shrink-0">
                      {rx.patientName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{rx.patientName}</p>
                      <p className="text-xs font-medium text-primary-600">{rx.diagnosis}</p>
                      <p className="text-[10px] text-slate-500 mt-1">{rx.issuedAt ? new Date(rx.issuedAt).toLocaleDateString() : 'N/A'}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>


    </div>
  );
};

export default DoctorDashboard;
