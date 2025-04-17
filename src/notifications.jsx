"use client"

import { useState, useEffect } from "react"
import { Bell } from "lucide-react"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const NotificationsPage = () => {
  const [requests, setRequests] = useState([])

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          console.error("No token found. Please log in as admin.")
          return
        }

        const response = await fetch(
          "http://localhost:3000/event-registration-requests/requests",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        const data = await response.json()
        if (response.ok) {
          setRequests(data.requests || [])
        } else {
          console.error("Failed to fetch requests:", data.error)
        }
      } catch (error) {
        console.error("Error fetching registration requests:", error)
      }
    }
    fetchRequests()
  }, [])

  const handleAccept = async (requestId) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(
        `http://localhost:3000/event-registration-requests/requests/${requestId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: "accepted" }),
        }
      )
      const data = await response.json()
      if (response.ok) {
        setRequests(requests.filter((req) => req._id !== requestId))
        toast.success("Request accepted successfully.")
      } else {
        toast.error(data.error || "Failed to accept request.")
      }
    } catch (error) {
      console.error("Error accepting request:", error)
      toast.error("An error occurred while accepting the request.")
    }
  }

  const handleReject = async (requestId) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(
        `http://localhost:3000/event-registration-requests/requests/${requestId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: "rejected" }),
        }
      )
      const data = await response.json()
      if (response.ok) {
        setRequests(requests.filter((req) => req._id !== requestId))
        toast.success("Request rejected successfully.")
      } else {
        toast.error(data.error || "Failed to reject request.")
      }
    } catch (error) {
      console.error("Error rejecting request:", error)
      toast.error("An error occurred while rejecting the request.")
    }
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <ToastContainer />
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Bell className="h-6 w-6 text-blue-600" />
            <h1 className="text-2xl font-bold">Notifications</h1>
          </div>
        </div>
        <div className="divide-y divide-gray-100">
          {requests.length > 0 ? (
            requests.map((request) => (
              <div
                key={request._id}
                className="p-4 sm:p-6 flex gap-4 bg-white hover:bg-gray-50 transition-colors"
              >
                <div className="flex-shrink-0 mt-1">
                  <img
                    src={
                      request.userId.picture ||
                      "https://www.gravatar.com/avatar/?d=mp"
                    }
                    alt={`${request.userId.firstName} ${request.userId.lastName}`}
                    className="w-10 h-10 rounded-full"
                  />
                </div>
                <div className="flex-grow">
                  <p className="text-gray-700">
                    <span className="font-semibold">
                      {request.userId.firstName} {request.userId.lastName}
                    </span>{" "}
                    (Roll No: {request.userId.rollNo}) has requested to register
                    for the event{" "}
                    <span className="font-semibold">{request.eventId.name}</span>.
                  </p>
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => handleAccept(request._id)}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleReject(request._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Bell className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                No pending requests
              </h3>
              <p className="text-gray-500">
                There are no registration requests to review at this time.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default NotificationsPage

