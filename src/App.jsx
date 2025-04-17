



import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet
} from 'react-router-dom';
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
import ProfileEditPage from './EditProfile.jsx';
import Discussions from './discussions.jsx';
import AdminLogin from './AdminLogin';

// Loader overlay component
import Loader from './components/Loader';

// Higher-order component to protect routes
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/admin-login" replace />;
};

// Layout wrapper for authenticated pages
const AdminLayout = () => (
  <div className="h-screen grid grid-cols-[203px_1fr]">
    <Navbar />
    <Outlet />
  </div>
);

const App = () => (
  <Router>
    <Routes>
      {/* Public Route */}
      <Route
        path="/admin-login"
        element={
          localStorage.getItem('token')
            ? <Navigate to="/" replace />
            : <AdminLogin />
        }
      />

      {/* Protected Routes */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        {/* default to dashboard */}
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="discussions" element={<Discussions />} />
        <Route path="manage-user" element={<ManageUsers />} />
        <Route path="manage-events" element={<ManageEvents />} />
        <Route path="createEvent" element={<CreateEvent />} />
        <Route path="editEvent/:id" element={<EditEvent />} />
        <Route path="attendance/:id" element={<AttendanceTracking />} />
        <Route path="finances" element={<Finances />} />
        <Route path="financesdetails/:id" element={<FinancesDetails />} />
        <Route path="settings" element={<Settings />} />
        <Route path="EditProfile" element={<ProfileEditPage />} />
        <Route path="help" element={<Help />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="Certifications" element={<Certifications />} />
      </Route>

      {/* Fallback to login if route not found */}
      <Route
        path="*"
        element={<Navigate to="/admin-login" replace />}
      />
    </Routes>
    <ToastContainer position="top-right" autoClose={3000} />
  </Router>
);

export default App;








// import React from 'react';
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Navigate,
//   Outlet
// } from 'react-router-dom';
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// import Navbar from './navbar';
// import Dashboard from './dashboard';
// import ManageUsers from './manage-users.jsx';
// import ManageEvents from './manageEvents.jsx';
// import CreateEvent from './CreateEvent.jsx';
// import EditEvent from './editEvent.jsx';
// import AttendanceTracking from './AttendanceTracking.jsx';
// import Finances from './finances.jsx';
// import Settings from './Settings.jsx';
// import Help from './help.jsx';
// import Notifications from './notifications.jsx';
// import Certifications from './Certifications.jsx';
// import FinancesDetails from './financesdetails.jsx';
// import ProfileEditPage from './EditProfile.jsx';
// import Discussions from './discussions.jsx';

// import AdminLogin from './AdminLogin';
// import Loader from './components/Loader';


// // Protect all “inner” routes:
// const RequireAuth = () => {
//   const token = localStorage.getItem('token');
//   if (!token) {
//     // not logged in → to login
//     return <Navigate to="/admin-login" replace />;
//   }
 
// };

// // Layout for all protected pages
// const AdminLayout = () => (
//   <div className="h-screen grid grid-cols-[203px_1fr]">
//     <Navbar />
//     <Outlet />
//   </div>
// );

// const App = () => (
//   <Router>
//     <Routes>
//       {/* Public */}
//       <Route
//         path="/admin-login"
//         element={
//           // if already have token, bounce to dashboard immediately
//           localStorage.getItem('token')
//             ? <Navigate to="/dashboard" replace />
//             : <AdminLogin />
//         }
//       />

//       {/* Protected wrapper */}
//       <Route element={<RequireAuth />}>
//         <Route path="/" element={<AdminLayout />}>
//           {/* default to /dashboard */}
//           <Route index element={<Navigate to="dashboard" replace />} />
//           <Route path="dashboard" element={<Dashboard />} />
//           <Route path="discussions" element={<Discussions />} />
//           <Route path="manage-user" element={<ManageUsers />} />
//           <Route path="manage-events" element={<ManageEvents />} />
//           <Route path="createEvent" element={<CreateEvent />} />
//           <Route path="editEvent/:id" element={<EditEvent />} />
//           <Route path="attendance/:id" element={<AttendanceTracking />} />
//           <Route path="finances" element={<Finances />} />
//           <Route path="financesdetails/:id" element={<FinancesDetails />} />
//           <Route path="settings" element={<Settings />} />
//           <Route path="EditProfile" element={<ProfileEditPage />} />
//           <Route path="help" element={<Help />} />
//           <Route path="notifications" element={<Notifications />} />
//           <Route path="Certifications" element={<Certifications />} />
//         </Route>
//       </Route>

//       {/* Catch‑all → redirect to dashboard if authed, else login */}
//       <Route
//         path="*"
//         element={
//           localStorage.getItem('token')
//             ? <Navigate to="/dashboard" replace />
//             : <Navigate to="/admin-login" replace />
//         }
//       />
//     </Routes>

//     <ToastContainer position="top-right" autoClose={3000} />
//   </Router>
// );

// export default App;







// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import Navbar from './navbar';
// import Dashboard from './dashboard';
// import ManageUsers from './manage-users.jsx';
// import ManageEvents from './manageEvents.jsx';
// import CreateEvent from './CreateEvent.jsx';
// import EditEvent from './editEvent.jsx';
// import AttendanceTracking from './AttendanceTracking.jsx';
// import Finances from './finances.jsx';
// import Settings from './Settings.jsx';
// import Help from './help.jsx';
// import Notifications from './notifications.jsx';
// import Certifications from './Certifications.jsx';
// import FinancesDetails from './financesdetails.jsx';
// import ProfileEditPage from './EditProfile.jsx'; 
// import Disscussions from './discussions.jsx'
// const App = () => {
//   return (
//     <Router>
//       <div className="h-screen grid grid-cols-[203px_1fr]">
//         <Navbar />
//         <Routes>
//           <Route path="/dashboard" element={<Dashboard />} />
//           <Route path="/discussions" element={<Disscussions />} />

//           <Route path="/manage-user" element={<ManageUsers />} />
//           <Route path="/manage-events" element={<ManageEvents />} />
//           <Route path="/createEvent" element={<CreateEvent />} />
//           <Route path="/editEvent/:id" element={<EditEvent />} />
//           <Route path="/attendance/:id" element={<AttendanceTracking />} />
//           <Route path="/finances" element={<Finances />} />
//           <Route path="/financesdetails/:id" element={<FinancesDetails />} />
//           <Route path="/settings" element={<Settings />} />
//           <Route path="/EditProfile" element={<ProfileEditPage />} />

//           <Route path="/help" element={<Help />} />
//           <Route path="/notifications" element={<Notifications />} />
//           <Route path="/Certifications" element={<Certifications />} />
//         </Routes>
//         <ToastContainer position="top-right" autoClose={3000} />
//       </div>
//     </Router>
//   );
// };

// export default App;











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
