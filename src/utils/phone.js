export const normalizePhone = (phone = "") => {
  const cleaned = phone.replace(/[\s-]/g, "");
  return /^01\d{9}$/.test(cleaned) ? `+2${cleaned}` : cleaned;
};
