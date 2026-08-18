import { Outlet } from 'react-router-dom'
import { SideNav } from '@/components/layout/SideNav'
import { StatusBar } from '@/components/layout/StatusBar'

export function AppShell() {
  return (
    <div className="flex min-h-dvh flex-col bg-void md:flex-row">
      <SideNav />
      <div className="flex min-w-0 flex-1 flex-col pb-16 md:pb-0">
        <StatusBar />
        <main className="relative min-h-0 flex-1 overflow-y-auto">
          <div className="pointer-events-none absolute inset-0 grid-fade opacity-70" />
          <div className="relative z-10 px-4 py-6 md:px-8 md:py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
