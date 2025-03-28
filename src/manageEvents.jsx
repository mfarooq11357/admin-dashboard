import React, { useState, useEffect } from "react";
import axios from "axios";
import { Edit, Trash2 } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function EventsDashboard() {
  const [events, setEvents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [notification, setNotification] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [selectedEvents, setSelectedEvents] = useState([]);

  const fetchEvents = async (page) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:3000/events?page=${page}&limit=6`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setEvents(response.data.events);
      setCurrentPage(response.data.currentPage);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching events:", error);
      if (error.response?.status === 403) {
        alert("You are not authorized to view events.");
      }
    }
  };

  useEffect(() => {
    fetchEvents(currentPage);
  }, [currentPage]);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleCheckboxChange = (eventId) => {
    setSelectedEvents((prev) =>
      prev.includes(eventId)
        ? prev.filter((id) => id !== eventId)
        : [...prev, eventId]
    );
  };

  const handleDelete = (eventId) => {
    setEventToDelete(eventId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    setShowDeleteModal(false);
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3000/events/${eventToDelete}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setNotification({ type: "success", message: "Event deleted successfully!" });
      fetchEvents(currentPage);
    } catch (error) {
      console.error("Error deleting event:", error);
      setNotification({
        type: "error",
        message:
          error.response?.status === 403
            ? "You are not authorized to delete this event."
            : "Failed to delete event.",
      });
    }
  };

  return (
    <div className="container mx-auto py-10 px-6">
      <h1 className="text-4xl font-bold mb-8">Events!</h1>

      {notification && (
        <div
          className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg text-white ${
            notification.type === "success" ? "bg-green-500" : "bg-red-500"
          } animate-slide-in`}
        >
          {notification.message}
        </div>
      )}

      <div className="rounded-md border overflow-hidden">
        {events.length === 0 ? (
          <p className="text-center text-gray-500 py-4">No events found.</p>
        ) : (
          <table className="w-full border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-center">
                  <input type="checkbox" className="rounded border-gray-300" />
                </th>
                <th className="px-4 py-2 text-left">Event Name</th>
                <th className="px-4 py-2 text-center">Date</th>
                <th className="py-2 text-center">Participants Count</th>
                <th className="px-4 py-2 text-left">Location</th>
                <th className="px-4 py-2 text-center">Status</th>
                <th className="px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event._id} className="border-t text-xs font-medium">
                  <td className="px-4 py-2 text-center">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300"
                      checked={selectedEvents.includes(event._id)}
                      onChange={() => handleCheckboxChange(event._id)}
                    />
                  </td>
                  <td className=" py-2 text-left">{event.name}</td>
                  <td className=" py-2 text-center">
                    {new Date(event.dateTime).toLocaleDateString()}
                  </td>
                  <td className=" text-center">{event.participants.length}</td>
                  <td className=" py-2 text-left">{event.location}</td>
                  <td className=" py-2 text-center">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        event.status === "upcoming"
                          ? "bg-green-100 text-green-700"
                          : event.status === "ongoing"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {event.status}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex justify-center items-center gap-2">
                      <NavLink to={`/editEvent/${event._id}`}>
                        <button
                          className="p-2 text-gray-600 hover:bg-gray-200 rounded"
                          aria-label="Edit"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                      </NavLink>
                      <button
                        onClick={() => handleDelete(event._id)}
                        className="p-2 text-gray-600 hover:bg-gray-200 rounded"
                        aria-label="Delete"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination Controls */}
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

      <div className="mt-4 flex gap-4">
        <NavLink to="/createEvent">
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Create Event
          </button>
        </NavLink>
        <NavLink
          to={`/attendance/${selectedEvents[0]}`}
          onClick={(e) => {
            if (selectedEvents.length !== 1) {
              e.preventDefault();
              alert("Please select exactly one event to view participants.");
            }
          }}
        >
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Participants
          </button>
        </NavLink>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this event?
            </p>
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}




// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Edit, Trash2 } from "lucide-react";
// import { NavLink } from "react-router-dom";

// export default function EventsDashboard() {
//   const [events, setEvents] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [notification, setNotification] = useState(null);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [eventToDelete, setEventToDelete] = useState(null);

//   // Fetch events from backend with pagination
//   const fetchEvents = async (page) => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await axios.get(
//         `http://localhost:3000/events?page=${page}&limit=6`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       setEvents(response.data.events);
//       setCurrentPage(response.data.currentPage);
//       setTotalPages(response.data.totalPages);
//     } catch (error) {
//       console.error("Error fetching events:", error);
//       if (error.response?.status === 403) {
//         alert("You are not authorized to view events.");
//       }
//     }
//   };

//   // Fetch events on mount and when page changes
//   useEffect(() => {
//     fetchEvents(currentPage);
//   }, [currentPage]);

