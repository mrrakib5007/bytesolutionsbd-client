"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import Logo from "@/components/Shared/Logo";
import {
  FiUser,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiAlertCircle,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { LuLoader } from "react-icons/lu";



export default function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get("redirect") || "/";
  const { signup } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    whatsapp: "+880",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation function with Regex
  const validateField = (field, value, countryCode = formData.countryCode) => {
    let error = "";

    if (field === "name") {
      const trimmed = value?.trim() || "";
      const nameRegex = /^[a-zA-Z\s.'-]{2,50}$/;
      if (!trimmed) {
        error = "Full Name is required.";
      } else if (!nameRegex.test(trimmed)) {
        error = "Name must be at least 2 characters and contain only letters.";
      }
    }

    if (field === "email") {
      const trimmed = value?.trim() || "";
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!trimmed) {
        error = "Email address is required.";
      } else if (!emailRegex.test(trimmed)) {
        error = "Please enter a valid email address.";
      }
    }

    if (field === "whatsapp") {
      const trimmed = value?.trim() || "";
      if (!trimmed || trimmed === "+" || trimmed === "+880") {
        error = "WhatsApp number is required.";
      } else {
        const cleanNumber = trimmed.replace(/[\s\-()]/g, "");
        const formatted = cleanNumber.startsWith("+")
          ? cleanNumber
          : `+${cleanNumber}`;
        if (!/^\+[1-9]\d{6,14}$/.test(formatted)) {
          error =
            "Please enter a valid WhatsApp number with country code (e.g. +88017XXXXXXXX).";
        }
      }
    }

    if (field === "password") {
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;
      if (!value) {
        error = "Password is required.";
      } else if (!passwordRegex.test(value)) {
        error =
          "Password must be at least 6 characters with at least 1 letter and 1 number.";
      }
    }

    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      const error = validateField(name, value);
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

    // Validate all fields
    const allTouched = {
      name: true,
      email: true,
      whatsapp: true,
      password: true,
    };
    setTouched(allTouched);

    const newErrors = {
      name: validateField("name", formData.name),
      email: validateField("email", formData.email),
      whatsapp: validateField("whatsapp", formData.whatsapp),
      password: validateField("password", formData.password),
    };

    setErrors(newErrors);

    // Check if any error exists
    const hasError = Object.values(newErrors).some((err) => Boolean(err));
    if (hasError) {
      toast.error("Please fill in all required fields correctly.");
      return;
    }

    setIsSubmitting(true);

    try {
      const cleanWa = formData.whatsapp.trim().replace(/[\s\-()]/g, "");
      const fullWa = cleanWa.startsWith("+") ? cleanWa : `+${cleanWa}`;
      const match = fullWa.match(/^(\+\d{1,4})/);
      const extractedCode = match ? match[1] : "+880";

      const res = await signup({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        whatsapp: fullWa,
        countryCode: extractedCode,
      });

      if (res.success) {
        toast.success("Account created successfully!");
        // Reset form
        setFormData({
          name: "",
          whatsapp: "+880",
          email: "",
          password: "",
        });
        setTouched({});
        setErrors({});
        router.push(redirectTarget);
      } else {
        toast.error(res.message || "Failed to register. Please try again.");
      }
    } catch (err) {
      toast.error("Failed to register. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-140px)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg">
        {/* Card Container */}
        <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white p-7 shadow-xl shadow-gray-200/50 sm:p-10">
          {/* Header */}
          <div className="text-center flex flex-col items-center">
            <Logo size="md" className="mb-4" />
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Create an account
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Get genuine licenses, instant delivery & dedicated support
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-4">
            {/* Full Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-xs font-semibold uppercase tracking-wider text-gray-700"
              >
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative mt-1.5">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                  <FiUser className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter your name"
                  className={`block w-full rounded-xl border py-2.5 pr-3.5 pl-10 text-sm text-gray-900 transition-all outline-none placeholder:text-gray-400 ${
                    errors.name && touched.name
                      ? "border-red-400 bg-red-50/20 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                      : "border-gray-200 bg-gray-50/40 focus:border-(--primary) focus:bg-white focus:ring-4 focus:ring-(--primary)/15"
                  }`}
                />
              </div>
              {errors.name && touched.name && (
                <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-red-500">
                  <FiAlertCircle className="h-3.5 w-3.5 shrink-0" />
                  <span>{errors.name}</span>
                </p>
              )}
            </div>

            {/* WhatsApp Number (Single Input with default +880) */}
            <div>
              <label
                htmlFor="whatsapp"
                className="block text-xs font-semibold uppercase tracking-wider text-gray-700"
              >
                WhatsApp Number <span className="text-red-500">*</span>
              </label>
              <div className="relative mt-1.5">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-emerald-600">
                  <FaWhatsapp className="h-4 w-4" />
                </div>
                <input
                  type="tel"
                  id="whatsapp"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="+880 1XXXXXXXXX"
                  className={`block w-full rounded-xl border py-2.5 pr-3.5 pl-10 text-sm font-mono text-gray-900 transition-all outline-none placeholder:text-gray-400 ${
                    errors.whatsapp && touched.whatsapp
                      ? "border-red-400 bg-red-50/20 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                      : "border-gray-200 bg-gray-50/40 focus:border-(--primary) focus:bg-white focus:ring-4 focus:ring-(--primary)/15"
                  }`}
                />
              </div>              
              {errors.whatsapp && touched.whatsapp && (
                <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-red-500">
                  <FiAlertCircle className="h-3.5 w-3.5 shrink-0" />
                  <span>{errors.whatsapp}</span>
                </p>
              )}
            </div>

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
              <label
                htmlFor="password"
                className="block text-xs font-semibold uppercase tracking-wider text-gray-700"
              >
                Password <span className="text-red-500">*</span>
              </label>
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
                  placeholder="At least 6 characters with letter & number"
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
                  aria-label={showPassword ? "Hide password" : "Show password"}
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

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center rounded-xl bg-(--primary) py-3 text-sm font-semibold text-white shadow-md shadow-(--primary)/20 transition-all hover:bg-(--primary-hover) active:scale-[0.99] disabled:opacity-70"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <LuLoader className="h-4 w-4 animate-spin" />
                    <span>Creating Account...</span>
                  </div>
                ) : (
                  <span>Create Account</span>
                )}
              </button>
            </div>

            {/* Switch to Login */}
            <div className="pt-2 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-(--primary) transition-colors hover:underline"
                >
                  Log In
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
