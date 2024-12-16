import { LucideUser, LucideCheckCircle, LucideXCircle } from "lucide-react";

const participants = [
  {
    name: "Ahmed Ali",
    email: "ahmed523@gmail.com",
    contact: "0330623566",
    role: "Student",
    status: "Present",
  },
  {
    name: "Ahmed Ali",
    email: "ahmed523@gmail.com",
    contact: "0330623566",
    role: "Student",
    status: "Present",
  },
  {
    name: "Ahmed Ali",
    email: "ahmed523@gmail.com",
    contact: "0330623566",
    role: "Student",
    status: "Present",
  },
  {
    name: "Ahmed Ali",
    email: "ahmed523@gmail.com",
    contact: "0330623566",
    role: "Student",
    status: "Present",
  },
  {
    name: "Ahmed Ali",
    email: "ahmed523@gmail.com",
    contact: "0330623566",
    role: "Student",
    status: "Present",
  },
  {
    name: "Ahmed Ali",
    email: "ahmed523@gmail.com",
    contact: "0330623566",
    role: "Student",
    status: "Present",
  },
  {
    name: "Ahmed Ali",
    email: "ahmed523@gmail.com",
    contact: "0330623566",
    role: "Student",
    status: "Present",
  },
  {
    name: "Ahmed Ali",
    email: "ahmed523@gmail.com",
    contact: "0330623566",
    role: "Student",
    status: "Present",
  }
  // Additional participants...
];

export default function AttendanceTracking() {
  const totalRegistered = participants.length;
  const totalPresent = participants.filter((p) => p.status === "Present").length;
  const totalAbsent = totalRegistered - totalPresent;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="space-y-6">
        {/* Header Section */}
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">Attendance Tracking</h1>
          <input
            type="text"
            placeholder="Search Event Name"
            className="max-w-sm border border-gray-300 rounded-lg px-4 py-2"
          />
        </div>

        {/* Table Section */}
        <div className="border rounded-lg overflow-hidden">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">
                  <input type="checkbox" className="h-4 w-4 text-blue-500 rounded" />
                </th>
                <th className="px-4 py-2 text-left">Participant Name</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Contact</th>
                <th className="px-4 py-2 text-left">Role</th>
                <th className="px-4 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {participants.map((participant, index) => (
                <tr key={index} className="border-t">
                  <td className="px-4 py-2">
                    <input type="checkbox" className="h-4 w-4 text-blue-500 rounded" />
                  </td>
                  <td className="px-4 py-2">{participant.name}</td>
                  <td className="px-4 py-2">{participant.email}</td>
                  <td className="px-4 py-2">{participant.contact}</td>
                  <td className="px-4 py-2">{participant.role}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        participant.status === "Present"
                          ? "bg-green-50 text-green-700"
                          : "bg-red-50 text-red-700"
                      }`}
                    >
                      {participant.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary Section */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-lg bg-pink-100 p-4">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-white p-2">
                <LucideUser className="h-6 w-6 text-pink-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">{totalRegistered}</div>
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
                <div className="text-2xl font-bold">{totalPresent}</div>
                <div className="text-sm">Present</div>
              </div>
            </div>
          </div>
          <div className="rounded-lg bg-blue-100 p-4">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-white p-2">
                <LucideXCircle className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">{totalAbsent}</div>
                <div className="text-sm">Absent</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
