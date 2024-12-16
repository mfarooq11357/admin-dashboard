"use client"

import { Mail, Eye, EyeOff, LogOut, Trash2 } from 'lucide-react'
import { useState } from "react"

export default function AccountSettings() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)

  return (
    <div className="w-full max-w-2xl mx-auto p-2">
      <div className="bg-white shadow-md rounded-lg">
        <div className="p-2 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Account Settings</h2>
        </div>
        <div className="p-6 space-y-8">
          {/* Profile Picture Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-900">Profile Picture</h3>
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src="/public/image 1.png"
                  alt="Profile"
                  className="w-16 h-16 rounded-full bg-gray-100 object-cover"
                />
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  Upload New
                </button>
                <button className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  Delete
                </button>
              </div>
            </div>
            <p className="text-xs text-gray-500">PNG, JPEG or GIF (15MB)</p>
          </div>

          {/* Full Name Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-900">Full Name</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  id="firstName"
                  placeholder="Subhan"
                  className="w-full px-3 py-2 text-sm text-gray-900 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  id="lastName"
                  placeholder="Ali"
                  className="w-full px-3 py-2 text-sm text-gray-900 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Email Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-900">Email</h3>
            <div className="space-y-2">
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  className="w-full pl-10 pr-3 py-2 text-sm text-gray-900 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="subhanali@gmail.com"
                  type="email"
                />
              </div>
              <button className="text-sm text-indigo-600 hover:text-indigo-500 focus:outline-none">
                + Add another email
              </button>
            </div>
          </div>

          {/* Password Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-900">Password</h3>
            <div className="grid gap-4">
              <div className="space-y-2">
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    id="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 text-sm text-gray-900 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <button
                    className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-gray-500 focus:outline-none"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <div className="relative">
                  <input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 text-sm text-gray-900 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <button
                    className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-gray-500 focus:outline-none"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Account Security Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-900">Account Security</h3>
            <p className="text-sm text-gray-500">Manage your account security</p>
            <div className="flex items-center gap-4">
              <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
              <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-red-700 bg-white border border-red-300 rounded-md shadow-sm hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete my account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

