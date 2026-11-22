"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import RoleGuard from "@/components/Auth/RoleGuard";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiCopy,
  FiCheck,
  FiCheckCircle,
  FiLock,
  FiArrowRight,
  FiInfo,
  FiCreditCard,
} from "react-icons/fi";
import { LuLoader, LuShoppingBag } from "react-icons/lu";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Fallback payment accounts if offline or loading
const FALLBACK_PAYMENT_METHODS = [
  {
    _id: "bkash-default",
    name: "bKash",
    type: "personal",
    typeLabel: "Personal (Send Money)",
    number: "01834923304",
    color: "#E2136E",
    logo: "https://i.ibb.co.com/k6FkHh7/bkash.png",
    instructions:
      "1. Open your bKash Mobile App or dial *247#.\n2. Choose 'Send Money' option.\n3. Enter our bKash Personal Number: 01834923304.\n4. Enter the exact Total Order Amount.\n5. Enter reference (e.g., your name or order).\n6. Enter your PIN to confirm the transaction.\n7. Copy the Transaction ID (TrxID) and enter it below.",
    isActive: true,
  },
  {
    _id: "nagad-default",
    name: "Nagad",
    type: "personal",
    typeLabel: "Personal (Send Money)",
    number: "01834923304",
    color: "#F7931E",
    logo: "https://i.ibb.co.com/ycfgs7BG/nagad.png",
    instructions:
      "1. Open your Nagad Mobile App or dial *167#.\n2. Choose 'Send Money' option.\n3. Enter our Nagad Personal Number: 01834923304.\n4. Enter the exact Total Order Amount.\n5. Enter reference (e.g., your name or order).\n6. Enter your PIN to confirm the transaction.\n7. Copy the Transaction ID (TrxID) and enter it below.",
    isActive: true,
  },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { cartItems, subtotal, clearCart } = useCart();

  const [paymentMethods, setPaymentMethods] = useState(FALLBACK_PAYMENT_METHODS);
  const [selectedMethodId, setSelectedMethodId] = useState(
    FALLBACK_PAYMENT_METHODS[0]?._id || "bkash-default"
  );
  const [loadingMethods, setLoadingMethods] = useState(true);

  const [senderNumber, setSenderNumber] = useState("");
  const [trxId, setTrxId] = useState("");
  const [customerNote, setCustomerNote] = useState("");
  const [copiedNumber, setCopiedNumber] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch active payment methods from server
  useEffect(() => {
    let ignore = false;

    fetch(`${API_BASE_URL}/payment-methods`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!ignore && data?.success && Array.isArray(data.data) && data.data.length > 0) {
          setPaymentMethods(data.data);
          setSelectedMethodId(data.data[0]._id);
        }
      })
      .catch((err) => {
        console.error("Fetch payment methods error:", err);
      })
      .finally(() => {
        if (!ignore) {
          setLoadingMethods(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  const activePayment =
    paymentMethods.find((m) => m._id === selectedMethodId) ||
    paymentMethods[0] ||
    FALLBACK_PAYMENT_METHODS[0];

  const handleCopyNumber = () => {
    if (!activePayment?.number) return;
    navigator.clipboard.writeText(activePayment.number);
    setCopiedNumber(true);
    toast.success(`${activePayment.name} number copied to clipboard!`);
    setTimeout(() => setCopiedNumber(false), 2500);
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!cartItems || cartItems.length === 0) {
      toast.error("Your cart is empty. Please add products first.");
      return;
    }

    if (!senderNumber.trim()) {
      toast.error("Please enter your sender mobile number.");
      return;
    }

    if (!trxId.trim()) {
      toast.error("Please enter your payment Transaction ID (TrxID).");
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare payload - only sending product references, variant, and quantity
      // The server independently verifies prices from MongoDB
      const payload = {
        items: cartItems.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          duration: item.duration,
          quantity: item.quantity,
        })),
        payment: {
          method: activePayment.name,
          senderNumber: senderNumber.trim(),
          trxId: trxId.trim().toUpperCase(),
        },
        customerNote: customerNote.trim(),
      };

      const res = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success("Order placed successfully! We are reviewing your payment.");
        clearCart();
        router.push("/dashboard/orders");
      } else {
        toast.error(data.message || "Failed to place order. Please try again.");
      }
    } catch (err) {
      console.error("Order submission error:", err);
      toast.error("Network error while placing order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <RoleGuard allowedRoles={["user", "admin"]}>
      <div className="min-h-screen bg-slate-50/50 py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Secure Checkout & Payment
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-gray-500">
              Complete payment via your preferred payment method to receive your software license instantly.
            </p>
          </div>

          {cartItems.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-12 text-center shadow-xs max-w-xl mx-auto space-y-4">
              <div className="inline-flex p-4 rounded-2xl bg-gray-50 border border-gray-200 text-gray-400">
                <LuShoppingBag className="h-10 w-10" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">
                Your Cart is Empty
              </h2>
              <p className="text-xs text-gray-500">
                You haven&apos;t added any software licenses or digital products to your cart yet.
              </p>
              <div>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 rounded-xl bg-(--primary) px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-(--primary-hover) transition-all cursor-pointer"
                >
                  <span>Browse Products</span>
                  <FiArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handlePlaceOrder}>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left Column: Customer Details & Payment (7 Cols) */}
                <div className="lg:col-span-7 space-y-6">
                  {/* Card 1: Customer Profile Confirmation */}
                  <div className="rounded-3xl border border-gray-200/80 bg-white p-6 shadow-xs">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                          <FiUser className="h-4 w-4" />
                        </div>
                        <div>
                          <h2 className="text-sm font-bold text-gray-900">
                            Customer Information
                          </h2>
                          <p className="text-xs text-gray-500">
                            License keys and confirmation will be bound to this account
                          </p>
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
                        <FiCheckCircle className="h-3 w-3" />
                        Authenticated
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                        <span className="text-gray-400 block mb-0.5">Name</span>
                        <span className="font-bold text-gray-900 truncate block">
                          {user?.name || "Customer"}
                        </span>
                      </div>
                      <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                        <span className="text-gray-400 mb-0.5 flex items-center gap-1">
                          <FiMail className="h-3 w-3" /> Email
                        </span>
                        <span className="font-bold text-gray-900 truncate block">
                          {user?.email}
                        </span>
                      </div>
                      <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                        <span className="text-gray-400 mb-0.5 flex items-center gap-1">
                          <FiPhone className="h-3 w-3" /> WhatsApp
                        </span>
                        <span className="font-bold font-mono text-gray-900 truncate block">
                          {user?.whatsapp || "Not set"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Dynamic Payment Methods */}
                  <div className="rounded-3xl border border-gray-200/80 bg-white p-6 shadow-xs">
                    <div className="flex items-center gap-2.5 border-b border-gray-100 pb-4 mb-4">
                      <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
                        <FiLock className="h-4 w-4" />
                      </div>
                      <div>
                        <h2 className="text-sm font-bold text-gray-900">
                          Payment Method ({activePayment?.name || "Select Gateway"})
                        </h2>
                        <p className="text-xs text-gray-500">
                          Send payment to our verified account and enter transaction details below
                        </p>
                      </div>
                    </div>

                    {/* Dynamic Method Tabs */}
                    {loadingMethods ? (
                      <div className="py-6 flex items-center justify-center gap-2 text-xs text-gray-400">
                        <LuLoader className="h-4 w-4 animate-spin text-(--primary)" />
                        <span>Loading available payment methods...</span>
                      </div>
                    ) : paymentMethods.length === 0 ? (
                      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs mb-5">
                        No active payment methods currently available. Please contact store support.
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2.5 mb-5">
                        {paymentMethods.map((method) => {
                          const isSelected = method._id === activePayment?._id;
                          const brandColor = method.color || "#10B981";

                          return (
                            <button
                              key={method._id}
                              type="button"
                              onClick={() => setSelectedMethodId(method._id)}
                              className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl border-2 transition-all cursor-pointer font-bold text-xs ${
                                isSelected
                                  ? "shadow-xs ring-1"
                                  : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                              }`}
                              style={
                                isSelected
                                  ? {
                                      borderColor: brandColor,
                                      backgroundColor: `${brandColor}0D`,
                                      color: brandColor,
                                      ringColor: `${brandColor}40`,
                                    }
                                  : {}
                              }
                            >
                              {method.logo ? (
                                <span className="relative h-5 w-6 shrink-0 flex items-center justify-center">
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={method.logo}
                                    alt={method.name}
                                    className="max-h-full max-w-full object-contain"
                                  />
                                </span>
                              ) : (
                                <span
                                  className="h-2.5 w-2.5 rounded-full shrink-0"
                                  style={{ backgroundColor: brandColor }}
                                />
                              )}
                              <span>{method.name}</span>
                              
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Number Display Box */}
                    <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                          {activePayment.name} {activePayment.typeLabel || activePayment.type || ""}
                        </span>
                        <div className="text-xl font-mono font-extrabold text-gray-900 tracking-wider mt-0.5">
                          {activePayment.number}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleCopyNumber}
                        className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-gray-300 text-xs font-bold text-gray-800 shadow-xs hover:bg-gray-100 transition-colors cursor-pointer"
                      >
                        {copiedNumber ? (
                          <>
                            <FiCheck className="h-3.5 w-3.5 text-emerald-600" />
                            <span className="text-emerald-700">Copied!</span>
                          </>
                        ) : (
                          <>
                            <FiCopy className="h-3.5 w-3.5 text-gray-500" />
                            <span>Copy Number</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Instructions */}
                    <div className="mb-6 p-4 rounded-2xl bg-blue-50/70 border border-blue-100 text-blue-900 text-xs space-y-2">
                      <div className="font-bold flex items-center gap-1.5 text-blue-950">
                        <FiInfo className="h-3.5 w-3.5 text-blue-600" /> How to Pay ({activePayment.name}):
                      </div>
                      {activePayment.instructions ? (
                        <div className="text-blue-900 whitespace-pre-line leading-relaxed font-sans text-xs">
                          {activePayment.instructions}
                        </div>
                      ) : (
                        <ol className="list-decimal list-inside space-y-1 text-blue-800">
                          <li>Open your <strong>{activePayment.name}</strong> App or dial USSD code.</li>
                          <li>Select <strong>{activePayment.typeLabel || "Send Money"}</strong> and paste the number: <code className="font-mono bg-blue-100 px-1 rounded">{activePayment.number}</code>.</li>
                          <li>Enter the exact total amount: <strong className="font-mono">৳{subtotal.toFixed(2)}</strong>.</li>
                          <li>Complete the transaction and copy the <strong>TrxID</strong>.</li>
                        </ol>
                      )}
                    </div>

                    {/* Form Fields: Sender Number & TrxID */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-900 mb-1.5">
                          Your Sender {activePayment.name} Number / Account <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          required
                          value={senderNumber}
                          onChange={(e) => setSenderNumber(e.target.value)}
                          placeholder="e.g. 017XXXXXXXX"
                          className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs text-gray-900 focus:border-(--primary) focus:ring-1 focus:ring-(--primary) outline-none transition-all"
                        />
                        <p className="mt-1 text-[11px] text-gray-400">
                          The account or mobile number you sent the money from.
                        </p>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-900 mb-1.5">
                          Transaction ID (TrxID) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={trxId}
                          onChange={(e) => setTrxId(e.target.value.toUpperCase())}
                          placeholder="e.g. BL7A982K1Q"
                          className="w-full font-mono uppercase tracking-wider rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs text-gray-900 focus:border-(--primary) focus:ring-1 focus:ring-(--primary) outline-none transition-all"
                        />
                        <p className="mt-1 text-[11px] text-gray-400">
                          Found in the confirmation SMS or {activePayment.name} statement.
                        </p>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-900 mb-1.5">
                          Order Note / Remarks (Optional)
                        </label>
                        <textarea
                          rows={2}
                          value={customerNote}
                          onChange={(e) => setCustomerNote(e.target.value)}
                          placeholder="Any specific delivery instructions or custom details..."
                          className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs text-gray-900 focus:border-(--primary) focus:ring-1 focus:ring-(--primary) outline-none transition-all resize-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Order Summary (5 Cols) */}
                <div className="lg:col-span-5 space-y-6">
                  <div className="rounded-3xl border border-gray-200/80 bg-white p-6 shadow-xs space-y-5 sticky top-24">
                    <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">
                      Order Summary ({cartItems.length} {cartItems.length === 1 ? "item" : "items"})
                    </h2>

                    {/* Items List */}
                    <div className="divide-y divide-gray-100 max-h-72 overflow-y-auto space-y-3 pr-1">
                      {cartItems.map((item) => (
                        <div key={item.key} className="pt-3 first:pt-0 flex items-center gap-3">
                          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                            {item.image ? (
                              <Image
                                src={item.image}
                                alt={item.title}
                                fill
                                sizes="48px"
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-gray-400">
                                <LuShoppingBag className="h-4 w-4" />
                              </div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-bold text-gray-900 truncate">
                              {item.title}
                            </h4>
                            <p className="text-[11px] text-gray-500">
                              {item.duration} × {item.quantity}
                            </p>
                          </div>

                          <div className="text-xs font-bold text-gray-900">
                            ৳{(item.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Price Breakdown */}
                    <div className="border-t border-gray-100 pt-4 space-y-2 text-xs">
                      <div className="flex items-center justify-between text-gray-600">
                        <span>Subtotal</span>
                        <span className="font-bold text-gray-900">৳{subtotal.toFixed(2)}</span>
                      </div>                      
                      <div className="border-t border-gray-100 pt-3 flex items-center justify-between text-sm font-extrabold text-gray-900">
                        <span>Total Payable</span>
                        <span className="text-base text-gray-950 font-mono">
                          ৳{subtotal.toFixed(2)}
                        </span>
                      </div>
                    </div>                    

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-(--primary) py-3.5 text-xs font-bold text-white shadow-xs hover:bg-(--primary-hover) active:scale-98 transition-all disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <LuLoader className="h-4 w-4 animate-spin" />
                          <span>Verifying & Submitting...</span>
                        </>
                      ) : (
                        <>
                          <FiLock className="h-4 w-4" />
                          <span>Confirm & Place Order</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </RoleGuard>
  );
}
