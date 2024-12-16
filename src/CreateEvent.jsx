import { useState } from "react";
import { Calendar } from "lucide-react";

export default function CreateEvent() {
  return (
    <div className="w-full max-w-lg mx-auto bg-white shadow-md rounded-lg p-6">
      <h1 className="text-2xl font-semibold mb-6">Create New Event</h1>
      <form className="space-y-6">
        <div>
          <label htmlFor="eventName" className="block text-sm font-medium text-gray-700">
            Event Name
          </label>
          <input
            id="eventName"
            type="text"
            required
            className="mt-1 block w-full h-12 rounded-md border border-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="eventDetails" className="block text-sm font-medium text-gray-700">
            Event Details
          </label>
          <textarea
            id="eventDetails"
            required
            className="mt-1 block w-full h-28 rounded-md border border-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="fee" className="block text-sm font-medium text-gray-700">
            Fee
          </label>
          <input
            id="fee"
            type="number"
            min="0"
            step="0.01"
            required
            className="mt-1 block w-full h-12 rounded-md border border-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">
            Location
          </label>
          <input
            id="location"
            type="text"
            required
            className="mt-1 block w-full h-12 rounded-md border border-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">
            Date
          </label>
          <div className="relative">
            <input
              id="date"
              type="date"
              required
              className="mt-1 block w-full h-12 rounded-md border border-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            <Calendar className="absolute right-3 top-3.5 h-5 w-5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Upload Files</label>
          <div className="mt-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-400 rounded-lg p-6 text-center hover:border-indigo-500">
            <p className="text-sm text-gray-500">
              Drag & drop files here or click to upload
            </p>
            <p className="text-xs text-gray-400">JPEG, PNG, PDF up to 50MB</p>
            <button
              type="button"
              className="mt-2 bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-600"
            >
              Browse File
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
        >
          Create
        </button>
      </form>
    </div>
  );
}
