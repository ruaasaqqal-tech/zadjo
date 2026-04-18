import { Link } from 'react-router-dom';
import { Phone, MapPin, Clock } from 'lucide-react';
import { useLang } from '@/lib/i18n';

export default function Footer() {
  const { t, lang } = useLang();

  return (
    <footer className="bg-foreground text-background mt-12">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-md flex-shrink-0">
                <span className="text-xl">🍽️</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">زاد جو</h3>
                <p className="text-sm opacity-70">Zad JO</p>
              </div>
            </div>
            <p className="text-sm opacity-60 leading-relaxed">{t('footerDesc')}</p>
          </div>

          <div>
            <h4 className="font-bold mb-4">{t('quickLinks')}</h4>
            <div className="flex flex-col gap-2">
              <Link to="/" className="text-sm opacity-70 hover:opacity-100 transition-opacity">{t('home')}</Link>
              <Link to="/menu" className="text-sm opacity-70 hover:opacity-100 transition-opacity">{t('menu')}</Link>
              <Link to="/cart" className="text-sm opacity-70 hover:opacity-100 transition-opacity">{t('cart')}</Link>
              <Link to="/track-order" className="text-sm opacity-70 hover:opacity-100 transition-opacity">{t('trackYourOrder')}</Link>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-4">{t('contactUs')}</h4>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-sm opacity-70">
                <Phone className="h-4 w-4" />
                <span dir="ltr">+962 77 624 1441</span>
              </div>
              <div className="flex items-center gap-2 text-sm opacity-70">
                <MapPin className="h-4 w-4" />
                <span>{lang === 'ar' ? 'السلط، الأردن' : 'Salt, Jordan'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm opacity-70">
                <Clock className="h-4 w-4" />
                <span>{t('delivery24')}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-background/10 mt-8 pt-6 text-center space-y-1">
          <p className="text-sm opacity-50">© 2026 زاد جو (Zad JO) — {t('allRightsReserved')}</p>
          <p className="text-sm opacity-40">{t('madeIn')}</p>
        </div>
      </div>
    </footer>
  );
}