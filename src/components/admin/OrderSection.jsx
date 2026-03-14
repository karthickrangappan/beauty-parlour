import React from "react";
import { Search } from "lucide-react";

const OrderSection = ({
  orders,
  orderSearch,
  setOrderSearch,
  statusColors,
  updateOrderStatus,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search Order ID or Email..."
            value={orderSearch}
            onChange={(e) => setOrderSearch(e.target.value)}
            className="w-full bg-white border border-neutral-100 py-2 pl-10 pr-4 text-xs focus:outline-none focus:border-gold-500"
          />
        </div>
      </div>
      <div className="bg-white border border-neutral-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-cream-50">
            <tr>
              <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-neutral-500 font-bold">
                Order ID
              </th>
              <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-neutral-500 font-bold">
                Date
              </th>
              <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-neutral-500 font-bold">
                Items
              </th>
              <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-neutral-500 font-bold">
                Payment
              </th>
              <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-neutral-500 font-bold">
                Status
              </th>
              <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-neutral-500 font-bold">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 text-sm">
            {orders
              .filter(
                (o) =>
                  !orderSearch ||
                  o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
                  o.customer?.email
                    ?.toLowerCase()
                    .includes(orderSearch.toLowerCase())
              )
              .map((o) => {
                const d = o.createdAt?.toDate
                  ? o.createdAt.toDate().toLocaleDateString()
                  : new Date(o.createdAt || Date.now()).toLocaleDateString();
                return (
                  <tr
                    key={o.id}
                    className="hover:bg-neutral-50 transition-colors"
                  >
                    <td className="px-6 py-4 font-mono text-xs">
                      {o.id.startsWith("LUM") ? o.id : o.id.slice(0, 8)}
                    </td>
                    <td className="px-6 py-4 text-neutral-600 font-serif italic text-xs">
                      {d}
                    </td>
                    <td className="px-6 py-4 text-neutral-600 text-xs">
                      {o.items?.length || 0} items
                    </td>
                    <td className="px-6 py-4 text-neutral-800 font-bold">
                      ₹{o.totalAmount || 0}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] uppercase font-bold text-neutral-500 flex items-center gap-1">
                        {o.paymentType === "COD" ? "🚚" : "💳"} {o.paymentType}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 text-[10px] uppercase tracking-widest font-bold rounded-sm ${statusColors[o.status] || "bg-neutral-100 text-neutral-500"}`}
                      >
                        {o.status?.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={o.status}
                        onChange={(e) => updateOrderStatus(o, e.target.value)}
                        className="text-[10px] border border-neutral-100 bg-white p-1 text-neutral-600 focus:outline-none uppercase font-bold"
                      >
                        <option value="confirmed">Confirmed</option>
                        <option value="processing">Processing</option>
                        <option value="packed">Packed</option>
                        <option value="shipped">Shipped</option>
                        <option value="out_for_delivery">
                          Out for Delivery
                        </option>
                        <option value="delivered">Delivered</option>
                        <option value="return_requested">
                          Return Requested
                        </option>
                        <option value="cancelled">Cancel</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            {orders.length === 0 && (
              <tr>
                <td
                  colSpan="6"
                  className="px-6 py-12 text-center text-neutral-400 text-sm italic"
                >
                  No orders yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderSection;
