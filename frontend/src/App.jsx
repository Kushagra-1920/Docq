import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import AuthLayout from './layouts/AuthLayout';
import MainLayout from './layouts/MainLayout';

// Public Pages
import Home from './pages/public/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';

// Doctor Pages
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import DoctorPatients from './pages/doctor/DoctorPatients';
import DoctorPrescriptions from './pages/doctor/DoctorPrescriptions';

// Patient Pages
import PatientDashboard from './pages/patient/PatientDashboard';
import BookAppointment from './pages/patient/BookAppointment';
import MedicalRecords from './pages/patient/MedicalRecords';
import DoctorDetails from './pages/patient/DoctorDetails';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        
        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Protected Dashboard Routes */}
        <Route element={<MainLayout />}>
          
          {/* Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={['ROLE_ADMIN']} />}>
            <Route path="/admin" element={<AdminDashboard />} />
            {/* Add more admin routes here */}
          </Route>

          {/* Doctor Routes */}
          <Route element={<ProtectedRoute allowedRoles={['ROLE_DOCTOR']} />}>
            <Route path="/doctor" element={<DoctorDashboard />} />
            <Route path="/doctor/patients" element={<DoctorPatients />} />
            <Route path="/doctor/prescriptions" element={<DoctorPrescriptions />} />
          </Route>

          {/* Patient Routes */}
          <Route element={<ProtectedRoute allowedRoles={['ROLE_PATIENT']} />}>
            <Route path="/patient" element={<PatientDashboard />} />
            <Route path="/patient/book" element={<BookAppointment />} />
            <Route path="/patient/records" element={<MedicalRecords />} />
            <Route path="/patient/doctors" element={<DoctorDetails />} />
          </Route>

        </Route>
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
