import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Calendar as CalendarIcon, Clock, User, CheckCircle, ArrowLeft, Loader2, AlertCircle, FileText } from 'lucide-react';
import api from '../../services/api';
import { format, addDays } from 'date-fns';

const BookAppointment = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [doctors, setDoctors] = useState([]);
  const [loadingDocs, setLoadingDocs] = useState(true);
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form State
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [reason, setReason] = useState('');
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [selectedSlot, setSelectedSlot] = useState(null);

  // Fetch doctors on mount
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await api.get('/doctors');
        setDoctors(response.data);
      } catch (err) {
        console.error("Failed to load doctors", err);
      } finally {
        setLoadingDocs(false);
      }
    };
    fetchDoctors();
  }, []);

  // Fetch slots when doctor or date changes
  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      const fetchSlots = async () => {
        setLoadingSlots(true);
        setSelectedSlot(null);
        try {
          const response = await api.get(`/doctors/${selectedDoctor.id}/availability`, {
            params: { date: selectedDate }
          });
          // The backend currently returns slots for date >= selectedDate, so we filter by exact date here.
          const slotsForDate = response.data.filter(s => s.date === selectedDate);
          setSlots(slotsForDate);
        } catch (err) {
          console.error("Failed to load slots", err);
        } finally {
          setLoadingSlots(false);
        }
      };
      fetchSlots();
    }
  }, [selectedDoctor, selectedDate]);

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
    else navigate('/patient');
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await api.post('/patient/appointments', {
        doctorId: selectedDoctor.id,
        slotId: selectedSlot.id,
        reason: reason
      });
      setStep(5); // Success step
    } catch (err) {
      console.error("Failed to book appointment", err);
      alert("Failed to book appointment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const upcomingDates = [];
  let d = new Date();
  while (upcomingDates.length < 4) {
    if (d.getDay() !== 0 && d.getDay() !== 6) { // exclude Sundays (0) and Saturdays (6)
      upcomingDates.push({
        value: format(d, 'yyyy-MM-dd'),
        label: format(d, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') ? 'Today' : format(d, 'EEE, MMM d')
      });
    }
    d = addDays(d, 1);
  }

  return (
    <div className="max-w-4xl mx-auto pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center mb-8">
        <button onClick={handleBack} className="p-2 mr-4 bg-white rounded-full shadow-sm hover:bg-slate-50 transition-colors text-slate-500">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Book Appointment</h1>
          <p className="text-slate-500 mt-1">Schedule a visit with our specialists</p>
        </div>
      </div>

      {/* Progress Bar */}
      {step < 5 && (
        <div className="mb-8">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 rounded-full -z-10"></div>
            <div 
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary-600 rounded-full -z-10 transition-all duration-500"
              style={{ width: `${((step - 1) / 3) * 100}%` }}
            ></div>
            
            {['Specialist', 'Details', 'Time', 'Confirm'].map((label, i) => (
              <div key={label} className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-4 border-white transition-colors duration-300 ${step > i + 1 ? 'bg-primary-600 text-white' : step === i + 1 ? 'bg-primary-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                  {step > i + 1 ? <CheckCircle className="w-5 h-5" /> : i + 1}
                </div>
                <span className={`mt-2 text-xs font-semibold ${step >= i + 1 ? 'text-primary-700' : 'text-slate-400'}`}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step Content */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="p-6 sm:p-10">
          
          {/* STEP 1: Select Doctor */}
          {step === 1 && (
            <div className="animate-in slide-in-from-right-8 duration-300">
              <h2 className="text-xl font-bold mb-6 flex items-center text-slate-800">
                <User className="w-6 h-6 mr-2 text-primary-600" /> Select a Specialist
              </h2>
              {loadingDocs ? (
                <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary-500" /></div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {doctors.map(doc => (
                    <div 
                      key={doc.id} 
                      onClick={() => setSelectedDoctor(doc)}
                      className={`cursor-pointer border-2 rounded-xl p-4 flex items-center gap-4 transition-all duration-200 hover:shadow-md ${selectedDoctor?.id === doc.id ? 'border-primary-500 bg-primary-50' : 'border-slate-100 hover:border-primary-200 bg-white'}`}
                    >
                      <img src={doc.profileImage || `https://ui-avatars.com/api/?name=Dr+${doc.firstName}+${doc.lastName}&background=0D8ABC&color=fff`} alt="Doctor" className="w-16 h-16 rounded-full object-cover" />
                      <div>
                        <h3 className="font-bold text-slate-900">Dr. {doc.firstName} {doc.lastName}</h3>
                        <p className="text-sm text-primary-600 font-medium">{doc.specialization}</p>
                        <p className="text-xs text-slate-500 mt-1">{doc.experienceYears} Years Exp. • ₹{doc.consultationFee}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-8 flex justify-end">
                <button 
                  disabled={!selectedDoctor} 
                  onClick={handleNext}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  Continue <ChevronRight className="w-5 h-5 ml-1" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Reason */}
          {step === 2 && (
            <div className="animate-in slide-in-from-right-8 duration-300">
              <h2 className="text-xl font-bold mb-6 flex items-center text-slate-800">
                <FileText className="w-6 h-6 mr-2 text-primary-600" /> Visit Details
              </h2>
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6 flex gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 shrink-0" />
                <p className="text-sm text-blue-800">Please provide a brief reason for your visit so Dr. {selectedDoctor.userLastName} can prepare for your consultation.</p>
              </div>
              <textarea 
                rows="4" 
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. Regular checkup, severe back pain, follow-up..."
                className="w-full border-2 border-slate-200 rounded-xl p-4 focus:border-primary-500 focus:ring-0 transition-colors"
              ></textarea>
              
              <div className="mt-8 flex justify-between">
                <button onClick={handleBack} className="px-6 py-2 rounded-xl font-medium text-slate-600 hover:bg-slate-100 transition-colors">Back</button>
                <button 
                  disabled={!reason.trim()} 
                  onClick={handleNext}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  Continue <ChevronRight className="w-5 h-5 ml-1" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Time Slot */}
          {step === 3 && (
            <div className="animate-in slide-in-from-right-8 duration-300">
              <h2 className="text-xl font-bold mb-6 flex items-center text-slate-800">
                <CalendarIcon className="w-6 h-6 mr-2 text-primary-600" /> Select Date & Time
              </h2>
              
              <div className="mb-6">
                <label className="block text-sm font-bold text-slate-700 mb-3">Select Date</label>
                <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
                  {upcomingDates.map(d => (
                    <button
                      key={d.value}
                      onClick={() => setSelectedDate(d.value)}
                      className={`flex-shrink-0 px-5 py-3 rounded-xl border-2 font-medium transition-all ${selectedDate === d.value ? 'border-primary-600 bg-primary-600 text-white shadow-md shadow-primary-500/30' : 'border-slate-200 bg-white text-slate-600 hover:border-primary-300 hover:bg-slate-50'}`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-3">Available Slots</label>
                {loadingSlots ? (
                  <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-primary-500" /></div>
                ) : slots.length === 0 ? (
                  <div className="bg-slate-50 rounded-xl p-8 text-center text-slate-500 border border-slate-100">
                    <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    No slots available for this date. Please select another date.
                  </div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                    {slots.map(slot => (
                      <button
                        key={slot.id}
                        disabled={slot.booked}
                        onClick={() => setSelectedSlot(slot)}
                        className={`py-3 rounded-xl border-2 font-bold text-sm flex flex-col items-center justify-center transition-all ${
                          slot.booked ? 'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed opacity-70' :
                          selectedSlot?.id === slot.id ? 'border-primary-600 bg-primary-50 text-primary-700 shadow-sm' : 'border-slate-100 bg-white text-slate-700 hover:border-primary-300 hover:bg-slate-50'
                        }`}
                      >
                        <span>{slot.startTime.substring(0, 5)} - {slot.endTime.substring(0, 5)}</span>
                        {slot.booked && <span className="text-[10px] font-medium mt-0.5 text-slate-400">Booked</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-8 flex justify-between">
                <button onClick={handleBack} className="px-6 py-2 rounded-xl font-medium text-slate-600 hover:bg-slate-100 transition-colors">Back</button>
                <button 
                  disabled={!selectedSlot} 
                  onClick={handleNext}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  Review Details <ChevronRight className="w-5 h-5 ml-1" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Confirm */}
          {step === 4 && (
            <div className="animate-in slide-in-from-right-8 duration-300">
              <h2 className="text-xl font-bold mb-6 flex items-center text-slate-800">
                <CheckCircle className="w-6 h-6 mr-2 text-primary-600" /> Review & Confirm
              </h2>
              
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 mb-8 space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                  <div className="text-sm font-medium text-slate-500">Specialist</div>
                  <div className="font-bold text-slate-900">Dr. {selectedDoctor.firstName} {selectedDoctor.lastName}</div>
                </div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                  <div className="text-sm font-medium text-slate-500">Date & Time</div>
                  <div className="font-bold text-slate-900">{selectedDate} at {selectedSlot.startTime.substring(0, 5)}</div>
                </div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                  <div className="text-sm font-medium text-slate-500">Consultation Fee</div>
                  <div className="font-bold text-primary-700">₹{selectedDoctor.consultationFee}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-slate-500 mb-1">Reason for visit</div>
                  <div className="text-slate-800 italic bg-white p-3 rounded-lg border border-slate-200">"{reason}"</div>
                </div>
              </div>

              <div className="mt-8 flex justify-between">
                <button disabled={isSubmitting} onClick={handleBack} className="px-6 py-2 rounded-xl font-medium text-slate-600 hover:bg-slate-100 transition-colors">Back</button>
                <button 
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="btn-primary flex items-center shadow-lg shadow-primary-500/30 text-lg px-8"
                >
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <CheckCircle className="w-5 h-5 mr-2" />}
                  Confirm Appointment
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: Success */}
          {step === 5 && (
            <div className="text-center py-12 animate-in zoom-in duration-500">
              <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Appointment Confirmed!</h2>
              <div className="bg-white shadow-sm rounded-xl p-6 border border-slate-100 mx-auto max-w-sm mb-8">
                <p className="text-slate-500 mb-2">Your appointment with</p>
                <div className="text-xl font-bold text-primary-700">Dr. {selectedDoctor.firstName} {selectedDoctor.lastName}</div>
                <p className="text-slate-500 mt-2">has been successfully scheduled.</p>
              </div>
              
              <div className="flex justify-center gap-4">
                <button 
                  onClick={() => navigate('/patient')}
                  className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold transition-colors"
                >
                  View My Appointments
                </button>
                <button 
                  onClick={() => { setStep(1); setSelectedDoctor(null); setSelectedSlot(null); setReason(''); }}
                  className="btn-primary"
                >
                  Book Another
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default BookAppointment;
