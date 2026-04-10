import { Link } from 'react-router-dom';
import { Phone, MapPin, Clock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-foreground text-background mt-12">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl">🍲</span>
              <div>
                <h3 className="text-xl font-bold">لقمة بيت</h3>
                <p className="text-sm opacity-70">أكل بيتي طازج من مطابخ السلط</p>
              </div>
            </div>
            <p className="text-sm opacity-60 leading-relaxed">
              منصة لتوصيل الأكل البيتي الطازج من أفضل مطابخ السلط مباشرة إلى بابك.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-4">روابط سريعة</h4>
            <div className="flex flex-col gap-2">
              <Link to="/" className="text-sm opacity-70 hover:opacity-100 transition-opacity">الرئيسية</Link>
              <Link to="/menu" className="text-sm opacity-70 hover:opacity-100 transition-opacity">القائمة</Link>
              <Link to="/cart" className="text-sm opacity-70 hover:opacity-100 transition-opacity">السلة</Link>
              <Link to="/track-order" className="text-sm opacity-70 hover:opacity-100 transition-opacity">تتبع طلبك</Link>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-4">تواصل معنا</h4>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-sm opacity-70">
                <Phone className="h-4 w-4" />
                <span dir="ltr">+962 77 624 1441</span>
              </div>
              <div className="flex items-center gap-2 text-sm opacity-70">
                <MapPin className="h-4 w-4" />
                <span>السلط، الأردن</span>
              </div>
              <div className="flex items-center gap-2 text-sm opacity-70">
                <Clock className="h-4 w-4" />
                <span>يومياً من 9 صباحاً - 9 مساءً</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-background/10 mt-8 pt-6 text-center">
          <p className="text-sm opacity-50">© 2026 لقمة بيت — جميع الحقوق محفوظة</p>
        </div>
      </div>
    </footer>
  );
}