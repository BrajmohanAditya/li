import React, { useState } from 'react';
import AddFeedbackModal from '../../components/feedback.jsx';
import { getAllFeedbacksHook, deleteFeedbackHook } from '../../hooks/feedback.hook.js';
import { getAllLibrariesHook } from '../../hooks/library.hook.js';
import { 
  MessageSquare, 
  Plus, 
  Star, 
  Award, 
  ThumbsUp, 
  BookOpen, 
  ChevronDown, 
  Search,
  Library,
  Calendar,
  Trash2
} from 'lucide-react';

const Feedback = () => {
  const [selectedLibrary, setSelectedLibrary] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const { mutate: deleteFeedback, isPending: isDeleting } = deleteFeedbackHook();

  // Fetch libraries
  const { data: librariesResponse } = getAllLibrariesHook();
  const libraries = librariesResponse?.data || librariesResponse || [];

  // Fetch feedbacks
  const { data: feedbacksResponse, isLoading: feedbacksLoading } = getAllFeedbacksHook();
  const allFeedbacks = feedbacksResponse?.data || feedbacksResponse || [];

  // Filter feedbacks locally based on criteria
  const filteredFeedbacks = Array.isArray(allFeedbacks) ? allFeedbacks.filter(f => {
    const libId = f.library?.id || f.library?._id || f.libraryId || (typeof f.library === 'string' ? f.library : null);
    const matchesLibrary = selectedLibrary === 'all' || libId === selectedLibrary;
    
    // User name from backend could be nested depending on populate
    const userName = f.userId?.name || f.userId?.fullName || f.user?.name || f.user || 'Unknown User';
    const matchesSearch = !searchQuery || userName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const fRating = Number(f.rating || f.rate || f.stars || 0);
    const matchesRating = ratingFilter === 'all' || fRating === parseInt(ratingFilter);
    
    return matchesLibrary && matchesSearch && matchesRating;
  }) : [];

  // Calculate stats dynamically
  const totalFeedbacks = filteredFeedbacks.length;
  const averageRating = totalFeedbacks > 0 
    ? (filteredFeedbacks.reduce((acc, curr) => acc + Number(curr.rating || curr.rate || curr.stars || 0), 0) / totalFeedbacks).toFixed(1) 
    : '0.0';
  const fiveStarRatings = filteredFeedbacks.filter(f => Number(f.rating || f.rate || f.stars || 0) === 5).length;
  const positiveFeedbacks = filteredFeedbacks.filter(f => Number(f.rating || f.rate || f.stars || 0) >= 4).length;

  const stats = [
    {
      title: 'TOTAL FEEDBACKS',
      value: totalFeedbacks.toString(),
      icon: MessageSquare,
      color: 'text-brand-600',
      bgColor: 'bg-brand-600',
    },
    {
      title: 'AVERAGE RATING',
      value: averageRating,
      icon: Star,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500',
    },
    {
      title: '5 STAR RATINGS',
      value: fiveStarRatings.toString(),
      icon: Award,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500',
    },
    {
      title: 'POSITIVE FEEDBACK',
      value: positiveFeedbacks.toString(),
      icon: ThumbsUp,
      color: 'text-brand-500',
      bgColor: 'bg-brand-600',
    }
  ];

  const renderStars = (rating) => {
    const numRating = Number(rating) || 0;
    return (
      <div className="flex gap-1 mt-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star 
            key={star} 
            className={`w-4 h-4 ${star <= numRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200 fill-gray-200'}`} 
          />
        ))}
      </div>
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 bg-slate-50 min-h-screen font-sans">
      
      {/* Header Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm flex justify-between items-center border border-slate-100">
        <div className="flex items-center gap-4">
          <div className="bg-brand-100 p-3 rounded-xl">
            <MessageSquare className="w-6 h-6 text-brand-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Feedback Management</h1>
            <p className="text-slate-500 text-sm mt-1">Monitor and manage user feedback across all libraries</p>
          </div>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Feedback
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex justify-between items-center">
            <div>
              <p className="text-xs font-semibold text-slate-400 tracking-wider mb-1">{stat.title}</p>
              <h3 className="text-2xl font-bold text-slate-800">{stat.value}</h3>
            </div>
            <div className={`${stat.bgColor} p-3 rounded-xl shadow-sm`}>
              <stat.icon className="w-5 h-5 text-white" />
            </div>
          </div>
        ))}
      </div>

      {/* Select Library Section */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-4 h-4 text-slate-400" />
          <span className="text-sm font-medium text-slate-600">Select Library</span>
        </div>
        <div className="relative max-w-md">
          <select 
            className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-700 py-2.5 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 font-medium text-sm"
            value={selectedLibrary}
            onChange={(e) => setSelectedLibrary(e.target.value)}
          >
            <option value="all">-- All Feedbacks --</option>
            {Array.isArray(libraries) && libraries.map((lib) => (
              <option key={lib._id || lib.id} value={lib._id || lib.id}>{lib.name}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
        <p className="text-xs text-slate-400 mt-3">Showing {selectedLibrary === 'all' ? 'all feedbacks from all libraries' : 'feedbacks for selected library'}</p>
      </div>

      {/* Feedbacks List Section */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-800">All Feedbacks</h2>
            <p className="text-sm text-slate-500">Total Feedbacks: {totalFeedbacks}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search by user name..." 
                className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-white w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="relative">
              <select 
                className="appearance-none bg-white border border-slate-200 text-slate-700 py-2 pl-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 font-medium text-sm"
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value)}
              >
                <option value="all">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {feedbacksLoading ? (
          <div className="flex justify-center py-10">
            <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
          </div>
        ) : filteredFeedbacks.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center border border-slate-100 shadow-sm mt-4">
            <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-slate-700">No feedbacks found</h3>
            <p className="text-sm text-slate-500 mt-1">Try adjusting your filters or search query.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            {filteredFeedbacks.map((feedback) => {
              const userName = feedback.userId?.name || feedback.userId?.fullName || feedback.user?.name || feedback.user || 'Unknown User';
              const initial = userName.charAt(0).toUpperCase();
              const reviewText = feedback.message || feedback.review || feedback.feedback || feedback.text || '';
              const foundLib = libraries.find(l => l._id === feedback.libraryId || l.id === feedback.libraryId);
              const libName = feedback.libraryId?.name || feedback.library?.name || foundLib?.name || 'Unknown Library';
              
              const ratingValue = Number(feedback.rating || feedback.rate || feedback.stars || 0);
              const isPositive = ratingValue >= 4;
              const badgeColor = isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-brand-50 text-brand-600';
              
              // Get an arbitrary background color for avatar based on first letter
              const colors = ['bg-brand-500', 'bg-brand-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500', 'bg-purple-500'];
              const colorIndex = userName.length > 0 ? userName.charCodeAt(0) % colors.length : 0;
              const avatarColor = colors[colorIndex];

              return (
                <div key={feedback._id || feedback.id} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`${avatarColor} w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm`}>
                        {initial}
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-800 text-sm">{userName}</h4>
                        {renderStars(ratingValue)}
                      </div>
                    </div>
                    <div className={`${badgeColor} px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1`}>
                      {ratingValue > 0 ? ratingValue : '-'} <Star className="w-3 h-3 fill-current" />
                    </div>
                  </div>
                  
                  <div className="py-4 text-slate-600 text-sm truncate" title={reviewText}>
                    "{reviewText}"
                  </div>

                  <div className="pt-4 border-t border-slate-50 flex justify-between items-center text-xs text-slate-400 font-medium mt-2">
                    <div className="flex items-center gap-1.5 uppercase tracking-wide">
                      <Library className="w-3.5 h-3.5" />
                      <span className="truncate max-w-[120px]">{libName}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(feedback.createdAt || Date.now()).toLocaleDateString()}
                      </div>
                      <button 
                        onClick={() => {
                          if(window.confirm('Are you sure you want to delete this feedback?')) {
                            deleteFeedback(feedback._id || feedback.id);
                          }
                        }}
                        disabled={isDeleting}
                        className="text-slate-400 hover:text-red-500 transition-colors p-1"
                        title="Delete Feedback"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <AddFeedbackModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />
    </div>
  );
};

export default Feedback;
