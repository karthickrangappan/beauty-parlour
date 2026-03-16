import React, { useState, useRef } from "react";
import { 
  Search, 
  Printer, 
  CheckCircle2, 
  Clock, 
  Truck, 
  Package, 
  XCircle,
  ChevronRight,
  Download,
  Filter,
  ArrowRight,
  X,
  Users,
  ShoppingBag
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { fmtCurrency } from "../../constants/config";

// ─── Number to Words (INR) Helper ───────────────────────────────────────────
function numberToWords(num) {
  if (!num || isNaN(num)) return "Zero Rupees";
  const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
    "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  function toWords(n) {
    if (n === 0) return "";
    if (n < 20) return ones[n] + " ";
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "") + " ";
    if (n < 1000) return ones[Math.floor(n / 100)] + " Hundred " + toWords(n % 100);
    if (n < 100000) return toWords(Math.floor(n / 1000)) + "Thousand " + toWords(n % 1000);
    if (n < 10000000) return toWords(Math.floor(n / 100000)) + "Lakh " + toWords(n % 100000);
    return toWords(Math.floor(n / 10000000)) + "Crore " + toWords(n % 10000000);
  }
  const rupees = Math.floor(num);
  const paise = Math.round((num - rupees) * 100);
  let result = "Rupees " + toWords(rupees).trim();
  if (paise > 0) result += ` and ${toWords(paise).trim()} Paise`;
  return result;
}

const COMPANY = {
  name: "LUMINARY",
  tagline: "Curated Luxury Goods",
  address: "12, Heritage Arcade, MG Road",
  city: "Bengaluru — 560 001",
  gstin: "29AABCU9603R1ZM",
  email: "orders@luminary.in",
  phone: "+91 80 4121 9900",
};

const invoicePrintCSS = `
  table { border-collapse: collapse; width: 100%; }
  thead tr { background: #1a1a1a !important; color: white !important; }
  th, td { padding: 10px 14px; }
  .bg-neutral-50 { background-color: #fafafa; }
  .border-b { border-bottom: 1px solid #e5e5e5; }
  .italic { font-style: italic; }
  @media print {
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  }
`;

