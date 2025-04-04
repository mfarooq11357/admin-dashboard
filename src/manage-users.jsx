import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search, Pencil } from "lucide-react";
import { toast } from "react-toastify";

const UsersPage = () => {
  // State management
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // For the input field
  const [activeSearchQuery, setActiveSearchQuery] = useState(""); // For the current search

  // Function to check if the query is a complete roll number
  const isRollNo = (query) => {
    const rollNoRegex = /^\d{6}98-\d{3}$/;
    return rollNoRegex.test(query);
  };

  // Fetch users from the backend API with pagination and search
  const fetchUsers = async (page, query) => {
    try {
      const token = localStorage.getItem("token");
      let url;
      if (query) {
        // If it's a complete roll number, search only by rollNo,
        // otherwise, send both rollNo and name to allow partial matching
        if (isRollNo(query)) {
          url = `http://localhost:3000/user/search?rollNo=${query}&page=${page}&limit=10`;
        } else {
          url = `http://localhost:3000/user/search?rollNo=${query}&name=${query}&page=${page}&limit=10`;
        }
      } else {
        url = `http://localhost:3000/user/allUsers?page=${page}&limit=10`;
      }
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data.users);
      setCurrentPage(response.data.currentPage);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Fetch users when the component mounts or when currentPage or activeSearchQuery changes
  useEffect(() => {
    fetchUsers(currentPage, activeSearchQuery);
  }, [currentPage, activeSearchQuery]);

  // Enhance live search: update active search query whenever searchQuery changes (with a debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      setActiveSearchQuery(searchQuery);
      setCurrentPage(1);
    }, 300); // debounce delay of 300ms
    return () => clearTimeout(timer);
  }, [searchQuery]);

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
      toast.success("Role updated successfully!");
      closeModal();
      fetchUsers(currentPage, activeSearchQuery);
    } catch (error) {
      console.error("Error updating role:", error);
      toast.error("Error updating role. Please try again.");
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Users</h1>

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-6">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search"
            className="pl-8 pr-4 py-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button
          onClick={() => {
            setActiveSearchQuery(searchQuery);
            setCurrentPage(1);
          }}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm"
        >
          Search
        </button>
      </div>

      {/* Users Table */}
      <div className="border rounded-lg overflow-hidden">
        <table className="table-auto w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="pl-4 text-left text-sm font-semibold text-[#000000]">Roll No</th>
              <th className="p-3 text-left text-sm font-semibold text-[#000000]">Name</th>
              <th className="p-3 text-left text-sm font-semibold text-[#000000]">Email</th>
              <th className="p-3 text-left text-sm font-semibold text-[#000000]">Role</th>
              <th className="p-3 text-left text-sm font-semibold text-[#000000]">Gender</th>
              <th className="p-3 text-left text-sm font-semibold text-[#000000] w-[100px]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-t hover:bg-gray-50">
                <td className="pl-4 text-sm text-gray-800">{user.rollNo}</td>
                <td className="p-3 text-sm text-gray-800">{`${user.firstName} ${user.lastName}`}</td>
                <td className="p-3 text-sm text-gray-800">{user.officialEmail}</td>
                <td className="p-3 text-sm text-gray-800">{user.role}</td>
                <td className="p-3 text-sm text-gray-800">{user.gender}</td>
                <td className="p-3">
                  <button
                    onClick={() => openModal(user)}
                    className="p-1 hover:bg-gray-200 rounded"
                  >
                    <Pencil className="h-4 w-4" />
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
            className={`px-2 py-1 text-sm rounded-md border ${
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
        <EditRoleModal user={selectedUser} onClose={closeModal} onSave={handleUpdateRole} />
      )}
    </div>
  );
};

// Edit Role Modal Component (unchanged)
const EditRoleModal = ({ user, onClose, onSave }) => {
  const [role, setRole] = useState(user.role);
  const [subRole, setSubRole] = useState(user.subRole || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(role, subRole);
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Edit Role</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="student">Student</option>
              <option value="admin">Admin</option>
              <option value="society member">Society Member</option>
              <option value="alumni">Alumni</option>
            </select>
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Sub Role</label>
            <input
              type="text"
              value={subRole}
              onChange={(e) => setSubRole(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="Enter sub role (optional)"
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
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


// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Search, Pencil } from "lucide-react";

// const UsersPage = () => {
//   // State management
//   const [users, setUsers] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [searchQuery, setSearchQuery] = useState(""); // For the input field
//   const [activeSearchQuery, setActiveSearchQuery] = useState(""); // For the current search

//   // Function to check if the query is a complete roll number
//   const isRollNo = (query) => {
//     const rollNoRegex = /^\d{6}98-\d{3}$/;
//     return rollNoRegex.test(query);
//   };

//   // Fetch users from the backend API with pagination and search
//   const fetchUsers = async (page, query) => {
//     try {
//       const token = localStorage.getItem("token");
//       let url;
//       if (query) {
//         // If it's a complete roll number, search only by rollNo,
//         // otherwise, send both rollNo and name to allow partial matching
//         if (isRollNo(query)) {
//           url = `http://localhost:3000/user/search?rollNo=${query}&page=${page}&limit=10`;
//         } else {
//           url = `http://localhost:3000/user/search?rollNo=${query}&name=${query}&page=${page}&limit=10`;
//         }
//       } else {
//         url = `http://localhost:3000/user/allUsers?page=${page}&limit=10`;
//       }
//       const response = await axios.get(url, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setUsers(response.data.users);
//       setCurrentPage(response.data.currentPage);
//       setTotalPages(response.data.totalPages);
//     } catch (error) {
//       console.error("Error fetching users:", error);
//     }
//   };

//   // Fetch users when the component mounts or when currentPage or activeSearchQuery changes
//   useEffect(() => {
//     fetchUsers(currentPage, activeSearchQuery);
//   }, [currentPage, activeSearchQuery]);

//   // Enhance live search: update active search query whenever searchQuery changes (with a debounce)
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setActiveSearchQuery(searchQuery);
//       setCurrentPage(1);
//     }, 300); // debounce delay of 300ms
//     return () => clearTimeout(timer);
//   }, [searchQuery]);

//   // Handle pagination button clicks
//   const handlePageChange = (page) => {
//     setCurrentPage(page);
//   };

//   // Open the edit modal with the selected user
//   const openModal = (user) => {
//     setSelectedUser(user);
//     setIsModalOpen(true);
//   };

//   // Close the edit modal
//   const closeModal = () => {
//     setIsModalOpen(false);
//     setSelectedUser(null);
//   };

//   // Update user role and subrole via the backend API
//   const handleUpdateRole = async (role, subRole) => {
//     try {
//       const token = localStorage.getItem("token");
//       await axios.put(
//         `http://localhost:3000/user/updateRole/${selectedUser._id}`,
//         { role, subRole },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       closeModal();
//       fetchUsers(currentPage, activeSearchQuery);
//     } catch (error) {
//       console.error("Error updating role:", error);
//     }
//   };

//   return (
//     <div className="container mx-auto p-6 space-y-6">
//       <h1 className="text-3xl font-bold mb-6 text-gray-800">Users</h1>

//       {/* Search Bar */}
//       <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-6">
//         <div className="relative flex-1 w-full">
//           <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
//           <input
//             type="text"
//             placeholder="Search"
//             className="pl-8 pr-4 py-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />
//         </div>
//         <button
//           onClick={() => {
//             setActiveSearchQuery(searchQuery);
//             setCurrentPage(1);
//           }}
//           className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm"
//         >
//           Search
//         </button>
//       </div>

//       {/* Users Table */}
//       <div className="border rounded-lg overflow-hidden">
//         <table className="table-auto w-full border-collapse">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="pl-4 text-left text-sm font-semibold text-[#000000]">Roll No</th>
//               <th className="p-3 text-left text-sm font-semibold text-[#000000]">Name</th>
//               <th className="p-3 text-left text-sm font-semibold text-[#000000]">Email</th>
//               <th className="p-3 text-left text-sm font-semibold text-[#000000]">Role</th>
//               <th className="p-3 text-left text-sm font-semibold text-[#000000]">Gender</th>
//               <th className="p-3 text-left text-sm font-semibold text-[#000000] w-[100px]">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {users.map((user) => (
//               <tr key={user._id} className="border-t hover:bg-gray-50">
//                 <td className="pl-4 text-sm text-gray-800">{user.rollNo}</td>
//                 <td className="p-3 text-sm text-gray-800">{`${user.firstName} ${user.lastName}`}</td>
//                 <td className="p-3 text-sm text-gray-800">{user.officialEmail}</td>
//                 <td className="p-3 text-sm text-gray-800">{user.role}</td>
//                 <td className="p-3 text-sm text-gray-800">{user.gender}</td>
//                 <td className="p-3">
//                   <button
//                     onClick={() => openModal(user)}
//                     className="p-1 hover:bg-gray-200 rounded"
//                   >
//                     <Pencil className="h-4 w-4" />
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination Buttons */}
//       <div className="mt-6 flex justify-center space-x-2">
//         {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
//           <button
//             key={page}
//             onClick={() => handlePageChange(page)}
//             className={`px-2 py-1 text-sm rounded-md border ${
//               currentPage === page
//                 ? "bg-blue-600 text-white border-blue-600"
//                 : "bg-white text-blue-600 border-gray-300 hover:bg-blue-50"
//             }`}
//           >
//             {page}
//           </button>
//         ))}
//       </div>

//       {/* Edit Role Modal */}
//       {isModalOpen && (
//         <EditRoleModal user={selectedUser} onClose={closeModal} onSave={handleUpdateRole} />
//       )}
//     </div>
//   );
// };

// // Edit Role Modal Component (unchanged)
// const EditRoleModal = ({ user, onClose, onSave }) => {
//   const [role, setRole] = useState(user.role);
//   const [subRole, setSubRole] = useState(user.subRole || "");

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onSave(role, subRole);
//   };

//   return (
//     <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
//       <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
//         <h2 className="text-xl font-semibold mb-4 text-gray-800">Edit Role</h2>
//         <form onSubmit={handleSubmit}>
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
//             <select
//               value={role}
//               onChange={(e) => setRole(e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
//             >
//               <option value="student">Student</option>
//               <option value="admin">Admin</option>
//               <option value="society member">Society Member</option>
//               <option value="alumni">Alumni</option>
//             </select>
//           </div>
//           <div className="mb-6">
//             <label className="block text-sm font-medium text-gray-700 mb-1">Sub Role</label>
//             <input
//               type="text"
//               value={subRole}
//               onChange={(e) => setSubRole(e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
//               placeholder="Enter sub role (optional)"
//             />
//           </div>
//           <div className="flex justify-end space-x-3">
//             <button
//               type="button"
//               onClick={onClose}
//               className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
//             >
//               Save
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default UsersPage;




