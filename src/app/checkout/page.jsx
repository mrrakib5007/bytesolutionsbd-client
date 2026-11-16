"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import RoleGuard from "@/components/Auth/RoleGuard";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import {
  FiShoppingBag,
  FiUser,
  FiMail,
  FiPhone,
  FiCopy,
  FiCheck,
  FiCheckCircle,
  FiLock,
  FiArrowRight,
  FiInfo,
} from "react-icons/fi";
import { LuLoader } from "react-icons/lu";

// Default payment numbers (Can be updated or loaded dynamically)
const PAYMENT_ACCOUNTS = {
  bkash: {
    name: "bKash",
    type: "Personal (Send Money)",
    number: "01834923304",
    color: "#E2136E",
    bgColor: "bg-[#E2136E]/10",
    borderColor: "border-[#E2136E]/30",
    textColor: "text-[#E2136E]",
  },
  nagad: {
    name: "Nagad",
    type: "Personal (Send Money)",
    number: "01834923304",
    color: "#F7931E",
    bgColor: "bg-[#F7931E]/10",
    borderColor: "border-[#F7931E]/30",
    textColor: "text-[#F7931E]",
  },
};

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { cartItems, subtotal, clearCart } = useCart();

  const [paymentMethod, setPaymentMethod] = useState("bkash");
  const [senderNumber, setSenderNumber] = useState("");
  const [trxId, setTrxId] = useState("");
  const [customerNote, setCustomerNote] = useState("");
  const [copiedNumber, setCopiedNumber] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activePayment = PAYMENT_ACCOUNTS[paymentMethod];

  const handleCopyNumber = () => {
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
          method: paymentMethod,
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
        router.push("/dashboard");
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
              Complete payment via bKash or Nagad to receive your software license instantly.
            </p>
          </div>

          {cartItems.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-12 text-center shadow-xs max-w-xl mx-auto space-y-4">
              <div className="inline-flex p-4 rounded-2xl bg-gray-50 border border-gray-200 text-gray-400">
                <FiShoppingBag className="h-10 w-10" />
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

                  {/* Card 2: Manual Payment (bKash & Nagad) */}
                  <div className="rounded-3xl border border-gray-200/80 bg-white p-6 shadow-xs">
                    <div className="flex items-center gap-2.5 border-b border-gray-100 pb-4 mb-4">
                      <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
                        <FiLock className="h-4 w-4" />
                      </div>
                      <div>
                        <h2 className="text-sm font-bold text-gray-900">
                          Payment Method (bKash / Nagad)
                        </h2>
                        <p className="text-xs text-gray-500">
                          Send Money to our verified personal account and enter details below
                        </p>
                      </div>
                    </div>

                    {/* Method Tabs */}
                    <div className="grid grid-cols-2 gap-3 mb-5">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("bkash")}
                        className={`flex items-center justify-center gap-2 p-3.5 rounded-2xl border-2 transition-all cursor-pointer font-bold text-xs ${
                          paymentMethod === "bkash"
                            ? "border-[#E2136E] bg-[#E2136E]/5 text-[#E2136E] shadow-xs"
                            : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                        }`}
                      >
                        <span className="h-2.5 w-2.5 rounded-full bg-[#E2136E]" />
                        <span>bKash (Send Money)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod("nagad")}
                        className={`flex items-center justify-center gap-2 p-3.5 rounded-2xl border-2 transition-all cursor-pointer font-bold text-xs ${
                          paymentMethod === "nagad"
                            ? "border-[#F7931E] bg-[#F7931E]/5 text-[#F7931E] shadow-xs"
                            : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                        }`}
                      >
                        <span className="h-2.5 w-2.5 rounded-full bg-[#F7931E]" />
                        <span>Nagad (Send Money)</span>
                      </button>
                    </div>

                    {/* Number Display Box */}
                    <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                          {activePayment.name} {activePayment.type}
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
                    <div className="mb-6 p-4 rounded-2xl bg-blue-50/70 border border-blue-100 text-blue-900 text-xs space-y-1.5">
                      <div className="font-bold flex items-center gap-1.5 text-blue-950">
                        <FiInfo className="h-3.5 w-3.5" /> How to Pay:
                      </div>
                      <ol className="list-decimal list-inside space-y-1 text-blue-800">
                        <li>Open your <strong>{activePayment.name}</strong> App or dial USSD code.</li>
                        <li>Select <strong>Send Money</strong> and paste the number: <code className="font-mono bg-blue-100 px-1 rounded">{activePayment.number}</code>.</li>
                        <li>Enter the exact total amount: <strong className="font-mono">৳{subtotal.toFixed(2)}</strong>.</li>
                        <li>Complete the transaction and copy the <strong>TrxID</strong>.</li>
                      </ol>
                    </div>

                    {/* Form Fields: Sender Number & TrxID */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-900 mb-1.5">
                          Your Sender {activePayment.name} Number <span className="text-red-500">*</span>
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
                          The number you sent the money from.
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
                          Found in the confirmation SMS or {activePayment.name} transaction statement.
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
                                <FiShoppingBag className="h-4 w-4" />
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
                      <div className="flex items-center justify-between text-gray-600">
                        <span>Digital Delivery</span>
                        <span className="font-bold text-emerald-600">FREE (Instant)</span>
                      </div>
                      <div className="border-t border-gray-100 pt-3 flex items-center justify-between text-sm font-extrabold text-gray-900">
                        <span>Total Payable</span>
                        <span className="text-base text-gray-950 font-mono">
                          ৳{subtotal.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100 text-[11px] text-emerald-800 flex items-start gap-2">
                      <FiCheckCircle className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>
                        Secure transaction: Price and orders are validated and fulfilled directly via database verification.
                      </span>
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
