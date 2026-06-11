import React from "react";
import { getDashboardHook } from "../../hooks/home.hook";
import { 
  Users, 
  Library, 
  BookMarked, 
  Activity, 
  IndianRupee,
  Clock,
  CheckCircle2,
  XCircle,
  Star
} from "lucide-react";

const Home = () => {
  const { data, isLoading, isError, error } = getDashboardHook();

  if (isLoading) return (
    <div className="min-h-[88vh] flex items-center justify-center bg-slate-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
    </div>
  );

  if (isError) return (
    <div className="min-h-[88vh] flex items-center justify-center bg-slate-50">
      <div className="text-red-500 font-semibold text-lg bg-red-100 p-4 rounded-lg shadow-sm border border-red-200">
        Error: {error.message}
      </div>
    </div>
  );

  const overview = data?.overview || {};
  const recentBookings = data?.recentBookings || [];
  const recentFeedbacks = data?.recentFeedbacks || [];

  const overviewCards = [
    { title: "Total Users", value: overview.totalUsers || 0, icon: <Users className="w-8 h-8 text-brand-500" />, bg: "bg-brand-50" },
    { title: "Total Libraries", value: overview.totalLibraries || 0, icon: <Library className="w-8 h-8 text-brand-500" />, bg: "bg-brand-50" },
    { title: "Total Bookings", value: overview.totalBookings || 0, icon: <BookMarked className="w-8 h-8 text-emerald-500" />, bg: "bg-emerald-50" },
    { title: "Active Bookings", value: overview.activeBookings || 0, icon: <Activity className="w-8 h-8 text-amber-500" />, bg: "bg-amber-50" },
    { title: "Total Revenue", value: `₹${overview.totalRevenue || 0}`, icon: <IndianRupee className="w-8 h-8 text-rose-500" />, bg: "bg-rose-50" },
  ];

  return (
    <div className="min-h-[88vh] bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Dashboard Overview</h1>
          <p className="text-slate-500 mt-1">Welcome back! Here's what's happening today.</p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {overviewCards.map((card, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex items-center space-x-4 hover:shadow-md transition-shadow">
              <div className={`p-3 rounded-lg ${card.bg}`}>
                {card.icon}
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">{card.title}</p>
                <h3 className="text-2xl font-bold text-slate-800">{card.value}</h3>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Bookings */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col h-[450px]">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-800">Recent Bookings</h2>
            </div>
            <div className="overflow-auto flex-1 custom-scrollbar">
              <table className="w-full text-left text-sm relative">
                <thead className="bg-slate-50 text-slate-600 font-medium sticky top-0 z-10 shadow-sm">
                  <tr>
                    <th className="px-6 py-3">Booking ID</th>
                    <th className="px-6 py-3">Type</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Payment</th>
                    <th className="px-6 py-3">Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentBookings.length > 0 ? (
                    recentBookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-slate-50/50">
                        <td className="px-6 py-4 font-mono text-xs text-slate-500">
                          {booking.id.substring(0, 8)}...
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700">
                            {booking.bookingType}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {booking.status === 'ACTIVE' ? (
                            <span className="inline-flex items-center text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md text-xs font-medium">
                              <CheckCircle2 className="w-3 h-3 mr-1" /> Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center text-rose-600 bg-rose-50 px-2 py-1 rounded-md text-xs font-medium">
                              <XCircle className="w-3 h-3 mr-1" /> Expired
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                            booking.paymentStatus === 'SUCCESS' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                          }`}>
                            {booking.paymentStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-500 flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {new Date(booking.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center text-slate-500">
                        No recent bookings found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Feedbacks */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col h-[450px]">
            <div className="px-6 py-4 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-800">Recent Feedbacks</h2>
            </div>
            <div className={`flex-1 p-6 flex flex-col items-center text-center overflow-y-auto custom-scrollbar ${recentFeedbacks.length > 0 ? 'justify-start' : 'justify-center'}`}>
              {recentFeedbacks.length > 0 ? (
                <div className="w-full space-y-4">
                  {/* Map feedbacks here if any */}
                  {recentFeedbacks.map((fb, idx) => (
                    <div key={idx} className="p-4 bg-slate-50 rounded-lg text-left space-y-2 border border-slate-100 shadow-sm">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{fb.user?.name || 'Anonymous'}</p>
                          <p className="text-xs text-slate-500">{fb.library?.name || 'Unknown Library'}</p>
                        </div>
                        <div className="flex items-center space-x-1 bg-amber-50 px-2 py-1 rounded-md">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span className="text-xs font-bold text-amber-600">{fb.rating}</span>
                        </div>
                      </div>
                      <p className="text-sm text-slate-700 truncate bg-white p-3 rounded border border-slate-100 mt-2" title={fb.message || 'No message provided'}>
                        {fb.message || 'No message provided'}
                      </p>
                      <div className="flex justify-end mt-1">
                        <p className="text-xs text-slate-400 flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {new Date(fb.createdAt).toLocaleDateString()} {new Date(fb.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                    <Activity className="w-8 h-8 text-slate-300" />
                  </div>
                  <p className="text-slate-500">No new feedback</p>
                  <p className="text-sm text-slate-400 mt-1">When users submit feedback, it will appear here.</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;


