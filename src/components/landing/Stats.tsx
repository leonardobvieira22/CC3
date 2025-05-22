"use client"

import { useEffect, useState, useRef } from "react"
import { motion, useInView } from "framer-motion"

const stats = [
  { value: 5000, label: "Traders Ativos", symbol: "+" },
  { value: 1200000, label: "Volume Diário", symbol: "$" },
  { value: 120, label: "Pares de Trading", symbol: "+" },
  { value: 99.9, label: "Uptime", symbol: "%" },
]

export function Stats() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [counts, setCounts] = useState(stats.map(() => 0))

  useEffect(() => {
    if (!isInView) return

    const intervals = stats.map((stat, index) => {
      return setInterval(() => {
        setCounts(prevCounts => {
          const newCounts = [...prevCounts]
          const increment = Math.ceil(stat.value / 20)
          const newValue = Math.min(prevCounts[index] + increment, stat.value)
          newCounts[index] = newValue

          if (newValue >= stat.value) {
            clearInterval(intervals[index])
          }

          return newCounts
        })
      }, 50)
    })

    return () => {
      intervals.forEach(interval => clearInterval(interval))
    }
  }, [isInView])

  const formatValue = (value: number, index: number) => {
    if (index === 0) return value.toLocaleString()
    if (index === 1) return (value / 1000000).toFixed(1) + "M"
    if (index === 2) return value.toLocaleString()
    if (index === 3) return value.toFixed(1)
    return value
  }

  return (
    <section className="py-20 bg-gray-50 dark:bg-blue-medium">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white border-2 border-[#4B5CFA] rounded-2xl shadow-md p-8 flex flex-col items-center justify-center transition-transform hover:scale-105 duration-300"
            >
              <div className="flex items-end gap-1 mb-2">
                {stat.symbol && (
                  <span className="text-4xl font-bold text-[#4B5CFA]">{stat.symbol}</span>
                )}
                <span className="text-5xl font-extrabold text-[#4B5CFA] leading-none">
                  {formatValue(counts[index], index)}
                </span>
                {stat.symbol !== "$" && (
                  <span className="text-2xl font-bold text-[#4B5CFA]">{stat.symbol}</span>
                )}
              </div>
              <p className="text-lg text-black font-medium mt-2">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
