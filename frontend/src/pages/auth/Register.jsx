import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import { Loader2 } from 'lucide-react';

const schema = z.object({
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  phone: z.string().optional(),
  role: z.enum(['PATIENT', 'DOCTOR'], { message: 'Please select a valid role' })
});

const Register = () => {
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      role: 'PATIENT'
    }
  });

  const onSubmit = async (data) => {
    setErrorMsg('');
    setSuccessMsg('');
    try {
      await api.post('/auth/register', data);
      setSuccessMsg('Registration successful! You can now log in.');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      {errorMsg && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-100">
          {errorMsg}
        </div>
      )}
      {successMsg && (
        <div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm font-medium border border-green-100">
          {successMsg}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700">First Name</label>
          <div className="mt-1">
            <input {...register('firstName')} type="text" className="input-field" placeholder="John" />
            {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Last Name</label>
          <div className="mt-1">
            <input {...register('lastName')} type="text" className="input-field" placeholder="Doe" />
            {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>}
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">Email address</label>
        <div className="mt-1">
          <input {...register('email')} type="email" className="input-field" placeholder="you@example.com" />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">Phone</label>
        <div className="mt-1">
          <input {...register('phone')} type="text" className="input-field" placeholder="+1 (555) 000-0000" />
          {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">Password</label>
        <div className="mt-1">
          <input {...register('password')} type="password" className="input-field" placeholder="••••••••" />
          {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Register As</label>
        <div className="grid grid-cols-2 gap-4 mt-1">
          <label className="flex items-center p-3 border rounded-xl cursor-pointer hover:bg-slate-50 transition-colors border-slate-200 bg-white/50 backdrop-blur-sm">
            <input {...register('role')} type="radio" value="PATIENT" className="text-primary-600 focus:ring-primary-500 h-4 w-4" />
            <span className="ml-2 text-sm font-medium text-slate-900">Patient</span>
          </label>
          <label className="flex items-center p-3 border rounded-xl cursor-pointer hover:bg-slate-50 transition-colors border-slate-200 bg-white/50 backdrop-blur-sm">
            <input {...register('role')} type="radio" value="DOCTOR" className="text-primary-600 focus:ring-primary-500 h-4 w-4" />
            <span className="ml-2 text-sm font-medium text-slate-900">Doctor</span>
          </label>
        </div>
        {errors.role && <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>}
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-70 transition-all duration-200"
        >
          {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
        </button>
      </div>
      
      <div className="mt-6 text-center text-sm">
        <span className="text-slate-600">Already have an account? </span>
        <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
          Sign in
        </Link>
      </div>
    </form>
  );
};

export default Register;
