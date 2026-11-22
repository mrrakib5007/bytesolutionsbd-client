"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import EditProfileModal from "@/components/Dashboard/EditProfileModal";
import {
  FiEdit2,
  FiMail,
  FiClock,
  FiCheckCircle,
  FiArrowRight,
} from "react-icons/fi";
import { LuShoppingBag } from "react-icons/lu";
import { FaWhatsapp } from "react-icons/fa6";

export default function UserProfilePage() {
  const { user } = useAuth();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fullWhatsapp = user?.whatsapp || "Not provided";

  return (
    <div className="space-y-6">
      {/* Profile Details Card */}
      <div className="rounded-3xl border border-gray-200/80 bg-white p-6 sm:p-7 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-100 pb-5">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-gray-900">
              Profile Details
            </h2>
            <p className="text-xs text-gray-500">
              Manage your personal credentials, contact info, and security details
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsEditModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-(--primary) hover:bg-(--primary-hover) text-xs font-bold text-white shadow-xs transition-all cursor-pointer"
          >
            <FiEdit2 className="h-3.5 w-3.5" />
            <span>Edit Profile</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
            <span className="text-xs font-medium text-gray-500 block mb-1">
              Full Name
            </span>
            <span className="text-sm font-bold text-gray-900">
              {user?.name || "Not provided"}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
            <span className="text-xs font-medium text-gray-500 mb-1 flex items-center gap-1.5">
              <FiMail className="h-3.5 w-3.5 text-gray-400" />
              Email Address
            </span>
            <span className="text-sm font-bold text-gray-900 truncate block">
              {user?.email || "Not provided"}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
            <span className="text-xs font-medium text-gray-500 mb-1 flex items-center gap-1.5">
              <FaWhatsapp className="h-3.5 w-3.5 text-emerald-600" />
              WhatsApp Number
            </span>
            <span className="text-sm font-bold font-mono text-gray-900">
              {fullWhatsapp}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
            <span className="text-xs font-medium text-gray-500 mb-1 flex items-center gap-1.5">
              <FiClock className="h-3.5 w-3.5 text-gray-400" />
              Account Status
            </span>
            <span className="inline-flex items-center gap-1 text-sm font-bold text-emerald-600">
              <FiCheckCircle className="h-4 w-4" />
              Active
            </span>
          </div>
        </div>
      </div>

      {/* Quick Action Card: Link to Orders */}
      <div className="rounded-3xl border border-emerald-100 bg-linear-to-r from-emerald-50/70 to-green-50/40 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-white shadow-xs border border-emerald-100 text-(--primary)">
            <LuShoppingBag className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900">
              My Orders & Digital Licenses
            </h3>
            <p className="text-xs text-gray-500">
              View your order history, verification status, and access genuine software license keys.
            </p>
          </div>
        </div>

        <Link
          href="/dashboard/orders"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-(--primary) hover:bg-(--primary-hover) text-xs font-bold text-white shadow-xs transition-all cursor-pointer shrink-0 self-start sm:self-auto"
        >
          <span>View My Orders</span>
          <FiArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <EditProfileModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
    </div>
  );
}
