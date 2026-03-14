import React from "react";
import { Calendar, CheckCircle, XCircle } from "lucide-react";

const AppointmentSection = ({
  appointments,
  statusColors,
  handleAppointment,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {appointments.length === 0 && (
        <div className="col-span-full text-center py-20 text-neutral-400 text-sm italic">
          No appointment bookings yet.
        </div>
      )}
      {appointments.map((a) => (
        <div
          key={a.id}
          className="bg-white p-6 border border-neutral-100 shadow-sm flex flex-col justify-between"
        >
          <div>
            <div className="flex justify-between items-start mb-4">
              <div className="flex flex-col">
                <span
                  className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 w-fit ${statusColors[a.status] || "bg-gold-100 text-gold-700"}`}
                >
                  {a.status}
                </span>
                <span className="text-[10px] text-neutral-400 font-mono mt-1">
                  #{a.bookingId || a.id.slice(0, 8)}
                </span>
              </div>
              <span
                className="text-xl font-light text-neutral-800"
                style={{
                  fontFamily: "ui-serif, Georgia, serif",
                }}
              >
                ${a.price}
              </span>
            </div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-neutral-800 mb-1">
              {a.serviceName}
            </h4>
            <p className="text-xs text-neutral-500 font-serif italic mb-4">
              {a.staffName}
            </p>
            <p className="text-xs text-neutral-600 mb-6 flex items-center gap-2">
              <Calendar className="w-3 h-3" /> {a.date} at {a.time}
            </p>
          </div>
          {a.status === "pending" && (
            <div className="flex gap-2">
              <button
                onClick={() => handleAppointment(a.id, "confirmed")}
                className="flex-1 bg-green-500 text-white py-2 text-[10px] uppercase font-bold hover:bg-green-600 transition-colors flex justify-center items-center gap-1"
              >
                <CheckCircle className="w-3 h-3" /> Approve
              </button>
              <button
                onClick={() => handleAppointment(a.id, "cancelled")}
                className="flex-1 bg-red-50 text-red-600 py-2 text-[10px] uppercase font-bold hover:bg-red-100 transition-colors flex justify-center items-center gap-1"
              >
                <XCircle className="w-3 h-3" /> Reject
              </button>
            </div>
          )}
          {a.status === "confirmed" && (
            <div className="flex gap-2">
              <button
                onClick={() => handleAppointment(a.id, "completed")}
                className="flex-1 bg-neutral-900 text-white py-2 text-[10px] uppercase font-bold hover:bg-gold-500 transition-colors"
              >
                Mark Completed
              </button>
              <button
                onClick={() => handleAppointment(a.id, "no_show")}
                className="flex-1 bg-neutral-100 text-neutral-500 py-2 text-[10px] uppercase font-bold hover:bg-neutral-200 transition-colors"
              >
                No Show
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default AppointmentSection;
