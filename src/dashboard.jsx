import { useEffect, useState } from 'react';
import { Users } from 'lucide-react';
import { Box, Text } from '@chakra-ui/react';
import CountUp from 'react-countup';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  const [topNotifications, setTopNotifications] = useState([]);
  const [userCounts, setUserCounts] = useState({
    totalStudents: 0,
    totalSocietyMembers: 0,
    totalAdmins: 0,
  });
  const [upcomingEvent, setUpcomingEvent] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchUserCounts = async () => {
      try {
        const response = await fetch('http://localhost:3000/user/user-counts', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error('Failed to fetch user counts');
        const data = await response.json();
        setUserCounts(data);
      } catch (error) {
        console.error('Error fetching user counts:', error);
      }
    };

    const fetchUpcomingEvent = async () => {
      try {
        const response = await fetch('http://localhost:3000/events/upcoming');
        if (!response.ok) throw new Error('Failed to fetch upcoming event');
        const data = await response.json();
        setUpcomingEvent(data.upcomingEvent);
      } catch (error) {
        console.error('Error fetching upcoming event:', error);
      }
    };

    const fetchNotifications = async () => {
      try {
        const response = await fetch('http://localhost:3000/event-registration-requests/requests', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setTopNotifications(data.requests.slice(0, 3));
        } else {
          console.error('Failed to fetch notifications:', data.error);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchUserCounts();
    fetchUpcomingEvent();
    fetchNotifications();
  }, [token]);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      {/* Welcome Header */}
      <div className="flex items-center gap-2">
        <h1 className="text-3xl font-bold">
          <span className="text-red-600">Welcome Back,</span> "Ahmed Ali"
        </h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Box className="bg-pink-50 p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-4">
            <Users className="w-6 h-6 text-pink-600" />
            <div>
              <Text className="text-2xl font-bold">
                <CountUp
                  end={userCounts.totalStudents}
                  duration={1}
                  formattingFn={(value) => String(Math.floor(value)).padStart(2, '0')}
                />
              </Text>
              <Text className="text-sm text-muted-foreground">Total Users</Text>
            </div>
          </div>
        </Box>

        <Box className="bg-yellow-50 p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-4">
            <Users className="w-6 h-6 text-yellow-600" />
            <div>
              <Text className="text-2xl font-bold">
                <CountUp
                  end={userCounts.totalSocietyMembers}
                  duration={1}
                  formattingFn={(value) => String(Math.floor(value)).padStart(2, '0')}
                />
              </Text>
              <Text className="text-sm text-muted-foreground">Total Society Members</Text>
            </div>
          </div>
        </Box>

        <Box className="bg-blue-50 p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-4">
            <Users className="w-6 h-6 text-blue-600" />
            <div>
              <Text className="text-2xl font-bold">
                <CountUp
                  end={userCounts.totalAdmins}
                  duration={1}
                  formattingFn={(value) => String(Math.floor(value)).padStart(2, '0')}
                />
              </Text>
              <Text className="text-sm text-muted-foreground">Total Admins</Text>
            </div>
          </div>
        </Box>
      </div>

      {/* Activity and Events Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Activity Section with Top 3 Notifications */}
        <Box className="p-6 rounded-lg shadow-md">
          <Text className="text-xl font-semibold mb-4">Activity</Text>
          <div className="space-y-4">
            {topNotifications.length > 0 ? (
              topNotifications.map((notification) => (
                <div
                  key={notification._id}
                  className="flex items-start gap-4 p-2 hover:bg-gray-100 rounded cursor-pointer"
                  onClick={() => navigate('/notifications')}
                >
                  <img
                    src={notification.userId.picture || "https://www.gravatar.com/avatar/?d=mp"}
                    alt={`${notification.userId.firstName} ${notification.userId.lastName}`}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <Text className="font-medium">
                      {notification.userId.firstName} {notification.userId.lastName}
                    </Text>
                    <Text className="text-sm text-gray-600">
                      Requested to register for {notification.eventId.name}
                    </Text>
                  </div>
                </div>
              ))
            ) : (
              <Text className="text-gray-500">No recent notifications</Text>
            )}
          </div>
        </Box>

        {/* Upcoming Events Section */}
        <Box className="p-6 rounded-lg shadow-md bg-white">
          <Text className="text-xl font-semibold mb-4">Upcoming Event</Text>
          {upcomingEvent ? (
            <div className="space-y-4">
              <img
                src={upcomingEvent.picture || '/placeholder-event.jpg'}
                alt={upcomingEvent.name}
                className="w-full h-48 object-cover rounded-lg"
              />
              <div className="space-y-2">
                <Text className="text-lg font-semibold">{upcomingEvent.name}</Text>
                <Text className="text-sm text-gray-600">
                  {upcomingEvent.smallDescription}
                </Text>
                <div className="flex items-center gap-2 text-blue-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <Text className="text-sm">
                    {new Date(upcomingEvent.dateTime).toLocaleString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Text>
                </div>
                <Text className="text-sm text-gray-500">
                  Location: {upcomingEvent.location}
                </Text>
              </div>
            </div>
          ) : (
            <Text className="text-gray-500">No upcoming events</Text>
          )}
        </Box>
      </div>
    </div>
  );
}






// import { useEffect, useState } from 'react';
// import { Users } from 'lucide-react';
// import { Box, Text } from '@chakra-ui/react';
// import CountUp from 'react-countup';

// export default function Dashboard() {
//   // State for user counts
//   const [userCounts, setUserCounts] = useState({
//     totalStudents: 0,
//     totalSocietyMembers: 0,
//     totalAdmins: 0,
//   });
//   // State for upcoming event
//   const [upcomingEvent, setUpcomingEvent] = useState(null);
//   const token = localStorage.getItem('token');

//   useEffect(() => {
//     // Fetch user counts
//     const fetchUserCounts = async () => {
//       try {
//         const response = await fetch('http://localhost:3000/user/user-counts', {
//           method: 'GET',
//           headers: {
//             'Authorization': `Bearer ${token}`,
//           },
//         });
//         if (!response.ok) throw new Error('Failed to fetch user counts');
//         const data = await response.json();
//         setUserCounts(data);
//       } catch (error) {
//         console.error('Error fetching user counts:', error);
//       }
//     };

//     // Fetch upcoming event
//     const fetchUpcomingEvent = async () => {
//       try {
//         const response = await fetch('http://localhost:3000/events/upcoming');
//         if (!response.ok) throw new Error('Failed to fetch upcoming event');
//         const data = await response.json();
//         setUpcomingEvent(data.upcomingEvent);
//       } catch (error) {
//         console.error('Error fetching upcoming event:', error);
//       }
//     };

//     fetchUserCounts();
//     fetchUpcomingEvent();
//   }, [token]);

//   return (
//     <div className="p-6 max-w-6xl mx-auto space-y-8">
//       {/* Welcome Header */}
//       <div className="flex items-center gap-2">
//         <h1 className="text-3xl font-bold">
//           <span className="text-red-600">Welcome Back,</span> "Ahmed Ali"
//         </h1>
//       </div>

   
//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         <Box className="bg-pink-50 p-6 rounded-lg shadow-md">
//           <div className="flex items-center gap-4">
//             <Users className="w-6 h-6 text-pink-600" />
//             <div>
//               <Text className="text-2xl font-bold">
//                 <CountUp
//                   end={userCounts.totalStudents}
//                   duration={1}
//                   formattingFn={(value) => String(Math.floor(value)).padStart(2, '0')}
//                 />
//               </Text>
//               <Text className="text-sm text-muted-foreground">Total Students</Text>
//             </div>
//           </div>
//         </Box>

//         <Box className="bg-yellow-50 p-6 rounded-lg shadow-md">
//           <div className="flex items-center gap-4">
//             <Users className="w-6 h-6 text-yellow-600" />
//             <div>
//               <Text className="text-2xl font-bold">
//                 <CountUp
//                   end={userCounts.totalSocietyMembers}
//                   duration={1}
//                   formattingFn={(value) => String(Math.floor(value)).padStart(2, '0')}
//                 />
//               </Text>
//               <Text className="text-sm text-muted-foreground">Total Society Members</Text>
//             </div>
//           </div>
//         </Box>

//         <Box className="bg-blue-50 p-6 rounded-lg shadow-md">
//           <div className="flex items-center gap-4">
//             <Users className="w-6 h-6 text-blue-600" />
//             <div>
//               <Text className="text-2xl font-bold">
//                 <CountUp
//                   end={userCounts.totalAdmins}
//                   duration={1}
//                   formattingFn={(value) => String(Math.floor(value)).padStart(2, '0')}
//                 />
//               </Text>
//               <Text className="text-sm text-muted-foreground">Total Admins</Text>
//             </div>
//           </div>
//         </Box>
//       </div>

//       {/* Activity and Events Section */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//         {/* Activity Log - Untouched as per requirement */}
//         <Box className="p-6 rounded-lg shadow-md">
//           <Text className="text-xl font-semibold mb-4">Activity</Text>
//           <div className="space-y-4">
//             {activities.map((activity, index) => (
//               <div key={index} className="flex items-start gap-4">
//                 <div className="w-10 h-10 rounded-full bg-yellow-200 flex items-center justify-center text-yellow-800 font-semibold">
//                   {activity.user.charAt(0)}
//                 </div>
//                 <div>
//                   <Text className="font-medium">{activity.user}</Text>
//                   <Text className={`text-sm ${activity.type === 'Log In' ? 'text-green-500' : 'text-red-500'}`}>
//                     {activity.type}
//                   </Text>
//                   <Text className="text-xs text-muted-foreground">
//                     Time: {activity.time} | Location: {activity.location}
//                   </Text>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </Box>

//         {/* Upcoming Events - Static section remains unchanged */}
//         <Box className="p-6 rounded-lg shadow-md">
//           <Text className="text-xl font-semibold mb-4">Upcoming Events:</Text>
//           <div className="space-y-6">
//             {events.map((event, index) => (
//               <div key={index} className="flex gap-4">
//                 <Text className="text-sm text-muted-foreground min-w-[80px]">
//                   {event.date}
//                 </Text>
//                 <div>
//                   <Text className="font-medium">{event.title}</Text>
//                   <Text className="text-sm text-muted-foreground">
//                     Venue: {event.venue}
//                   </Text>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </Box>
//       </div>
//     </div>
//   );
// }

// const activities = [
//   {
//     user: "Ahmed Ali",
//     type: "Log In",
//     time: "08:55 UTC",
//     location: "Islamabad",
//   },
//   {
//     user: "Sajid Hussain",
//     type: "Log Out",
//     time: "08:55 UTC",
//     location: "Islamabad",
//   },
//   {
//     user: "Mohsin Ali",
//     type: "Log In",
//     time: "08:55 UTC",
//     location: "Islamabad",
//   },
// ];

// const events = [
//   {
//     date: "05-12-2024",
//     title: "Upcoming Workshop On Digital Marketing",
//     venue: "ISLAMABAD",
//   },
//   {
//     date: "05-12-2024",
//     title: "Upcoming Workshop On Digital Marketing",
//     venue: "ISLAMABAD",
//   },
//   {
//     date: "05-12-2024",
//     title: "Upcoming Workshop On Digital Marketing",
//     venue: "ISLAMABAD",
//   },
// ]





