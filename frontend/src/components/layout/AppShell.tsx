import { Outlet } from 'react-router-dom'
import { SideNav } from '@/components/layout/SideNav'
import { StatusBar } from '@/components/layout/StatusBar'

export function AppShell() {
  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-void md:flex-row">
      <SideNav />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col pb-16 md:pb-0">
        <StatusBar />
        <main className="relative min-h-0 flex-1 overflow-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
