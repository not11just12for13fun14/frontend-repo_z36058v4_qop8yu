import { useRef } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Features from './components/Features'

function App() {
  const ref = useRef(null)
  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <Navbar />
      <main className="pt-16">
        <Hero onGetStarted={() => (window.location.href='/auth')} ref={ref} onLearnMore={scrollToFeatures} />
        <Features />
      </main>
    </div>
  )
}

export default App
