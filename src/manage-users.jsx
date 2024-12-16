'use client';

import React, { useState } from "react";
import { Search, Pencil, Trash2 } from "lucide-react";

// User object definition
const initialUsers = [
  { id: "SE-001", name: "Muhamad amir", email: "amir01@gmail.com", role: "Student", status: "active" },
  { id: "SE-050", name: "Muhamad Ali", email: "amir01@gmail.com", role: "Alumni", status: "active" },
  { id: "SE-236", name: "Ahmed Ali", email: "amir01@gmail.com", role: "Student", status: "active" },
  { id: "SE-65", name: "Muhamad ahmed", email: "amir01@gmail.com", role: "Society Member", status: "active" },
  { id: "SE-653", name: "ali raza", email: "amir01@gmail.com", role: "Student", status: "active" },
  { id: "SE-323", name: "subhan", email: "amir01@gmail.com", role: "Society Member", status: "active" },
  { id: "SE-323", name: "hassan", email: "amir01@gmail.com", role: "Student", status: "active" },
  { id: "SE-323", name: "alyan", email: "amir01@gmail.com", role: "Student", status: "inactive" },
  { id: "SE-323", name: "haseeb", email: "amir01@gmail.com", role: "Student", status: "inactive" },
  { id: "SE-223", name: "hanzala", email: "amir01@gmail.com", role: "Society Member", status: "inactive" },
];

export default function UserTable() {
  const [users, setUsers] = useState(initialUsers);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search"
            className="pl-8 pr-4 py-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">
          Add New
        </button>
      </div>
      <div className="border rounded-lg overflow-hidden">
        <table className="table-auto w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left w-12">
                <input type="checkbox" />
              </th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left w-[100px]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id + user.name} className="border-t">
                <td className="p-3">
                  <input type="checkbox" />
                </td>
                <td className="p-3">{user.name}</td>
                <td className="p-1">{user.id}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3">{user.role}</td>
                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-white text-sm ${
                      user.status === "active" ? "bg-green-500" : "bg-gray-500"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="p-3 flex gap-2">
                  <button className="p-1 hover:bg-gray-200 rounded">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button className="p-1 hover:bg-gray-200 rounded">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
