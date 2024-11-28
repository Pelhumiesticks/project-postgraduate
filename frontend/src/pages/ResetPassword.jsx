import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch backend URL from environment
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Get the token from the query string in the URL
  const token = new URLSearchParams(location.search).get('token');

  // Check token validity on component mount
  useEffect(() => {
    if (!token) {
      navigate('/');
    }
  }, [token, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    // Ensure both passwords match
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      // POST request to backend for password reset
      const { data } = await axios.post( `${backendUrl}/api/user/reset-password`,{ token, newPassword });

      if (data.success) {
        toast.success('Password reset successfully');
        navigate('/login'); // Redirect to login page
      } else {
        toast.error(data.message || 'Something went wrong');
      }
    } catch (error) {
      // Handle errors and display messages
      toast.error(
        error.response?.data?.message || 'Something went wrong. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="min-h-[80vh] flex items-center">
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg">
        <p className="text-2xl font-semibold">Reset Password</p>
        <p>Enter your new password below.</p>

        <div className="w-full">
          <p>New Password</p>
          <input
            className="border border-zinc-300 rounded w-full p-2 m-1"
            type="password"
            onChange={(e) => setNewPassword(e.target.value)}
            value={newPassword}
            required
          />
        </div>

        <div className="w-full">
          <p>Confirm Password</p>
          <input
            className="border border-zinc-300 rounded w-full p-2 m-1"
            type="password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            value={confirmPassword}
            required
          />
        </div>

        <button
          type="submit"
          className={`bg-primary text-white w-full py-2 rounded-md text-base ${
            loading ? 'opacity-50' : ''
          }`}
          disabled={loading}
        >
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </div>
    </form>
  );
};

export default ResetPassword;
