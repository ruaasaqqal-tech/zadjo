import { motion } from 'framer-motion';
import { useLang } from '@/lib/i18n';

const FEATURES = [
  { icon: '🏠', titleKey: 'trust1Title', descKey: 'trust1Desc' },
  { icon: '⭐', titleKey: 'trust2Title', descKey: 'trust2Desc' },
  { icon: '🚚', titleKey: 'trust3Title', descKey: 'trust3Desc' },
  { icon: '💰', titleKey: 'trust4Title', descKey: 'trust4Desc' },
];

export default function TrustSection() {
  const { t, lang } = useLang();

  return (
    <section className="py-12 bg-accent/50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-2">
          {lang === 'ar' ? 'لماذا لقمة بيت؟' : 'Why Lugma Bait?'}
        </h2>
        <p className="text-muted-foreground text-center text-sm mb-8">
          {lang === 'ar' ? 'ثقة آلاف العملاء في السلط' : 'Trusted by thousands of customers in Salt'}
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {FEATURES.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card rounded-2xl p-5 text-center shadow-sm border border-border/50"
            >
              <span className="text-3xl mb-3 block">{f.icon}</span>
              <h3 className="font-bold text-sm mb-1">{t(f.titleKey)}</h3>
              <p className="text-xs text-muted-foreground">{t(f.descKey)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}