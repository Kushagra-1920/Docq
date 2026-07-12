import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { Calendar, FileText, CheckCircle, Clock, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

const PatientDashboard = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedAptId, setExpandedAptId] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);
  const [cancelReason, setCancelReason] = useState('');

  const toggleAccordion = (id) => {
    setExpandedAptId(prev => prev === id ? null : id);
    if (expandedAptId !== id) {
      setCancellingId(null);
    }
  };

  const handleCancel = async (id) => {
    try {
      await api.put(`/patient/appointments/${id}/cancel${cancelReason ? `?reason=${encodeURIComponent(cancelReason)}` : ''}`);
      setAppointments(appointments.map(apt => apt.id === id ? { ...apt, appointmentStatus: 'CANCELLED' } : apt));
      setCancellingId(null);
      setCancelReason('');
    } catch (err) {
      console.error("Failed to cancel", err);
      alert("Failed to cancel appointment");
    }
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await api.get('/patient/appointments');
        setAppointments(response.data);
      } catch (error) {
        console.error("Failed to fetch appointments", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAppointments();
  }, []);

  if (loading) {
    return <div className="flex h-full items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-primary-600" /></div>;
  }

  const upcomingAppointments = appointments.filter(a => a.appointmentStatus === 'PENDING' || a.appointmentStatus === 'CONFIRMED');
  const pastAppointments = appointments.filter(a => a.appointmentStatus === 'COMPLETED' || a.appointmentStatus === 'CANCELLED');

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">My Appointments</h1>
          <p className="mt-2 text-sm text-slate-600">View and manage your upcoming medical visits.</p>
        </div>
        <button 
          onClick={() => navigate('/patient/book')}
          className="btn-primary flex items-center shadow-lg shadow-primary-500/30"
        >
          <Calendar className="w-5 h-5 mr-2" />
          Book New Appointment
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Upcoming */}
        <div className="glass-panel overflow-hidden shadow-md">
          <div className="px-6 py-4 bg-primary-50/50 border-b border-primary-100 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-primary-900 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-primary-600" />
              Upcoming Visits
            </h2>
            <span className="bg-primary-100 text-primary-700 py-1 px-3 rounded-full text-xs font-bold">
              {upcomingAppointments.length}
            </span>
          </div>
          <div className="p-2 max-h-[400px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {upcomingAppointments.length === 0 ? (
              <div className="p-8 text-center text-slate-500">No upcoming appointments.</div>
            ) : (
              <div className="space-y-2">
                {upcomingAppointments.map((apt) => (
                  <div 
                    key={apt.id} 
                    onClick={() => toggleAccordion(apt.id)}
                    className="p-4 rounded-xl border border-slate-100 hover:border-primary-200 hover:shadow-md transition-all bg-white cursor-pointer group"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold text-slate-900 group-hover:text-primary-700 transition-colors">{apt.doctorName}</h3>
                        <div className="flex gap-4 mt-2 text-sm text-slate-500">
                          <span className="flex items-center"><Calendar className="w-4 h-4 mr-1" /> {apt.date}</span>
                          <span className="flex items-center"><Clock className="w-4 h-4 mr-1" /> {apt.time}</span>
                        </div>
                      </div>
                      <div>
                         <span className="px-3 py-1 rounded-full text-xs font-medium border bg-blue-50 text-blue-700 border-blue-200">
                          {apt.appointmentStatus === 'PENDING' || apt.appointmentStatus === 'CONFIRMED' ? 'BOOKED' : apt.appointmentStatus}
                        </span>
                      </div>
                    </div>
                    {expandedAptId === apt.id && (
                      <div className="mt-4 pt-3 border-t border-slate-100 text-sm text-slate-600 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                          <div>
                            <span className="font-semibold text-slate-700 block mb-1 flex items-center">
                              <FileText className="w-4 h-4 mr-1 inline" /> Reason for visit
                            </span>
                            <span className="italic">{apt.reason || 'No reason provided.'}</span>
                          </div>
                          
                          <div className="shrink-0 w-full sm:w-auto border-t sm:border-t-0 sm:border-l border-slate-100 pt-3 sm:pt-0 sm:pl-4 mt-2 sm:mt-0">
                            {cancellingId === apt.id ? (
                               <div className="flex flex-col gap-2">
                                 <input 
                                   type="text" 
                                   placeholder="Reason for cancelling (optional)" 
                                   className="text-xs p-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-red-500 focus:border-red-500 w-full"
                                   onClick={(e) => e.stopPropagation()}
                                   onChange={(e) => setCancelReason(e.target.value)}
                                   value={cancelReason}
                                 />
                                 <div className="flex gap-2 justify-end">
                                   <button 
                                     onClick={(e) => { e.stopPropagation(); setCancellingId(null); }}
                                     className="text-xs px-3 py-1.5 text-slate-500 hover:text-slate-700 font-medium"
                                   >
                                     Keep It
                                   </button>
                                   <button 
                                     onClick={(e) => { e.stopPropagation(); handleCancel(apt.id); }}
                                     className="text-xs px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold shadow-sm transition-colors"
                                   >
                                     Confirm Cancel
                                   </button>
                                 </div>
                               </div>
                            ) : (
                              <button 
                                onClick={(e) => { e.stopPropagation(); setCancellingId(apt.id); setCancelReason(''); }}
                                className="text-xs px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 border border-red-100 rounded-lg font-medium transition-colors w-full sm:w-auto"
                              >
                                Cancel Appointment
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Past */}
        <div className="glass-panel overflow-hidden shadow-sm">
          <div className="px-6 py-4 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-700 flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-slate-500" />
              Past Visits
            </h2>
          </div>
          <div className="p-2 max-h-[400px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {pastAppointments.length === 0 ? (
              <div className="p-8 text-center text-slate-500">No past appointments.</div>
            ) : (
              <div className="space-y-2">
                {pastAppointments.map((apt) => (
                  <div 
                    key={apt.id} 
                    onClick={() => toggleAccordion(apt.id)}
                    className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-all cursor-pointer opacity-80 hover:opacity-100"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium text-slate-800">{apt.doctorName}</h3>
                        <div className="text-sm text-slate-500 mt-1">
                          {apt.date} at {apt.time}
                        </div>
                      </div>
                      <div>
                         <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                          apt.appointmentStatus === 'COMPLETED' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
                        }`}>
                          {apt.appointmentStatus}
                        </span>
                      </div>
                    </div>
                    {expandedAptId === apt.id && (
                      <div className="mt-4 pt-3 border-t border-slate-200 text-sm text-slate-600 animate-in fade-in slide-in-from-top-2 duration-200">
                        <span className="font-semibold text-slate-700 block mb-1 flex items-center">
                          <FileText className="w-4 h-4 mr-1 inline" /> Reason for visit
                        </span>
                        <span className="italic">{apt.reason || 'No reason provided.'}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default PatientDashboard;
