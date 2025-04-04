import React from "react";
import { NavLink } from "react-router-dom"; // Import NavLink
import {
  LayoutDashboard,
  Users,
  Calendar,
  MessageSquare,
  MessageCircle,
  DollarSign,
  Bell,
  HelpCircle,
  Settings,
} from "lucide-react";

const Sidebar = ({ className }) => {
  const customNavLink = (icon, label, to) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `w-full flex items-center justify-start px-4 py-2 rounded ${
          isActive ? "bg-zinc-800 text-yellow-500" : "text-white hover:bg-zinc-800 hover:text-yellow-500"
        }`
      }
    >
      {icon}
      <span className="ml-2">{label}</span>
    </NavLink>
  );

  return (
    <div className={`pb-12 min-h-screen w-[210px] bg-black text-white fixed left-0 top-0 ${className}`}>
      <div className="space-y-4 py-4">
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight text-yellow-500">
            👀 Admin
          </h2>
        </div>
        <nav className="space-y-1">
          {customNavLink(<LayoutDashboard className="h-4 w-4" />, "Dashboard", "/dashboard")}
          {customNavLink(<Users className="h-4 w-4" />, "Manage User", "/manage-user")}
          {customNavLink(<Calendar className="h-4 w-4" />, "Manage Events", "/manage-events")}
          {customNavLink(<MessageSquare className="h-4 w-4" />, "Certifications", "/Certifications")}
          {customNavLink(<DollarSign className="h-4 w-4" />, "Finances", "/finances")}
          {customNavLink(<MessageCircle className="h-4 w-4" />, "Discussions", "/discussions")}
          <div className="my-4 border-t border-zinc-800" />
          {customNavLink(<Bell className="h-4 w-4" />, "Notifications", "/notifications")}
          {customNavLink(<HelpCircle className="h-4 w-4" />, "Help", "/help")}
          {customNavLink(<Settings className="h-4 w-4" />, "Settings", "/settings")}
        </nav>
      </div>
      <div className="mt-auto px-4">
        <div className="flex items-center gap-2 py-2 transition-transform duration-200 ease-in-out hover:bg-zinc-800 hover:scale-105 rounded px-2 cursor-pointer">
          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-500">
            <img src="/public/image 1.png" alt="Avatar" className="h-10 w-10 rounded-full object-cover" />
          </div>
          <div className="text-sm">
            <p className="font-medium">Ahmed Ali</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Layout = ({ children }) => {
  return (
    <div className="flex bg-white text-black">
      <Sidebar />
      <main className="">{children}</main>
    </div>
  );
};

export default Layout;
