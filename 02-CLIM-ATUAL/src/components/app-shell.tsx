import { Link, useRouterState } from "@tanstack/react-router";
import {
  CalendarClock,
  CalendarDays,
  LayoutDashboard,
  ListChecks,
  Menu,
  Settings,
  ShieldCheck,
  Stethoscope,
  UserCog,
  Users,
} from "lucide-react";
import { useState, type ComponentType, type ReactNode } from "react";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

type NavItem = { to: string; label: string; icon: ComponentType<{ className?: string }> };

const NAV_ITEMS: NavItem[] = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/agenda", label: "Agenda", icon: CalendarDays },
  { to: "/pacientes", label: "Pacientes", icon: Users },
  { to: "/profissionais", label: "Profissionais", icon: UserCog },
  { to: "/convenios", label: "Convênios", icon: ShieldCheck },
  { to: "/atendimentos", label: "Atendimentos", icon: Stethoscope },
  { to: "/fila", label: "Fila de atendimento", icon: ListChecks },
  { to: "/feriados", label: "Feriados", icon: CalendarClock },
  { to: "/configuracoes", label: "Configurações", icon: Settings },
];

function Wordmark() {
  return (
    <div className="flex flex-col items-start px-5 py-5">
      <div className="flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#C7962D] shadow-lg">
          <span className="font-display text-lg font-bold text-white">C</span>
        </div>
        <div className="flex flex-col">
          <span className="font-display text-2xl font-bold leading-none tracking-tight text-white">
            CLIM
          </span>
          <span className="mt-0.5 text-[8px] font-bold uppercase tracking-[0.18em] text-[#E5C878]">
            Clínica Integrada Matonense
          </span>
        </div>
      </div>
    </div>
  );
}

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  return (
    <nav className="flex-1 space-y-0.5 overflow-y-auto px-3">
      {NAV_ITEMS.map((item) => {
        const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
        const Icon = item.icon;

        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            preload="render"
            className={cn(
              "group flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium transition-all duration-200",
              active
                ? "bg-gradient-to-r from-[#C7962D] to-[#E5C878] text-white shadow-md shadow-black/20"
                : "text-white/70 hover:bg-white/10 hover:text-white",
            )}
          >
            <Icon
              className={cn(
                "h-4 w-4 shrink-0 transition-transform group-hover:scale-110",
                active ? "text-white" : "text-white/60 group-hover:text-white",
              )}
            />
            <span className="truncate">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-[#F7F8F5] font-sans selection:bg-[#C7962D]/30 selection:text-[#07553F]">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[224px] flex-col bg-[#07553F] lg:flex">
        <Wordmark />
        <SidebarNav />
        <div className="mt-auto border-t border-white/10 p-4">
          <div className="rounded-xl bg-white/5 p-3">
            <p className="text-xs font-bold text-white">Uso interno</p>
            <p className="mt-0.5 text-[9px] text-white/50">Acesso local à CLIM</p>
          </div>
        </div>
      </aside>

      <div className="flex h-screen min-w-0 flex-1 flex-col lg:pl-[224px]">
        <header className="sticky top-0 z-30 h-16 shrink-0 w-full border-b border-[#E6ECE8] bg-white/80 backdrop-blur-md">
          <div className="flex h-full items-center justify-between gap-4 px-4 lg:px-6">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5 text-[#07553F]" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[260px] border-0 bg-[#07553F] p-0">
                <div className="flex h-full flex-col">
                  <Wordmark />
                  <SidebarNav onNavigate={() => setMobileOpen(false)} />
                </div>
              </SheetContent>
            </Sheet>

            <div className="text-right">
              <p className="text-xs font-bold text-[#202825]">CLIM</p>
              <p className="text-[9px] font-medium uppercase tracking-wider text-[#07553F]">
                Sistema local
              </p>
            </div>
          </div>
        </header>

        <main className="min-h-0 flex-1 overflow-auto">{children}</main>

        <footer className="flex h-[42px] w-full shrink-0 items-center justify-between bg-[#07553F] px-6 text-[10px] font-medium tracking-wide text-white">
          <span className="opacity-80">Clínica Integrada Matonense</span>
          <span className="opacity-60">Operação local</span>
        </footer>
      </div>
    </div>
  );
}
