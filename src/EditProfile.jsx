import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { Save, X, Calendar, MapPin, Phone, Mail, User, Briefcase, Flag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import Loader from "./components/Loader";
import crypto from 'crypto-js';

const ProfileEditPage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();
  const fileInputRef = useRef(null);

  const cloudName = 'diane1tak';
  const apiKey = '595487194871695';
  const apiSecret = 'mxA23kc58ZihQbGwPuM5mNicdFo';
  const uploadPreset = 'sesmanagement';

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await fetch('http://localhost:3000/user/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          reset(data.user);
        } else {
          toast.error('Failed to fetch user data');
          navigate('/settings');
        }
      } catch (error) {
        toast.error('An error occurred while fetching user data');
        navigate('/settings');
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [navigate, reset]);

  const generateSignature = (paramsToSign, apiSecret) => {
    const sortedParams = Object.keys(paramsToSign).sort().reduce((acc, key) => {
      acc[key] = paramsToSign[key];
      return acc;
    }, {});
    const paramString = Object.entries(sortedParams).map(([key, value]) => `${key}=${value}`).join('&');
    const signature = crypto.SHA1(paramString + apiSecret).toString();
    return signature;
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const paramsToSign = {
      timestamp,
      upload_preset: uploadPreset,
    };
    const signature = generateSignature(paramsToSign, apiSecret);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    formData.append('api_key', apiKey);
    formData.append('timestamp', timestamp);
    formData.append('signature', signature);

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.secure_url) {
        setUser(prev => ({ ...prev, picture: data.secure_url }));
        setValue("picture", data.secure_url);
        toast.success('Image uploaded successfully');
      } else {
        toast.error(`Failed to upload image: ${data.error?.message || 'Unknown error'}`);
        console.error('Cloudinary response:', data);
      }
    } catch (error) {
      toast.error('An error occurred during image upload');
      console.error('Upload error:', error);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        toast.success('Profile updated successfully');
        navigate('/settings');
      } else {
        const result = await response.json();
        toast.error(result.error || 'Failed to update profile');
      }
    } catch (error) {
      toast.error('An error occurred while updating profile');
      console.error('Update error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <Loader />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="container mx-auto pt-12 py-6 px-4 min-h-screen">
      <div className="flex flex-col lg:flex-row gap-8 relative bg-white p-6">
        <div className="w-full lg:w-4/5 lg:pr-8">
          <h1 className="text-4xl font-bold mb-6 text-gray-800">Edit Profile</h1>

          <div className="flex flex-wrap items-center gap-4 mb-8">
            <div className="relative h-24 w-24 rounded-full overflow-hidden border-4 border-gray-100 shadow-md group cursor-pointer"
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
            >
              <img
                src={user.picture || "https://i.ibb.co/ksKn2gWQ/Ellipse-1.png"}
                alt="Profile"
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white text-xs font-medium">Change Photo</span>
              </div>
              <input 
                type="file" 
                accept="image/*"
                ref={fileInputRef} 
                onChange={handleFileChange}
                style={{ display: 'none' }} 
              />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{user.firstName} {user.lastName}</h2>
              <p className="text-gray-500 flex items-center">
                <Mail className="w-4 h-4 mr-1" />
                {user.officialEmail}
              </p>
            </div>
          </div>

          <div className="mb-6">
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-gray-500 text-sm flex items-center">
                <Mail className="w-4 h-4 mr-1" />
                Official Email
              </p>
              <p className="font-medium text-gray-800">{user.officialEmail}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg mt-2">
              <p className="text-gray-500 text-sm flex items-center">
                <Briefcase className="w-4 h-4 mr-1" />
                Role
              </p>
              <p className="font-medium text-gray-800">{user.role}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div className="bg-gray-50 p-3 rounded-lg hover:shadow-md transition-all">
              <label htmlFor="firstName" className="text-gray-500 text-sm flex items-center">
                <User className="w-4 h-4 mr-1" />
                First Name
              </label>
              <input
                id="firstName"
                type="text"
                className="w-full bg-transparent font-medium text-gray-800 focus:outline-none mt-1"
                {...register("firstName", { required: "First name is required" })}
              />
              {errors.firstName && <p className="mt-1 text-xs text-red-500">{errors.firstName.message}</p>}
            </div>

            <div className="bg-gray-50 p-3 rounded-lg hover:shadow-md transition-all">
              <label htmlFor="lastName" className="text-gray-500 text-sm flex items-center">
                <User className="w-4 h-4 mr-1" />
                Last Name
              </label>
              <input
                id="lastName"
                type="text"
                className="w-full bg-transparent font-medium text-gray-800 focus:outline-none mt-1"
                {...register("lastName", { required: "Last name is required" })}
              />
              {errors.lastName && <p className="mt-1 text-xs text-red-500">{errors.lastName.message}</p>}
            </div>

            <div className="bg-gray-50 p-3 rounded-lg hover:shadow-md transition-all">
              <label htmlFor="personalEmail" className="text-gray-500 text-sm flex items-center">
                <Mail className="w-4 h-4 mr-1" />
                Personal Email
              </label>
              <input
                id="personalEmail"
                type="email"
                className="w-full bg-transparent font-medium text-gray-800 focus:outline-none mt-1"
                {...register("personalEmail")}
              />
            </div>

            <div className="bg-gray-50 p-3 rounded-lg hover:shadow-md transition-all">
              <label htmlFor="contactNumber" className="text-gray-500 text-sm flex items-center">
                <Phone className="w-4 h-4 mr-1" />
                Tel #
              </label>
              <input
                id="contactNumber"
                type="tel"
                className="w-full bg-transparent font-medium text-gray-800 focus:outline-none mt-1"
                {...register("contactNumber", { required: "Contact number is required" })}
              />
              {errors.contactNumber && <p className="mt-1 text-xs text-red-500">{errors.contactNumber.message}</p>}
            </div>

            <div className="bg-gray-50 p-3 rounded-lg hover:shadow-md transition-all">
              <label htmlFor="address" className="text-gray-500 text-sm flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                Address
              </label>
              <input
                id="address"
                type="text"
                className="w-full bg-transparent font-medium text-gray-800 focus:outline-none mt-1"
                {...register("address")}
              />
            </div>

            <div className="bg-gray-50 p-3 rounded-lg hover:shadow-md transition-all">
              <label htmlFor="jobStatus" className="text-gray-500 text-sm flex items-center">
                <Briefcase className="w-4 h-4 mr-1" />
                Job Status
              </label>
              <input
                id="jobStatus"
                type="text"
                className="w-full bg-transparent font-medium text-gray-800 focus:outline-none mt-1"
                {...register("jobStatus")}
              />
            </div>

            <div className="bg-gray-50 p-3 rounded-lg hover:shadow-md transition-all">
              <label htmlFor="locationCountry" className="text-gray-500 text-sm flex items-center">
                <Flag className="w-4 h-4 mr-1" />
                Country
              </label>
              <input
                id="locationCountry"
                type="text"
                className="w-full bg-transparent font-medium text-gray-800 focus:outline-none mt-1"
                {...register("locationCountry")}
              />
            </div>

            <div className="md:col-span-2 flex justify-end gap-4 mt-4">
              <button
                type="button"
                onClick={() => navigate('/settings')}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 flex items-center gap-2 hover:bg-gray-50 transition-colors"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-all flex items-center gap-2 shadow-md hover:shadow-lg"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </form>
        </div>

        <div className="hidden lg:flex items-center justify-center">
          <div className="h-full">
            <img src="https://i.ibb.co/rBZSJDk/Line-61.png" alt="Divider" className="h-full object-contain" />
          </div>
        </div>

 
      </div>
    </div>
  );
};

export default ProfileEditPage;



















