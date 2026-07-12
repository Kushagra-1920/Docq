import { useRef, useState, useEffect } from 'react';
import { X, User, Mail, Phone, MapPin, Droplet, Calendar, Camera, Stethoscope, Briefcase, Award, Loader2, Edit2, Check, DollarSign } from 'lucide-react';
import useAuthStore from '../store/authStore';
import api from '../services/api';

const ProfileModal = ({ isOpen, onClose }) => {
  const { user, updateUser } = useAuthStore();
  const fileInputRef = useRef(null);
  
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    phone: '',
    specialization: '',
    qualification: '',
    experienceYears: 0,
    biography: '',
    consultationFee: 0
  });

  const isDoctor = user?.roles?.[0] === 'ROLE_DOCTOR';
  
  useEffect(() => {
    if (isOpen && isDoctor) {
      fetchDoctorProfile();
    } else {
      setIsEditing(false);
    }
  }, [isOpen, isDoctor]);

  const fetchDoctorProfile = async () => {
    setLoading(true);
    try {
      const res = await api.get('/doctor/profile');
      setDoctorProfile(res.data);
      if (res.data.profileImage) {
        updateUser({ profileImage: res.data.profileImage });
      }
      setFormData({
        phone: res.data.phone || '',
        specialization: res.data.specialization || '',
        qualification: res.data.qualification || '',
        experienceYears: res.data.experienceYears || 0,
        biography: res.data.biography || '',
        consultationFee: res.data.consultationFee || 0
      });
    } catch (error) {
      console.error("Failed to fetch doctor profile", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Image = reader.result;
        updateUser({ profileImage: base64Image });
        
        // Save to backend if it's a doctor
        if (isDoctor) {
          try {
            await api.put('/doctor/profile', { profileImage: base64Image });
          } catch (error) {
            console.error("Failed to save profile image", error);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    if (!isDoctor) return;
    setLoading(true);
    try {
      const res = await api.put('/doctor/profile', formData);
      setDoctorProfile(res.data);
      updateUser({ phone: res.data.phone });
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        
        {/* Header section */}
        <div className="relative h-32 bg-gradient-to-r from-primary-600 to-primary-800 shrink-0">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-1 bg-black/10 hover:bg-black/20 text-white rounded-full transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>
          
          {isDoctor && (
            <button 
              onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
              className="absolute top-4 right-14 px-3 py-1 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors text-sm font-medium flex items-center backdrop-blur-sm z-10"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : isEditing ? (
                <><Check className="w-4 h-4 mr-1"/> Save</>
              ) : (
                <><Edit2 className="w-4 h-4 mr-1"/> Edit</>
              )}
            </button>
          )}
        </div>

        {/* Avatar Section */}
        <div className="relative px-6 shrink-0 z-20 flex justify-center -mt-16 mb-4">
          <div className="relative h-32 w-32 bg-white p-2 rounded-full shadow-lg group">
            {user?.profileImage ? (
              <img src={user.profileImage} alt="Profile" className="h-full w-full rounded-full object-cover border-4 border-white" />
            ) : (
              <div className="h-full w-full bg-slate-100 rounded-full flex items-center justify-center border-4 border-white text-4xl font-bold text-slate-400">
                {user?.firstName?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
              </div>
            )}
            
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-1 right-1 bg-primary-600 text-white p-2 rounded-full shadow-md hover:bg-primary-700 transition-colors opacity-90 group-hover:opacity-100"
            >
              <Camera className="w-4 h-4" />
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageChange} 
              accept="image/*" 
              className="hidden" 
            />
          </div>
        </div>

        {/* Profile Content */}
        <div className="px-6 pb-8 overflow-y-auto flex-1 scrollbar-hide">
          
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900">{user?.firstName || 'User'} {user?.lastName || ''}</h2>
            <p className="text-slate-500 font-medium">
              {isDoctor ? (doctorProfile?.specialization || 'Doctor') : 'Patient'}
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="p-2 bg-primary-100 text-primary-600 rounded-lg mr-4">
                <Mail className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</p>
                <p className="text-slate-900 font-medium">{user?.email}</p>
              </div>
            </div>

            <div className="flex items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg mr-4">
                <Phone className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Phone</p>
                {isEditing ? (
                  <input type="text" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-sm outline-none focus:border-primary-500" />
                ) : (
                  <p className="text-slate-900 font-medium">{user?.phone || 'Not provided'}</p>
                )}
              </div>
            </div>

            {isDoctor ? (
              <>
                <div className="flex items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg mr-4">
                    <Stethoscope className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Specialization</p>
                    {isEditing ? (
                      <input type="text" value={formData.specialization} onChange={(e) => setFormData({...formData, specialization: e.target.value})} className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-sm outline-none focus:border-primary-500" />
                    ) : (
                      <p className="text-slate-900 font-medium">{doctorProfile?.specialization || 'Not specified'}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="p-2 bg-purple-100 text-purple-600 rounded-lg mr-4">
                    <Award className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Qualification</p>
                    {isEditing ? (
                      <input type="text" value={formData.qualification} onChange={(e) => setFormData({...formData, qualification: e.target.value})} className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-sm outline-none focus:border-primary-500" />
                    ) : (
                      <p className="text-slate-900 font-medium">{doctorProfile?.qualification || 'Not specified'}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="p-2 bg-amber-100 text-amber-600 rounded-lg mr-3">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Experience</p>
                      {isEditing ? (
                        <input type="number" value={formData.experienceYears} onChange={(e) => setFormData({...formData, experienceYears: parseInt(e.target.value) || 0})} className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-sm outline-none focus:border-primary-500" />
                      ) : (
                        <p className="text-slate-900 font-medium text-sm">{doctorProfile?.experienceYears || 0} Years</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg mr-3">
                      <DollarSign className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Fee</p>
                      {isEditing ? (
                        <input type="number" value={formData.consultationFee} onChange={(e) => setFormData({...formData, consultationFee: parseInt(e.target.value) || 0})} className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-sm outline-none focus:border-primary-500" />
                      ) : (
                        <p className="text-slate-900 font-medium text-sm">₹{doctorProfile?.consultationFee || 0}</p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Biography</p>
                    {isEditing ? (
                      <textarea value={formData.biography} onChange={(e) => setFormData({...formData, biography: e.target.value})} className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-sm outline-none focus:border-primary-500 min-h-[80px]" />
                    ) : (
                      <p className="text-slate-700 text-sm whitespace-pre-line">{doctorProfile?.biography || 'No biography added yet.'}</p>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="p-2 bg-red-100 text-red-600 rounded-lg mr-4">
                    <Droplet className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Blood Group</p>
                    <p className="text-slate-900 font-medium">O+ (Positive)</p>
                  </div>
                </div>
                
                <div className="flex items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="p-2 bg-green-100 text-green-600 rounded-lg mr-4">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Date of Birth</p>
                    <p className="text-slate-900 font-medium">12 Oct, 1990</p>
                  </div>
                </div>
              </>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
