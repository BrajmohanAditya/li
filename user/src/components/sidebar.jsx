import React, { useState } from "react";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  CalendarDays,
  CreditCard,
  MessageSquare,
  Settings,
  LogOut,
  X,
  BadgeIndianRupee
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { userLogoutHook } from "../hooks/user.hook";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { mutate: triggerLogout } = userLogoutHook();

  const handleLogout = () => {
    triggerLogout(null, {
      onSuccess: () => {
        navigate("/login");
      },
    });
  };
  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, to: "/" },
    { name: "Libraries", icon: BookOpen, to: "/libraries" },
    { name: "Plans", icon: BadgeIndianRupee, to: "/plans" },

    { name: "Students", icon: Users, to: "/students" },
    { name: "Bookings", icon: CalendarDays, to: "/bookings" },
    { name: "Features", icon: CalendarDays, to: "/features" },
    { name: "Sheets", icon: CreditCard, to: "/sheets" },
    { name: "Feedback", icon: MessageSquare, to: "/feedback" },
    { name: "Settings", icon: Settings, to: "/settings" },
  ];

  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-100 flex flex-col transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
    >
      {/* Header */}
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-600 shadow-lg shadow-indigo-200 flex items-center justify-center text-white font-bold text-xl">
            L
          </div>

          <div>
            <h2 className="font-bold text-xl">Library Admin</h2>
            <p className="text-xs text-gray-400 uppercase">System Control</p>
          </div>
        </div>

        <button
          className="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
          onClick={() => setIsOpen(false)}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Menu */}
      <div className="flex-1 px-4 py-6 space-y-2 overflow-y-auto scrollbar-thin">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.to || (item.to !== '/' && location.pathname.startsWith(item.to));

          return (
            <button
              key={index}
              onClick={() => {
                if (item.to) navigate(item.to);
                if (window.innerWidth < 768) setIsOpen(false); // Close on mobile navigation
              }}
              className={`w-full flex items-center justify-between px-4 py-4 rounded-2xl transition-all ${
                isActive
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 cursor-pointer"
              }`}
            >
              <div className="flex items-center gap-4">
                <Icon size={20} />
                <span className="font-medium">{item.name}</span>
              </div>

              {isActive && (
                <div className="w-2 h-2 rounded-full bg-white"></div>
              )}
            </button>
          );
        })}
      </div>

      {/* Logout */}
      <div className="p-4 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
