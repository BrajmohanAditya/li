import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getUserApi } from '../api/user.api';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();

  // Fetch the current user to verify their session (assuming you use HTTP-only cookies)
  const { data: user, isLoading, isError } = useQuery({
    queryKey: ['authUser'],
    queryFn: getUserApi,
    retry: false, // Don't retry if unauthorized (just fail and redirect)
    // staleTime: 5 * 60 * 1000, // Optional: Cache user data for 5 minutes
  });

  // 1. Show a loading state while verifying the user's session
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-600"></div>
      </div>
    );
  }

  // 2. If the API returns an error (like 401 Unauthorized) or no user, redirect to login
  if (isError || !user) {
    // Save the location they were trying to go to, so you can redirect them back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. If authenticated, render the nested routes (Outlet) or children
  return children ? children : <Outlet />;
};

export default ProtectedRoute;