export const InvoiceModal = ({ order: o, onClose }) => {
  const printRef = useRef(null);

  const handlePrint = () => {
    const content = printRef.current.innerHTML;
    const win = window.open("", "_blank");
    win.document.write(`
      <html>
        <head>
          <title>Invoice — INV-${new Date().getFullYear()}-${o.id.slice(-6).toUpperCase()}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=IM+Fell+English:ital@0;1&family=Crimson+Pro:wght@300;400;600;700&display=swap');
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Crimson Pro', Georgia, serif; color: #1a1a1a; background: #fff; }
            .invoice-wrap { max-width: 780px; margin: 0 auto; padding: 60px 48px; }
            ${invoicePrintCSS}
          </style>
        </head>
        <body><div class="invoice-wrap">${content}</div></body>
      </html>
    `);
    win.document.close();
    win.print();
  };

  if (!o) return null;

  const date = o.createdAt?.toDate
    ? o.createdAt.toDate()
    : new Date(o.createdAt || Date.now());

  const invoiceNumber = `INV-${date.getFullYear()}-${o.id.slice(-6).toUpperCase()}`;
  const subtotal = o.items?.reduce(
    (s, i) => s + (i.price || 0) * (i.qty || i.quantity || 1),
    0
  ) || 0;
  const gstRate = 0.18;
  const gstAmount = Math.round(subtotal * gstRate);
  const grandTotal = subtotal + gstAmount;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center overflow-y-auto py-4 md:py-10 px-4"
        onClick={onClose}
      >
        <div
          className="relative w-full max-w-3xl bg-white shadow-2xl my-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Toolbar */}
          <div className="flex items-center justify-between px-6 py-3 bg-neutral-900 text-white sticky top-0 z-10">
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-neutral-400">
              Invoice Preview
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-3 md:px-4 py-2 bg-amber-500 hover:bg-amber-400 transition-colors text-[9px] md:text-[10px] uppercase tracking-widest font-black text-white"
              >
                <Printer className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Print / Save PDF</span><span className="sm:hidden">Print</span>
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-neutral-700 transition-colors rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Invoice Body */}
          <div
            ref={printRef}
            className="p-6 md:p-12 font-serif overflow-x-auto"
            style={{ fontFamily: "'Crimson Pro', Georgia, serif" }}
          >
            <div className="min-w-[600px]">
              {/* Header */}
              <div className="flex justify-between items-start pb-8 border-b-2 border-neutral-900 mb-8">
                <div>
                  <h1
                    className="text-3xl md:text-4xl font-bold tracking-widest text-neutral-900 mb-1"
                    style={{ fontFamily: "'IM Fell English', Georgia, serif", letterSpacing: "0.3em" }}
                  >
                    {COMPANY.name}
                  </h1>
                  <p className="text-[10px] uppercase tracking-[0.4em] text-neutral-400 font-semibold">
                    {COMPANY.tagline}
                  </p>
                  <div className="mt-4 space-y-0.5 text-[11px] text-neutral-500">
                    <p>{COMPANY.address}</p>
                    <p>{COMPANY.city}</p>
                    <p className="font-semibold text-neutral-600">GSTIN: {COMPANY.gstin}</p>
                    <p>{COMPANY.email} · {COMPANY.phone}</p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="inline-block border-2 border-neutral-900 px-6 py-4">
                    <p className="text-[9px] uppercase tracking-[0.35em] text-neutral-400 font-black mb-1">Tax Invoice</p>
                    <p className="text-xl md:text-2xl font-bold text-neutral-900 tracking-wider" style={{ fontFamily: "'IM Fell English', Georgia, serif" }}>
                      {invoiceNumber}
                    </p>
                  </div>
                  <div className="mt-4 space-y-1 text-[11px] text-neutral-500">
                    <p>
                      <span className="font-black uppercase tracking-widest text-[9px] text-neutral-400 mr-2">Date</span>
                      {date.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                    </p>
                    <p>
                      <span className="font-black uppercase tracking-widest text-[9px] text-neutral-400 mr-2">Order Ref</span>
                      {o.id}
                    </p>
                    <p>
                      <span className="font-black uppercase tracking-widest text-[9px] text-neutral-400 mr-2">Status</span>
                      <span className="font-semibold uppercase text-neutral-700">{o.status?.replace("_", " ")}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Bill To */}
              <div className="grid grid-cols-2 gap-8 mb-10">
                <div>
                  <p className="text-[9px] uppercase tracking-[0.35em] font-black text-neutral-400 mb-3 pb-2 border-b border-neutral-200">
                    Bill To
                  </p>
                  <p className="text-base font-bold text-neutral-900 uppercase tracking-wide">
                    {o.customer?.name || "Private Client"}
                  </p>
                  <p className="text-[12px] text-neutral-600 mt-1 leading-relaxed italic">
                    {o.customer?.address}
                  </p>
                  <p className="text-[11px] text-neutral-500 mt-1 font-semibold uppercase tracking-wider">
                    {o.customer?.city}{o.customer?.zip ? ` — ${o.customer.zip}` : ""}
                  </p>
                  {o.customer?.email && (
                    <p className="text-[11px] text-neutral-400 mt-2">{o.customer.email}</p>
                  )}
                </div>

                <div>
                  <p className="text-[9px] uppercase tracking-[0.35em] font-black text-neutral-400 mb-3 pb-2 border-b border-neutral-200">
                    Payment Details
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-neutral-400 uppercase tracking-widest font-bold text-[9px]">Method</span>
                      <span className="font-semibold text-neutral-700">
                        {o.paymentType === "COD" ? "Cash on Delivery" : "Online Payment"}
                      </span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-neutral-400 uppercase tracking-widest font-bold text-[9px]">Status</span>
                      <span className={`font-bold text-[10px] uppercase tracking-widest px-2 py-0.5 ${
                        o.paymentType === "COD"
                          ? "bg-amber-50 text-amber-600 border border-amber-200"
                          : "bg-green-50 text-green-600 border border-green-200"
                      }`}>
                        {o.paymentType === "COD" ? "Pay on Delivery" : "Paid"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <table className="w-full mb-8 text-[12px]" style={{ borderCollapse: "collapse" }}>
                <thead>
                  <tr className="bg-neutral-900 text-white">
                    <th className="py-3 px-4 text-left text-[9px] uppercase tracking-[0.3em] font-black w-8">#</th>
                    <th className="py-3 px-4 text-left text-[9px] uppercase tracking-[0.3em] font-black">Description</th>
                    <th className="py-3 px-4 text-center text-[9px] uppercase tracking-[0.3em] font-black">HSN</th>
                    <th className="py-3 px-4 text-center text-[9px] uppercase tracking-[0.3em] font-black">Qty</th>
                    <th className="py-3 px-4 text-right text-[9px] uppercase tracking-[0.3em] font-black">Price</th>
                    <th className="py-3 px-4 text-right text-[9px] uppercase tracking-[0.3em] font-black">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {o.items?.map((item, idx) => (
                    <tr
                      key={idx}
                      className={idx % 2 === 0 ? "bg-white" : "bg-neutral-50"}
                      style={{ borderBottom: "1px solid #e5e5e5" }}
                    >
                      <td className="py-3.5 px-4 text-neutral-400 font-semibold">{idx + 1}</td>
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-neutral-900 uppercase tracking-wide text-[11px]">{item.name}</p>
                        <p className="text-neutral-400 text-[10px] italic mt-0.5">Ref: {item.id?.slice(-8)}</p>
                      </td>
                      <td className="py-3.5 px-4 text-center text-neutral-400 text-[10px] font-mono">6217</td>
                      <td className="py-3.5 px-4 text-center font-bold text-neutral-700">{item.qty || item.quantity}</td>
                      <td className="py-3.5 px-4 text-right text-neutral-700">
                        {fmtCurrency(item.price || 0)}
                      </td>
                      <td className="py-3.5 px-4 text-right font-semibold text-neutral-900">
                        {fmtCurrency((item.price || 0) * (item.qty || item.quantity || 1))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals */}
              <div className="flex justify-end mb-10">
                <div className="w-full md:w-72 space-y-2">
                  <div className="flex justify-between text-[12px] py-1.5 border-b border-neutral-100">
                    <span className="text-neutral-500">Subtotal</span>
                    <span className="font-semibold text-neutral-800">{fmtCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-[12px] py-1.5 border-b border-neutral-100">
                    <span className="text-neutral-500">GST @ 18%</span>
                    <span className="font-semibold text-neutral-800">{fmtCurrency(gstAmount)}</span>
                  </div>
                  <div className="flex justify-between py-3 bg-neutral-900 text-white px-4 mt-2">
                    <span className="text-[10px] uppercase tracking-[0.3em] font-black">Order Total</span>
                    <span className="text-lg font-bold" style={{ fontFamily: "'IM Fell English', Georgia, serif" }}>
                      {fmtCurrency(o.totalAmount || grandTotal)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mb-8 p-4 bg-neutral-50 border-l-4 border-neutral-300">
                <p className="text-[9px] uppercase tracking-[0.3em] text-neutral-400 font-black mb-1">Amount in Words</p>
                <p className="text-[12px] italic text-neutral-700 font-semibold">
                  {numberToWords(o.totalAmount || grandTotal)} Only
                </p>
              </div>

              <div className="grid grid-cols-2 gap-8 pt-8 border-t-2 border-neutral-900">
                <div>
                  <p className="text-[9px] uppercase tracking-[0.3em] font-black text-neutral-400 mb-3">Terms & Conditions</p>
                  <ul className="space-y-1 text-[10px] text-neutral-500">
                    <li>· Goods once sold will be replaced only if damaged.</li>
                    <li>· Subject to {COMPANY.city.split("—")[0].trim()} jurisdiction.</li>
                    <li>· This is a digital tax invoice.</li>
                  </ul>
                </div>
                <div className="text-right">
                  <p className="text-[9px] uppercase tracking-[0.3em] font-black text-neutral-400 mb-3">Authorised Signatory</p>
                  <div className="mt-12 border-t border-neutral-300 pt-2">
                    <p className="text-[10px] uppercase tracking-widest font-black text-neutral-600">{COMPANY.name}</p>
                    <p className="text-[10px] italic text-neutral-400">{COMPANY.tagline}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const OrderSection = ({ orders, orderSearch, setOrderSearch, updateOrderStatus, statusColors }) => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showInvoice, setShowInvoice] = useState(false);

  const filteredOrders = orders.filter(o => 
    o.id?.toLowerCase().includes(orderSearch.toLowerCase()) ||
    o.customer?.name?.toLowerCase().includes(orderSearch.toLowerCase()) ||
    o.customer?.email?.toLowerCase().includes(orderSearch.toLowerCase())
  ).sort((a, b) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0));

  const StatusDiagram = ({ currentStatus }) => {
    const steps = [
      { id: 'confirmed', label: 'Confirmed', icon: CheckCircle2 },
      { id: 'processing', label: 'Processing', icon: Clock },
      { id: 'packed', label: 'Packed', icon: Package },
      { id: 'shipped', label: 'Shipped', icon: Truck },
      { id: 'delivered', label: 'Delivered', icon: CheckCircle2 },
      { id: 'return_requested', label: 'Return Req', icon: Clock },
      { id: 'return_accepted', label: 'Return Acc', icon: CheckCircle2 },
      { id: 'refunded', label: 'Refunded', icon: Package }
    ];

    const currentIndex = steps.findIndex(s => s.id === currentStatus);
    
    if (currentStatus === 'cancelled') {
        return (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-2 rounded-full border border-red-100">
                <XCircle className="w-4 h-4" />
                <span className="text-[10px] uppercase tracking-widest font-black">Order Cancelled</span>
            </div>
        );
    }

    return (
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 max-w-full">
        {steps.map((step, idx) => {
          const isCompleted = idx < currentIndex;
          const isActive = idx === currentIndex;
          const isPending = idx > currentIndex;

          if (isCompleted) return null; // Hide previous process

          return (
            <React.Fragment key={step.id}>
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-500 flex-shrink-0 ${
                isActive ? 'bg-gold-500 text-white scale-105 shadow-md' : 'bg-neutral-50 text-neutral-400 border border-neutral-100'
              }`}>
                <step.icon className={`w-3 h-3 ${isActive ? 'animate-pulse' : ''}`} />
                <span className="text-[9px] uppercase tracking-widest font-bold whitespace-nowrap">
                    {step.label}
                </span>
              </div>
              {idx < steps.length - 1 && !isActive && (
                <div className="w-4 h-[1px] bg-neutral-100 flex-shrink-0" />
              )}
              {isActive && idx < steps.length - 1 && (
                <ArrowRight className="w-3 h-3 text-gold-300 animate-bounce-x flex-shrink-0" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between bg-white p-4 border border-neutral-100 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-300" />
          <input
            type="text"
            placeholder="Search by Order ID, Client Name..."
            className="w-full bg-neutral-50 border border-neutral-100 py-3 pl-10 pr-4 text-xs focus:outline-none focus:border-gold-500 transition-colors italic font-serif"
            value={orderSearch}
            onChange={(e) => setOrderSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center justify-end gap-3">
          <button className="p-3 bg-neutral-50 border border-neutral-100 text-neutral-400 hover:text-gold-500 transition-colors">
            <Filter className="w-4 h-4" />
          </button>
          <button className="p-3 bg-neutral-50 border border-neutral-100 text-neutral-400 hover:text-gold-500 transition-colors">
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredOrders.map((order) => (
            <motion.div
              layout
              key={order.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="bg-white border border-neutral-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden group"
            >
              <div className="p-4 md:p-6">
                <div className="flex flex-col lg:flex-row items-stretch lg:items-start justify-between gap-6 mb-8">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] uppercase tracking-[0.3em] font-black text-neutral-400">Order Ref</span>
                      <h3 className="text-sm font-bold text-neutral-800 font-mono tracking-tighter">
                        #{order.id.slice(0, 12).toUpperCase()}...
                      </h3>
                    </div>
                    <p className="text-[10px] text-neutral-400 font-medium">
                      Plotted on {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleString() : new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-4">
                    <StatusDiagram currentStatus={order.status} />
                    
                    <div className="h-8 w-[1px] bg-neutral-100 hidden sm:block" />

                    <div className="text-left sm:text-right w-full sm:w-auto">
                      <p className="text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-0.5">Grand Total</p>
                      <p className="text-lg font-light text-gold-600" style={{ fontFamily: 'ui-serif, Georgia, serif'}}>
                        {fmtCurrency(order.totalAmount)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6 border-t border-neutral-50">
                  <div className="lg:col-span-4 space-y-4">
                    <div className="bg-neutral-50/50 p-4 border border-neutral-50">
                      <p className="text-[9px] uppercase tracking-widest font-black text-neutral-400 mb-3 flex items-center gap-2">
                        <Users className="w-3 h-3 text-gold-500" /> Customer Portfolio
                      </p>
                      <h4 className="text-xs font-bold text-neutral-800 uppercase tracking-wider mb-1">
                        {order.customer?.name}
                      </h4>
                      <p className="text-[10px] text-neutral-500 mb-2">{order.customer?.email}</p>
                      <p className="text-[10px] text-neutral-400 italic leading-relaxed">
                        {order.customer?.address}, {order.customer?.city} - {order.customer?.zip}
                      </p>
                    </div>
                  </div>

                  <div className="lg:col-span-5">
                    <p className="text-[9px] uppercase tracking-widest font-black text-neutral-400 mb-3 flex items-center gap-2">
                        <Package className="w-3 h-3 text-gold-500" /> Consignment Manifest
                    </p>
                    <div className="space-y-3 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                      {order.items?.map((item, i) => (
                        <div key={i} className="flex items-center justify-between text-[11px] group/item">
                          <span className="text-neutral-500 font-medium">
                            {item.qty || item.quantity} <span className="text-[9px] text-neutral-300 mx-1">×</span> 
                            <span className="text-neutral-800 group-hover/item:text-gold-600 transition-colors uppercase tracking-tight">{item.name}</span>
                          </span>
                          <span className="font-bold text-neutral-700">{fmtCurrency(item.price * (item.qty || item.quantity))}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="lg:col-span-3 flex flex-col justify-end gap-3">
                    <div className="relative group/select">
                      <select
                        className={`w-full appearance-none px-4 py-2.5 text-[10px] uppercase tracking-[0.2em] font-black border transition-all cursor-pointer focus:outline-none ${statusColors[order.status] || 'bg-neutral-100 border-neutral-200 text-neutral-600'}`}
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order, e.target.value)}
                      >
                        <option value="confirmed">Confirm</option>
                        <option value="processing">Process</option>
                        <option value="packed">Pack</option>
                        <option value="shipped">Ship Items</option>
                        <option value="out_for_delivery">Out for Delivery</option>
                        <option value="delivered">Delivered</option>
                        <option value="return_requested">Return Requested</option>
                        <option value="return_accepted">Accept Return</option>
                        <option value="refunded">Refunded</option>
                        <option value="cancelled">Cancel Order</option>
                      </select>
                      <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none rotate-90" />
                    </div>

                    <button 
                      onClick={() => {
                        setSelectedOrder(order);
                        setShowInvoice(true);
                      }}
                      className="w-full py-2.5 bg-neutral-900 text-white text-[10px] uppercase tracking-widest font-black hover:bg-gold-600 transition-colors flex items-center justify-center gap-2"
                    >
                      <Printer className="w-3.5 h-3.5" /> Print Manifest
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredOrders.length === 0 && (
          <div className="text-center py-24 bg-white border border-dashed border-neutral-200">
            <ShoppingBag className="w-12 h-12 text-neutral-100 mx-auto mb-4" />
            <p className="text-neutral-400 italic font-serif">No transactions match your query...</p>
          </div>
        )}
      </div>

      {showInvoice && selectedOrder && (
        <InvoiceModal 
          order={selectedOrder} 
          onClose={() => {
            setShowInvoice(false);
            setSelectedOrder(null);
          }} 
          statusColors={statusColors}
        />
      )}
    </div>
  );
};

export default OrderSection;