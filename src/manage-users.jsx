import React, { useState, useEffect } from "react";
import axios from "axios";

const UsersPage = () => {
  // State management
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Fetch users from the backend API with pagination
  const fetchUsers = async (page) => {
    try {
      const token = localStorage.getItem("token"); // Retrieve JWT token
      const response = await axios.get(
        `http://localhost:3000/user/allUsers?page=${page}&limit=10`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUsers(response.data.users);
      setCurrentPage(response.data.currentPage);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Fetch users when the component mounts or the page changes
  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  // Handle pagination button clicks
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Open the edit modal with the selected user
  const openModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  // Close the edit modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  // Update user role and subrole via the backend API
  const handleUpdateRole = async (role, subRole) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:3000/user/updateRole/${selectedUser._id}`,
        { role, subRole },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      closeModal();
      fetchUsers(currentPage); // Refresh the user list
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Users</h1>

      {/* Users Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Roll No</th>
              <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Name</th>
              <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Email</th>
              <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Role</th>
              <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Gender</th>
              <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-b hover:bg-gray-50">
                <td className="py-4 px-6 text-gray-800">{user.rollNo}</td>
                <td className="py-4 px-6 text-gray-800">{`${user.firstName} ${user.lastName}`}</td>
                <td className="py-4 px-6 text-gray-800">{user.officialEmail}</td>
                <td className="py-4 px-6 text-gray-800">{user.role}</td>
                <td className="py-4 px-6 text-gray-800">{user.gender}</td>
                <td className="py-4 px-6">
                  <button
                    onClick={() => openModal(user)}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Buttons */}
      <div className="mt-6 flex justify-center space-x-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`px-4 py-2 rounded-md border ${
              currentPage === page
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-blue-600 border-gray-300 hover:bg-blue-50"
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Edit Role Modal */}
      {isModalOpen && (
        <EditRoleModal
          user={selectedUser}
          onClose={closeModal}
          onSave={handleUpdateRole}
        />
      )}
    </div>
  );
};

// Edit Role Modal Component
const EditRoleModal = ({ user, onClose, onSave }) => {
  const [role, setRole] = useState(user.role);
  const [subRole, setSubRole] = useState(user.subRole || "");

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(role, subRole);
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Edit Role</h2>
        <form onSubmit={handleSubmit}>
          {/* Role Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="student">Student</option>
              <option value="admin">Admin</option>
              <option value="society member">Society Member</option>
              <option value="alumni">Alumni</option>
            </select>
          </div>

          {/* SubRole Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Sub Role</label>
            <input
              type="text"
              value={subRole}
              onChange={(e) => setSubRole(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter sub role (optional)"
            />
          </div>

          {/* Modal Actions */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UsersPage;







// 'use client';

// import React, { useState } from "react";
// import { Search, Pencil, Trash2 } from "lucide-react";

// // User object definition
// const initialUsers = [
//   { id: "SE-001", name: "Muhamad amir", email: "amir01@gmail.com", role: "Student", status: "active" },
//   { id: "SE-050", name: "Muhamad Ali", email: "amir01@gmail.com", role: "Alumni", status: "active" },
//   { id: "SE-236", name: "Ahmed Ali", email: "amir01@gmail.com", role: "Student", status: "active" },
//   { id: "SE-65", name: "Muhamad ahmed", email: "amir01@gmail.com", role: "Society Member", status: "active" },
//   { id: "SE-653", name: "ali raza", email: "amir01@gmail.com", role: "Student", status: "active" },
//   { id: "SE-323", name: "subhan", email: "amir01@gmail.com", role: "Society Member", status: "active" },
//   { id: "SE-323", name: "hassan", email: "amir01@gmail.com", role: "Student", status: "active" },
//   { id: "SE-323", name: "alyan", email: "amir01@gmail.com", role: "Student", status: "inactive" },
//   { id: "SE-323", name: "haseeb", email: "amir01@gmail.com", role: "Student", status: "inactive" },
//   { id: "SE-223", name: "hanzala", email: "amir01@gmail.com", role: "Society Member", status: "inactive" },
// ];

// export default function UserTable() {
//   const [users, setUsers] = useState(initialUsers);
//   const [searchQuery, setSearchQuery] = useState("");

//   const filteredUsers = users.filter((user) =>
//     user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     user.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     user.email.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   return (
//     <div className="p-6 space-y-6">
//       <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
//         <div className="relative flex-1 w-full">
//           <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
//           <input
//             type="text"
//             placeholder="Search"
//             className="pl-8 pr-4 py-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />
//         </div>
//         <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">
//           Search
//         </button>
//       </div>
//       <div className="border rounded-lg overflow-hidden">
//         <table className="table-auto w-full border-collapse">
//           <thead className="bg-gray-100">
//             <tr>
//               {/* <th className="p-3 text-left ">
//                 <input type="checkbox" />
//               </th> */}
//               <th className="pl-4 text-left">Rollno</th>
//               <th className="p-3 text-left">Name</th>
//               <th className="p-3 text-left">Email</th>
//               <th className="p-3 text-left">Role</th>
//               <th className="p-3 text-left">Gender</th>
//               <th className="p-3 text-left w-[100px]">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredUsers.map((user) => (
//               <tr key={user.id + user.name} className="border-t">
//                 {/* <td className="p-3">
//                 {user.id}
//                 </td> */}
                
//                 <td className="pl-4"> {user.id}</td>
//                 <td className="p-3">{user.name}</td>
//                 <td className="p-3">{user.email}</td>
//                 <td className="p-3">{user.role}</td>
//                 <td className="p-3">{user.status}</td>

//                 <td className="p-3 flex gap-2">
//                   <button className="p-1 hover:bg-gray-200 rounded pl-4">
//                     <Pencil className="h-4 w-4 " />
//                   </button>
//                   {/* <button className="p-1 hover:bg-gray-200 rounded">
//                     <Trash2 className="h-4 w-4" />
//                   </button> */}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }
