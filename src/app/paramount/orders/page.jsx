"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import OrderFulfillModal from "./OrderFulfillModal";
import {
  FiShoppingBag,
  FiSearch,
  FiRefreshCw,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiEdit3,
  FiTrash2,
  FiEye,
  FiKey,
} from "react-icons/fi";
import { LuLoader } from "react-icons/lu";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all"); // "all" | "pending" | "completed" | "cancelled"
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      let url = `http://localhost:5000/api/admin/orders?status=${activeFilter}`;
      if (searchQuery.trim()) {
        url += `&search=${encodeURIComponent(searchQuery.trim())}`;
      }

      const res = await fetch(url, {
        credentials: "include",
      });

      const data = await res.json();
      if (res.ok && data.success && Array.isArray(data.data)) {
        setOrders(data.data);
      } else {
        toast.error(data.message || "Failed to load orders");
      }
    } catch (err) {
      console.error("Failed to load orders:", err);
      toast.error("Network error while loading orders.");
    } finally {
      setLoading(false);
    }
  }, [activeFilter, searchQuery]);

  useEffect(() => {
    let active = true;
    const loadOrdersOnFilter = async () => {
      try {
        let url = `http://localhost:5000/api/admin/orders?status=${activeFilter}`;
        if (searchQuery.trim()) {
          url += `&search=${encodeURIComponent(searchQuery.trim())}`;
        }
        const res = await fetch(url, { credentials: "include" });
        const data = await res.json();
        if (active && res.ok && data.success && Array.isArray(data.data)) {
          setOrders(data.data);
        }
      } catch (err) {
        console.error("Failed to load orders:", err);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadOrdersOnFilter();
    return () => {
      active = false;
    };
  }, [activeFilter, searchQuery]);

  const handleOpenFulfill = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleOrderUpdated = (updatedOrder) => {
    setOrders((prev) =>
      prev.map((o) => (o._id === updatedOrder._id ? updatedOrder : o))
    );
  };

  const handleDeleteOrder = async (orderId) => {
    if (!confirm("Are you sure you want to permanently delete this order?")) {
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/admin/orders/${orderId}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();

      if (res.ok && data.success) {
        toast.success("Order deleted successfully");
        setOrders((prev) => prev.filter((o) => o._id !== orderId));
      } else {
        toast.error(data.message || "Failed to delete order");
      }
    } catch (err) {
      console.error("Delete order error:", err);
      toast.error("Failed to delete order.");
    }
  };

  // Counts for tabs
  const pendingCount = orders.filter((o) => o.orderStatus === "pending").length;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-gray-900">
            Order Management & Licenses
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Review bKash / Nagad payments, approve orders, and deliver license keys or account credentials.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchOrders}
          className="inline-flex items-center gap-1.5 self-start sm:self-auto px-4 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-bold text-gray-700 shadow-2xs transition-colors cursor-pointer"
        >
          <FiRefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filters & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-gray-200/80 shadow-2xs">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: "all", label: "All Orders" },
            { id: "pending", label: "Pending", count: pendingCount },
            { id: "completed", label: "Completed" },
            { id: "cancelled", label: "Cancelled" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveFilter(tab.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeFilter === tab.id
                  ? "bg-(--primary) text-white shadow-xs"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <span>{tab.label}</span>
              {typeof tab.count === "number" && tab.count > 0 && (
                <span className="bg-amber-500 text-white px-1.5 py-0.2 rounded-full text-[10px]">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Order ID, TrxID, Email..."
            className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-(--primary) outline-none transition-all"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-16 text-center">
            <LuLoader className="h-7 w-7 animate-spin mx-auto text-(--primary)" />
            <p className="mt-2 text-xs font-medium text-gray-500">Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <div className="inline-flex p-3 rounded-2xl bg-gray-50 border border-gray-200 text-gray-400">
              <FiShoppingBag className="h-7 w-7" />
            </div>
            <h3 className="text-sm font-bold text-gray-900">No Orders Found</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              There are currently no orders matching your selected status filter or search query.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-600">
              <thead className="bg-gray-50 text-[11px] font-bold uppercase tracking-wider text-gray-500 border-b border-gray-200">
                <tr>
                  <th className="px-5 py-3.5">Order ID & Date</th>
                  <th className="px-5 py-3.5">Customer</th>
                  <th className="px-5 py-3.5">Items</th>
                  <th className="px-5 py-3.5">Payment Verification</th>
                  <th className="px-5 py-3.5">Amount</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((order) => {
                  const isCompleted = order.orderStatus === "completed";
                  const isPending = order.orderStatus === "pending";
                  const isCancelled = order.orderStatus === "cancelled";

                  const formattedDate = order.createdAt
                    ? new Date(order.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "N/A";

                  return (
                    <tr key={order._id} className="hover:bg-gray-50/60 transition-colors">
                      {/* Order ID & Date */}
                      <td className="px-5 py-3.5">
                        <div className="font-mono font-bold text-gray-900">
                          {order.orderId}
                        </div>
                        <div className="text-[11px] text-gray-400">
                          {formattedDate}
                        </div>
                      </td>

                      {/* Customer */}
                      <td className="px-5 py-3.5">
                        <div className="font-bold text-gray-900 truncate max-w-[150px]">
                          {order.customer?.name}
                        </div>
                        <div className="text-[11px] text-gray-500 truncate max-w-[150px]">
                          {order.customer?.email}
                        </div>
                        <div className="font-mono text-[10px] text-gray-400">
                          {order.customer?.whatsapp || ""}
                        </div>
                      </td>

                      {/* Items */}
                      <td className="px-5 py-3.5">
                        <div className="space-y-1">
                          {order.items?.map((it, idx) => (
                            <div key={idx} className="flex items-center gap-1.5 text-xs text-gray-800">
                              <span className="font-medium truncate max-w-[160px]">
                                {it.title}
                              </span>
                              <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-600 font-mono">
                                {it.duration}
                              </span>
                            </div>
                          ))}
                        </div>
                      </td>

                      {/* Payment Verification */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold uppercase text-gray-900">
                            {order.payment?.method}
                          </span>
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                              order.payment?.status === "verified"
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-amber-50 text-amber-700"
                            }`}
                          >
                            {order.payment?.status === "verified" ? "Verified" : "Unverified"}
                          </span>
                        </div>
                        <div className="font-mono text-[11px] font-bold text-emerald-700 mt-0.5">
                          TrxID: {order.payment?.trxId}
                        </div>
                        <div className="font-mono text-[10px] text-gray-400">
                          From: {order.payment?.senderNumber}
                        </div>
                      </td>

                      {/* Total Amount */}
                      <td className="px-5 py-3.5 font-bold font-mono text-gray-950">
                        ৳ {order.totalAmount?.toFixed(2)}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-3.5">
                        {isCompleted && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700">
                            <FiCheckCircle className="h-3 w-3" />
                            Completed
                          </span>
                        )}
                        {isPending && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-bold text-amber-700">
                            <FiClock className="h-3 w-3" />
                            Pending
                          </span>
                        )}
                        {isCancelled && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-0.5 text-[11px] font-bold text-red-700">
                            <FiAlertCircle className="h-3 w-3" />
                            Cancelled
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3.5 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenFulfill(order)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-(--primary) hover:bg-(--primary-hover) text-[11px] font-bold text-white shadow-2xs transition-all cursor-pointer"
                            title="Manage & Deliver License"
                          >
                            <FiKey className="h-3 w-3" />
                            <span>{isCompleted ? "Edit License" : "Deliver"}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteOrder(order._id)}
                            className="p-1.5 rounded-lg border border-gray-200 text-gray-400 hover:text-red-600 hover:border-red-200 transition-colors cursor-pointer"
                            title="Delete Order"
                          >
                            <FiTrash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Fulfill & Delivery Modal */}
      {isModalOpen && selectedOrder && (
        <OrderFulfillModal
          isOpen={isModalOpen}
          order={selectedOrder}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedOrder(null);
          }}
          onOrderUpdated={handleOrderUpdated}
        />
      )}
    </div>
  );
}
