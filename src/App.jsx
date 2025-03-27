import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './navbar';
import Dashboard from './dashboard';
import ManageUsers from './manage-users.jsx';
import ManageEvents from './manageEvents.jsx';
import CreateEvent from './CreateEvent.jsx';
import EditEvent from './editEvent.jsx';
import AttendanceTracking from './AttendanceTracking.jsx';
import Finances from './finances.jsx';
import Settings from './Settings.jsx';
import Help from './help.jsx';
import Notifications from './notifications.jsx';
import Certifications from './Certifications.jsx';
import FinancesDetails from './financesdetails.jsx';

const App = () => {
  return (
    <Router>
      <div className="h-screen grid grid-cols-[203px_1fr]">
        <Navbar />
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/manage-user" element={<ManageUsers />} />
          <Route path="/manage-events" element={<ManageEvents />} />
          <Route path="/createEvent" element={<CreateEvent />} />
          <Route path="/editEvent/:id" element={<EditEvent />} />
          <Route path="/attendance/:id" element={<AttendanceTracking />} />
          <Route path="/finances" element={<Finances />} />
          <Route path="/financesdetails/:id" element={<FinancesDetails />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/help" element={<Help />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/Certifications" element={<Certifications />} />
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </Router>
  );
};

export default App;











// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Navbar from './navbar';
// import Dashboard from './dashboard'
// import ManageUsers from './manage-users.jsx'
// import ManageEvents from './manageEvents.jsx'
// import CreateEvent from './CreateEvent.jsx'
// import EditEvent from './editEvent.jsx'

// import AttendanceTracking from './AttendanceTracking.jsx'
// import Finances from './finances.jsx'
// import Settings from './Settings.jsx'
// import Help from './help.jsx'
// import Notifications from './notifications.jsx'
// import Certifications from './Certifications.jsx'
// import financesdetails from './financesdetails.jsx';

// const App = () => {
//     return (
//         <Router>
//             <div className='h-screen grid grid-cols-[203px_1fr]'>
//                 <Navbar />
//                 <Routes>
//                     <Route path="/dashboard" element={<Dashboard />} />
//                     <Route path="/manage-user" element={<ManageUsers />} />
//                     <Route path="/manage-events" element={<ManageEvents />} />
//                     <Route path="/createEvent" element={<CreateEvent />} />
//                     <Route path="/editEvent/:id" element={<EditEvent />} />
//                     <Route path="/attendance/:id" element={<AttendanceTracking />} />
//                     <Route path="/finances" element={<Finances />} />
//                     <Route path="/financesdetails/:id" element={<financesdetails/>} />

//                     <Route path="/settings" element={<Settings />} />
//                     <Route path="/help" element={<Help />} />
//                     <Route path="/notifications" element={<Notifications />} />
//                     <Route path="/Certifications" element={<Certifications />} />
//                      {/* <Route path="/services" element={<Services />} />
//                      <Route path="/contact" element={<ContactUs />} />
//                      <Route path="/contact" element={<FAQS />} />
//                      <Route path="/about" element={<About/>} />
//                      <Route path="/login" element={<Login/>} />
//                      <Route path="/signup" element={<Signup />} /> */}
//                 </Routes>
            
//             </div>
//         </Router>



//     );
// };

// export default App;
