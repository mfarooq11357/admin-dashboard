'use client'

import { Users } from 'lucide-react'
import { Box, Text } from '@chakra-ui/react'

export default function Dashboard() {
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
              <Text className="text-2xl font-bold">105</Text>
              <Text className="text-sm text-muted-foreground">Total Students</Text>
            </div>
          </div>
        </Box>

        <Box className="bg-yellow-50 p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-4">
            <Users className="w-6 h-6 text-yellow-600" />
            <div>
              <Text className="text-2xl font-bold">75</Text>
              <Text className="text-sm text-muted-foreground">Total Alumnis</Text>
            </div>
          </div>
        </Box>

        <Box className="bg-blue-50 p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-4">
            <Users className="w-6 h-6 text-blue-600" />
            <div>
              <Text className="text-2xl font-bold">5</Text>
              <Text className="text-sm text-muted-foreground">Total Admins</Text>
            </div>
          </div>
        </Box>
      </div>

      {/* Activity and Events Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Activity Log */}
        <Box className="p-6 rounded-lg shadow-md">
          <Text className="text-xl font-semibold mb-4">Activity</Text>
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-yellow-200 flex items-center justify-center text-yellow-800 font-semibold">
                  {activity.user.charAt(0)}
                </div>
                <div>
                  <Text className="font-medium">{activity.user}</Text>
                  <Text className={`text-sm ${activity.type === 'Log In' ? 'text-green-500' : 'text-red-500'}`}>
                    {activity.type}
                  </Text>
                  <Text className="text-xs text-muted-foreground">
                    Time: {activity.time} | Location: {activity.location}
                  </Text>
                </div>
              </div>
            ))}
          </div>
        </Box>

        {/* Upcoming Events */}
        <Box className="p-6 rounded-lg shadow-md">
          <Text className="text-xl font-semibold mb-4">Upcoming Events:</Text>
          <div className="space-y-6">
            {events.map((event, index) => (
              <div key={index} className="flex gap-4">
                <Text className="text-sm text-muted-foreground min-w-[80px]">
                  {event.date}
                </Text>
                <div>
                  <Text className="font-medium">{event.title}</Text>
                  <Text className="text-sm text-muted-foreground">
                    Venue: {event.venue}
                  </Text>
                </div>
              </div>
            ))}
          </div>
        </Box>
      </div>
    </div>
  )
}

const activities = [
  {
    user: "Ahmed Ali",
    type: "Log In",
    time: "08:55 UTC",
    location: "Islamabad"
  },
  {
    user: "Sajid Hussain",
    type: "Log Out",
    time: "08:55 UTC",
    location: "Islamabad"
  },
  {
    user: "Mohsin Ali",
    type: "Log In",
    time: "08:55 UTC",
    location: "Islamabad"
  }
]

const events = [
  {
    date: "05-12-2024",
    title: "Upcoming Workshop On Digital Marketing",
    venue: "ISLAMABAD"
  },
  {
    date: "05-12-2024",
    title: "Upcoming Workshop On Digital Marketing",
    venue: "ISLAMABAD"
  },
  {
    date: "05-12-2024",
    title: "Upcoming Workshop On Digital Marketing",
    venue: "ISLAMABAD"
  }
]
