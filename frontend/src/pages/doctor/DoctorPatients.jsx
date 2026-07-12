import { useState, useEffect } from 'react';
import api from '../../services/api';
import { User, Calendar, FileText, ChevronDown, ChevronUp, Loader2, Phone, Droplet, Info, Search } from 'lucide-react';

const DoctorPatients = () => {
  const [appointments, setAppointments] = useState([]);
  const [uniquePatients, setUniquePatients] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const patientsPerPage = 4;
  
  // Search State
  const [searchQuery, setSearchQuery] = useState('');

  // Accordion State
  const [expandedPatientId, setExpandedPatientId] = useState(null);
  const [patientDetails, setPatientDetails] = useState({}); // { [id]: { profile, prescriptions, loading } }

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await api.get('/doctor/appointments');
        setAppointments(response.data);
        
        // Extract unique patients from appointments
        const patientMap = new Map();
        response.data.forEach(apt => {
          if (!patientMap.has(apt.patientId)) {
            patientMap.set(apt.patientId, {
              id: apt.patientId,
              name: apt.patientName
            });
          }
        });
        setUniquePatients(Array.from(patientMap.values()));
      } catch (error) {
        console.error("Failed to fetch appointments", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAppointments();
  }, []);

  const handleExpandPatient = async (patientId) => {
    // Toggle collapse if already expanded
    if (expandedPatientId === patientId) {
      setExpandedPatientId(null);
      return;
    }

    setExpandedPatientId(patientId);

    // If we haven't loaded this patient's details yet, fetch them
    if (!patientDetails[patientId]) {
      setPatientDetails(prev => ({ ...prev, [patientId]: { loading: true } }));
      
      try {
        const [profileRes, prescriptionsRes] = await Promise.all([
          api.get(`/doctor/patients/${patientId}`),
          api.get(`/doctor/patients/${patientId}/prescriptions`)
        ]);

        setPatientDetails(prev => ({
          ...prev,
          [patientId]: {
            profile: profileRes.data,
            prescriptions: prescriptionsRes.data,
            loading: false
          }
        }));
      } catch (error) {
        console.error("Failed to fetch patient details", error);
        setPatientDetails(prev => ({
          ...prev,
          [patientId]: { loading: false, error: true }
        }));
      }
    }
  };

  // Search & Pagination Logic
  const filteredPatients = uniquePatients.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = filteredPatients.slice(indexOfFirstPatient, indexOfLastPatient);
  const totalPages = Math.ceil(filteredPatients.length / patientsPerPage);

  const getPatientAppointments = (patientId) => {
    return appointments.filter(a => a.patientId === patientId)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  if (loading) {
    return <div className="flex h-full items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-primary-600" /></div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">My Patients</h1>
        <p className="mt-2 text-sm text-slate-600">View detailed information, past files, and appointment history for your patients.</p>
      </div>

      <div className="glass-panel shadow-md overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200 bg-white/50 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div className="flex items-center">
            <h2 className="text-lg font-semibold text-slate-900 flex items-center">
              <User className="mr-2 h-5 w-5 text-primary-500" />
              Patient Directory
            </h2>
            <span className="ml-4 text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
              {filteredPatients.length} Patients
            </span>
          </div>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search patients..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1); // Reset to page 1 on search
              }}
              className="input-field pl-10 py-1.5 text-sm w-full sm:w-64"
            />
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {currentPatients.length === 0 ? (
            <div className="p-8 text-center text-slate-500">No patients found.</div>
          ) : (
            currentPatients.map((patient) => {
              const isExpanded = expandedPatientId === patient.id;
              const details = patientDetails[patient.id];
              const pAppointments = getPatientAppointments(patient.id);

              return (
                <div key={patient.id} className="transition-colors">
                  {/* Accordion Header */}
                  <div 
                    className={`p-6 cursor-pointer hover:bg-slate-50/50 flex items-center justify-between transition-all ${isExpanded ? 'bg-primary-50/30' : ''}`}
                    onClick={() => handleExpandPatient(patient.id)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-14 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-xl shadow-sm border border-primary-200">
                        {patient.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">{patient.name}</h3>
                        <p className="text-sm text-slate-500 flex items-center mt-1">
                          <Calendar className="w-4 h-4 mr-1 text-slate-400" /> 
                          {pAppointments.length} Total Appointments
                        </p>
                      </div>
                    </div>
                    <div>
                      {isExpanded ? <ChevronUp className="w-6 h-6 text-slate-400" /> : <ChevronDown className="w-6 h-6 text-slate-400" />}
                    </div>
                  </div>

                  {/* Accordion Content */}
                  {isExpanded && (
                    <div className="px-6 pb-8 pt-4 bg-slate-50/50 border-t border-slate-100 animate-in slide-in-from-top-2 duration-300">
                      {details?.loading ? (
                        <div className="flex justify-center py-8"><Loader2 className="w-8 h-8 animate-spin text-primary-500" /></div>
                      ) : details?.error ? (
                        <div className="text-center text-red-500 py-4">Failed to load patient details.</div>
                      ) : details?.profile ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          
                          {/* Patient Info Card */}
                          <div className="md:col-span-1 space-y-4">
                            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center border-b pb-2">
                              <Info className="w-4 h-4 mr-2 text-primary-500" /> Patient Info
                            </h4>
                            <div className="space-y-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-sm">
                              <div className="flex justify-between items-center">
                                <span className="text-slate-500">Gender</span>
                                <span className="font-medium text-slate-900">{details.profile.gender || 'N/A'}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-slate-500">Age/DOB</span>
                                <span className="font-medium text-slate-900">{details.profile.dob || 'N/A'}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-slate-500 flex items-center"><Droplet className="w-3 h-3 mr-1 text-red-400"/> Blood Grp</span>
                                <span className="font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded text-xs">{details.profile.bloodGroup || 'N/A'}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-slate-500 flex items-center"><Phone className="w-3 h-3 mr-1"/> Phone</span>
                                <span className="font-medium text-slate-900">{details.profile.phone || 'N/A'}</span>
                              </div>
                              {details.profile.allergies && (
                                <div className="pt-2 border-t border-slate-100 mt-2">
                                  <span className="block text-slate-500 mb-1">Allergies</span>
                                  <span className="font-medium text-amber-700 bg-amber-50 px-2 py-1 rounded block">{details.profile.allergies}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Appointments History */}
                          <div className="md:col-span-1 space-y-4">
                            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center border-b pb-2">
                              <Calendar className="w-4 h-4 mr-2 text-primary-500" /> Appointments
                            </h4>
                            <div className="space-y-3 max-h-64 overflow-y-auto scrollbar-hide pr-2">
                              {pAppointments.map(apt => (
                                <div key={apt.id} className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                                  <div className="flex justify-between items-start mb-1">
                                    <span className="text-sm font-medium text-slate-900">{apt.date}</span>
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                                      apt.appointmentStatus === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                                      apt.appointmentStatus === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                                      'bg-blue-100 text-blue-700'
                                    }`}>
                                      {apt.appointmentStatus}
                                    </span>
                                  </div>
                                  <p className="text-xs text-slate-500">{apt.time}</p>
                                  {apt.reason && <p className="text-xs text-slate-700 mt-2 line-clamp-2">Reason: {apt.reason}</p>}
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Past Files / Prescriptions */}
                          <div className="md:col-span-1 space-y-4">
                            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center border-b pb-2">
                              <FileText className="w-4 h-4 mr-2 text-primary-500" /> Past Files
                            </h4>
                            <div className="space-y-3 max-h-64 overflow-y-auto scrollbar-hide pr-2">
                              {!details.prescriptions || details.prescriptions.length === 0 ? (
                                <div className="text-sm text-slate-500 italic bg-white p-4 rounded-xl border border-slate-200 text-center">No past prescriptions found.</div>
                              ) : (
                                details.prescriptions.map(rx => (
                                  <div key={rx.id} className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                                    <p className="text-xs font-semibold text-primary-700 mb-2 border-b border-primary-50 pb-1 flex items-center">
                                      <FileText className="w-3 h-3 mr-1" /> Prescription Record
                                    </p>
                                    <div className="space-y-1">
                                      {rx.diagnosis && <p className="text-xs text-slate-700"><span className="font-medium">Diagnosis:</span> {rx.diagnosis}</p>}
                                      {rx.medication && <p className="text-xs text-slate-700"><span className="font-medium">Meds:</span> {rx.medication}</p>}
                                      {rx.notes && <p className="text-xs text-slate-700"><span className="font-medium">Notes:</span> {rx.notes}</p>}
                                    </div>
                                  </div>
                                ))
                              )}
                            </div>
                          </div>

                        </div>
                      ) : null}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
            <span className="text-sm text-slate-600">
              Showing <span className="font-medium">{indexOfFirstPatient + 1}</span> to <span className="font-medium">{Math.min(indexOfLastPatient, filteredPatients.length)}</span> of <span className="font-medium">{filteredPatients.length}</span> patients
            </span>
            <div className="flex gap-2">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm border border-slate-300 rounded-md bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm border border-slate-300 rounded-md bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorPatients;
