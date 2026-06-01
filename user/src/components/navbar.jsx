import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp, Menu } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { userLogoutHook, GetUserHook } from "../hooks/user.hook";

const Navbar = ({ toggleSidebar }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { mutate: triggerLogout } = userLogoutHook();

  const handleLogout = () => {
    triggerLogout(null, {
      onSuccess: () => {
        // When the token is deleted, send them back to login!
        navigate("/login");
      },
    });
  };
  const { data: userData } = GetUserHook();
  const user = userData?.data;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-full h-[72px] bg-white flex items-center justify-between px-4 md:px-8 border-b border-gray-100 shrink-0">
      <div className="flex items-center">
        <button 
          onClick={toggleSidebar}
          className="p-2 -ml-2 mr-2 text-gray-500 hover:bg-gray-100 rounded-lg md:hidden"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      <div className="flex items-center justify-end">
      {user ? (
        <div className="relative" ref={dropdownRef}>
          {/* Profile Button */}
          <div
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`flex items-center gap-3 bg-white pl-2 pr-4 py-1.5 rounded-full cursor-pointer shadow-sm border transition-all ${
              isDropdownOpen
                ? "border-gray-300 shadow-md"
                : "border-gray-100 hover:shadow-md"
            }`}
          >
            <img
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}&backgroundColor=b6e3f4`}
              alt="Profile"
              className="w-9 h-9 rounded-full object-cover bg-blue-50"
            />
            <span className="text-sm font-medium text-gray-700">
              {user.name}
            </span>
            {isDropdownOpen ? (
              <ChevronUp className="w-4 h-4 text-gray-500 ml-1" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-500 ml-1" />
            )}
          </div>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
              {/* User Info */}
              <div className="px-4 py-2">
                <p className="text-xs text-gray-500 mb-1">Signed in as</p>
                <p className="text-sm font-semibold text-gray-800">
                  {user.name}
                </p>
                <p className="text-xs text-gray-400">{user.email}</p>
              </div>

              <div className="h-[1px] bg-gray-100 my-1"></div>

              {/* Links */}
              <div className="px-2 space-y-1">
                <button className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors">
                  Profile
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors">
                  Settings
                </button>
              </div>

              <div className="h-[1px] bg-gray-100 my-1"></div>

              {/* Logout */}
              <div className="px-2">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-5 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-sm"
          >
            Signup
          </Link>
        </div>
      )}
      </div>
    </div>
  );
};

export default Navbar;
