import { useEffect, useRef } from 'react'

// Simple canvas bar chart without external deps
export default function Charts({ data }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !data) return
    const ctx = canvas.getContext('2d')
    const w = canvas.width = canvas.offsetWidth
    const h = canvas.height = 220
    ctx.clearRect(0,0,w,h)
    const items = data.byCategory || []
    const max = Math.max(1, ...items.map(i => i.total))
    const barW = Math.max(20, (w - 40) / (items.length || 1) - 16)

    items.forEach((it, idx) => {
      const x = 30 + idx * (barW + 16)
      const barH = (it.total / max) * (h - 60)
      const y = h - 30 - barH
      // bar
      const grad = ctx.createLinearGradient(0, y, 0, y + barH)
      grad.addColorStop(0, '#2563eb')
      grad.addColorStop(1, '#60a5fa')
      ctx.fillStyle = grad
      ctx.fillRect(x, y, barW, barH)
      // label
      ctx.fillStyle = '#6b7280'
      ctx.font = '12px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(it.category, x + barW/2, h - 12)
    })
  }, [data])

  return (
    <div className="rounded-xl border bg-white/70 dark:bg-white/[0.03] p-4">
      <div className="text-sm text-gray-700 dark:text-gray-200 mb-2">By Category</div>
      <canvas ref={canvasRef} className="w-full" style={{ height: 220 }} />
    </div>
  )
}
