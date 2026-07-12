import { useState, useEffect } from 'react';
import { Mail, Phone, Clock, Calendar, Search } from 'lucide-react';
import api from '../../services/api';

const DoctorDetails = () => {
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await api.get('/doctors');
        setDoctors(response.data);
      } catch (err) {
        console.error("Failed to fetch doctors", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  const filteredDoctors = doctors.filter(doc => 
    `${doc.firstName} ${doc.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Doctors Directory</h1>
          <p className="mt-2 text-sm text-slate-600">Find contact details and consulting schedules for our medical staff.</p>
        </div>
        
        <div className="relative mt-2 sm:mt-0 w-full sm:w-72">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by name or specialty..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 w-full shadow-sm"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredDoctors.map(doctor => (
            <div key={doctor.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4 mb-6 pb-6 border-b border-slate-100">
                <img 
                  src={doctor.profileImage || `https://ui-avatars.com/api/?name=Dr+${doctor.firstName}+${doctor.lastName}&background=0D8ABC&color=fff`} 
                  alt="Doctor" 
                  className="w-16 h-16 rounded-2xl object-cover shadow-sm"
                />
                <div>
                  <h3 className="font-bold text-lg text-slate-900">Dr. {doctor.firstName} {doctor.lastName}</h3>
                  <p className="text-primary-600 font-medium text-sm">{doctor.specialization}</p>
                  <p className="text-slate-500 text-xs mt-1">{doctor.departmentName} Department</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <div className="p-2 bg-slate-50 rounded-lg text-slate-400"><Phone className="w-4 h-4" /></div>
                  <span className="font-medium text-slate-700">{doctor.phone || "+91 98765 43210"}</span>
                </div>
                
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <div className="p-2 bg-slate-50 rounded-lg text-slate-400"><Mail className="w-4 h-4" /></div>
                  <span className="font-medium text-slate-700">{doctor.email}</span>
                </div>

                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <div className="p-2 bg-slate-50 rounded-lg text-slate-400"><Calendar className="w-4 h-4" /></div>
                  <span className="font-medium text-slate-700">Mon - Fri</span>
                </div>

                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <div className="p-2 bg-slate-50 rounded-lg text-slate-400"><Clock className="w-4 h-4" /></div>
                  <span className="font-medium text-slate-700">12:00 PM - 06:00 PM</span>
                </div>
              </div>
            </div>
          ))}

          {filteredDoctors.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-500">
              No doctors found matching your search.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DoctorDetails;
