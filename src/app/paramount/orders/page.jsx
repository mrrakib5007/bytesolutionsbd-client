"use client";

import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import OrderFulfillModal from "./OrderFulfillModal";
import AdminOrderViewModal from "./AdminOrderViewModal";
import {
  FiShoppingBag,
  FiSearch,
  FiRefreshCw,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiEdit3,
  FiEye,
} from "react-icons/fi";
import { LuLoader } from "react-icons/lu";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all"); // "all" | "pending" | "completed" | "cancelled"
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // Format date and time in Bangladesh Dhaka Time (Asia/Dhaka)
  const formatDhakaDateTime = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("en-GB", {
      timeZone: "Asia/Dhaka",
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

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

  const handleOpenView = (order) => {
    setSelectedOrder(order);
    setIsViewModalOpen(true);
  };

  const handleOrderUpdated = (updatedOrder) => {
    setOrders((prev) =>
      prev.map((o) => (o._id === updatedOrder._id ? updatedOrder : o))
    );
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
        <div className="relative min-w-60">
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

      {/* Orders Container: Mobile Cards (< md) + Desktop Table (>= md) */}
      {loading ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-16 text-center shadow-xs">
          <LuLoader className="h-7 w-7 animate-spin mx-auto text-(--primary)" />
          <p className="mt-2 text-xs font-medium text-gray-500">Loading orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-16 text-center space-y-3 shadow-xs">
          <div className="inline-flex p-3 rounded-2xl bg-gray-50 border border-gray-200 text-gray-400">
            <FiShoppingBag className="h-7 w-7" />
          </div>
          <h3 className="text-sm font-bold text-gray-900">No Orders Found</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            There are currently no orders matching your selected status filter or search query.
          </p>
        </div>
      ) : (
        <>
          {/* Card View (< xl: mobile, tablet, and compact laptop screens - ZERO horizontal scroll & ZERO broken text) */}
          <div className="block xl:hidden space-y-4">
            {orders.map((order) => {
              const isCompleted = order.orderStatus === "completed";
              const isPending = order.orderStatus === "pending";
              const isCancelled = order.orderStatus === "cancelled";

              return (
                <div
                  key={order._id}
                  className="rounded-2xl border border-gray-200/90 bg-white p-4 sm:p-5 shadow-xs space-y-4 hover:border-gray-300 transition-all"
                >
                  {/* Top Bar: Order ID, Date, Status, Total, Actions */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3.5">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="font-mono font-bold text-xs bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-lg text-gray-900 whitespace-nowrap">
                        {order.orderId}
                      </span>
                      <span className="text-[11px] text-gray-400 whitespace-nowrap">
                        {formatDhakaDateTime(order.createdAt)}
                      </span>

                      {isCompleted && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 whitespace-nowrap">
                          <FiCheckCircle className="h-3 w-3" />
                          Completed
                        </span>
                      )}
                      {isPending && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold text-amber-700 whitespace-nowrap">
                          <FiClock className="h-3 w-3" />
                          Pending
                        </span>
                      )}
                      {isCancelled && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-0.5 text-[10px] font-bold text-red-700 whitespace-nowrap">
                          <FiAlertCircle className="h-3 w-3" />
                          Cancelled
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-50">
                      <div className="text-left sm:text-right">
                        <span className="text-[10px] text-gray-400 block uppercase font-bold">
                          Total Paid
                        </span>
                        <span className="font-mono font-extrabold text-sm text-gray-950 whitespace-nowrap">
                          ৳ {order.totalAmount?.toFixed(2)}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleOpenView(order)}
                          className="p-2 rounded-xl border border-gray-200 text-gray-600 hover:text-emerald-700 hover:border-emerald-300 hover:bg-emerald-50/70 transition-all cursor-pointer"
                          title="View Order Details"
                        >
                          <FiEye className="h-4 w-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenFulfill(order)}
                          className="p-2 rounded-xl bg-(--primary) hover:bg-(--primary-hover) text-white shadow-2xs transition-all cursor-pointer"
                          title={isCompleted ? "Edit License" : "Deliver License"}
                        >
                          <FiEdit3 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Info Grid: 3 Clean Columns on sm+, 1 on mobile */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    {/* Col 1: Customer (Name & Email only) */}
                    <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 space-y-0.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                        Customer
                      </span>
                      <p className="font-bold text-gray-900 truncate" title={order.customer?.name}>
                        {order.customer?.name}
                      </p>
                      <p className="text-[11px] text-gray-500 truncate" title={order.customer?.email}>
                        {order.customer?.email}
                      </p>
                    </div>

                    {/* Col 2: Products */}
                    <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 space-y-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                        Ordered Products
                      </span>
                      {order.items?.map((it, idx) => (
                        <div key={idx} className="flex flex-col items-start gap-1 bg-white border border-gray-200/80 p-2.5 rounded-lg text-xs">
                          <span className="font-semibold text-gray-900 leading-snug">{it.title}</span>
                          <span className="inline-flex items-center font-mono text-[10px] bg-gray-50 border border-gray-200 px-2 py-0.5 rounded text-gray-700 whitespace-nowrap">
                            {it.duration} × {it.quantity}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Col 3: Payment Verification (1 line: number(trxId)) */}
                    <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 space-y-1 text-xs">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                        Payment
                      </span>
                      <div className="font-bold uppercase text-gray-900 text-xs">
                        {order.payment?.method || "bKash"}
                      </div>
                      <div
                        className="font-mono text-[11px] text-gray-600 truncate"
                        title={order.payment?.senderNumber ? `${order.payment.senderNumber}(${order.payment.trxId || ""})` : order.payment?.trxId || "N/A"}
                      >
                        {order.payment?.senderNumber
                          ? `${order.payment.senderNumber}(${order.payment?.trxId || ""})`
                          : order.payment?.trxId || "N/A"}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop Table View (>= xl: Large wide desktop screens only - zero right side scrolling) */}
          <div className="hidden xl:block rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-xs">
            <div className="w-full overflow-hidden">
              <table className="w-full text-left text-xs text-gray-600 border-collapse table-fixed">
                <colgroup>
                  <col className="w-[15%]" />
                  <col className="w-[16%]" />
                  <col className="w-[21%]" />
                  <col className="w-[17%]" />
                  <col className="w-[9%]" />
                  <col className="w-[11%]" />
                  <col className="w-[11%]" />
                </colgroup>
                <thead className="bg-gray-50 text-[11px] font-bold uppercase tracking-wider text-gray-500 border-b border-gray-200">
                  <tr>
                    <th className="w-[15%] px-3.5 py-3.5 whitespace-nowrap">Order ID & Date</th>
                    <th className="w-[16%] px-3.5 py-3.5 whitespace-nowrap">Customer</th>
                    <th className="w-[21%] px-3.5 py-3.5 whitespace-nowrap">Items</th>
                    <th className="w-[17%] px-3.5 py-3.5 whitespace-nowrap">Payment Verification</th>
                    <th className="w-[9%] px-3.5 py-3.5 whitespace-nowrap">Amount</th>
                    <th className="w-[11%] px-3.5 py-3.5 text-center whitespace-nowrap">Status</th>
                    <th className="w-[11%] px-3.5 py-3.5 text-right whitespace-nowrap pr-5">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map((order) => {
                    const isCompleted = order.orderStatus === "completed";
                    const isPending = order.orderStatus === "pending";
                    const isCancelled = order.orderStatus === "cancelled";

                    return (
                      <tr key={order._id} className="hover:bg-gray-50/60 transition-colors">
                        {/* Order ID & Date (Dhaka Time) */}
                        <td className="w-[15%] px-3.5 py-3.5 whitespace-nowrap align-middle">
                          <div className="font-mono font-bold text-gray-900 tracking-tight whitespace-nowrap truncate" title={order.orderId}>
                            {order.orderId}
                          </div>
                          <div className="text-[11px] text-gray-400 whitespace-nowrap mt-0.5">
                            {formatDhakaDateTime(order.createdAt)}
                          </div>
                        </td>

                        {/* Customer (Name & Email only) */}
                        <td className="w-[16%] px-3.5 py-3.5 align-middle">
                          <div className="font-bold text-gray-900 truncate" title={order.customer?.name}>
                            {order.customer?.name}
                          </div>
                          <div className="text-[11px] text-gray-500 truncate" title={order.customer?.email}>
                            {order.customer?.email}
                          </div>
                        </td>

                        {/* Items - 2 Lines: Product Name on Top, Duration × Qty Badge Underneath */}
                        <td className="w-[21%] px-3.5 py-3.5 align-middle">
                          <div className="space-y-1.5">
                            {order.items?.map((it, idx) => (
                              <div key={idx} className="flex flex-col items-start gap-0.5">
                                <span className="font-semibold text-gray-900 leading-snug text-xs line-clamp-1" title={it.title}>
                                  {it.title}
                                </span>
                                <span className="inline-flex items-center text-[10px] bg-gray-100 border border-gray-200/90 px-1.5 py-0.5 rounded text-gray-600 font-mono font-medium whitespace-nowrap">
                                  {it.duration} × {it.quantity}
                                </span>
                              </div>
                            ))}
                          </div>
                        </td>

                        {/* Payment Verification (Method name + 1-line: 01834923304(A34923304)) */}
                        <td className="w-[17%] px-3.5 py-3.5 align-middle">
                          <span className="font-bold uppercase text-gray-900 text-xs">
                            {order.payment?.method || "bKash"}
                          </span>
                          <div
                            className="font-mono text-[11px] text-gray-600 mt-0.5 truncate"
                            title={order.payment?.senderNumber ? `${order.payment.senderNumber}(${order.payment.trxId || ""})` : order.payment?.trxId || "N/A"}
                          >
                            {order.payment?.senderNumber
                              ? `${order.payment.senderNumber}(${order.payment?.trxId || ""})`
                              : order.payment?.trxId || "N/A"}
                          </div>
                        </td>

                        {/* Total Amount */}
                        <td className="w-[9%] px-3.5 py-3.5 font-bold font-mono text-gray-950 whitespace-nowrap align-middle">
                          ৳ {order.totalAmount?.toFixed(2)}
                        </td>

                        {/* Status */}
                        <td className="w-[11%] px-3.5 py-3.5 text-center whitespace-nowrap align-middle">
                          <div className="flex items-center justify-center">
                            {isCompleted && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200/60 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 whitespace-nowrap">
                                <FiCheckCircle className="h-3 w-3 shrink-0" />
                                Completed
                              </span>
                            )}
                            {isPending && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200/60 px-2.5 py-0.5 text-[10px] font-bold text-amber-700 whitespace-nowrap">
                                <FiClock className="h-3 w-3 shrink-0" />
                                Pending
                              </span>
                            )}
                            {isCancelled && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-red-50 border border-red-200/60 px-2.5 py-0.5 text-[10px] font-bold text-red-700 whitespace-nowrap">
                                <FiAlertCircle className="h-3 w-3 shrink-0" />
                                Cancelled
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Actions (View & Edit icons only, delete removed) */}
                        <td className="w-[11%] px-3.5 py-3.5 text-right whitespace-nowrap align-middle pr-5">
                          <div className="inline-flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleOpenView(order)}
                              className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:text-emerald-700 hover:border-emerald-300 hover:bg-emerald-50/70 transition-all cursor-pointer"
                              title="View Full Details"
                            >
                              <FiEye className="h-3.5 w-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleOpenFulfill(order)}
                              className="p-1.5 rounded-lg bg-(--primary) hover:bg-(--primary-hover) text-white shadow-2xs transition-all cursor-pointer"
                              title={isCompleted ? "Edit License" : "Deliver License"}
                            >
                              <FiEdit3 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Order Details View Modal */}
      {isViewModalOpen && selectedOrder && (
        <AdminOrderViewModal
          isOpen={isViewModalOpen}
          order={selectedOrder}
          onClose={() => {
            setIsViewModalOpen(false);
            setSelectedOrder(null);
          }}
          onOpenFulfill={handleOpenFulfill}
        />
      )}

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
