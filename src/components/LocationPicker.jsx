import { useState } from 'react';
import { MapPin, Loader2, LocateFixed, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

/**
 * LocationPicker — GPS-first, no Google Maps API key required.
 * Props:
 *   coords: { lat, lng } | null
 *   onCoordsChange: ({ lat, lng, address }) => void
 */
export default function LocationPicker({ coords, onCoordsChange }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [manualAddress, setManualAddress] = useState('');

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      setError('المتصفح لا يدعم تحديد الموقع. يرجى إدخال العنوان يدوياً.');
      return;
    }
    setLoading(true);
    setError('');
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        // Reverse geocode using free Nominatim (OpenStreetMap) — no API key needed
        let address = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=ar`,
            { headers: { 'Accept-Language': 'ar' } }
          );
          const data = await res.json();
          if (data?.display_name) address = data.display_name;
        } catch (_) { /* use coords as fallback */ }

        setLoading(false);
        onCoordsChange({ lat, lng, address });
      },
      (err) => {
        setLoading(false);
        if (err.code === 1) {
          setError('تم رفض إذن الموقع. يرجى السماح للتطبيق بالوصول إلى موقعك من إعدادات المتصفح، أو أدخل عنوانك يدوياً.');
        } else {
          setError('تعذّر تحديد موقعك. يرجى إدخال العنوان يدوياً.');
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleManualSubmit = () => {
    if (!manualAddress.trim()) return;
    onCoordsChange({ lat: null, lng: null, address: manualAddress.trim() });
  };

  return (
    <div className="space-y-3">
      {/* GPS Button */}
      <Button
        type="button"
        variant={coords ? 'outline' : 'default'}
        className="w-full h-12 rounded-2xl gap-2 text-sm font-medium select-none"
        onClick={handleLocateMe}
        disabled={loading}
      >
        {loading ? (
          <><Loader2 className="h-4 w-4 animate-spin" /> جارٍ تحديد موقعك...</>
        ) : coords ? (
          <><CheckCircle2 className="h-4 w-4 text-emerald-500" /> تم تحديد الموقع — انقر لإعادة التحديد</>
        ) : (
          <><LocateFixed className="h-4 w-4" /> حدد موقعي تلقائياً 📍</>
        )}
      </Button>

      {/* Show confirmed location */}
      {coords && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-sm text-emerald-700 flex items-start gap-2">
          <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">تم تحديد موقعك بنجاح ✓</p>
            <p className="text-xs text-emerald-600 mt-0.5 leading-relaxed">{coords.address || `${coords.lat?.toFixed(5)}, ${coords.lng?.toFixed(5)}`}</p>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Manual address fallback */}
      <div>
        <p className="text-xs text-muted-foreground mb-1.5">أو أدخل عنوانك يدوياً:</p>
        <div className="flex gap-2">
          <Input
            value={manualAddress}
            onChange={(e) => setManualAddress(e.target.value)}
            placeholder="مثال: شارع الجامعة، السلط"
            className="rounded-xl flex-1"
            onKeyDown={(e) => e.key === 'Enter' && handleManualSubmit()}
          />
          <Button
            type="button"
            variant="outline"
            className="rounded-xl px-4 select-none"
            onClick={handleManualSubmit}
            disabled={!manualAddress.trim()}
          >
            تأكيد
          </Button>
        </div>
      </div>
    </div>
  );
}