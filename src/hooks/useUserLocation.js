import { useState, useEffect } from 'react';

export default function useUserLocation() {
  const [location, setLocation] = useState(null); // { lat, lng }
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('الجهاز لا يدعم تحديد الموقع');
      setLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLoading(false);
      },
      () => {
        setError('تعذّر الحصول على موقعك');
        setLoading(false);
      },
      { timeout: 8000 }
    );
  }, []);

  return { location, error, loading };
}