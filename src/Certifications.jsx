

import React from 'react'
import { Search, Plus } from 'lucide-react'

// Sample data - in a real app this would come from an API or database
const users = [
  {
    id: "1",
    name: "Muhammad Farooq",
    rollNo: "21011588-019",
    email: "mfarooq@gmail.com",
    role: "Student"
  },
  // Repeated entries for demonstration
].concat(Array(7).fill({
  id: "1",
  name: "Muhammad Farooq",
  rollNo: "21011588-019",
  email: "mfarooq@gmail.com",
  role: "Student"
}))

export default function Certificates() {
  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
        <h1 className="text-xl md:text-2xl font-bold">Certificates</h1>
        <div className="text-sm text-gray-500">list of all users</div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
          <input
            type="text"
            placeholder="Search"
            className="pl-10 w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button type="submit" className="flex-1 sm:flex-none px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50">
            Search
          </button>
          <button className="flex-1 sm:flex-none px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 flex items-center justify-center">
            <Plus className="h-4 w-4 mr-2" />
            <span className="whitespace-nowrap">Add New</span>
          </button>
        </div>
      </div>

      <div className="border rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-12 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <span className="sr-only">Select</span>
                <input type="checkbox" className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roll No</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Email</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Role</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Certificate</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user, index) => (
              <tr key={index}>
                <td className="px-3 py-4 whitespace-nowrap">
                  <input type="checkbox" className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
                </td>
                <td className="px-3 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{user.name}</div>
                  <div className="text-sm text-gray-500 sm:hidden">{user.role}</div>
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">{user.rollNo}</td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">{user.email}</td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">{user.role}</td>
                <td className="px-3 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    className="px-2 py-1 border border-transparent text-xs md:text-sm font-medium rounded-md text-green-600 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Generate Certificate
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

