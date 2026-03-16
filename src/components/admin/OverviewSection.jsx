import React from "react";
import { fmtCurrency } from "../../constants/config";
import {
  DollarSign,
  ShoppingBag,
  Box,
  Sparkles,
  Users,
  TrendingUp,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Utility removed in favor of fmtCurrency

const OverviewSection = ({
  totalRevenue,
  pendingOrders,
  totalProducts,
  totalServices,
  totalUsers,
  chartData,
}) => {
  return (
    <>
      {/* stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[
          {
            label: "Revenue",
            val: fmtCurrency(totalRevenue),
            icon: DollarSign,
            bg: "bg-green-50 text-green-600",
          },
          {
            label: "Pending Orders",
            val: pendingOrders,
            icon: ShoppingBag,
            bg: "bg-orange-50 text-orange-600",
          },
          {
            label: "Products",
            val: totalProducts,
            icon: Box,
            bg: "bg-blue-50 text-blue-600",
          },
          {
            label: "Services",
            val: totalServices,
            icon: Sparkles,
            bg: "bg-pink-50 text-pink-600",
          },
          {
            label: "Active Users",
            val: totalUsers,
            icon: Users,
            bg: "bg-violet-50 text-violet-600",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-white p-6 border border-neutral-100 shadow-sm flex items-start justify-between"
          >
            <div>
              <p className="text-[10px] uppercase tracking-widest text-neutral-400 mb-1">
                {s.label}
              </p>
              <h3
                className="text-3xl font-light text-neutral-800"
                style={{
                  fontFamily: "ui-serif, Georgia, serif",
                }}
              >
                {s.val}
              </h3>
            </div>
            <div className={`p-3 rounded-full ${s.bg}`}>
              <s.icon className="w-5 h-5" />
            </div>
          </div>
        ))}
      </div>

      {/* chart */}
      <div className="bg-white p-8 border border-neutral-100 shadow-sm mb-8">
        <div className="flex items-center gap-3 mb-8 border-b border-neutral-100 pb-4">
          <TrendingUp className="w-5 h-5 text-gold-500" />
          <h3 className="text-sm uppercase tracking-widest font-bold text-neutral-800">
            Revenue Analytics
          </h3>
        </div>
        <div className="h-80 w-full min-h-[320px]">
          {chartData?.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: "#A3A3A3" }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: "#A3A3A3" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #f1f5f9",
                  borderRadius: "4px",
                  fontSize: "12px",
                }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#D4AF37"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorRevenue)"
              />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full w-full flex items-center justify-center text-neutral-300 italic text-xs">
              Waiting for data stream...
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default OverviewSection;
