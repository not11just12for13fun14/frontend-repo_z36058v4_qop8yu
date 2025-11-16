import { motion } from 'framer-motion'

const plans = [
  { name: 'Starter', price: '$9/mo', features: ['Up to 3 devices', '7-day history', 'Email support'] },
  { name: 'Pro', price: '$29/mo', features: ['Up to 20 devices', '90-day history', 'Priority support', 'Geo-fencing alerts'] },
  { name: 'Enterprise', price: 'Custom', features: ['Unlimited devices', 'Unlimited history', 'SLA & SSO', 'Dedicated support'] },
]

export default function Pricing() {
  return (
    <section className="py-20 bg-white dark:bg-black">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-semibold text-center text-gray-900 dark:text-white">Simple, transparent pricing</h2>
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {plans.map((p, i) => (
            <motion.div key={p.name} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="rounded-2xl border p-6 bg-white/70 dark:bg-white/[0.03]">
              <div className="text-sm uppercase tracking-wide text-gray-500">{p.name}</div>
              <div className="mt-2 text-3xl font-semibold">{p.price}</div>
              <ul className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                {p.features.map(f => (<li key={f}>• {f}</li>))}
              </ul>
              <button className="mt-6 w-full rounded-md bg-gray-900 text-white py-2">Choose {p.name}</button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
