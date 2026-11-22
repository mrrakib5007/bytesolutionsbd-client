"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import UserOrderDetailsModal from "@/components/Dashboard/UserOrderDetailsModal";
import {
  FiPackage,
  FiClock,
  FiCheckCircle,
  FiEye,
  FiAlertCircle,
  FiRefreshCw,
} from "react-icons/fi";
import { LuLoader, LuShoppingBag } from "react-icons/lu";

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  // Initial fetch on mount
  useEffect(() => {
    let ignore = false;

    fetch("http://localhost:5000/api/orders/my-orders", {
      credentials: "include",
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!ignore) {
          if (data?.success && Array.isArray(data.data)) {
            setOrders(data.data);
          }
          setLoadingOrders(false);
        }
      })
      .catch((err) => {
        console.error("Failed to load orders:", err);
        if (!ignore) {
          setLoadingOrders(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const res = await fetch("http://localhost:5000/api/orders/my-orders", {
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok && data.success && Array.isArray(data.data)) {
        setOrders(data.data);
      }
    } catch (err) {
      console.error("Failed to load orders:", err);
    } finally {
      setRefreshing(false);
    }
  };

  const openOrderDetails = (order) => {
    setSelectedOrder(order);
    setIsOrderModalOpen(true);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-gray-900">
            My Orders
          </h2>
          <p className="text-xs text-gray-500">
            View order status, payment verifications, and digital license keys.
          </p>
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          disabled={refreshing}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-(--primary) hover:underline cursor-pointer disabled:opacity-50"
        >
          <FiRefreshCw
            className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`}
          />
          <span>Refresh</span>
        </button>
      </div>

      {loadingOrders ? (
        <div className="rounded-3xl border border-gray-200 bg-white p-12 text-center shadow-xs">
          <LuLoader className="h-6 w-6 animate-spin mx-auto text-(--primary)" />
          <p className="mt-2 text-xs text-gray-500 font-medium">
            Loading your orders...
          </p>
        </div>
      ) : orders.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-12 text-center space-y-3 shadow-xs">
          <div className="inline-flex p-3 rounded-2xl bg-gray-50 border border-gray-200 text-gray-400">
            <LuShoppingBag className="h-8 w-8" />
          </div>
          <h3 className="text-sm font-bold text-gray-900">
            No Orders Placed Yet
          </h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            You have not purchased any licenses or software subscriptions yet. Explore our genuine tools and creative assets at the best price.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-(--primary) hover:bg-(--primary-hover) text-xs font-bold text-white transition-all cursor-pointer"
          >
            <FiPackage className="h-4 w-4" />
            <span>Browse Products</span>
          </Link>
        </div>
      ) : (
        <>
          {/* Mobile Cards View (< lg screens) */}
          <div className="block lg:hidden space-y-3">
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
                <div
                  key={order._id || order.orderId}
                  className="rounded-2xl border border-gray-200/90 bg-white p-4 shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                    <div>
                      <div className="font-mono font-bold text-xs text-gray-900">
                        {order.orderId}
                      </div>
                      <div className="text-[10px] text-gray-400 mt-0.5">
                        {formattedDate}
                      </div>
                    </div>

                    <div>
                      {isCompleted && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                          <FiCheckCircle className="h-3 w-3" /> Completed
                        </span>
                      )}
                      {isPending && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                          <FiClock className="h-3 w-3" /> Pending
                        </span>
                      )}
                      {isCancelled && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-bold text-red-700">
                          <FiAlertCircle className="h-3 w-3" /> Cancelled
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-xs space-y-1.5">
                    {order.items?.map((it, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col items-start gap-1 bg-gray-50 p-2.5 rounded-lg text-xs"
                      >
                        <span className="font-semibold text-gray-900 leading-snug">
                          {it.productTitle || it.title}
                        </span>
                        <span className="inline-flex items-center text-[10px] bg-white border border-gray-200 px-2 py-0.5 rounded text-gray-700 font-mono font-medium whitespace-nowrap">
                          {it.duration} × {it.quantity || 1}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <div>
                      <span className="text-[10px] text-gray-400 block">
                        Total Amount
                      </span>
                      <span className="font-mono font-bold text-gray-950">
                        ৳ {order.totalAmount?.toFixed(2)}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => openOrderDetails(order)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-(--primary) text-white font-bold text-xs shadow-2xs hover:bg-(--primary-hover) transition-all cursor-pointer"
                    >
                      <FiEye className="h-3.5 w-3.5" />
                      <span>{isCompleted ? "View Key" : "Details"}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop Table View (>= lg screens) */}
          <div className="hidden lg:block rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-xs">
            <div className="w-full overflow-hidden">
              <table className="w-full text-left text-xs text-gray-600 border-collapse table-fixed">
                <colgroup>
                  <col className="w-[15%]" />
                  <col className="w-[23%]" />
                  <col className="w-[12%]" />
                  <col className="w-[12%]" />
                  <col className="w-[10%]" />
                  <col className="w-[20%]" />
                </colgroup>
                <thead className="bg-gray-50 text-[11px] font-bold uppercase tracking-wider text-gray-500 border-b border-gray-200">
                  <tr>
                    <th className="px-5 py-3 whitespace-nowrap">Order ID</th>
                    <th className="px-5 py-3 whitespace-nowrap">Items</th>
                    <th className="px-5 py-3 whitespace-nowrap">Payment</th>
                    <th className="px-5 py-3 whitespace-nowrap">Total Amount</th>
                    <th className="px-5 py-3 whitespace-nowrap">Status</th>
                    <th className="px-5 py-3 text-right whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map((order) => {
                    const isCompleted = order.orderStatus === "completed";
                    const isPending = order.orderStatus === "pending";
                    const isCancelled = order.orderStatus === "cancelled";

                    return (
                      <tr
                        key={order._id || order.orderId}
                        className="hover:bg-gray-50/50"
                      >
                        <td className="px-5 py-3.5 whitespace-nowrap align-middle">
                          <div
                            className="font-mono font-bold text-gray-900 whitespace-nowrap truncate"
                            title={order.orderId}
                          >
                            {order.orderId}
                          </div>
                          <div className="text-[10px] text-gray-400 whitespace-nowrap mt-0.5">
                            {order.createdAt
                              ? new Date(order.createdAt).toLocaleDateString("en-GB", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })
                              : "N/A"}
                          </div>
                        </td>
                        <td className="px-5 py-3.5 align-middle">
                          <div className="space-y-1.5">
                            {order.items?.map((it, idx) => (
                              <div
                                key={idx}
                                className="flex flex-col items-start gap-0.5"
                              >
                                <span
                                  className="font-semibold text-gray-900 leading-snug line-clamp-1 text-xs"
                                  title={it.productTitle || it.title}
                                >
                                  {it.productTitle || it.title}
                                </span>
                                <span className="inline-flex items-center text-[10px] bg-gray-100 border border-gray-200/90 px-1.5 py-0.5 rounded text-gray-600 font-mono font-medium whitespace-nowrap">
                                  {it.duration} × {it.quantity || 1}
                                </span>
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="px-5 py-3.5 whitespace-nowrap align-middle">
                          <span className="font-bold uppercase text-gray-800 text-[11px]">
                            {order.payment?.method}
                          </span>
                          <div
                            className="font-mono text-[10px] text-gray-400 truncate max-w-30"
                            title={order.payment?.trxId}
                          >
                            {order.payment?.trxId}
                          </div>
                        </td>
                        <td className="px-5 py-3.5 font-bold font-mono text-gray-950 whitespace-nowrap align-middle">
                          ৳ {order.totalAmount?.toFixed(2)}
                        </td>
                        <td className="px-5 py-3.5 whitespace-nowrap align-middle">
                          {isCompleted && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200/60 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 whitespace-nowrap">
                              <FiCheckCircle className="h-3 w-3" />
                              Completed
                            </span>
                          )}
                          {isPending && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200/60 px-2.5 py-0.5 text-[10px] font-bold text-amber-700 whitespace-nowrap">
                              <FiClock className="h-3 w-3" />
                              Pending
                            </span>
                          )}
                          {isCancelled && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-red-50 border border-red-200/60 px-2.5 py-0.5 text-[10px] font-bold text-red-700 whitespace-nowrap">
                              <FiAlertCircle className="h-3 w-3" />
                              Cancelled
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-3.5 text-right whitespace-nowrap align-middle">
                          <button
                            type="button"
                            onClick={() => openOrderDetails(order)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-[11px] font-bold text-gray-800 transition-colors shadow-2xs cursor-pointer whitespace-nowrap"
                          >
                            <FiEye className="h-3 w-3 text-(--primary)" />
                            <span>{isCompleted ? "View Key" : "Details"}</span>
                          </button>
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

      {/* User Order Details & Key Modal */}
      {isOrderModalOpen && selectedOrder && (
        <UserOrderDetailsModal
          isOpen={isOrderModalOpen}
          order={selectedOrder}
          onClose={() => {
            setIsOrderModalOpen(false);
            setSelectedOrder(null);
          }}
        />
      )}
    </div>
  );
}
