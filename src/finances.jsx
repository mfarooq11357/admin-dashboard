

import * as React from "react"
import { Download, Printer } from 'lucide-react'

const events = [
  { name: "Concert", date: "10-12-2024", participants: 50, location: "Rawalpindi", status: "Close" },
  { name: "Qawali", date: "12-12-2024", participants: 50, location: "Rawalpindi", status: "Close" },
  { name: "Concert", date: "13-12-2024", participants: 50, location: "Islamabad", status: "Open" },
  { name: "Qawali", date: "14-12-2024", participants: 50, location: "Sialkot", status: "Open" },
  { name: "Qawali", date: "14-12-2024", participants: 50, location: "Sialkot", status: "Open" },
]

export default function FinanceDashboard() {
  return (
    <div className="p-6 space-y-6 max-w-[1000px]">
      <h1 className="text-2xl font-bold">Finances</h1>
      
      {/* Events Table */}
      <div className="border rounded-lg">
        <table className="w-full">
          <thead>
            <tr className="bg-zinc-900 text-white">
              <th className="w-12 px-4 py-2 text-left text-xs font-medium text-gray-200 uppercase tracking-wider"></th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Event Name</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Date</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Participants Count</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Location</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {events.map((event, index) => (
              <tr key={index}>
                <td className="px-4 py-2 whitespace-nowrap">
                  <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600" checked={event.isSelected} />
                </td>
                <td className="px-4 py-2 whitespace-nowrap">{event.name}</td>
                <td className="px-4 py-2 whitespace-nowrap">{event.date}</td>
                <td className="px-4 py-2 whitespace-nowrap">{event.participants}</td>
                <td className="px-4 py-2 whitespace-nowrap">{event.location}</td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <button
                    className={`w-20 px-2 py-1 text-xs font-medium rounded-full ${
                      event.status === "Open"
                        ? "text-green-600 border border-green-600"
                        : "text-gray-600 bg-gray-100"
                    }`}
                  >
                    {event.status}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Financial Details Card */}
      <div className="border rounded-lg overflow-hidden">
        <div className="bg-zinc-900 text-white p-4 rounded-t-lg">
          <div className="grid grid-cols-2">
            <h2 className="text-lg font-semibold">Event Details</h2>
            <h2 className="text-lg font-semibold">Finance</h2>
          </div>
        </div>
        <div className="grid grid-cols-2 divide-x">
          {/* Event Details */}
          <div className="p-4 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <span className="text-sm">Event Name</span>
              <span className="text-sm">Qawali Night</span>
              <span className="text-sm">Date</span>
              <span className="text-sm">10-12-2024</span>
              <span className="text-sm">Registered</span>
              <span className="text-sm">50</span>
              <span className="text-sm">Attended</span>
              <span className="text-sm">40</span>
              <span className="text-sm">Missing</span>
              <span className="text-sm">00</span>
              <span className="text-sm">Location</span>
              <span className="text-sm">Islamabad</span>
            </div>
          </div>

          {/* Finance Details */}
          <div className="p-4">
            <div className="grid grid-cols-2 gap-x-8">
              {/* Expenses */}
              <div>
                <h4 className="font-medium text-red-500 mb-2">Expenses</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Catering</span>
                    <span>5000</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Venue Costs</span>
                    <span>12000</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Venue Costs</span>
                    <span>5000</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Venue Costs</span>
                    <span>800</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Venue Costs</span>
                    <span>400</span>
                  </div>
                  <div className="flex justify-between font-medium pt-2 border-t">
                    <span>Total</span>
                    <span>600</span>
                  </div>
                </div>
              </div>

              {/* Income */}
              <div>
                <h4 className="font-medium text-green-500 mb-2">Income</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Ticket Sales</span>
                    <span>5000</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Sponsorships</span>
                    <span>12000</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Vendor Fees</span>
                    <span>5000</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Membership Fees</span>
                    <span>600</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Advertising Revenue</span>
                    <span>1000</span>
                  </div>
                  <div className="flex justify-between font-medium pt-2 border-t">
                    <span>Total</span>
                    <span>600</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4">
        <button className="px-4 py-2 border border-red-500 text-red-500 rounded-md flex items-center">
          <Download className="w-4 h-4 mr-2" />
          Download Finance Report
        </button>
        <button className="px-4 py-2 border border-gray-300 rounded-md flex items-center">
          <Printer className="w-4 h-4 mr-2" />
          Print
        </button>
      </div>
    </div>
  )
}

