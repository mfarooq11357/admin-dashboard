import React from 'react';
import { Bell, Check } from 'lucide-react';

const notifications = [
  {
    id: "1",
    name: "Ahmed Khan",
    type: "reminder",
    message: "Your booking for 'Mehndi Event Decorations' on 15th December has been confirmed",
    timestamp: "12-08-2024, 12:00 P.M.",
    read: false,
  },
  {
    id: "2",
    name: "Jamal Ali",
    type: "like",
    message: "Jamal Ali liked your reply to the client's inquiry about 'DJ Sound System Rental.",
    timestamp: "12-08-2024, 12:00 P.M.",
    read: false,
  },
  {
    id: "3",
    name: "Yousaf Ali",
    type: "mention",
    message: "Yousaf tagged you in a post: 'Looking forward to working with you on our next project!'",
    timestamp: "12-08-2024, 12:00 P.M.",
    read: false,
  },
  {
    id: "4",
    name: "Usman Khan",
    type: "comment",
    message: "Usman khan commented: 'Can you provide a breakdown of the catering costs ?'",
    timestamp: "12-08-2024, 12:00 P.M.",
    read: true,
  },
  {
    id: "5",
    name: "Yousaf Ali",
    type: "reminder",
    message: "Update your payment method to avoid service interruptions.",
    timestamp: "12-08-2024, 12:00 P.M.",
    read: true,
  },
  {
    id: "6",
    name: "Yousaf Ali",
    type: "system",
    message: "The client has rescheduled their event 'Corporate Annual Meetup' to 18th December.",
    timestamp: "12-08-2024, 12:00 P.M.",
    read: true,
  },
];

const NotificationsPanel = () => {
  return (
    <div className=" border rounded-lg ">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">Notifications</h2>
        <button className="text-sm text-gray-600 hover:text-gray-900">
          Mark all as read
        </button>
      </div>
      <div className=" overflow-y-auto">
        <div className="divide-y">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`flex gap-3 p-4 ${notification.read ? "bg-white" : "bg-gray-50"}`}
            >
              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-600 font-medium">
                  {notification.name.charAt(0)}
                </span>
              </div>
              <div className="space-y-1 flex-1">
                <p className="text-sm">
                  <span className="font-medium">{notification.name}</span>
                  <span className="text-gray-500"> · </span>
                  <span className="text-gray-500">{notification.type}</span>
                </p>
                <p className="text-sm text-gray-600">{notification.message}</p>
                <p className="text-xs text-gray-500">{notification.timestamp}</p>
              </div>
              {!notification.read ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-red-500">Unread</span>
                  <div className="h-2 w-2 rounded-full bg-red-500" />
                </div>
              ) : (
                <Check className="h-4 w-4 text-green-500" />
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default NotificationsPanel;

