import { Outlet } from 'react-router-dom'
import { Navbar } from '@/components/layout/Navbar'
import { UniverseCanvas } from '@/components/Three/UniverseCanvas'

export function AppShell() {
  return (
    <div className="relative min-h-screen bg-void font-sans text-bone selection:bg-cyan/20 selection:text-cyan">
      {/* Background 3D Universe Canvas */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <UniverseCanvas />
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-void/60 to-void" />
      </div>

      {/* Main OS Surface */}
      <div className="relative z-10 flex min-h-screen flex-col">
        <Navbar />
        <main className="mx-auto flex-1 w-full max-w-7xl px-4 py-6 md:px-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
