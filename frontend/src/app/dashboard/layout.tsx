import AuroraBackground from '@/components/AuroraBackground'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid-bg min-h-screen relative">
      <AuroraBackground />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}
