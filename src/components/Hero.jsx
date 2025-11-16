import Spline from '@splinetool/react-spline';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function Hero({ onGetStarted }) {
  return (
    <section className="relative min-h-[80vh] flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/VyGeZv58yuk8j7Yy/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/60 to-white/90 dark:from-black/70 dark:via-black/60 dark:to-black/80 pointer-events-none" />

      <div className="relative z-10 container mx-auto px-6 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-600/10 text-blue-700 dark:text-blue-300 px-3 py-1 mb-4">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm">Interactive • Tech • Futuristic</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight leading-tight text-gray-900 dark:text-white">
            The minimalist way to track everything that matters
          </h1>
          <p className="mt-5 text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
            Log entries, analyze insights, and stay on top of your data with an elegant, modern dashboard.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <button onClick={onGetStarted} className="inline-flex items-center gap-2 bg-gray-900 text-white hover:bg-black px-5 py-3 rounded-lg transition">
              Get started <ArrowRight className="w-4 h-4" />
            </button>
            <a href="#features" className="px-5 py-3 rounded-lg border border-gray-300/80 dark:border-white/20 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5 transition">
              Learn more
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
