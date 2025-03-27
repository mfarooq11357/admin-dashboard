import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Download, Printer } from 'lucide-react';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { toast } from 'react-toastify';

export default function FinanceDashboard() {
  const [events, setEvents] = useState([]);
  const [selectedEvents, setSelectedEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:3000/events/eventdetails');
        setEvents(response.data.events);
      } catch (error) {
        console.error('Error fetching events:', error);
        toast.error('Failed to load events');
      }
    };
    fetchEvents();
  }, []);

  const handleCheckboxChange = (eventId) => {
    setSelectedEvents((prev) =>
      prev.includes(eventId)
        ? prev.filter((id) => id !== eventId)
        : [...prev, eventId]
    );
  };

  const generatePDF = () => {
    if (selectedEvents.length !== 1) {
      toast.error('Please select exactly one event to generate the finance report.');
      return;
    }

    const selectedEvent = events.find(({ event }) => event._id === selectedEvents[0]);
    const doc = new jsPDF();
    const primaryColor = '#3B82F6';
    const headerColor = '#1F2937';
    const fontFamily = 'helvetica';

    // Header Section
    doc.setFont(fontFamily, 'bold');
    doc.setFontSize(18);
    doc.setTextColor(headerColor);
    doc.text(`Finance Report - ${selectedEvent.event.name}`, 14, 20);

    // Descriptive Paragraph (from old commented code)
    const eventDate = new Date(selectedEvent.event.dateTime).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    doc.setFont(fontFamily, 'normal');
    doc.setFontSize(12);
    doc.setTextColor(75, 85, 99);
    doc.text(
      `This is the finance report for the event '${selectedEvent.event.name}' held at '${selectedEvent.event.location}' on ${eventDate}.`,
      14,
      28,
      { maxWidth: 180 }
    );

    // Event Details
    doc.setFont(fontFamily, 'normal');
    doc.setFontSize(10);
    // Adjust y position after descriptive text
    doc.text(`Event Date: ${eventDate}`, 14, 38);
    doc.text(`Location: ${selectedEvent.event.location}`, 14, 43);

    // Income Section
    let yPos = 53;
    doc.setFont(fontFamily, 'bold');
    doc.setFontSize(12);
    doc.setTextColor(primaryColor);
    doc.text('Income Summary', 14, yPos);
    
    doc.setFont(fontFamily, 'normal');
    doc.setFontSize(10);
    doc.setTextColor(75, 85, 99);
    yPos += 7;
    doc.text(`Total Collected: ${selectedEvent.finance.totalCollected.toFixed(2)} RS`, 20, yPos);
    yPos += 10;

    // Expenses Section
    doc.setFont(fontFamily, 'bold');
    doc.setFontSize(12);
    doc.setTextColor(primaryColor);
    doc.text('Expenses Breakdown', 14, yPos);
    yPos += 7;

    if (selectedEvent.finance.expenses.length > 0) {
      const expensesData = selectedEvent.finance.expenses.map((exp) => [
        { content: exp.description, styles: { cellWidth: 120 } },
        { content: `${exp.amount.toFixed(2)} RS`, styles: { halign: 'right' } }
      ]);

      autoTable(doc, {
        startY: yPos,
        head: [['Description', 'Amount']],
        body: expensesData,
        theme: 'grid',
        headStyles: {
          fillColor: headerColor,
          textColor: 255,
          fontStyle: 'bold'
        },
        columnStyles: {
          0: { cellWidth: 'wrap' },
          1: { cellWidth: 40, halign: 'right' }
        },
        styles: { 
          fontSize: 10,
          cellPadding: 2,
          lineColor: 200
        },
        margin: { left: 14 },
        tableWidth: 'auto'
      });
      yPos = doc.lastAutoTable.finalY + 5;
    } else {
      doc.setFont(fontFamily, 'normal');
      doc.setTextColor(75, 85, 99);
      doc.text('No expenses recorded', 20, yPos);
      yPos += 10;
    }

    // Financial Summary
    const totalExpenses = selectedEvent.finance.expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const net = selectedEvent.finance.totalCollected - totalExpenses;

    autoTable(doc, {
      startY: yPos,
      body: [
        ['Total Income', `${selectedEvent.finance.totalCollected.toFixed(2)} RS`],
        ['Total Expenses', `${totalExpenses.toFixed(2)} RS`],
        ['Net Amount', `${net.toFixed(2)} RS`]
      ],
      columnStyles: {
        0: { cellWidth: '70%', fontStyle: 'bold' },
        1: { cellWidth: '30%', halign: 'right' }
      },
      theme: 'plain',
      styles: { 
        fontSize: 12,
        textColor: headerColor,
        lineWidth: 0.1
      },
      margin: { left: 14 }
    });

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text(
      `Generated on ${new Date().toLocaleDateString('en-US', { dateStyle: 'medium' })} • Software Engineering Society Management System`,
      14,
      doc.internal.pageSize.height - 10
    );

    doc.save(`Finance_Report_${selectedEvent.event.name.replace(/\s+/g, '_')}.pdf`);
    toast.success('Finance report generated successfully!');
  };

  const selectedEvent = events.find(({ event }) => selectedEvents.includes(event._id));

  return (
    <div className="p-6 space-y-6 max-w-[1000px]">
      <h1 className="text-2xl font-bold">Finances</h1>
      <NavLink
        to={selectedEvents.length === 1 ? `/financesdetails/${selectedEvents[0]}` : '#'}
        onClick={(e) => {
          if (selectedEvents.length !== 1) {
            e.preventDefault();
            toast.error('Please select exactly one event to edit finances.');
          }
        }}
      >
        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Edit finances
        </button>
      </NavLink>

      {/* Events Table */}
      <div className="border rounded-lg">
        <table className="w-full">
          <thead>
            <tr className="bg-zinc-900 text-white">
              <th className="w-12 px-4 py-2 text-left text-xs font-medium text-gray-200 uppercase tracking-wider"></th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                Event Name
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                Date
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                Participants Count
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                Location
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {events.map(({ event, attendance }) => (
              <tr key={event._id}>
                <td className="px-4 py-2 whitespace-nowrap">
                  <input
                    type="checkbox"
                    className="form-checkbox h-4 w-4 text-blue-600"
                    checked={selectedEvents.includes(event._id)}
                    onChange={() => handleCheckboxChange(event._id)}
                  />
                </td>
                <td className="px-4 py-2 whitespace-nowrap">{event.name}</td>
                <td className="px-4 py-2 whitespace-nowrap">{new Date(event.dateTime).toLocaleDateString()}</td>
                <td className="px-4 py-2 whitespace-nowrap">{attendance.registered}</td>
                <td className="px-4 py-2 whitespace-nowrap">{event.location}</td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <button
                    className={`w-20 px-2 py-1 text-xs font-medium rounded-full ${
                      event.status === 'upcoming' || event.status === 'ongoing'
                        ? 'text-green-600 border border-green-600'
                        : 'text-gray-600 bg-gray-100'
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
      {selectedEvent && (
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-zinc-900 text-white p-4 rounded-t-lg">
            <div className="grid grid-cols-2">
              <h2 className="text-lg font-semibold">Event Details</h2>
              <h2 className="text-lg font-semibold">Finance</h2>
            </div>
          </div>
          <div className="grid grid-cols-2 divide-x">
            <div className="p-4 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <span className="text-sm">Event Name</span>
                <span className="text-sm">{selectedEvent.event.name}</span>
                <span className="text-sm">Date</span>
                <span className="text-sm">{new Date(selectedEvent.event.dateTime).toLocaleDateString()}</span>
                <span className="text-sm">Registered</span>
                <span className="text-sm">{selectedEvent.attendance.registered}</span>
                <span className="text-sm">Attended</span>
                <span className="text-sm">{selectedEvent.attendance.registered}</span>
                <span className="text-sm">Missing</span>
                <span className="text-sm">{selectedEvent.attendance.absent}</span>
                <span className="text-sm">Location</span>
                <span className="text-sm">{selectedEvent.event.location}</span>
              </div>
            </div>

            <div className="p-4">
              <div className="grid grid-cols-2 gap-x-8">
                <div>
                  <h4 className="font-medium text-red-500 mb-2">Expenses</h4>
                  <div className="space-y-2">
                    {selectedEvent.finance.expenses.length > 0 ? (
                      selectedEvent.finance.expenses.map((expense, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>{expense.description}</span>
                          <span>{expense.amount.toFixed(2)} RS</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm">No expenses recorded</div>
                    )}
                    <div className="flex justify-between font-medium pt-2 border-t">
                      <span>Total</span>
                      <span>
                        {selectedEvent.finance.expenses.reduce(
                          (sum, exp) => sum + exp.amount,
                          0
                        ).toFixed(2)} RS
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-green-500 mb-2">Income</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Total Collected</span>
                      <span>{selectedEvent.finance.totalCollected.toFixed(2)} RS</span>
                    </div>
                    <div className="flex justify-between font-medium pt-2 border-t">
                      <span>Total</span>
                      <span>{selectedEvent.finance.totalCollected.toFixed(2)} RS</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end space-x-4">
        <button
          className="px-4 py-2 border border-red-500 text-red-500 rounded-md flex items-center hover:bg-red-50"
          onClick={generatePDF}
        >
          <Download className="w-4 h-4 mr-2" />
          Download Finance Report
        </button>
        <button className="px-4 py-2 border border-gray-300 rounded-md flex items-center hover:bg-gray-50">
          <Printer className="w-4 h-4 mr-2" />
          Print
        </button>
      </div>
    </div>
  );
}











// import React, { useState, useEffect } from 'react';
// import { NavLink } from 'react-router-dom';
// import { Download, Printer } from 'lucide-react';
// import axios from 'axios';
// import jsPDF from 'jspdf';
// import autoTable from 'jspdf-autotable';

// export default function FinanceDashboard() {
//   const [events, setEvents] = useState([]);
//   const [selectedEvents, setSelectedEvents] = useState([]);

//   useEffect(() => {
//     const fetchEvents = async () => {
//       try {
//         const response = await axios.get('http://localhost:3000/events/eventdetails');
//         setEvents(response.data.events);
//       } catch (error) {
//         console.error('Error fetching events:', error);
//       }
//     };
//     fetchEvents();
//   }, []);

//   const handleCheckboxChange = (eventId) => {
//     setSelectedEvents((prev) =>
//       prev.includes(eventId)
//         ? prev.filter((id) => id !== eventId)
//         : [...prev, eventId]
//     );
//   };

//   // Function to generate PDF
//   const generatePDF = () => {
//     // Ensure exactly one event is selected
//     if (selectedEvents.length !== 1) {
//       alert('Please select exactly one event to generate the finance report.');
//       return;
//     }

//     // Find the selected event
//     const selectedEvent = events.find(({ event }) => event._id === selectedEvents[0]);
//     const doc = new jsPDF();

//     // Heading
//     doc.setFont('helvetica', 'bold');
//     doc.setFontSize(18);
//     doc.text(`Finance Report - ${selectedEvent.event.name}`, 10, 10);

//     // Body text with event details
//     doc.setFont('helvetica', 'normal');
//     doc.setFontSize(12);
//     const eventDate = new Date(selectedEvent.event.dateTime).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//     });
//     doc.text(
//       `This is the finance report for the event '${selectedEvent.event.name}' held at '${selectedEvent.event.location}' on ${eventDate}.`,
//       10,
//       20
//     );

//     // Income Section
//     doc.setFont('helvetica', 'bold');
//     doc.text('Income:', 10, 30);
//     doc.setFont('helvetica', 'normal');
//     doc.text(`Total Collected: ${selectedEvent.finance.totalCollected}`, 20, 40);

//     // Expenses Section
//     let yPos = 50;
//     doc.setFont('helvetica', 'bold');
//     doc.text('Expenses:', 10, yPos);
//     yPos += 10;

//     if (selectedEvent.finance.expenses.length > 0) {
//       // Prepare table data for expenses
//       const expensesData = selectedEvent.finance.expenses.map((exp) => [exp.description, exp.amount]);
//       autoTable(doc, {
//         startY: yPos,
//         head: [['Description', 'Amount']],
//         body: expensesData,
//       });
//       yPos = doc.lastAutoTable.finalY + 10;

//       // Total Expenses
//       const totalExpenses = selectedEvent.finance.expenses.reduce((sum, exp) => sum + exp.amount, 0);
//       doc.setFont('helvetica', 'bold');
//       doc.text(`Total Expenses: ${totalExpenses}`, 10, yPos);
//       yPos += 10;
//     } else {
//       doc.setFont('helvetica', 'normal');
//       doc.text('No expenses recorded', 20, yPos);
//       yPos += 10;
//     }

//     // Net Amount
//     const net =
//       selectedEvent.finance.totalCollected -
//       (selectedEvent.finance.expenses.reduce((sum, exp) => sum + exp.amount, 0) || 0);
//     doc.setFont('helvetica', 'bold');
//     doc.text(`Net: ${net}`, 10, yPos);

//     // Footer
//     const generationDate = new Date().toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//     });
//     doc.setFont('helvetica', 'normal');
//     doc.text(
//       `Generated by Software Engineering Society Management System on ${generationDate}`,
//       10,
//       doc.internal.pageSize.height - 10
//     );

//     // Save the PDF
//     doc.save(`Finance_Report_${selectedEvent.event.name.replace(/\s+/g, '_')}.pdf`);
//   };

//   // Get the first selected event for displaying details
//   const selectedEvent = events.find(({ event }) => selectedEvents.includes(event._id));

//   return (
//     <div className="p-6 space-y-6 max-w-[1000px]">
//       <h1 className="text-2xl font-bold">Finances</h1>
//       <NavLink
//         to={selectedEvents.length === 1 ? `/financesdetails/${selectedEvents[0]}` : '#'}
//         onClick={(e) => {
//           if (selectedEvents.length !== 1) {
//             e.preventDefault();
//             alert('Please select exactly one event to edit finances.');
//           }
//         }}
//       >
//         <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
//           Edit finances
//         </button>
//       </NavLink>

//       {/* Events Table */}
//       <div className="border rounded-lg">
//         <table className="w-full">
//           <thead>
//             <tr className="bg-zinc-900 text-white">
//               <th className="w-12 px-4 py-2 text-left text-xs font-medium text-gray-200 uppercase tracking-wider"></th>
//               <th className="px-4 py-2 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
//                 Event Name
//               </th>
//               <th className="px-4 py-2 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
//                 Date
//               </th>
//               <th className="px-4 py-2 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
//                 Participants Count
//               </th>
//               <th className="px-4 py-2 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
//                 Location
//               </th>
//               <th className="px-4 py-2 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
//                 Status
//               </th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {events.map(({ event, attendance }) => (
//               <tr key={event._id}>
//                 <td className="px-4 py-2 whitespace-nowrap">
//                   <input
//                     type="checkbox"
//                     className="form-checkbox h-4 w-4 text-blue-600"
//                     checked={selectedEvents.includes(event._id)}
//                     onChange={() => handleCheckboxChange(event._id)}
//                   />
//                 </td>
//                 <td className="px-4 py-2 whitespace-nowrap">{event.name}</td>
//                 <td className="px-4 py-2 whitespace-nowrap">{new Date(event.dateTime).toLocaleDateString()}</td>
//                 <td className="px-4 py-2 whitespace-nowrap">{attendance.registered}</td>
//                 <td className="px-4 py-2 whitespace-nowrap">{event.location}</td>
//                 <td className="px-4 py-2 whitespace-nowrap">
//                   <button
//                     className={`w-20 px-2 py-1 text-xs font-medium rounded-full ${
//                       event.status === 'upcoming' || event.status === 'ongoing'
//                         ? 'text-green-600 border border-green-600'
//                         : 'text-gray-600 bg-gray-100'
//                     }`}
//                   >
//                     {event.status}
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Financial Details Card */}
//       {selectedEvent && (
//         <div className="border rounded-lg overflow-hidden">
//           <div className="bg-zinc-900 text-white p-4 rounded-t-lg">
//             <div className="grid grid-cols-2">
//               <h2 className="text-lg font-semibold">Event Details</h2>
//               <h2 className="text-lg font-semibold">Finance</h2>
//             </div>
//           </div>
//           <div className="grid grid-cols-2 divide-x">
//             {/* Event Details */}
//             <div className="p-4 space-y-2">
//               <div className="grid grid-cols-2 gap-2">
//                 <span className="text-sm">Event Name</span>
//                 <span className="text-sm">{selectedEvent.event.name}</span>
//                 <span className="text-sm">Date</span>
//                 <span className="text-sm">{new Date(selectedEvent.event.dateTime).toLocaleDateString()}</span>
//                 <span className="text-sm">Registered</span>
//                 <span className="text-sm">{selectedEvent.attendance.registered}</span>
//                 <span className="text-sm">Attended</span>
//                 <span className="text-sm">{selectedEvent.attendance.registered}</span>
//                 <span className="text-sm">Missing</span>
//                 <span className="text-sm">{selectedEvent.attendance.absent}</span>
//                 <span className="text-sm">Location</span>
//                 <span className="text-sm">{selectedEvent.event.location}</span>
//               </div>
//             </div>

//             {/* Finance Details */}
//             <div className="p-4">
//               <div className="grid grid-cols-2 gap-x-8">
//                 {/* Expenses */}
//                 <div>
//                   <h4 className="font-medium text-red-500 mb-2">Expenses</h4>
//                   <div className="space-y-2">
//                     {selectedEvent.finance &&
//                     selectedEvent.finance.expenses.length > 0 ? (
//                       selectedEvent.finance.expenses.map((expense, index) => (
//                         <div key={index} className="flex justify-between text-sm">
//                           <span>{expense.description}</span>
//                           <span>{expense.amount}</span>
//                         </div>
//                       ))
//                     ) : (
//                       <div className="text-sm">No expenses recorded</div>
//                     )}
//                     {selectedEvent.finance && (
//                       <div className="flex justify-between font-medium pt-2 border-t">
//                         <span>Total</span>
//                         <span>
//                           {selectedEvent.finance.expenses.reduce(
//                             (sum, exp) => sum + exp.amount,
//                             0
//                           )}
//                         </span>
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 {/* Income */}
//                 <div>
//                   <h4 className="font-medium text-green-500 mb-2">Income</h4>
//                   <div className="space-y-2">
//                     {selectedEvent.finance && (
//                       <div className="flex justify-between text-sm">
//                         <span>Total Collected</span>
//                         <span>{selectedEvent.finance.totalCollected}</span>
//                       </div>
//                     )}
//                     {selectedEvent.finance && (
//                       <div className="flex justify-between font-medium pt-2 border-t">
//                         <span>Total</span>
//                         <span>{selectedEvent.finance.totalCollected}</span>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Action Buttons */}
//       <div className="flex justify-end space-x-4">
//         <button
//           className="px-4 py-2 border border-red-500 text-red-500 rounded-md flex items-center"
//           onClick={generatePDF}
//         >
//           <Download className="w-4 h-4 mr-2" />
//           Download Finance Report
//         </button>
//         <button className="px-4 py-2 border border-gray-300 rounded-md flex items-center">
//           <Printer className="w-4 h-4 mr-2" />
//           Print
//         </button>
//       </div>
//     </div>
//   );
// }





// import React, { useState, useEffect } from 'react';
// import { NavLink } from 'react-router-dom';
// import { Download, Printer } from 'lucide-react';
// import axios from 'axios';

// export default function FinanceDashboard() {
//   const [events, setEvents] = useState([]);
//   const [selectedEvents, setSelectedEvents] = useState([]);

//   useEffect(() => {
//     const fetchEvents = async () => {
//       try {
//         const response = await axios.get('http://localhost:3000/events/eventdetails');
//         setEvents(response.data.events);
//       } catch (error) {
//         console.error('Error fetching events:', error);
//       }
//     };
//     fetchEvents();
//   }, []);

//   const handleCheckboxChange = (eventId) => {
//     setSelectedEvents((prev) =>
//       prev.includes(eventId)
//         ? prev.filter((id) => id !== eventId)
//         : [...prev, eventId]
//     );
//   };

//   // Get the first selected event for displaying details (assuming one event at a time for simplicity)
//   const selectedEvent = events.find(({ event }) => selectedEvents.includes(event._id));

//   return (
//     <div className="p-6 space-y-6 max-w-[1000px]">
//       <h1 className="text-2xl font-bold">Finances</h1>
//       <NavLink
//         to={selectedEvents.length === 1 ? `/financesdetails/${selectedEvents[0]}` : '#'}
//         onClick={(e) => {
//           if (selectedEvents.length !== 1) {
//             e.preventDefault();
//             alert('Please select exactly one event to edit finances.');
//           }
//         }}
//       >
//         <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
//           Edit finances
//         </button>
//       </NavLink>

//       {/* Events Table */}
//       <div className="border rounded-lg">
//         <table className="w-full">
//           <thead>
//             <tr className="bg-zinc-900 text-white">
//               <th className="w-12 px-4 py-2 text-left text-xs font-medium text-gray-200 uppercase tracking-wider"></th>
//               <th className="px-4 py-2 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Event Name</th>
//               <th className="px-4 py-2 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Date</th>
//               <th className="px-4 py-2 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Participants Count</th>
//               <th className="px-4 py-2 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Location</th>
//               <th className="px-4 py-2 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Status</th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {events.map(({ event, attendance }) => (
//               <tr key={event._id}>
//                 <td className="px-4 py-2 whitespace-nowrap">
//                   <input
//                     type="checkbox"
//                     className="form-checkbox h-4 w-4 text-blue-600"
//                     checked={selectedEvents.includes(event._id)}
//                     onChange={() => handleCheckboxChange(event._id)}
//                   />
//                 </td>
//                 <td className="px-4 py-2 whitespace-nowrap">{event.name}</td>
//                 <td className="px-4 py-2 whitespace-nowrap">{new Date(event.dateTime).toLocaleDateString()}</td>
//                 <td className="px-4 py-2 whitespace-nowrap">{attendance.registered}</td>
//                 <td className="px-4 py-2 whitespace-nowrap">{event.location}</td>
//                 <td className="px-4 py-2 whitespace-nowrap">
//                   <button
//                     className={`w-20 px-2 py-1 text-xs font-medium rounded-full ${
//                       event.status === 'upcoming' || event.status === 'ongoing'
//                         ? 'text-green-600 border border-green-600'
//                         : 'text-gray-600 bg-gray-100'
//                     }`}
//                   >
//                     {event.status}
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Financial Details Card */}
//       {selectedEvent && (
//         <div className="border rounded-lg overflow-hidden">
//           <div className="bg-zinc-900 text-white p-4 rounded-t-lg">
//             <div className="grid grid-cols-2">
//               <h2 className="text-lg font-semibold">Event Details</h2>
//               <h2 className="text-lg font-semibold">Finance</h2>
//             </div>
//           </div>
//           <div className="grid grid-cols-2 divide-x">
//             {/* Event Details */}
//             <div className="p-4 space-y-2">
//               <div className="grid grid-cols-2 gap-2">
//                 <span className="text-sm">Event Name</span>
//                 <span className="text-sm">{selectedEvent.event.name}</span>
//                 <span className="text-sm">Date</span>
//                 <span className="text-sm">{new Date(selectedEvent.event.dateTime).toLocaleDateString()}</span>
//                 <span className="text-sm">Registered</span>
//                 <span className="text-sm">{selectedEvent.attendance.registered}</span>
//                 <span className="text-sm">Attended</span>
//                 <span className="text-sm">{selectedEvent.attendance.registered}</span> {/* Assuming attended = registered */}
//                 <span className="text-sm">Missing</span>
//                 <span className="text-sm">{selectedEvent.attendance.absent}</span>
//                 <span className="text-sm">Location</span>
//                 <span className="text-sm">{selectedEvent.event.location}</span>
//               </div>
//             </div>

//             {/* Finance Details */}
//             <div className="p-4">
//               <div className="grid grid-cols-2 gap-x-8">
//                 {/* Expenses */}
//                 <div>
//                   <h4 className="font-medium text-red-500 mb-2">Expenses</h4>
//                   <div className="space-y-2">
//                     {selectedEvent.finance && selectedEvent.finance.expenses.length > 0 ? (
//                       selectedEvent.finance.expenses.map((expense, index) => (
//                         <div key={index} className="flex justify-between text-sm">
//                           <span>{expense.description}</span>
//                           <span>{expense.amount}</span>
//                         </div>
//                       ))
//                     ) : (
//                       <div className="text-sm">No expenses recorded</div>
//                     )}
//                     {selectedEvent.finance && (
//                       <div className="flex justify-between font-medium pt-2 border-t">
//                         <span>Total</span>
//                         <span>{selectedEvent.finance.expenses.reduce((sum, exp) => sum + exp.amount, 0)}</span>
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 {/* Income */}
//                 <div>
//                   <h4 className="font-medium text-green-500 mb-2">Income</h4>
//                   <div className="space-y-2">
//                     {selectedEvent.finance && (
//                       <div className="flex justify-between text-sm">
//                         <span>Total Collected</span>
//                         <span>{selectedEvent.finance.totalCollected}</span>
//                       </div>
//                     )}
//                     {selectedEvent.finance && (
//                       <div className="flex justify-between font-medium pt-2 border-t">
//                         <span>Total</span>
//                         <span>{selectedEvent.finance.totalCollected}</span>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Action Buttons */}
//       <div className="flex justify-end space-x-4">
//         <button className="px-4 py-2 border border-red-500 text-red-500 rounded-md flex items-center">
//           <Download className="w-4 h-4 mr-2" />
//           Download Finance Report
//         </button>
//         <button className="px-4 py-2 border border-gray-300 rounded-md flex items-center">
//           <Printer className="w-4 h-4 mr-2" />
//           Print
//         </button>
//       </div>
//     </div>
//   );
// }























// import * as React from "react"
// import { Download, Printer } from 'lucide-react'

// const events = [
//   { name: "Concert", date: "10-12-2024", participants: 50, location: "Rawalpindi", status: "Close" },
//   { name: "Qawali", date: "12-12-2024", participants: 50, location: "Rawalpindi", status: "Close" },
//   { name: "Concert", date: "13-12-2024", participants: 50, location: "Islamabad", status: "Open" },
//   { name: "Qawali", date: "14-12-2024", participants: 50, location: "Sialkot", status: "Open" },
//   { name: "Qawali", date: "14-12-2024", participants: 50, location: "Sialkot", status: "Open" },
// ]

// export default function FinanceDashboard() {
//   return (
//     <div className="p-6 space-y-6 max-w-[1000px]">
//       <h1 className="text-2xl font-bold">Finances</h1>        <NavLink
//                 to={`/financesdetails/${selectedEvents[0]}`}
//                 onClick={(e) => {
//                   if (selectedEvents.length !== 1) {
//                     e.preventDefault();
//                     alert("Please select exactly one event to view participants.");
//                   }
//                 }}
//               >
//                 <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
//                   Edit finances 
//                 </button>
//               </NavLink>
      
//       {/* Events Table */}
//       <div className="border rounded-lg">
//         <table className="w-full">
//           <thead>
//             <tr className="bg-zinc-900 text-white">
//               <th className="w-12 px-4 py-2 text-left text-xs font-medium text-gray-200 uppercase tracking-wider"></th>
//               <th className="px-4 py-2 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Event Name</th>
//               <th className="px-4 py-2 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Date</th>
//               <th className="px-4 py-2 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Participants Count</th>
//               <th className="px-4 py-2 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Location</th>
//               <th className="px-4 py-2 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Status</th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {events.map((event, index) => (
//               <tr key={index}>
//                 <td className="px-4 py-2 whitespace-nowrap">
//                   <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600" checked={event.isSelected} />
//                 </td>
//                 <td className="px-4 py-2 whitespace-nowrap">{event.name}</td>
//                 <td className="px-4 py-2 whitespace-nowrap">{event.date}</td>
//                 <td className="px-4 py-2 whitespace-nowrap">{event.participants}</td>
//                 <td className="px-4 py-2 whitespace-nowrap">{event.location}</td>
//                 <td className="px-4 py-2 whitespace-nowrap">
//                   <button
//                     className={`w-20 px-2 py-1 text-xs font-medium rounded-full ${
//                       event.status === "Open"
//                         ? "text-green-600 border border-green-600"
//                         : "text-gray-600 bg-gray-100"
//                     }`}
//                   >
//                     {event.status}
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Financial Details Card */}
//       <div className="border rounded-lg overflow-hidden">
//         <div className="bg-zinc-900 text-white p-4 rounded-t-lg">
//           <div className="grid grid-cols-2">
//             <h2 className="text-lg font-semibold">Event Details</h2>
//             <h2 className="text-lg font-semibold">Finance</h2>
//           </div>
//         </div>
//         <div className="grid grid-cols-2 divide-x">
//           {/* Event Details */}
//           <div className="p-4 space-y-2">
//             <div className="grid grid-cols-2 gap-2">
//               <span className="text-sm">Event Name</span>
//               <span className="text-sm">Qawali Night</span>
//               <span className="text-sm">Date</span>
//               <span className="text-sm">10-12-2024</span>
//               <span className="text-sm">Registered</span>
//               <span className="text-sm">50</span>
//               <span className="text-sm">Attended</span>
//               <span className="text-sm">40</span>
//               <span className="text-sm">Missing</span>
//               <span className="text-sm">00</span>
//               <span className="text-sm">Location</span>
//               <span className="text-sm">Islamabad</span>
//             </div>
//           </div>

//           {/* Finance Details */}
//           <div className="p-4">
//             <div className="grid grid-cols-2 gap-x-8">
//               {/* Expenses */}
//               <div>
//                 <h4 className="font-medium text-red-500 mb-2">Expenses</h4>
//                 <div className="space-y-2">
//                   <div className="flex justify-between text-sm">
//                     <span>Catering</span>
//                     <span>5000</span>
//                   </div>
//                   <div className="flex justify-between text-sm">
//                     <span>Venue Costs</span>
//                     <span>12000</span>
//                   </div>
//                   <div className="flex justify-between text-sm">
//                     <span>Venue Costs</span>
//                     <span>5000</span>
//                   </div>
//                   <div className="flex justify-between text-sm">
//                     <span>Venue Costs</span>
//                     <span>800</span>
//                   </div>
//                   <div className="flex justify-between text-sm">
//                     <span>Venue Costs</span>
//                     <span>400</span>
//                   </div>
//                   <div className="flex justify-between font-medium pt-2 border-t">
//                     <span>Total</span>
//                     <span>600</span>
//                   </div>
//                 </div>
//               </div>

//               {/* Income */}
//               <div>
//                 <h4 className="font-medium text-green-500 mb-2">Income</h4>
//                 <div className="space-y-2">
//                   <div className="flex justify-between text-sm">
//                     <span>Ticket Sales</span>
//                     <span>5000</span>
//                   </div>
//                   <div className="flex justify-between text-sm">
//                     <span>Sponsorships</span>
//                     <span>12000</span>
//                   </div>
//                   <div className="flex justify-between text-sm">
//                     <span>Vendor Fees</span>
//                     <span>5000</span>
//                   </div>
//                   <div className="flex justify-between text-sm">
//                     <span>Membership Fees</span>
//                     <span>600</span>
//                   </div>
//                   <div className="flex justify-between text-sm">
//                     <span>Advertising Revenue</span>
//                     <span>1000</span>
//                   </div>
//                   <div className="flex justify-between font-medium pt-2 border-t">
//                     <span>Total</span>
//                     <span>600</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Action Buttons */}
//       <div className="flex justify-end space-x-4">
//         <button className="px-4 py-2 border border-red-500 text-red-500 rounded-md flex items-center">
//           <Download className="w-4 h-4 mr-2" />
//           Download Finance Report
//         </button>
//         <button className="px-4 py-2 border border-gray-300 rounded-md flex items-center">
//           <Printer className="w-4 h-4 mr-2" />
//           Print
//         </button>
//       </div>
//     </div>
//   )
// }