//   // Auto dismiss notification after 3 seconds
//   useEffect(() => {
//     if (notification) {
//       const timer = setTimeout(() => setNotification(null), 3000);
//       return () => clearTimeout(timer);
//     }
//   }, [notification]);

//   // Initiate delete modal on delete button click
//   const handleDelete = (eventId) => {
//     setEventToDelete(eventId);
//     setShowDeleteModal(true);
//   };

//   // Confirm deletion
//   const confirmDelete = async () => {
//     setShowDeleteModal(false);
//     try {
//       const token = localStorage.getItem("token");
//       await axios.delete(`http://localhost:3000/events/${eventToDelete}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setNotification({ type: 'success', message: 'Event deleted successfully!' });
//       fetchEvents(currentPage); // Refetch events after deletion
//     } catch (error) {
//       console.error("Error deleting event:", error);
//       setNotification({
//         type: 'error',
//         message:
//           error.response?.status === 403
//             ? "You are not authorized to delete this event."
//             : "Failed to delete event."
//       });
//     }
//   };

//   return (
//     <div className="container mx-auto py-10 px-6">
//       <h1 className="text-4xl font-bold mb-8">Events!</h1>

//       {notification && (
//         <div
//           className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg text-white ${
//             notification.type === 'success'
//               ? 'bg-green-500'
//               : 'bg-red-500'
//           } animate-slide-in`}
//         >
//           {notification.message}
//         </div>
//       )}

//       <div className="rounded-md border overflow-hidden">
//         <table className="w-full border-collapse">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="px-4 py-2 text-center">
//               </th>
//               <th className="px-4 py-2 text-left">Event Name</th>
//               <th className="px-4 py-2 text-center">Date</th>
//               <th className=" py-2 text-center">Participants Count</th>
//               <th className="px-4 py-2 text-left">Location</th>
//               <th className="px-4 py-2 text-center">Status</th>
//               <th className="px-4 py-2 text-center">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {events.map((event) => (
//               <tr key={event._id} className="border-t text-xs font-medium">
//                 <td className="px-4 py-2 text-center">
//                   <input type="checkbox" className="rounded border-gray-300" />
//                 </td>
//                 <td className="px-4 py-2 text-left">{event.name}</td>
//                 <td className="px-4 py-2 text-center">
//                   {new Date(event.dateTime).toLocaleDateString()}
//                 </td>
//                 <td className=" py-2 text-center">
//                   {event.participants.length}
//                 </td>
//                 <td className="px-4 py-2 text-left">{event.location}</td>
//                 <td className="px-4 py-2 text-center">
//                   <span
//                     className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
//                       event.status === "upcoming"
//                         ? "bg-green-100 text-green-700"
//                         : event.status === "ongoing"
//                         ? "bg-blue-100 text-blue-700"
//                         : "bg-red-100 text-red-700"
//                     }`}
//                   >
//                     {event.status}
//                   </span>
//                 </td>
//                 <td className="px-4 py-2">
//                   <div className="flex justify-center items-center gap-2">
//                     <NavLink to={`/editEvent/${event._id}`}>
//                       <button
//                         className="p-2 text-gray-600 hover:bg-gray-200 rounded"
//                         aria-label="Edit"
//                       >
//                         <Edit className="h-5 w-5" />
//                       </button>
//                     </NavLink>
//                     <button
//                       onClick={() => handleDelete(event._id)}
//                       className="p-2 text-gray-600 hover:bg-gray-200 rounded"
//                       aria-label="Delete"
//                     >
//                       <Trash2 className="h-5 w-5" />
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination Controls */}
//       <div className="mt-4 flex justify-center gap-2">
//         {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
//           <button
//             key={page}
//             onClick={() => setCurrentPage(page)}
//             className={`px-3 py-1 rounded ${
//               currentPage === page ? "bg-blue-500 text-white" : "bg-gray-200"
//             }`}
//           >
//             {page}
//           </button>
//         ))}
//       </div>

//       <div className="mt-4 flex gap-4">
//         <NavLink to="/createEvent">
//           <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
//             Create Event
//           </button>
//         </NavLink>
//         <NavLink to="/attendence">
//           <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
//             Participants
//           </button>
//         </NavLink>
//       </div>

//       {showDeleteModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-xl p-6 max-w-md w-full">
//             <h3 className="text-xl font-semibold mb-4">Confirm Delete</h3>
//             <p className="text-gray-600 mb-6">
//               Are you sure you want to delete this event?
//             </p>
//             <div className="flex justify-end gap-4">
//               <button
//                 type="button"
//                 onClick={() => setShowDeleteModal(false)}
//                 className="px-4 py-2 text-gray-600 hover:text-gray-800"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="button"
//                 onClick={confirmDelete}
//                 className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
//               >
//                 Confirm
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


