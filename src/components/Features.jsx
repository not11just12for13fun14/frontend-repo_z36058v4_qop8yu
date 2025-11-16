import { motion } from 'framer-motion'
import { BarChart3, Search, Shield, Zap, Moon, Download } from 'lucide-react'

const features = [
  { icon: BarChart3, title: 'Dashboard Insights', desc: 'Interactive charts and quick summaries at a glance.' },
  { icon: Search, title: 'Search & Filters', desc: 'Powerful query tools to find exactly what you need.' },
  { icon: Download, title: 'Export CSV/PDF', desc: 'Take your data anywhere in a click.' },
  { icon: Moon, title: 'Dark Mode', desc: 'Beautiful on the eyes, day or night.' },
  { icon: Shield, title: 'Secure Accounts', desc: 'JWT auth with hashed passwords.' },
  { icon: Zap, title: 'Fast & Modern', desc: 'Built with React, Tailwind and FastAPI.' },
]

export default function Features() {
  return (
    <section id="features" className="py-20 bg-white dark:bg-black">
      <div className="container mx-auto px-6">
        <motion.h2 initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl md:text-4xl font-semibold text-gray-900 dark:text-white text-center">
          Everything you need to track smarter
        </motion.h2>
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="p-6 rounded-xl border border-gray-200/80 dark:border-white/10 bg-white/70 dark:bg-white/[0.03] backdrop-blur">
              <f.icon className="w-6 h-6 text-blue-600" />
              <h3 className="mt-4 font-medium text-gray-900 dark:text-white">{f.title}</h3>
              <p className="mt-1 text-gray-600 dark:text-gray-300 text-sm">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
