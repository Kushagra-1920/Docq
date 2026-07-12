import { useState } from 'react';
import { FileText, Download, Activity, Eye, Search, Filter } from 'lucide-react';

const loremIpsum = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

const mockRecords = [
  { id: 1, type: 'Lab Report', title: 'Complete Blood Count (CBC)', date: 'Oct 12, 2023', doctor: 'Dr. Sarah Smith', status: 'Available', content: loremIpsum },
  { id: 2, type: 'Invoice', title: 'Consultation Fee - Cardiology', date: 'Oct 05, 2023', doctor: 'Dr. Michael Chen', status: 'Paid', content: loremIpsum },
  { id: 3, type: 'Prescription', title: 'Post-Surgery Medication', date: 'Sep 28, 2023', doctor: 'Dr. Emily Johnson', status: 'Active', content: loremIpsum },
  { id: 4, type: 'Scan Report', title: 'Chest X-Ray', date: 'Sep 15, 2023', doctor: 'Dr. Sarah Smith', status: 'Available', content: loremIpsum },
  { id: 5, type: 'Discharge', title: 'Discharge Summary', date: 'Aug 02, 2023', doctor: 'Dr. Emily Johnson', status: 'Finalized', content: loremIpsum },
];

const MedicalRecords = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [previewRecord, setPreviewRecord] = useState(null);

  const filteredRecords = mockRecords.filter(record => 
    record.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    record.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Medical Records</h1>
          <p className="mt-2 text-sm text-slate-600">Access your past reports, prescriptions, and invoices.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-500/20">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-blue-100 font-medium mb-1">Total Reports</p>
              <h3 className="text-3xl font-bold">12</h3>
            </div>
            <div className="p-3 bg-white/20 rounded-xl"><FileText className="w-6 h-6" /></div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg shadow-emerald-500/20">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-emerald-100 font-medium mb-1">Active Prescriptions</p>
              <h3 className="text-3xl font-bold">3</h3>
            </div>
            <div className="p-3 bg-white/20 rounded-xl"><Activity className="w-6 h-6" /></div>
          </div>
        </div>

        <div className="flex items-center">
          <div className="relative w-full">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search records..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-base focus:ring-2 focus:ring-primary-500 focus:border-primary-500 w-full shadow-sm"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm">
                <th className="px-6 py-4 font-medium">Document Name</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Issued By</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.map((record) => (
                <tr key={record.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-100 rounded-lg text-slate-500 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                        <FileText className="w-5 h-5" />
                      </div>
                      <span className="font-semibold text-slate-800">{record.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">{record.type}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{record.date}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{record.doctor}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      record.status === 'Available' ? 'bg-blue-50 text-blue-700' :
                      record.status === 'Paid' ? 'bg-emerald-50 text-emerald-700' :
                      record.status === 'Active' ? 'bg-purple-50 text-purple-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {record.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => setPreviewRecord(record)} className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors" title="View">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors" title="Download">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {filteredRecords.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                    No medical records found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {previewRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setPreviewRecord(null)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-primary-600" />
                {previewRecord.title}
              </h3>
              <button onClick={() => setPreviewRecord(null)} className="text-slate-400 hover:text-slate-600 p-1">
                ✕
              </button>
            </div>
            <div className="p-6">
              <div className="flex justify-between text-sm text-slate-500 mb-6 pb-4 border-b border-slate-100">
                <div>
                  <span className="block font-semibold text-slate-700">Doctor</span>
                  {previewRecord.doctor}
                </div>
                <div className="text-right">
                  <span className="block font-semibold text-slate-700">Date</span>
                  {previewRecord.date}
                </div>
              </div>
              <div className="text-slate-600 text-sm leading-relaxed">
                <p className="font-semibold text-slate-800 mb-2">Report Content:</p>
                <p>{previewRecord.content}</p>
                <p className="mt-4">{previewRecord.content}</p>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button onClick={() => setPreviewRecord(null)} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">Close</button>
              <button className="px-4 py-2 text-sm font-semibold bg-primary-600 text-white hover:bg-primary-700 rounded-lg transition-colors flex items-center">
                <Download className="w-4 h-4 mr-2" /> Download PDF
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default MedicalRecords;
