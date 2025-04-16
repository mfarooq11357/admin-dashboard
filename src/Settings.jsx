import React, { useState, useEffect } from "react";
import { Edit, Calendar, MapPin, Phone, Mail, User, Briefcase, Flag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import Loader from "./components/Loader";
// import UpcomingEvents from "../components/UpcommingEvents";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const isOtpVerified = localStorage.getItem('isOtpVerified') === 'true';
    if (!token || !isOtpVerified) {
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
        } else {
          toast.error('Failed to fetch user data');
          navigate('/login');
        }
      } catch (error) {
        toast.error('An error occurred while fetching user data');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [navigate]);

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
          <h1 className="text-4xl font-bold mb-6 text-gray-800">My Profile</h1>

          <div className="flex flex-wrap items-center gap-4 mb-8">
            <div className="relative h-24 w-24 rounded-full overflow-hidden border-4 border-gray-100 shadow-md">
              <img
                src={user.picture || "https://i.ibb.co/ksKn2gWQ/Ellipse-1.png"}
                alt="Profile picture"
                className="object-cover w-full h-full"
              />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{user.firstName} {user.lastName}</h2>
              <p className="text-gray-500 flex items-center">
                <Mail className="w-4 h-4 mr-1" />
                {user.officialEmail}
              </p>
            </div>
            <button
              onClick={() => navigate('/EditProfile')}
              className="ml-auto bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-all flex items-center gap-2 shadow-md hover:shadow-lg"
            >
              <Edit className="w-4 h-4" />
              Edit Profile
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div className="bg-gray-50 p-3 rounded-lg hover:shadow-md transition-all">
              <p className="text-gray-500 text-sm flex items-center">
                <User className="w-4 h-4 mr-1" />
                First Name
              </p>
              <p className="font-medium text-gray-800">{user.firstName}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg hover:shadow-md transition-all">
              <p className="text-gray-500 text-sm flex items-center">
                <User className="w-4 h-4 mr-1" />
                Last Name
              </p>
              <p className="font-medium text-gray-800">{user.lastName}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg hover:shadow-md transition-all">
              <p className="text-gray-500 text-sm flex items-center">
                <User className="w-4 h-4 mr-1" />
                Gender
              </p>
              <p className="font-medium text-gray-800">{user.gender || 'N/A'}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg hover:shadow-md transition-all">
              <p className="text-gray-500 text-sm flex items-center">
                <Flag className="w-4 h-4 mr-1" />
                Country
              </p>
              <p className="font-medium text-gray-800">{user.locationCountry || 'N/A'}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg hover:shadow-md transition-all">
              <p className="text-gray-500 text-sm flex items-center">
                <Briefcase className="w-4 h-4 mr-1" />
                Job Status
              </p>
              <p className="font-medium text-gray-800">{user.jobStatus || 'N/A'}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg hover:shadow-md transition-all">
              <p className="text-gray-500 text-sm flex items-center">
                <User className="w-4 h-4 mr-1" />
                Roll No
              </p>
              <p className="font-medium text-gray-800">{user.rollNo}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg hover:shadow-md transition-all">
              <p className="text-gray-500 text-sm flex items-center">
                <Briefcase className="w-4 h-4 mr-1" />
                Role
              </p>
              <p className="font-medium text-gray-800">{user.role}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg hover:shadow-md transition-all">
              <p className="text-gray-500 text-sm flex items-center">
                <Mail className="w-4 h-4 mr-1" />
                Personal Email
              </p>
              <p className="font-medium text-gray-800">{user.personalEmail || 'N/A'}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg hover:shadow-md transition-all">
              <p className="text-gray-500 text-sm flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                Address
              </p>
              <p className="font-medium text-gray-800">{user.address || 'N/A'}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg hover:shadow-md transition-all">
              <p className="text-gray-500 text-sm flex items-center">
                <Phone className="w-4 h-4 mr-1" />
                Tel #
              </p>
              <p className="font-medium text-gray-800">{user.contactNumber}</p>
            </div>
          </div>
        </div>

        <div className="hidden lg:flex items-center justify-center">
          <div className="h-full">
            <img src="https://i.ibb.co/rBZSJDk/Line-61.png" alt="Divider" className="h-full object-contain" />
          </div>
        </div>

        {/* <div className="w-full lg:w-1/5 mt-8 lg:mt-0">
          <h1 className="text-[1.4rem] font-bold mb-6 text-gray-800 flex items-center">
            <Calendar className="mr-2 text-blue-600" />
            Upcoming Events
          </h1>
          <UpcomingEvents />
        </div> */}
      </div>
    </div>
  );
};

export default ProfilePage;

