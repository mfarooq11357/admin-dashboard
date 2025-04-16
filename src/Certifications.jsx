import React, { useState, useEffect } from 'react';
import { Search, Plus, Check } from 'lucide-react';
import jsPDF from 'jspdf';
import { toast } from 'react-toastify';

export default function Certificates() {
  const [requests, setRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  // For client-side pagination
  const [currentPage, setCurrentPage] = useState(1);
  const requestsPerPage = 10;

  // Fetch pending certificate requests when the component mounts
  useEffect(() => {
    const fetchCertificateRequests = async () => {
      try {
        const token = localStorage.getItem('token'); // or wherever you store it

        const response = await fetch('http://localhost:3000/certificateRequestRoutes/admin/pending-requests', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) throw new Error('Failed to fetch certificate requests');
        const data = await response.json();
        setRequests(data.pendingRequests || []);
      } catch (error) {
        console.error('Error fetching certificate requests:', error);
        toast.error('Error fetching certificate requests');
        setRequests([]);
      }
    };
    fetchCertificateRequests();
  }, []);

  // Filter requests based on search term (applies on user's first name, last name, or roll number)
  const filteredRequests = requests.filter((req) => {
    const { firstName, lastName, rollNo } = req.userId;
    const fullName = `${firstName} ${lastName}`.toLowerCase();
    return (
      fullName.includes(searchTerm.toLowerCase()) ||
      rollNo.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const totalPages = Math.ceil(filteredRequests.length / requestsPerPage);
  const currentRequests = filteredRequests.slice(
    (currentPage - 1) * requestsPerPage,
    currentPage * requestsPerPage
  );

  // Handle search functionality
  const handleSearch = () => {
    setCurrentPage(1); // Reset to first page on search
  };

  // Generate character certificate as PDF using the user details from the request
  const generateCertificate = (user) => {
    try {
      const doc = new jsPDF();

      // Header: Society Name (assuming no logo for simplicity)
      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.text('Software Engineering Society', 105, 20, { align: 'center' });

      // Certificate Title
      doc.setFontSize(18);
      doc.setFont('helvetica', 'normal');
      doc.text('Character Certificate', 105, 40, { align: 'center' });

      // Body Text
      doc.setFontSize(12);
      const bodyText = `This is to certify that ${user.firstName} ${user.lastName}, with roll number ${user.rollNo}, has served as ${user.subRole || 'Member'} in the Software Engineering Society. During their tenure, they have demonstrated exceptional skills, unwavering dedication, and significant contributions to the society's objectives and activities, reflecting positively on their character and commitment.`;
      doc.text(bodyText, 10, 60, { maxWidth: 190 });

      // Date
      const date = new Date().toLocaleDateString();
      doc.text(`Date: ${date}`, 10, 100);

      // Signature
      doc.setFont('helvetica', 'italic');
      doc.text('Authorized Signature', 10, 110);
      doc.setFont('helvetica', 'normal');
      doc.text('President, Software Engineering Society', 10, 115);

      // Add a simple border for official look
      doc.setLineWidth(0.5);
      doc.rect(5, 5, 200, 287, 'S');

      // Save the PDF
      doc.save(`${user.firstName}_${user.lastName}_Character_Certificate.pdf`);
      toast.success('Certificate generated successfully');
    } catch (error) {
      console.error('Error generating certificate:', error);
      toast.error('Error generating certificate');
    }
  };

  // Resolve a certificate request (mark as solved)
  const resolveRequest = async (requestId) => {
    try {
      const token = localStorage.getItem('token'); // or wherever you store it

      const response = await fetch(`http://localhost:3000/certificateRequestRoutes/admin/resolve-request/${requestId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to resolve certificate request');
      const data = await response.json();
      toast.success('Certificate request resolved successfully');
      // Remove the resolved request from the list
      setRequests((prev) => prev.filter((req) => req._id !== requestId));
    } catch (error) {
      console.error('Error resolving certificate request:', error);
      toast.error('Error resolving certificate request');
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
        <h1 className="text-xl md:text-2xl font-bold">Certificates</h1>
        {/* <div className="text-sm text-gray-500">List of all society members</div> */}
      </div>

      {/* Search Bar and Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
          <input
            type="text"
            placeholder="Search by name or roll number"
            className="pl-10 w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={handleSearch}
            className="flex-1 sm:flex-none px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
          >
            Search
          </button>
          {/* Optional: "Add New" button remains commented if not needed */}
          {/*
          <button className="flex-1 sm:flex-none px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 flex items-center justify-center">
            <Plus className="h-4 w-4 mr-2" />
            <span className="whitespace-nowrap">Add New</span>
          </button>
          */}
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Roll No
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                Email
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                Role
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Certificate
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentRequests.length > 0 ? (
              currentRequests.map((req) => (
                <tr key={req._id}>
                  <td className="px-3 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {req.userId.firstName} {req.userId.lastName}
                    </div>
                    <div className="text-sm text-gray-500 sm:hidden">
                      {req.userId.role}
                    </div>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                    {req.userId.rollNo}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                    {req.userId.officialEmail}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                    {req.userId.role}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-left flex gap-2">
                    <button
                      onClick={() => generateCertificate(req.userId)}
                      className="px-2 py-1 border border-transparent text-xs md:text-sm font-medium rounded-md text-green-600 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      Generate Certificate
                    </button>
                    <button
                      onClick={() => resolveRequest(req._id)}
                      className="px-2 py-1 border border-transparent text-xs md:text-sm font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      title="Resolve Request"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="px-3 py-4 text-center text-sm text-gray-500"
                >
                  No certificate requests found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 disabled:opacity-50"
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}




// import React from 'react'
// import { Search, Plus } from 'lucide-react'

// // Sample data - in a real app this would come from an API or database
// const users = [
//   {
//     id: "1",
//     name: "Muhammad Farooq",
//     rollNo: "21011588-019",
//     email: "mfarooq@gmail.com",
//     role: "Student"
//   },
//   // Repeated entries for demonstration
// ].concat(Array(7).fill({
//   id: "1",
//   name: "Muhammad Farooq",
//   rollNo: "21011588-019",
//   email: "mfarooq@gmail.com",
//   role: "Student"
// }))

// export default function Certificates() {
//   return (
//     <div className="p-4 md:p-6 space-y-4 md:space-y-6">
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
//         <h1 className="text-xl md:text-2xl font-bold">Certificates</h1>
//         <div className="text-sm text-gray-500">list of all users</div>
//       </div>

//       <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
//         <div className="relative flex-1 w-full">
//           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
//           <input
//             type="text"
//             placeholder="Search"
//             className="pl-10 w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//           />
//         </div>
//         <div className="flex gap-2 w-full sm:w-auto">
//           <button type="submit" className="flex-1 sm:flex-none px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50">
//             Search
//           </button>
//           <button className="flex-1 sm:flex-none px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 flex items-center justify-center">
//             <Plus className="h-4 w-4 mr-2" />
//             <span className="whitespace-nowrap">Add New</span>
//           </button>
//         </div>
//       </div>

//       <div className="border rounded-lg overflow-x-auto">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="w-12 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 <span className="sr-only">Select</span>
//                 <input type="checkbox" className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
//               </th>
//               <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
//               <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roll No</th>
//               <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Email</th>
//               <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Role</th>
//               <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Certificate</th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {users.map((user, index) => (
//               <tr key={index}>
//                 <td className="px-3 py-4 whitespace-nowrap">
//                   <input type="checkbox" className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
//                 </td>
//                 <td className="px-3 py-4 whitespace-nowrap">
//                   <div className="text-sm font-medium text-gray-900">{user.name}</div>
//                   <div className="text-sm text-gray-500 sm:hidden">{user.role}</div>
//                 </td>
//                 <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">{user.rollNo}</td>
//                 <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">{user.email}</td>
//                 <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">{user.role}</td>
//                 <td className="px-3 py-4 whitespace-nowrap text-right text-sm font-medium">
//                   <button 
//                     className="px-2 py-1 border border-transparent text-xs md:text-sm font-medium rounded-md text-green-600 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
//                   >
//                     Generate Certificate
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   )
// }

