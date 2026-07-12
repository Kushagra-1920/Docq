import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import api from '../../services/api';
import { Loader2 } from 'lucide-react';

const schema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(1, { message: 'Password is required' }),
});

const Login = () => {
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    setErrorMsg('');
    try {
      const response = await api.post('/auth/login', data);
      const { accessToken, refreshToken, id, email, roles } = response.data;
      
      const rememberMe = document.getElementById('remember-me').checked;
      if (!rememberMe) {
        sessionStorage.setItem('use_session', 'true');
      } else {
        sessionStorage.removeItem('use_session');
      }
      
      login({ id, email, roles }, accessToken, refreshToken);
      
      if (roles.includes('ROLE_ADMIN')) navigate('/admin');
      else if (roles.includes('ROLE_DOCTOR')) navigate('/doctor');
      else navigate('/patient');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to login. Please check credentials.');
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      {errorMsg && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-100">
          {errorMsg}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-slate-700">Email address</label>
        <div className="mt-1">
          <input
            {...register('email')}
            type="email"
            className="input-field"
            placeholder="you@example.com"
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">Password</label>
        <div className="mt-1">
          <input
            {...register('password')}
            type="password"
            className="input-field"
            placeholder="••••••••"
          />
          {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-900">
            Remember me
          </label>
        </div>
        <div className="text-sm">
          <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
            Forgot password?
          </a>
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-70 transition-all duration-200"
        >
          {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign in'}
        </button>
      </div>
      
      <div className="mt-8 pt-6 border-t border-slate-200">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider text-center mb-4">Quick Demo Login</p>
        <div className="grid grid-cols-2 gap-4">
          <button 
            type="button"
            onClick={() => {
              setValue('email', 'doctor1@hospital.com', { shouldValidate: true });
              setValue('password', 'Doctor@123', { shouldValidate: true });
            }}
            className="text-xs py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors font-medium"
          >
            Doctor
          </button>
          <button 
            type="button"
            onClick={() => {
              setValue('email', 'patient1@hospital.com', { shouldValidate: true });
              setValue('password', 'Patient@123', { shouldValidate: true });
            }}
            className="text-xs py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors font-medium"
          >
            Patient
          </button>
        </div>
      </div>
      
      <div className="mt-6 text-center text-sm">
        <span className="text-slate-600">Don't have an account? </span>
        <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
          Register now
        </Link>
      </div>
    </form>
  );
};

export default Login;
