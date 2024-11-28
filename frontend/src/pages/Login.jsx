import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { backendUrl, token, setToken } = useContext(AppContext);
  const navigate = useNavigate();

  const [state, setState] = useState('Sign Up');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const validatePassword = (password) => {
    const specialCharRegex = /[!@#$%^&*(),.?":{}|+-<>|=~`]/;
    return specialCharRegex.test(password);
  };

  const onPasswordChange = (value) => {
    setPassword(value);
    if (!validatePassword(value)) {
      setError('Password must contain at least one special character.');
    } else {
      setError('');
    }
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    if (!validatePassword(password)) {
      toast.error('Password must contain at least one special character.');
      return;
    }

    try {
      if (state === 'Sign Up') {
        const { data } = await axios.post(`${backendUrl}/api/user/register`, { name, password, email });
        if (data.success) {
          localStorage.setItem('token', data.token);
          setToken(data.token);
          navigate('/profile');
          toast.success('User registered successfully! kindly update your profile to get started')
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(`${backendUrl}/api/user/login`, { password, email });
        if (data.success) {
          localStorage.setItem('token', data.token);
          setToken(data.token);
          navigate('/');
          toast.success('Welcome back!')
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="min-h-[80vh] flex items-center">
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg">
        <p className="text-2xl font-semibold">{state === 'Sign Up' ? 'Create Account' : 'Login'}</p>
        <p>Please {state === 'Sign Up' ? 'sign up' : 'log in'} to book an appointment</p>
        {state === 'Sign Up' && (
          <div className="w-full">
            <p>Full Name</p>
            <input
              className="border border-zinc-300 rounded w-full p-2 m-1"
              type="text"
              onChange={(e) => setName(e.target.value)}
              value={name}
              required
            />
          </div>
        )}
        <div className="w-full">
          <p>Email</p>
          <input
            className="border border-zinc-300 rounded w-full p-2 m-1"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          />
        </div>
        <div className="w-full relative">
          <p>Password</p>
          <input
            className="border border-zinc-300 rounded w-full p-2 m-1"
            type={showPassword ? 'text' : 'password'}
            onChange={(e) => onPasswordChange(e.target.value)}
            value={password}
            required
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-[42px] cursor-pointer text-gray-600"
          >
            <i className={`fas ${showPassword ? 'fa-eye-slash text-red-500' : 'fa-eye text-primary'}`}></i>
          </span>
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
        <button
          type="submit"
          className={`bg-primary text-white w-full py-2 rounded-md text-base ${
            error ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={!!error}
        >
          {state === 'Sign Up' ? 'Create Account' : 'Login'}
        </button>
        <p className="text-primary underline cursor-pointer">
          <a href="/password-reset-request">Forgot Password?</a>
        </p>
        {state !== 'Sign Up' && (
          <div className="w-full">
            <p className="text text-center w-full">Or</p>
            <a
              className="text-primary w-full py-2 rounded-md text-base text-center hover:text-lg"
              href="https://pelstick-project-7eng.vercel.app/"
            >
              Admin Login
            </a>
          </div>
        )}
        {state === 'Sign Up' ? (
          <p>
            Already have an account?{' '}
            <span onClick={() => setState('Login')} className="text-primary underline cursor-pointer">
              Login here
            </span>
          </p>
        ) : (
          <p>
            Create a new account?{' '}
            <span onClick={() => setState('Sign Up')} className="text-primary underline cursor-pointer">
              Click here
            </span>
          </p>
        )}
      </div>
    </form>
  );
};

export default Login;
