import { useState, useEffect } from 'react';
import api from '../../services/api';
import { FileText, Send, User, Search, Eye, X, Loader2, CheckCircle } from 'lucide-react';

const DoctorPrescriptions = () => {
  const [patients, setPatients] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Form State
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [formData, setFormData] = useState({
    diagnosis: '',
    medicines: '',
    dosageInstructions: '',
    doctorNotes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  // Modal State
  const [previewPrescription, setPreviewPrescription] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [aptRes, rxRes] = await Promise.all([
        api.get('/doctor/appointments'),
        api.get('/doctor/prescriptions')
      ]);
      
      // Extract unique patients from appointments
      const patientMap = new Map();
      aptRes.data.forEach(apt => {
        if (!patientMap.has(apt.patientId)) {
          patientMap.set(apt.patientId, {
            id: apt.patientId,
            name: apt.patientName
          });
        }
      });
      setPatients(Array.from(patientMap.values()));
      setPrescriptions(rxRes.data);
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPatientId) return;
    
    setIsSubmitting(true);
    setSubmitSuccess(false);
    try {
      const res = await api.post(`/doctor/patients/${selectedPatientId}/prescriptions`, formData);
      setPrescriptions(prev => [res.data, ...prev]);
      
      // Reset form
      setFormData({
        diagnosis: '',
        medicines: '',
        dosageInstructions: '',
        doctorNotes: ''
      });
      setSelectedPatientId('');
      setSubmitSuccess(true);
      
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (error) {
      console.error("Failed to send prescription", error);
      alert(error.response?.data?.message || "Failed to send prescription. Please ensure this patient has a valid appointment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <div className="flex h-full items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-primary-600" /></div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Prescriptions</h1>
        <p className="mt-2 text-sm text-slate-600">Send new prescriptions directly to patient emails and view your sent history.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Form */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-panel shadow-md p-6">
            <h2 className="text-lg font-semibold text-slate-900 flex items-center mb-4 border-b border-slate-100 pb-2">
              <Send className="mr-2 h-5 w-5 text-primary-500" />
              Write & Send
            </h2>
            
            {submitSuccess && (
              <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl flex items-center text-sm animate-in fade-in">
                <CheckCircle className="w-5 h-5 mr-2" />
                Prescription sent successfully!
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Select Patient</label>
                <select 
                  value={selectedPatientId} 
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  className="input-field bg-white"
                  required
                >
                  <option value="" disabled>Choose a patient...</option>
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Diagnosis</label>
                <input
                  type="text"
                  name="diagnosis"
                  value={formData.diagnosis}
                  onChange={handleInputChange}
                  className="input-field bg-white"
                  placeholder="e.g., Viral Fever"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Medicines</label>
                <textarea
                  name="medicines"
                  value={formData.medicines}
                  onChange={handleInputChange}
                  className="input-field bg-white min-h-[80px]"
                  placeholder="List medicines here..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Dosage Instructions</label>
                <textarea
                  name="dosageInstructions"
                  value={formData.dosageInstructions}
                  onChange={handleInputChange}
                  className="input-field bg-white min-h-[60px]"
                  placeholder="e.g., 1 tablet twice a day after meals"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Additional Notes</label>
                <textarea
                  name="doctorNotes"
                  value={formData.doctorNotes}
                  onChange={handleInputChange}
                  className="input-field bg-white min-h-[60px]"
                  placeholder="Precautions, diet restrictions, etc."
                />
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting || !selectedPatientId}
                className="w-full btn-primary flex justify-center items-center py-2.5 mt-2"
              >
                {isSubmitting ? (
                  <><Loader2 className="w-5 h-5 animate-spin mr-2"/> Sending Email...</>
                ) : (
                  <><Send className="w-4 h-4 mr-2"/> Send to Patient</>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: History */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel shadow-md overflow-hidden flex flex-col h-[600px] lg:h-[calc(100vh-12rem)] min-h-[500px]">
            <div className="px-6 py-5 border-b border-slate-200 bg-white/50 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <h2 className="text-lg font-semibold text-slate-900 flex items-center">
                <FileText className="mr-2 h-5 w-5 text-primary-500" />
                Sent Prescriptions History
              </h2>
            </div>

            <div className="flex-1 overflow-y-auto p-6 scrollbar-hide bg-slate-50/50">
              {prescriptions.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-slate-500">
                  <FileText className="w-10 h-10 mb-2 opacity-20" />
                  <p>No prescriptions sent yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {prescriptions.map((rx) => (
                    <div key={rx.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">Diagnosis: {rx.diagnosis}</p>
                          <p className="text-xs text-slate-500 mt-0.5">Appointment ID: #{rx.appointmentId} • Issued: {rx.issuedAt ? new Date(rx.issuedAt).toLocaleDateString() : 'N/A'}</p>
                        </div>
                        <button 
                          onClick={() => setPreviewPrescription(rx)}
                          className="text-primary-600 hover:bg-primary-50 p-2 rounded-lg transition-colors flex items-center text-xs font-medium"
                        >
                          <Eye className="w-4 h-4 mr-1"/> Preview
                        </button>
                      </div>
                      <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 mt-2">
                        <p className="text-xs text-slate-700 line-clamp-2"><span className="font-semibold text-slate-900">Meds:</span> {rx.medicines}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Preview Modal */}
      {previewPrescription && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold text-slate-900 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-primary-500" />
                Prescription Preview
              </h3>
              <button 
                onClick={() => setPreviewPrescription(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-8 overflow-y-auto print:p-0">
              {/* Fake Document Style */}
              <div className="border-2 border-slate-100 rounded-xl p-8 bg-white shadow-inner relative">
                
                {/* Header */}
                <div className="border-b-2 border-primary-100 pb-6 mb-6 flex justify-between">
                  <div>
                    <h1 className="text-2xl font-black text-primary-800 tracking-tight">CARECONNECT</h1>
                    <p className="text-xs text-slate-500 font-medium tracking-widest uppercase mt-1">Medical Prescription</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-900">Date: {previewPrescription.issuedAt ? new Date(previewPrescription.issuedAt).toLocaleDateString() : 'N/A'}</p>
                    <p className="text-xs text-slate-500 mt-1">Ref: #{previewPrescription.id}</p>
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Diagnosis</h4>
                    <p className="text-lg font-medium text-slate-900">{previewPrescription.diagnosis}</p>
                  </div>

                  <div className="bg-primary-50/50 p-4 rounded-xl border border-primary-100/50">
                    <h4 className="text-xs font-bold text-primary-600 uppercase tracking-wider mb-2 flex items-center">
                       Medications
                    </h4>
                    <p className="text-slate-800 whitespace-pre-line text-sm leading-relaxed">{previewPrescription.medicines}</p>
                  </div>

                  {previewPrescription.dosageInstructions && (
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Dosage Instructions</h4>
                      <p className="text-sm text-slate-700 whitespace-pre-line">{previewPrescription.dosageInstructions}</p>
                    </div>
                  )}

                  {previewPrescription.doctorNotes && (
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Doctor's Notes & Precautions</h4>
                      <p className="text-sm text-slate-700 whitespace-pre-line italic bg-slate-50 p-3 rounded-lg border border-slate-100">{previewPrescription.doctorNotes}</p>
                    </div>
                  )}
                </div>

                {/* Footer Signature */}
                <div className="mt-12 pt-6 border-t border-slate-100 flex justify-end">
                  <div className="text-center w-48">
                    <div className="border-b border-slate-300 pb-1 mb-2"></div>
                    <p className="text-xs text-slate-500 font-medium">Doctor's Signature</p>
                  </div>
                </div>

              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button 
                onClick={() => setPreviewPrescription(null)}
                className="btn-secondary"
              >
                Close
              </button>
              <button 
                onClick={() => window.print()}
                className="btn-primary"
              >
                Print / Save PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorPrescriptions;
