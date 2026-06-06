import { userRegisterHook } from "../../hooks/user.hook";
import React from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { User, Mail, Lock, Loader2, GraduationCap, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const { register, handleSubmit } = useForm();
  const { mutate, isPending } = userRegisterHook();
  const navigate = useNavigate();
  const registerFormHandler = (data) => {
    mutate(data, {
      onSuccess: (responseData) => {
        localStorage.setItem("token", responseData.token);
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
          <h1 className="text-2xl font-bold text-gray-900">Signup Account</h1>
          <p className="text-sm text-gray-500 mt-1">
            Join us and start your journey
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(registerFormHandler)}
          className="space-y-5"
        >
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <div className="relative">
              <User
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="John Doe"
                {...register("name", { required: true })}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition"
              />
            </div>
          </div>

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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-0">
              Mobile No
            </label>
            <div className="relative">
              <Phone
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="number"
                placeholder=""
                {...register("number", { required: true })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition"
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
              "Create Account"
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="text-sm text-center text-gray-600 mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-brand-600 font-medium hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
