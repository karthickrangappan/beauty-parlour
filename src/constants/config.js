export const APP_NAME = "Lumière Spa & Salon";

export const fmtCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

export const RAZORPAY_KEY_ID = "rzp_test_2ORD27rb7vGhwj";
