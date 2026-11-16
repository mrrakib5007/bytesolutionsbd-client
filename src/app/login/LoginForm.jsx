"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiAlertCircle,
} from "react-icons/fi";

export default function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Regex validation for fields
  const validateField = (field, value) => {
    let error = "";

    if (field === "email") {
      const trimmed = value?.trim() || "";
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!trimmed) {
        error = "Email address is required.";
      } else if (!emailRegex.test(trimmed)) {
        error = "Please enter a valid email address.";
      }
    }

    if (field === "password") {
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;
      if (!value) {
        error = "Password is required.";
      } else if (!passwordRegex.test(value)) {
        error = "Password must be at least 6 characters with at least 1 letter and 1 number.";
      }
    }

    return error;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;

    setFormData((prev) => ({ ...prev, [name]: val }));

    if (touched[name]) {
      const error = validateField(name, val);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const allTouched = { email: true, password: true };
    setTouched(allTouched);

    const newErrors = {
      email: validateField("email", formData.email),
      password: validateField("password", formData.password),
    };

    setErrors(newErrors);

    const hasError = Object.values(newErrors).some((err) => Boolean(err));
    if (hasError) {
      toast.error("Please enter your valid login credentials.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await login(formData.email.trim(), formData.password);

      if (res.success) {
        toast.success(`Welcome back, ${res.user.name}!`);
        // Reset form
        setFormData({
          email: "",
          password: "",
          rememberMe: false,
        });
        setTouched({});
        setErrors({});
        router.push("/");
      } else {
        toast.error(res.message || "Invalid email or password.");
      }
    } catch (err) {
      toast.error("An error occurred during login. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-140px)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white p-7 shadow-xl shadow-gray-200/50 sm:p-10">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Welcome back
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Sign in to manage your licenses, downloads, and orders
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-4">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold uppercase tracking-wider text-gray-700"
                >
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative mt-1.5">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                    <FiMail className="h-4 w-4" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="name@example.com"
                    className={`block w-full rounded-xl border py-2.5 pr-3.5 pl-10 text-sm text-gray-900 transition-all outline-none placeholder:text-gray-400 ${
                      errors.email && touched.email
                        ? "border-red-400 bg-red-50/20 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                        : "border-gray-200 bg-gray-50/40 focus:border-(--primary) focus:bg-white focus:ring-4 focus:ring-(--primary)/15"
                    }`}
                  />
                </div>
                {errors.email && touched.email && (
                  <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-red-500">
                    <FiAlertCircle className="h-3.5 w-3.5 shrink-0" />
                    <span>{errors.email}</span>
                  </p>
                )}
              </div>

              {/* Password with Eye Icon */}
              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-xs font-semibold uppercase tracking-wider text-gray-700"
                  >
                    Password <span className="text-red-500">*</span>
                  </label>
                  <Link
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      toast("Password reset link will be sent to your email.", {
                        icon: "ℹ️",
                      });
                    }}
                    className="text-xs font-medium text-(--primary) transition-colors hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative mt-1.5">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                    <FiLock className="h-4 w-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter your password"
                    className={`block w-full rounded-xl border py-2.5 pr-11 pl-10 text-sm text-gray-900 transition-all outline-none placeholder:text-gray-400 ${
                      errors.password && touched.password
                        ? "border-red-400 bg-red-50/20 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                        : "border-gray-200 bg-gray-50/40 focus:border-(--primary) focus:bg-white focus:ring-4 focus:ring-(--primary)/15"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400 transition-colors hover:text-gray-700 focus:outline-none"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <FiEyeOff className="h-4 w-4" />
                    ) : (
                      <FiEye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && touched.password && (
                  <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-red-500">
                    <FiAlertCircle className="h-3.5 w-3.5 shrink-0" />
                    <span>{errors.password}</span>
                  </p>
                )}
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex cursor-pointer items-center gap-2 select-none">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-gray-300 text-(--primary) focus:ring-(--primary)"
                  />
                  <span className="text-xs text-gray-600">
                    Remember me
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full items-center justify-center rounded-xl bg-(--primary) py-3 text-sm font-semibold text-white shadow-md shadow-(--primary)/20 transition-all hover:bg-(--primary-hover) active:scale-[0.99] disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      <span>Signing In...</span>
                    </div>
                  ) : (
                    <span>Sign In</span>
                  )}
                </button>
              </div>

              {/* Switch to Signup */}
              <div className="pt-2 text-center">
                <p className="text-sm text-gray-600">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/signup"
                    className="font-semibold text-(--primary) transition-colors hover:underline"
                  >
                    Create Account
                  </Link>
                </p>
              </div>
            </form>
        </div>
      </div>
    </div>
  );
}
