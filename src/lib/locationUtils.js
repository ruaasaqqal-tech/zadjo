// Haversine formula to calculate distance in km between two coordinates
export function calcDistance(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Base: 0.5 JD, +0.25 JD per km after first 2 km
export function calcDeliveryFee(distanceKm) {
  if (distanceKm === null) return 0.5;
  const base = 0.5;
  const extra = Math.max(0, distanceKm - 2) * 0.25;
  return Math.round((base + extra) * 100) / 100;
}

export const MAX_DELIVERY_KM = 4;

export function buildWhatsAppURL(phone, mealName) {
  const number = phone?.replace(/\D/g, '') || '962776241441';
  const msg = encodeURIComponent(`مرحبا، بدي أطلب ${mealName} من زاد جو `);
  return `https://wa.me/${number}?text=${msg}`;
}