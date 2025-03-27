import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { LucideUser, LucideCheckCircle, LucideXCircle } from "lucide-react";

export default function AttendanceTracking() {
  const { id: eventId } = useParams();
  const [participants, setParticipants] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({ totalUsers: 0, registered: 0, absent: 0 });
  const [animatedStats, setAnimatedStats] = useState({
    registered: 0,
    absent: 0,
    totalUsers: 0,
  });

  const fetchParticipants = async (page) => {
    try {
      if (!eventId) return; // Guard clause for missing event ID
      
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:3000/events/${eventId}/participants?page=${page}&limit=88`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setParticipants(response.data.participants);
      setCurrentPage(response.data.pagination.currentPage);
      setTotalPages(response.data.pagination.totalPages);
      setStats(response.data.stats);
    } catch (error) {
      console.error("Error fetching participants:", error);
      if (error.response?.status === 403) {
        alert("You are not authorized to view participants.");
      }
    }
  };

  // Reset to first page when event changes
  useEffect(() => {
    setCurrentPage(1);
  }, [eventId]);

  // Fetch participants when eventId or page changes
  useEffect(() => {
    if (eventId) {
      fetchParticipants(currentPage);
    }
  }, [eventId, currentPage]);

  // Animation effect for stats
  useEffect(() => {
    const animateValue = (start, end, duration, key) => {
      let startTimestamp = null;
      const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        setAnimatedStats((prev) => ({
          ...prev,
          [key]: Math.floor(progress * (end - start) + start),
        }));
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      window.requestAnimationFrame(step);
    };

    if (stats.registered !== animatedStats.registered) {
      animateValue(0, stats.registered, 1000, "registered");
    }
    if (stats.absent !== animatedStats.absent) {
      animateValue(0, stats.absent, 1000, "absent");
    }
    if (stats.totalUsers !== animatedStats.totalUsers) {
      animateValue(0, stats.totalUsers, 1000, "totalUsers");
    }
  }, [stats]);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="space-y-6">
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">Attendance Tracking - Event #{eventId}</h1>
        </div>

        <div className="border rounded-lg overflow-x-auto">
          {participants.length === 0 ? (
            <p className="text-center text-gray-500 py-4">
              No participants found for this event.
            </p>
          ) : (
            <table className="min-w-full bg-white text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">Roll No</th>
                  <th className="px-4 py-2 text-left">Participant Name</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Contact</th>
                  <th className="px-4 py-2 text-left">Role</th>
                  <th className="px-4 py-2 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {participants.map((participant, index) => (
                  <tr key={index} className="border-t">
                    <td className="px-4 py-2">{participant.rollNo || "N/A"}</td>
                    <td className="px-4 py-2">
                      {participant.firstName} {participant.lastName}
                    </td>
                    <td className="px-4 py-2">{participant.officialEmail}</td>
                    <td className="px-4 py-2">{participant.contactNumber}</td>
                    <td className="px-4 py-2">{participant.role}</td>
                    <td className="px-4 py-2 text-center">
                      <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-green-50 text-green-700">
                        {participant.status || "Present"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="mt-4 flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 rounded ${
                currentPage === page ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              {page}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-lg bg-pink-100 p-4">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-white p-2">
                <LucideUser className="h-6 w-6 text-pink-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">{animatedStats.registered}</div>
                <div className="text-sm">Registered</div>
              </div>
            </div>
          </div>
          <div className="rounded-lg bg-yellow-100 p-4">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-white p-2">
                <LucideCheckCircle className="h-6 w-6 text-yellow-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">{animatedStats.absent}</div>
                <div className="text-sm">Absent</div>
              </div>
            </div>
          </div>
          <div className="rounded-lg bg-blue-100 p-4">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-white p-2">
                <LucideXCircle className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">{animatedStats.totalUsers}</div>
                <div className="text-sm">Total Users</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}







// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useParams } from "react-router-dom";
// import { LucideUser, LucideCheckCircle, LucideXCircle } from "lucide-react";

// export default function AttendanceTracking() {
//   const { eventId } = useParams(); // Get event ID from URL
//   const [participants, setParticipants] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [stats, setStats] = useState({ totalUsers: 0, registered: 0, absent: 0 });
//   const [animatedStats, setAnimatedStats] = useState({
//     registered: 0,
//     absent: 0,
//     totalUsers: 0,
//   });

//   // Fetch participants from backend with pagination
//   const fetchParticipants = async (page) => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await axios.get(
//         `http://localhost:3000/events/${eventId}/participants?page=${page}&limit=6`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       setParticipants(response.data.participants);
//       setCurrentPage(response.data.pagination.currentPage);
//       setTotalPages(response.data.pagination.totalPages);
//       setStats(response.data.stats);
//     } catch (error) {
//       console.error("Error fetching participants:", error);
//       if (error.response?.status === 403) {
//         alert("You are not authorized to view participants.");
//       }
//     }
//   };

//   // Fetch participants on mount and when page or eventId changes
//   useEffect(() => {
//     if (eventId) {
//       fetchParticipants(currentPage);
//     }
//   }, [eventId, currentPage]);

//   // Animate stats when they change
//   useEffect(() => {
//     const animateValue = (start, end, duration, key) => {
//       let startTimestamp = null;
//       const step = (timestamp) => {
//         if (!startTimestamp) startTimestamp = timestamp;
//         const progress = Math.min((timestamp - startTimestamp) / duration, 1);
//         setAnimatedStats((prev) => ({
//           ...prev,
//           [key]: Math.floor(progress * (end - start) + start),
//         }));
//         if (progress < 1) {
//           window.requestAnimationFrame(step);
//         }
//       };
//       window.requestAnimationFrame(step);
//     };

//     animateValue(0, stats.registered, 1000, "registered");
//     animateValue(0, stats.absent, 1000, "absent");
//     animateValue(0, stats.totalUsers, 1000, "totalUsers");
//   }, [stats]);

//   return (
//     <div className="container mx-auto py-8 px-4">
//       <div className="space-y-6">
//         {/* Header Section */}
//         <div className="space-y-4">
//           <h1 className="text-2xl font-bold">Attendance Tracking</h1>
//         </div>

//         {/* Table Section */}
//         <div className="border rounded-lg overflow-hidden">
//           {participants.length === 0 ? (
//             <p className="text-center text-gray-500 py-4">
//               No participants found for this event.
//             </p>
//           ) : (
//             <table className="min-w-full bg-white">
//               <thead className="bg-gray-100">
//                 <tr>
//                   <th className="px-4 py-2 text-left">
//                     <input type="checkbox" className="h-4 w-4 text-blue-500 rounded" />
//                   </th>
//                   <th className="px-4 py-2 text-left">Participant Name</th>
//                   <th className="px-4 py-2 text-left">Email</th>
//                   <th className="px-4 py-2 text-left">Contact</th>
//                   <th className="px-4 py-2 text-left">Role</th>
//                   <th className="px-4 py-2 text-left">Status</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {participants.map((participant, index) => (
//                   <tr key={index} className="border-t">
//                     <td className="px-4 py-2">
//                       <input
//                         type="checkbox"
//                         className="h-4 w-4 text-blue-500 rounded"
//                       />
//                     </td>
//                     <td className="px-4 py-2">
//                       {participant.firstName} {participant.lastName}
//                     </td>
//                     <td className="px-4 py-2">{participant.officialEmail}</td>
//                     <td className="px-4 py-2">{participant.contactNumber}</td>
//                     <td className="px-4 py-2">{participant.role}</td>
//                     <td className="px-4 py-2">
//                       <span
//                         className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
//                           participant.status === "Present"
//                             ? "bg-green-50 text-green-700"
//                             : "bg-red-50 text-red-700"
//                         }`}
//                       >
//                         {participant.status || "Present"} {/* Default to Present if undefined */}
//                       </span>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
//         </div>

//         {/* Pagination Controls */}
//         <div className="mt-4 flex justify-center gap-2">
//           {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
//             <button
//               key={page}
//               onClick={() => setCurrentPage(page)}
//               className={`px-3 py-1 rounded ${
//                 currentPage === page ? "bg-purple-500 text-white" : "bg-gray-200"
//               }`}
//             >
//               {page}
//             </button>
//           ))}
//         </div>

//         {/* Summary Section */}
//         <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
//           <div className="rounded-lg bg-pink-100 p-4">
//             <div className="flex items-center gap-2">
//               <div className="rounded-full bg-white p-2">
//                 <LucideUser className="h-6 w-6 text-pink-500" />
//               </div>
//               <div>
//                 <div className="text-2xl font-bold">{animatedStats.registered}</div>
//                 <div className="text-sm">Registered</div>
//               </div>
//             </div>
//           </div>
//           <div className="rounded-lg bg-yellow-100 p-4">
//             <div className="flex items-center gap-2">
//               <div className="rounded-full bg-white p-2">
//                 <LucideCheckCircle className="h-6 w-6 text-yellow-500" />
//               </div>
//               <div>
//                 <div className="text-2xl font-bold">{animatedStats.absent}</div>
//                 <div className="text-sm">Absent</div>
//               </div>
//             </div>
//           </div>
//           <div className="rounded-lg bg-blue-100 p-4">
//             <div className="flex items-center gap-2">
//               <div className="rounded-full bg-white p-2">
//                 <LucideXCircle className="h-6 w-6 text-blue-500" />
//               </div>
//               <div>
//                 <div className="text-2xl font-bold">{animatedStats.totalUsers}</div>
//                 <div className="text-sm">Total Users</div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
