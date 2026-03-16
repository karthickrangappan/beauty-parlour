import { Timestamp } from "firebase/firestore";

export const calculateNewAverage = (oldAvg, oldCount, newUserRating, oldUserRating = null, mode = "add") => {
  const currentAvg = oldAvg || 0;
  const currentCount = oldCount || 0;

  if (mode === "add") {
    const nextCount = currentCount + 1;
    const nextAvg = (currentAvg * currentCount + newUserRating) / nextCount;
    return { nextAvg: parseFloat(nextAvg.toFixed(1)), nextCount };
  }

  if (mode === "edit") {
    if (currentCount === 0) return { nextAvg: newUserRating, nextCount: 1 };
    const nextAvg = (currentAvg * currentCount - oldUserRating + newUserRating) / currentCount;
    return { nextAvg: parseFloat(nextAvg.toFixed(1)), nextCount: currentCount };
  }

  if (mode === "delete") {
    const nextCount = Math.max(0, currentCount - 1);
    if (nextCount === 0) return { nextAvg: 0, nextCount: 0 };
    const nextAvg = (currentAvg * currentCount - oldUserRating) / nextCount;
    return { nextAvg: parseFloat(nextAvg.toFixed(1)), nextCount };
  }

  return { nextAvg: currentAvg, nextCount: currentCount };
};

export const getShippingStats = (subtotal, pincode) => {
  const isTN = pincode && String(pincode).startsWith("6");
  const isRemote = pincode && ["7", "8", "9"].includes(String(pincode)[0]); 

  let charge = 0;
  if (subtotal < 500) {
    charge = isRemote ? 99 : 49;
  }

  const days = isTN ? 3 : 5;
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + days);

  return {
    charge,
    estimatedDays: days,
    estimatedDate: Timestamp.fromDate(deliveryDate),
    isRemote,
    isTN
  };
};

export const ORDER_STATUS_SEQUENCE = [
  "confirmed",
  "processing",
  "packed",
  "shipped",
  "out_for_delivery", 
  "delivered"
];

export const canMoveToStatus = (current, next) => {
  const currIdx = ORDER_STATUS_SEQUENCE.indexOf(current);
  const nextIdx = ORDER_STATUS_SEQUENCE.indexOf(next);
  return nextIdx > currIdx;
};

export const canCancelOrder = (status, isAdmin) => {
  if (isAdmin) return true; 
  const cancellable = ["confirmed", "processing", "packed"];
  return cancellable.includes(status);
};

export const generateTimeSlots = (staff, service, dateStr) => {
  if (!staff || !service || !dateStr) return [];

  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  const dayName = date.toLocaleDateString('en-US', { weekday: 'short' }); 

  const workingDays = staff.workingDays || ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  if (!workingDays.includes(dayName)) return [];

  if (staff.blockedDates?.includes(dateStr)) return [];

  const slots = [];
  const startHour = staff.workingHours?.start || 9;
  const endHour = staff.workingHours?.end || 18;
  const duration = service.duration || 60;
  const breakStart = staff.breakTime?.start;
  const breakEnd = staff.breakTime?.end;

  let current = new Date(date);
  current.setHours(startHour, 0, 0, 0);
  
  const end = new Date(date);
  end.setHours(endHour, 0, 0, 0);

  while (current.getTime() + duration * 60000 <= end.getTime()) {
    const hour = current.getHours();
    
    const isInBreak = breakStart !== undefined && breakEnd !== undefined && 
                     hour >= breakStart && hour < breakEnd;

    if (!isInBreak) {
      slots.push(current.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
    }
    
    current = new Date(current.getTime() + duration * 60000);
  }

  return slots;
};
