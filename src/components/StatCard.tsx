'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface StatCardProps {
  icon: ReactNode
  label: string
  value: string | number
  subtext?: string
}

export default function StatCard({
  icon,
  label,
  value,
  subtext,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.3 }}
      className="bg-white/80 backdrop-blur-md rounded-3xl p-6 shadow-sm border border-emerald-deep/5"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-emerald-deep/60 font-medium">{label}</span>
        <div className="w-9 h-9 rounded-xl bg-emerald-deep/10 flex items-center justify-center text-emerald-deep">
          {icon}
        </div>
      </div>
      <p className="text-3xl font-serif text-emerald-deep">{value}</p>
      {subtext && <p className="text-xs text-emerald-deep/50 mt-1">{subtext}</p>}
    </motion.div>
  )
}