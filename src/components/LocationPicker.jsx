import { useEffect, useRef, useState } from 'react';
import { MapPin, Loader2, Search, LocateFixed } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || window.__GOOGLE_MAPS_KEY__;

// Load Google Maps script once
let scriptPromise = null;
function loadGoogleMaps(apiKey) {
  if (window.google?.maps) return Promise.resolve();
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
  return scriptPromise;
}

/**
 * LocationPicker
 * Props:
 *   coords: { lat, lng } | null
 *   onCoordsChange: ({ lat, lng, address }) => void
 *   apiKey: string
 */
export default function LocationPicker({ coords, onCoordsChange, apiKey }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);

  const [mapsLoaded, setMapsLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [reverseLoading, setReverseLoading] = useState(false);

  // Default center: Salt, Jordan
  const defaultCenter = { lat: 32.034, lng: 35.727 };
  const center = coords || defaultCenter;

  useEffect(() => {
    if (!apiKey) {
      setLoadError(true);
      return;
    }
    loadGoogleMaps(apiKey)
      .then(() => setMapsLoaded(true))
      .catch(() => setLoadError(true));
  }, [apiKey]);

  // Init map + marker
  useEffect(() => {
    if (!mapsLoaded || !mapRef.current) return;

    const map = new window.google.maps.Map(mapRef.current, {
      center,
      zoom: 15,
      disableDefaultUI: true,
      zoomControl: true,
      gestureHandling: 'greedy',
    });
    mapInstanceRef.current = map;

    const marker = new window.google.maps.Marker({
      position: center,
      map,
      draggable: true,
      title: 'موقع التوصيل',
      animation: window.google.maps.Animation.DROP,
    });
    markerRef.current = marker;

    // Drag end → reverse geocode
    marker.addListener('dragend', () => {
      const pos = marker.getPosition();
      reverseGeocode(pos.lat(), pos.lng());
    });

    // Click on map → move marker
    map.addListener('click', (e) => {
      marker.setPosition(e.latLng);
      reverseGeocode(e.latLng.lat(), e.latLng.lng());
    });

    // Places autocomplete
    if (inputRef.current) {
      const ac = new window.google.maps.places.Autocomplete(inputRef.current, {
        fields: ['geometry', 'formatted_address', 'name'],
        componentRestrictions: { country: 'jo' },
      });
      autocompleteRef.current = ac;
      ac.addListener('place_changed', () => {
        const place = ac.getPlace();
        if (!place.geometry?.location) return;
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const address = place.formatted_address || place.name || '';
        map.panTo({ lat, lng });
        map.setZoom(16);
        marker.setPosition({ lat, lng });
        onCoordsChange({ lat, lng, address });
      });
    }
  }, [mapsLoaded]);

  // Sync marker if coords change externally
  useEffect(() => {
    if (!markerRef.current || !coords) return;
    markerRef.current.setPosition(coords);
    mapInstanceRef.current?.panTo(coords);
  }, [coords]);

  const reverseGeocode = (lat, lng) => {
    setReverseLoading(true);
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      setReverseLoading(false);
      const address = status === 'OK' && results[0] ? results[0].formatted_address : `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
      onCoordsChange({ lat, lng, address });
      if (inputRef.current) inputRef.current.value = address;
    });
  };

  const handleLocateMe = () => {
    if (!navigator.geolocation) return;
    setReverseLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        mapInstanceRef.current?.panTo({ lat, lng });
        mapInstanceRef.current?.setZoom(17);
        markerRef.current?.setPosition({ lat, lng });
        reverseGeocode(lat, lng);
      },
      () => setReverseLoading(false),
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  if (loadError) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm text-amber-700 flex items-center gap-2">
        <MapPin className="h-4 w-4 flex-shrink-0" />
        <span>تعذّر تحميل الخريطة. يرجى إدخال عنوانك يدوياً أدناه.</span>
      </div>
    );
  }

  if (!mapsLoaded) {
    return (
      <div className="h-52 rounded-2xl bg-muted/50 flex items-center justify-center gap-2 text-muted-foreground text-sm">
        <Loader2 className="h-5 w-5 animate-spin" />
        جارٍ تحميل الخريطة...
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Search bar */}
      <div className="relative">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          placeholder="ابحث عن موقعك... (مثال: عبدون، السلط)"
          className="w-full h-10 pr-9 pl-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-ring"
          dir="auto"
        />
      </div>

      {/* Map */}
      <div className="relative rounded-2xl overflow-hidden border border-border" style={{ height: 220 }}>
        <div ref={mapRef} className="w-full h-full" />
        {/* Locate Me button */}
        <Button
          type="button"
          size="sm"
          variant="secondary"
          onClick={handleLocateMe}
          disabled={reverseLoading}
          className="absolute bottom-3 left-3 rounded-xl gap-1.5 shadow-md text-xs select-none"
        >
          {reverseLoading
            ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
            : <LocateFixed className="h-3.5 w-3.5" />}
          موقعي الحالي
        </Button>
      </div>

      {coords && (
        <p className="text-xs text-emerald-600 flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          تم تحديد الموقع — يمكنك سحب الدبوس لضبط الموقع بدقة
        </p>
      )}
    </div>
  );
}