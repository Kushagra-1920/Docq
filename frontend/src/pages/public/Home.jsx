import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Activity, ShieldCheck, HeartPulse, Clock, ChevronDown, Star, MapPin, Award, User, Loader2, ArrowRight, Phone, Mail, Globe, MessageCircle, Share2, Send } from 'lucide-react';
import api from '../../services/api';

const Home = () => {
  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await api.get('/doctors');
        setDoctors(response.data);
      } catch (error) {
        console.error("Failed to fetch doctors", error);
      } finally {
        setLoadingDoctors(false);
      }
    };
    
    fetchDoctors();
  }, []);

  const scrollToDoctors = (e) => {
    e.preventDefault();
    document.getElementById('doctors-section').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative overflow-x-hidden scroll-smooth">
      {/* Decorative background blobs - Hero */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
        <div className="absolute top-60 -left-20 w-[500px] h-[500px] bg-secondary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
      </div>

      <header className="px-6 py-4 flex justify-between items-center glass-panel m-4 rounded-full sticky top-4 z-50">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center shadow-md">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">CareConnect</span>
        </div>
        <div className="hidden md:flex items-center gap-8 font-medium text-slate-600">
          <a href="#services" className="hover:text-primary-600 transition-colors">Services</a>
          <a href="#doctors-section" className="hover:text-primary-600 transition-colors">Specialists</a>
          <a href="#about" className="hover:text-primary-600 transition-colors">About</a>
        </div>
        <div className="flex gap-4">
          <Link to="/login" className="btn-secondary rounded-full">Sign In</Link>
          <Link to="/register" className="btn-primary rounded-full hidden sm:block">Get Started</Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 min-h-[85vh] flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-left animate-in fade-in slide-in-from-left-8 duration-1000">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 text-primary-700 font-medium text-sm mb-8 border border-primary-100 shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-primary-600 animate-ping"></span>
              Modern Healthcare Management
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Your Health, <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-500">Perfectly Managed.</span>
            </h1>
            
            <p className="mt-6 text-lg md:text-xl text-slate-600 max-w-xl">
              Book appointments, manage prescriptions, and consult with top doctors easily through our seamless platform.
            </p>
            
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link to="/register" className="btn-primary text-lg px-8 py-4 rounded-full shadow-lg shadow-primary-500/30 flex items-center justify-center gap-2">
                Book an Appointment <ArrowRight className="w-5 h-5" />
              </Link>
              <button onClick={scrollToDoctors} className="btn-secondary text-lg px-8 py-4 rounded-full">
                Meet our Doctors
              </button>
            </div>
          </div>
          
          <div className="relative animate-in fade-in slide-in-from-right-8 duration-1000 delay-300 hidden md:flex items-center justify-center min-h-[450px]">
            {/* Abstract Medical Background Design */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary-100 to-secondary-50 rounded-[3rem] transform rotate-3 opacity-60 border border-white shadow-inner"></div>
            <div className="absolute inset-4 bg-white/40 rounded-[2.5rem] backdrop-blur-3xl transform -rotate-2 border border-white/60 shadow-xl"></div>
            
            {/* Large Medical SVG Pattern - Heartbeat */}
            <svg width="100%" height="100%" className="absolute inset-0 opacity-20 text-primary-600 drop-shadow-xl" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0 50 L20 50 L30 20 L45 80 L60 30 L70 60 L80 50 L100 50" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>

            {/* Central Icon */}
            <div className="relative z-10 w-48 h-48 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-[2rem] transform rotate-12 flex items-center justify-center shadow-2xl shadow-primary-500/30 overflow-hidden">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4yIi8+PC9zdmc+')] opacity-50"></div>
              <Activity className="w-24 h-24 text-white transform -rotate-12 animate-pulse" />
            </div>
            
            {/* Decorative Plus Signs */}
            <div className="absolute top-12 right-12 text-secondary-400 opacity-60 animate-spin-slow">
              <Activity className="w-8 h-8" />
            </div>
            <div className="absolute bottom-16 left-12 text-primary-400 opacity-50">
              <HeartPulse className="w-10 h-10" />
            </div>

            {/* Floating widget 1 */}
            <div className="absolute -left-6 top-1/4 z-20 glass-panel p-4 rounded-2xl shadow-xl border border-white/80" style={{animation: "bounce 3s infinite"}}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Trusted By</p>
                  <p className="text-lg font-black text-slate-900">50k+ Patients</p>
                </div>
              </div>
            </div>
            
            {/* Floating widget 2 */}
            <div className="absolute -right-6 bottom-1/4 z-20 glass-panel p-4 rounded-2xl shadow-xl border border-white/80" style={{animation: "bounce 3s infinite 1.5s"}}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary-100 flex items-center justify-center text-secondary-600">
                  <HeartPulse className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Specialists</p>
                  <p className="text-lg font-black text-slate-900">150+ Top Doctors</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features/Services Section */}
      <section id="services" className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Why Choose CareConnect?</h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg">Experience healthcare that revolves around you with our state-of-the-art facilities and seamless digital experience.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-panel p-8 text-left hover:-translate-y-2 transition-transform duration-300 border border-slate-100 shadow-xl shadow-slate-200/50">
              <div className="w-14 h-14 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Secure & Private</h3>
              <p className="text-slate-600 leading-relaxed">Your medical records and personal data are heavily encrypted. We enforce strict role-based access to guarantee your privacy.</p>
            </div>
            <div className="glass-panel p-8 text-left hover:-translate-y-2 transition-transform duration-300 border border-slate-100 shadow-xl shadow-slate-200/50">
              <div className="w-14 h-14 bg-secondary-50 text-secondary-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                <HeartPulse className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Elite Specialists</h3>
              <p className="text-slate-600 leading-relaxed">Consult with highly qualified, award-winning doctors across multiple medical disciplines dedicated to your well-being.</p>
            </div>
            <div className="glass-panel p-8 text-left hover:-translate-y-2 transition-transform duration-300 border border-slate-100 shadow-xl shadow-slate-200/50">
              <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                <Clock className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">24/7 Smart Booking</h3>
              <p className="text-slate-600 leading-relaxed">Say goodbye to waiting on hold. View real-time availability and instantly book or reschedule appointments effortlessly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Doctors Section */}
      <section id="doctors-section" className="py-24 relative overflow-hidden bg-slate-50">
        <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-primary-100 rounded-full mix-blend-multiply filter blur-3xl opacity-60 -translate-y-1/2 translate-x-1/3"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Meet Our Elite Specialists</h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg">
              Book an appointment with leading medical experts, delivering world-class healthcare tailored to your needs.
            </p>
          </div>

          {loadingDoctors ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-12 h-12 animate-spin text-primary-600" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {doctors.map((doctor, index) => (
                <div 
                  key={doctor.id} 
                  className="glass-panel overflow-hidden flex flex-col shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-white/60"
                >
                  <div className="p-6 flex flex-col items-center text-center border-b border-slate-100 bg-white/40">
                    <div className="w-24 h-24 rounded-full bg-slate-200 overflow-hidden mb-4 shadow-inner ring-4 ring-white">
                      <img 
                        src={doctor.profileImage || `https://ui-avatars.com/api/?name=${doctor.firstName}+${doctor.lastName}&background=0ea5e9&color=fff`} 
                        alt={`Dr. ${doctor.firstName} ${doctor.lastName}`} 
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${doctor.firstName}+${doctor.lastName}&background=0ea5e9&color=fff` }}
                      />
                    </div>
                    <h2 className="text-lg font-bold text-slate-900">
                      Dr. {doctor.firstName} {doctor.lastName}
                    </h2>
                    <p className="text-sm font-semibold text-primary-600 mt-1">
                      {doctor.specialization}
                    </p>
                    <div className="flex items-center gap-1 mt-3 text-[11px] font-semibold text-slate-600 bg-slate-100/80 px-3 py-1.5 rounded-full text-left leading-tight">
                      <User className="w-3 h-3 flex-shrink-0" />
                      <span>{doctor.qualification}</span>
                    </div>
                  </div>
                  
                  <div className="p-5 flex-1 flex flex-col bg-white/20">
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="flex flex-col items-center p-2 bg-white/60 rounded-xl shadow-sm border border-slate-50">
                        <Star className="w-4 h-4 text-yellow-500 mb-1" />
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Experience</span>
                        <span className="font-bold text-slate-900 text-sm">{doctor.experienceYears} Yrs</span>
                      </div>
                      <div className="flex flex-col items-center p-2 bg-white/60 rounded-xl shadow-sm border border-slate-50">
                        <MapPin className="w-4 h-4 text-red-500 mb-1" />
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Location</span>
                        <span className="font-bold text-slate-900 text-sm">New Delhi</span>
                      </div>
                    </div>

                    <div className="flex-1">
                      <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 mb-2 uppercase tracking-wider">
                        <Award className="w-3.5 h-3.5 text-primary-500" />
                        Bio
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {doctor.biography}
                      </p>
                    </div>
                    
                    <div className="mt-5 pt-4 border-t border-slate-200/60 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">Consultation</span>
                        <span className="text-lg font-black text-slate-900">₹{doctor.consultationFee}</span>
                      </div>
                      <Link to="/login" className="btn-primary text-xs px-4 py-2 shadow-primary-500/30">
                        Book Slot
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-1/2 bg-primary-500/20 blur-[120px] rounded-full pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-10">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 p-8 rounded-3xl text-center transform hover:-translate-y-2 transition-all duration-300 group">
              <div className="w-14 h-14 mx-auto bg-primary-500/10 text-primary-400 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary-500 group-hover:text-white transition-all duration-300">
                <HeartPulse className="w-7 h-7" />
              </div>
              <div className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tight">12k+</div>
              <div className="text-slate-400 font-medium uppercase tracking-wider text-sm">Recoveries</div>
            </div>
            
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 p-8 rounded-3xl text-center transform hover:-translate-y-2 transition-all duration-300 group">
              <div className="w-14 h-14 mx-auto bg-secondary-500/10 text-secondary-400 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-secondary-500 group-hover:text-white transition-all duration-300">
                <Activity className="w-7 h-7" />
              </div>
              <div className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tight">4</div>
              <div className="text-slate-400 font-medium uppercase tracking-wider text-sm">Departments</div>
            </div>
            
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 p-8 rounded-3xl text-center transform hover:-translate-y-2 transition-all duration-300 group">
              <div className="w-14 h-14 mx-auto bg-green-500/10 text-green-400 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-green-500 group-hover:text-white transition-all duration-300">
                <Award className="w-7 h-7" />
              </div>
              <div className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tight">15+</div>
              <div className="text-slate-400 font-medium uppercase tracking-wider text-sm">Years of Trust</div>
            </div>
            
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 p-8 rounded-3xl text-center transform hover:-translate-y-2 transition-all duration-300 group">
              <div className="w-14 h-14 mx-auto bg-yellow-500/10 text-yellow-400 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-yellow-500 group-hover:text-white transition-all duration-300">
                <Star className="w-7 h-7" />
              </div>
              <div className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tight">98%</div>
              <div className="text-slate-400 font-medium uppercase tracking-wider text-sm">Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Ready to prioritize your health?</h2>
          <p className="text-primary-100 text-lg mb-10 max-w-2xl mx-auto">Join thousands of patients who trust CareConnect for their medical needs. Register today and book your first consultation in minutes.</p>
          <Link to="/register" className="inline-flex items-center justify-center bg-white text-primary-600 font-bold text-lg px-10 py-4 rounded-full shadow-xl hover:bg-slate-50 hover:scale-105 transition-all duration-300">
            Create Free Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-16 relative overflow-hidden">
        {/* Subtle top gradient */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary-900 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          
          {/* Brand & Bio */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-900/50">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-black text-white tracking-tight">CareConnect</span>
            </div>
            <p className="text-sm leading-relaxed mb-8 max-w-sm text-slate-400">
              Simplifying healthcare with modern technology. We seamlessly connect patients with the most elite medical specialists in the city, providing 24/7 care you can trust.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-primary-400 hover:border-primary-500/50 hover:bg-primary-900/20 transition-all duration-300"><Globe className="w-4 h-4" /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-primary-400 hover:border-primary-500/50 hover:bg-primary-900/20 transition-all duration-300"><MessageCircle className="w-4 h-4" /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-primary-400 hover:border-primary-500/50 hover:bg-primary-900/20 transition-all duration-300"><Share2 className="w-4 h-4" /></a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-bold mb-6 uppercase text-sm tracking-wider">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/" className="flex items-center gap-2 hover:text-primary-400 transition-colors"><ArrowRight className="w-3 h-3" /> Home</Link></li>
              <li><a href="#services" className="flex items-center gap-2 hover:text-primary-400 transition-colors"><ArrowRight className="w-3 h-3" /> Services</a></li>
              <li><a href="#doctors-section" className="flex items-center gap-2 hover:text-primary-400 transition-colors"><ArrowRight className="w-3 h-3" /> Our Doctors</a></li>
              <li><Link to="/login" className="flex items-center gap-2 hover:text-primary-400 transition-colors"><ArrowRight className="w-3 h-3" /> Patient Login</Link></li>
            </ul>
          </div>
          
          {/* Departments */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-bold mb-6 uppercase text-sm tracking-wider">Departments</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="flex items-center gap-2 hover:text-secondary-400 transition-colors"><ArrowRight className="w-3 h-3" /> Cardiology</a></li>
              <li><a href="#" className="flex items-center gap-2 hover:text-secondary-400 transition-colors"><ArrowRight className="w-3 h-3" /> Neurology</a></li>
              <li><a href="#" className="flex items-center gap-2 hover:text-secondary-400 transition-colors"><ArrowRight className="w-3 h-3" /> Pediatrics</a></li>
              <li><a href="#" className="flex items-center gap-2 hover:text-secondary-400 transition-colors"><ArrowRight className="w-3 h-3" /> Orthopedics</a></li>
            </ul>
          </div>
          
          {/* Contact & Newsletter */}
          <div className="lg:col-span-4">
            <h4 className="text-white font-bold mb-6 uppercase text-sm tracking-wider">Contact Us</h4>
            <ul className="space-y-4 text-sm mb-8">
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" />
                <span className="text-slate-300">1800-HEALTH-CARE (Toll Free)<br/>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary-500 flex-shrink-0" />
                <span className="text-slate-300">support@careconnect.com</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" />
                <span className="text-slate-300">123 Health Avenue, Medical District<br/>New Delhi, India 110001</span>
              </li>
            </ul>
            
            <div className="relative">
              <input 
                type="email" 
                placeholder="Subscribe to newsletter..." 
                className="w-full bg-slate-900 border border-slate-800 rounded-full py-3 pl-5 pr-12 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
              />
              <button className="absolute right-1 top-1 bottom-1 w-10 bg-primary-600 hover:bg-primary-500 rounded-full flex items-center justify-center text-white transition-colors">
                <Send className="w-4 h-4 ml-[-2px]" />
              </button>
            </div>
          </div>
          
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} CareConnect Medical Systems. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Cookie Settings</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
