import { userLoginHook } from "../../hooks/user.hook";
import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Loader2, GraduationCap } from "lucide-react";

const Login = () => {
  const { register, handleSubmit } = useForm();
  const { mutate, isPending } = userLoginHook();
  const navigate = useNavigate();

  const loginFormHandler = (data) => {
    mutate(data, {
      onSuccess: (responseData) => { // <-- Grab the response data here
        localStorage.setItem("token", responseData.token); // <-- Save the token!
        navigate("/"); 
      },
    });
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-brand-50 via-white to-brand-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto mb-3 rounded-xl bg-brand-600 text-white flex items-center justify-center text-2xl font-bold">
            <GraduationCap className="w-8 h-8 animate-bounce" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Login  Account</h1>
          <p className="text-sm text-gray-500 mt-1">
            Join us and start your journey
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(loginFormHandler)} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="email"
                placeholder="you@example.com"
                {...register("email", { required: true })}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="password"
                placeholder="••••••••"
                {...register("password", { required: true })}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3 rounded-xl bg-brand-600 text-white font-semibold hover:bg-brand-700 transition-all disabled:opacity-60 flex items-center justify-center"
          >
            {isPending ? (
              <Loader2 className="animate-spin mr-2" size={20} />
            ) : (
              "Login"
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="text-sm text-center text-gray-600 mt-6">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-brand-600 font-medium hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
