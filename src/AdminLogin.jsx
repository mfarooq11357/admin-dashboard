import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { Link, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import Loader from "./components/Loader";

export default function AdminLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();

  // refs for OTP inputs
  const otpRefs = useRef([]);

  // If already logged in, go straight to dashboard
  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3000/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          officialEmail: data.email,
          password: data.password
        }),
      });
      const result = await res.json();

      if (!res.ok) {
        toast.error(result.error || 'Login failed');
      }
      else if (result.user.role !== 'admin') {
        toast.error('Access denied: Admin only');
      }
      else {
        // save token + user
        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));

        if (result.isOtpVerified) {
          toast.success('Welcome back!');
          navigate('/dashboard', { replace: true });
        } else {
          // send OTP then show OTP UI
          await fetch('http://localhost:3000/user/send-otp', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${result.token}`
            }
          });
          setOtpSent(true);
          toast.success('OTP sent to your email');
          // focus first OTP box
          otpRefs.current[0]?.focus();
        }
      }
    } catch (err) {
      toast.error('Network error, try again');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (idx, val) => {
    if (!/^\d?$/.test(val)) return;
    const arr = [...otpValues];
    arr[idx] = val;
    setOtpValues(arr);
    if (val && idx < 5) {
      otpRefs.current[idx + 1]?.focus();
    }
  };

  const verifyOtp = async () => {
    const code = otpValues.join('');
    if (code.length !== 6) {
      toast.error('Enter all 6 digits');
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3000/user/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ otp: code })
      });
      const result = await res.json();

      if (!res.ok) {
        toast.error(result.error || 'Wrong OTP');
      } else {
        localStorage.setItem('isOtpVerified', 'true');
        toast.success('OTP verified!');
        navigate('/dashboard', { replace: true });
      }
    } catch (err) {
      toast.error('OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <Loader />
        </div>
      )}
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 z-10">
          <h1 className="text-3xl font-bold text-center text-[#4B0082] mb-6">
            {otpSent ? 'Verify OTP' : 'Admin Login'}
          </h1>

          {!otpSent ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <div className="relative mt-1">
                  <Mail size={18} className="absolute left-3 top-3 text-gray-500" />
                  <input
                    {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
                    type="email"
                    placeholder="you@domain.com"
                    className={`w-full pl-10 pr-4 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-[#4B0082]`}
                  />
                  {errors.email && <p className="text-xs text-red-500 mt-1">Valid email required</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <div className="relative mt-1">
                  <Lock size={18} className="absolute left-3 top-3 text-gray-500" />
                  <input
                    {...register("password", { required: true })}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className={`w-full pl-10 pr-10 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-[#4B0082]`}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3"
                    onClick={() => setShowPassword(s => !s)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                  {errors.password && <p className="text-xs text-red-500 mt-1">Password required</p>}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#4B0082] text-white py-2 rounded-md hover:bg-[#3a0066] transition-transform transform hover:scale-105"
              >
                Sign In
              </button>

              <p className="text-center text-sm text-gray-600">
                Not an admin? <Link to="/admin-login" className="text-[#4B0082] hover:underline">User login</Link>
              </p>
            </form>
          ) : (
            <div className="space-y-6">
              <p className="text-center text-gray-600">Enter the 6-digit code sent to your email</p>
              <div className="flex justify-center gap-2">
                {otpValues.map((v, i) => (
                  <input
                    key={i}
                    ref={el => otpRefs.current[i] = el}
                    type="text"
                    maxLength={1}
                    value={v}
                    onChange={e => handleOtpChange(i, e.target.value)}
                    className="w-12 h-12 text-center border border-gray-300 rounded-md focus:ring-2 focus:ring-[#4B0082]"
                  />
                ))}
              </div>
              <button
                onClick={verifyOtp}
                className="w-full bg-[#4B0082] text-white py-2 rounded-md hover:bg-[#3a0066] transition-transform transform hover:scale-105"
              >
                Verify OTP
              </button>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
