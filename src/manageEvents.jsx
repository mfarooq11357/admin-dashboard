import { Edit, Trash2 } from "lucide-react";
import { NavLink } from "react-router-dom";

const events = [
    {
        id: 1,
        name: "Concert",
        date: "10-12-2024",
        participants: 50,
        location: "Rawalpindi",
        status: "Close",
    },
    {
        id: 2,
        name: "Qawali",
        date: "12-12-2024",
        participants: 50,
        location: "Rawalpindi",
        status: "Close",
    },
    {
        id: 3,
        name: "Concert",
        date: "13-12-2024",
        participants: 50,
        location: "Islamabad",
        status: "Open",
    },
    {
        id: 4,
        name: "Qawali",
        date: "14-12-2024",
        participants: 50,
        location: "Sialkot",
        status: "Open",
    },
    {
        id: 5,
        name: "Concert",
        date: "16-12-2024",
        participants: 100,
        location: "Lahore",
        status: "Open",
    },
    {
        id: 6,
        name: "Qawali",
        date: "16-12-2024",
        participants: 100,
        location: "Karachi",
        status: "Open",
    },
];

export default function EventsDashboard() {
    return (
        <div className="container mx-auto py-10 pl-6">
            <h1 className="text-4xl font-bold mb-8">Events!</h1>
            <div className="rounded-md border overflow-hidden">
                <table className="w-full border-collapse">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-2">
                                <input type="checkbox" className="rounded border-gray-300" />
                            </th>
                            <th className="px-4 py-2">Event Name</th>
                            <th className="px-4 py-2">Date</th>
                            <th className="px-4 py-2">Participants Count</th>
                            <th className="px-4 py-2">Location</th>
                            <th className="px-4 py-2">Status</th>
                            <th className="px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {events.map((event) => (
                            <tr key={event.id} className="border-t">
                                <td className="px-4 py-2 text-center">
                                    <input type="checkbox" className="rounded border-gray-300" />
                                </td>
                                <td className="px-4 py-2">{event.name}</td>
                                <td className="px-4 py-2">{event.date}</td>
                                <td className="px-4 py-2">{event.participants}</td>
                                <td className="px-4 py-2">{event.location}</td>
                                <td className="px-4 py-2">
                                    <span
                                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${event.status === "Open"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-700"
                                            }`}
                                    >
                                        {event.status}
                                    </span>
                                </td>
                                <td className="px-4 py-2 flex items-center gap-2">
                                    <NavLink to="/editEvent">
                                        <button
                                            className="p-2 text-gray-600 hover:bg-gray-200 rounded"
                                            aria-label="Edit"
                                        >
                                            <Edit className="h-5 w-5" />
                                        </button>
                                    </NavLink>
                                    <button
                                        className="p-2 text-gray-600 hover:bg-gray-200 rounded"
                                        aria-label="Delete"
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="mt-4 flex gap-4">
            <NavLink to="/editEvent">  <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                    Create Event
                </button>
                </NavLink>
                <NavLink to="/attendence">  <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 rounded ">
                    Participants
                </button>
                </NavLink>
            </div>
        </div>
    );
}
