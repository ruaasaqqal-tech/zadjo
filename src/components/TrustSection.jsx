import { motion } from 'framer-motion';

const FEATURES = [
  { icon: '🏠', title: 'أكل بيتي 100%', desc: 'من مطابخ بيوت السلط مباشرة' },
  { icon: '⭐', title: 'جودة عالية ونظافة', desc: 'معايير صحية صارمة' },
  { icon: '🚚', title: 'توصيل سريع', desc: 'داخل السلط بأسرع وقت' },
  { icon: '💰', title: 'الدفع عند الاستلام', desc: 'لا حاجة لدفع مسبق' },
];

export default function TrustSection() {
  return (
    <section className="py-12 bg-accent/50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-2">لماذا لقمة بيت؟</h2>
        <p className="text-muted-foreground text-center text-sm mb-8">ثقة آلاف العملاء في السلط</p>
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
              <h3 className="font-bold text-sm mb-1">{f.title}</h3>
              <p className="text-xs text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}