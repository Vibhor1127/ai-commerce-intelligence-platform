import { NavLink } from 'react-router-dom'
import { Command, Cpu, Radio } from 'lucide-react'
import { BrandMark } from '@/components/ui/BrandMark'
import { cn } from '@/lib/cn'

const items = [
  { to: '/', label: 'Command', icon: Command, end: true },
  { to: '/ask', label: 'Ask', icon: Radio },
  { to: '/capabilities', label: 'Mesh', icon: Cpu },
]

export function SideNav() {
  return (
    <aside className="fixed inset-x-0 bottom-0 z-30 flex border-t border-white/5 bg-[#070a14]/95 backdrop-blur md:static md:h-auto md:w-[88px] md:flex-col md:border-r md:border-t-0">
      <div className="hidden items-center justify-center px-3 py-5 md:flex">
        <BrandMark compact />
      </div>
      <nav className="flex w-full items-stretch justify-around md:flex-1 md:flex-col md:justify-start md:gap-1 md:px-2">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cn(
                'flex flex-1 flex-col items-center gap-1 py-3 text-[10px] uppercase tracking-[0.16em] text-mute transition md:flex-none',
                isActive ? 'text-cyan' : 'hover:text-ivory',
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon size={18} strokeWidth={1.6} />
                <span>{item.label}</span>
                <span className={cn('h-px w-6', isActive ? 'bg-cyan' : 'bg-transparent')} />
              </>
            )}
          </NavLink>
        ))}
      </nav>
      <div className="hidden px-3 pb-5 text-center font-mono text-[9px] uppercase tracking-[0.2em] text-mute/70 md:block">
        v1.0
      </div>
    </aside>
  )
}
