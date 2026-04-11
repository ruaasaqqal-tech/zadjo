import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function HeroBanner() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-bl from-primary/10 via-accent to-background">
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-20">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-1 text-center md:text-right"
          >
            <div className="inline-block bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-bold mb-4">
              🕐 الطلب والتوصيل متاحان على مدار الساعة
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4 leading-tight">
              أكل بيتي طازج<br />
              <span className="text-primary">من مطابخ السلط</span>
            </h1>
            <p className="text-muted-foreground text-lg mb-6 max-w-md mx-auto md:mx-0">
              وجبات بيتية لذيذة محضّرة بحب وعناية، توصلك لباب بيتك
            </p>
            <div className="flex gap-3 justify-center md:justify-start">
              <Link to="/menu">
                <Button size="lg" className="rounded-2xl px-8 h-12 text-base font-bold gap-2">
                  اطلب الآن
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <a href="https://wa.me/962776241441" target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline" className="rounded-2xl px-6 h-12 text-base font-bold gap-2">
                  💬 واتساب
                </Button>
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex-1 relative"
          >
            <div className="relative w-64 h-64 md:w-80 md:h-80 mx-auto">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl" />
              <img
                src="https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=400&fit=crop"
                alt="طعام بيتي"
                className="relative w-full h-full object-cover rounded-full shadow-2xl border-4 border-card"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}