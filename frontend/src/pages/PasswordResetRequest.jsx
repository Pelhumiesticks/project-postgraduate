import React, { useContext, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const PasswordResetRequest = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()
  const { backendUrl, token } = useContext(AppContext);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
  
    try {
      const { data } = await axios.post(`${backendUrl}/api/user/request-password-reset`, { email });
      
      if (data.success) {
        toast.success('Password reset email sent! Please check your inbox.');
        navigate('/reset-password')
      } else {
        toast.error(data.message || 'Something went wrong');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <form onSubmit={handleSubmit} className="min-h-[80vh] flex items-center">
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg">
        <p className="text-2xl font-semibold">Password Reset</p>
        <p>Enter your email to receive a password reset link.</p>

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

        <button
          type="submit"
          className={`bg-primary text-white w-full py-2 rounded-md text-base ${loading ? 'opacity-50' : ''}`}
          disabled={loading}
        >
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </div>
    </form>
  );
};

export default PasswordResetRequest;
