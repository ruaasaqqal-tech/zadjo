import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useLang } from '@/lib/i18n';

export default function HeroBanner() {
  const { t, lang } = useLang();
  const ArrowIcon = lang === 'ar' ? ArrowLeft : ArrowRight;

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-white via-primary/5 to-secondary/5">
      <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-1 text-center md:text-right"
          >
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-bold mb-6"
            >
              🍽️ طعام منزلي أصلي
            </motion.div>
            <h1 className="text-5xl md:text-6xl font-black text-foreground mb-3 leading-tight">
              <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">Zadjo</span>
            </h1>
            <h2 className="text-3xl font-bold text-secondary mb-6">زاد جو</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto md:mx-0 leading-relaxed">
              طعم حقيقي من مطابخك المفضلة، توصيل سريع وآمن، ثقة كاملة
            </p>
            <div className="flex gap-3 justify-center md:justify-start">
              <Link to="/menu">
                <Button size="lg" className="rounded-2xl px-8 h-12 text-base font-bold gap-2 bg-primary hover:bg-secondary text-white shadow-lg transition-colors">
                  اطلب الآن
                  <ArrowIcon className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex-1 relative"
          >
            <div className="relative w-64 h-64 md:w-80 md:h-80 mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/40 to-secondary/30 rounded-full blur-3xl" />
              <img
                src="https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=400&fit=crop"
                alt={lang === 'ar' ? 'طعام بيتي' : 'Home-cooked food'}
                className="relative w-full h-full object-cover rounded-full shadow-2xl border-4 border-card"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}