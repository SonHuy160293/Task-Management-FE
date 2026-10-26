import { useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import {
  ArrowUpRight,
  ChevronDown,
  ChevronRight,
  ChevronsUpDown,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  ShieldCheck,
  UserRound,
  Building2,
  LogOut,
  HelpCircle,
} from 'lucide-react';
import { Brand } from '@/components/layout/brand';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useUiStore } from '@/stores/ui-store';
import { navigation } from '@/routes/navigation';
import { cn } from '@/lib/utils/cn';
import { useAuth } from '@/app/providers/auth-provider';
import { toast } from 'sonner';

function Sidebar({
  collapsed = false,
  onNavigate,
}: {
  collapsed?: boolean;
  onNavigate?: () => void;
}) {
  return (
    <div className="flex h-full flex-col">
      <div
        className={cn('flex h-[78px] items-center px-6', collapsed && 'px-4')}
      >
        <Brand collapsed={collapsed} />
      </div>
      <div className={cn('px-4 pb-6', collapsed && 'px-2')}>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger
            className={cn(
              'flex w-full items-center gap-3 rounded-xl border bg-background p-3 text-left shadow-xs hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring',
              collapsed && 'justify-center px-1',
            )}
            aria-label="Organization switcher"
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-primary">
              <Building2 size={17} />
            </span>
            {!collapsed && (
              <>
                <span className="min-w-0 flex-1">
                  <span className="block text-xs font-semibold">
                    Your workspace
                  </span>
                  <span className="block text-[11px] text-muted-foreground">
                    No organization connected
                  </span>
                </span>
                <ChevronsUpDown size={14} className="text-muted-foreground" />
              </>
            )}
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              sideOffset={8}
              className="z-50 w-64 rounded-lg border bg-background p-2 shadow-lg"
            >
              <DropdownMenu.Label className="px-2 py-2 text-xs font-semibold">
                Organization switching
              </DropdownMenu.Label>
              <DropdownMenu.Label className="px-2 pb-3 text-xs leading-5 font-normal text-muted-foreground">
                Membership and organization endpoints must be connected before a
                workspace can be selected.
              </DropdownMenu.Label>
              <DropdownMenu.Item asChild>
                <Link
                  to="/organizations"
                  onClick={onNavigate}
                  className="block rounded px-2 py-2 text-sm outline-none focus:bg-accent"
                >
                  View availability
                  <ChevronRight className="float-right size-4" />
                </Link>
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
      <div
        className={cn(
          'px-6 pb-3 text-[10px] font-semibold tracking-[0.15em] text-slate-500',
          collapsed && 'sr-only',
        )}
      >
        WORKSPACE
      </div>
      <nav aria-label="Main navigation" className="space-y-1 px-3">
        {navigation.slice(0, 4).map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            onClick={onNavigate}
            title={collapsed ? label : undefined}
            className={({ isActive }) =>
              cn(
                'flex h-11 items-center gap-3 rounded-lg px-3 text-[13px] font-medium transition-colors',
                isActive
                  ? 'bg-indigo-50 text-primary'
                  : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900',
                collapsed && 'justify-center px-0',
              )
            }
          >
            <Icon className="size-[18px] shrink-0" />
            {!collapsed && (
              <>
                <span className="flex-1">{label}</span>
                {(label === 'Teams' || label === 'Organizations') && (
                  <span
                    className="size-1.5 rounded-full bg-slate-300"
                    aria-label="Integration pending"
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>
      {!collapsed && (
        <div className="mx-6 mt-7 border-t pt-5">
          <p className="text-[10px] font-semibold tracking-[0.15em] text-slate-500">
            COMING LATER
          </p>
          <p className="mt-3 text-xs leading-6 text-slate-500">
            Projects & work items
            <br />
            Goals & reporting
          </p>
        </div>
      )}
      <div className="mt-auto p-3">
        {!collapsed && (
          <div className="mb-5 rounded-xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-white p-4">
            <span className="mb-3 flex size-8 items-center justify-center rounded-lg bg-white text-primary shadow-xs">
              <ShieldCheck size={17} />
            </span>
            <p className="text-xs font-semibold">A foundation you can trust</p>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              Scoped access. Clear boundaries. Your team’s next chapter.
            </p>
            <Link
              to="/guide"
              onClick={onNavigate}
              className="mt-3 flex items-center gap-1 text-xs font-medium text-primary"
            >
              Explore DevFlow
              <ArrowUpRight size={13} />
            </Link>
          </div>
        )}
        {navigation.slice(4).map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onNavigate}
            title={collapsed ? label : undefined}
            className="flex h-10 items-center gap-3 rounded-lg px-3 text-xs text-muted-foreground hover:bg-accent"
          >
            <Icon className="size-4 shrink-0" />
            {!collapsed && label}
          </NavLink>
        ))}
      </div>
    </div>
  );
}

export default function AppLayout() {
  const collapsed = useUiStore((state) => state.sidebarCollapsed);
  const setCollapsed = useUiStore((state) => state.setSidebarCollapsed);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState('');
  const location = useLocation();
  const auth = useAuth();
  const page =
    navigation.find(
      (item) => item.to !== '/' && location.pathname.startsWith(item.to),
    )?.label || 'Overview';
  return (
    <div className="min-h-screen bg-slate-50/70">
      <a
        href="#main-content"
        className="sr-only fixed left-4 top-4 z-[100] rounded bg-primary p-3 text-white focus:not-sr-only"
      >
        Skip to main content
      </a>
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-30 hidden border-r border-border bg-[#fcfcfd] transition-[width] lg:block',
          collapsed ? 'w-[76px]' : 'w-[250px]',
        )}
      >
        <Sidebar collapsed={collapsed} />
      </aside>
      <div
        className={cn(
          'transition-[padding] lg:pl-[250px]',
          collapsed && 'lg:pl-[76px]',
        )}
      >
        <header className="flex h-[78px] items-center justify-between gap-4 border-b bg-background px-5 sm:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              aria-label="Open navigation"
              onClick={() => setMobileOpen(true)}
            >
              <Menu />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="hidden text-muted-foreground lg:inline-flex"
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              onClick={() => setCollapsed(!collapsed)}
            >
              {collapsed ? <PanelLeftOpen /> : <PanelLeftClose />}
            </Button>
            <div className="hidden h-4 w-px bg-border sm:block" />
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-2 text-xs"
            >
              <Link to="/" className="hidden text-muted-foreground sm:inline">
                Workspace
              </Link>
              <ChevronRight
                size={13}
                className="hidden text-slate-300 sm:block"
              />
              <span className="truncate font-medium">{page}</span>
            </nav>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => setSearchOpen(true)}
              className="flex h-9 items-center gap-2 rounded-lg border px-3 text-xs text-muted-foreground hover:bg-accent"
              aria-label="Search navigation"
            >
              <Search size={15} />
              <span className="hidden sm:inline">Find a page…</span>
            </button>
            <Badge className="hidden sm:inline-flex">
              <span className="size-1.5 rounded-full bg-amber-400" />
              Setup mode
            </Badge>
            <DropdownMenu.Root>
              <DropdownMenu.Trigger
                aria-label="User menu"
                className="flex items-center gap-2 rounded-lg p-1.5 focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span className="flex size-8 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-slate-500">
                  <UserRound size={16} />
                </span>
                <ChevronDown size={13} className="text-muted-foreground" />
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  align="end"
                  sideOffset={12}
                  className="z-50 min-w-52 rounded-lg border bg-background p-1.5 text-sm shadow-lg"
                >
                  <DropdownMenu.Label className="px-2 py-2 text-xs text-muted-foreground">
                    {auth.identity?.user.displayName || 'Welcome to DevFlow'}
                  </DropdownMenu.Label>
                  <DropdownMenu.Separator className="my-1 h-px bg-border" />
                  <DropdownMenu.Item asChild>
                    <Link to="/register" className="menu-item">
                      <UserRound size={15} />
                      Create account
                    </Link>
                  </DropdownMenu.Item>
                  <DropdownMenu.Item asChild>
                    <Link to="/identity" className="menu-item">
                      <ShieldCheck size={15} />
                      Identity & access
                    </Link>
                  </DropdownMenu.Item>
                  <DropdownMenu.Item asChild>
                    <Link to="/guide" className="menu-item">
                      <HelpCircle size={15} />
                      Help & learning
                    </Link>
                  </DropdownMenu.Item>
                  {auth.status === 'authenticated' && (
                    <DropdownMenu.Item
                      className="menu-item"
                      onSelect={() => {
                        void auth
                          .logout()
                          .catch(() =>
                            toast.error(
                              'The local session was cleared, but remote logout could not be confirmed.',
                            ),
                          );
                      }}
                    >
                      <LogOut size={15} />
                      Sign out
                    </DropdownMenu.Item>
                  )}
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </div>
        </header>
        <main
          id="main-content"
          tabIndex={-1}
          className="mx-auto max-w-[1500px] px-5 py-7 outline-none sm:px-8 lg:px-10 lg:py-9"
        >
          <Outlet />
        </main>
        <footer className="mx-5 flex flex-wrap items-center justify-between gap-2 border-t px-0 py-5 text-[11px] text-slate-500 sm:mx-8 lg:mx-10">
          <span>DevFlow · Your engineering workspace</span>
          <Link to="/settings" className="hover:text-primary">
            Integration status
            <ArrowUpRight className="ml-1 inline size-3" />
          </Link>
        </footer>
      </div>
      <DialogPrimitive.Root open={mobileOpen} onOpenChange={setMobileOpen}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-slate-950/35" />
          <DialogPrimitive.Content className="fixed inset-y-0 left-0 z-50 w-[280px] bg-background">
            <DialogPrimitive.Title className="sr-only">
              Navigation
            </DialogPrimitive.Title>
            <DialogPrimitive.Description className="sr-only">
              Choose a DevFlow page.
            </DialogPrimitive.Description>
            <Sidebar onNavigate={() => setMobileOpen(false)} />
            <DialogPrimitive.Close className="absolute right-2 top-6 rounded p-2 text-xs focus-visible:ring-2 focus-visible:ring-ring">
              Close
            </DialogPrimitive.Close>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent>
          <DialogTitle>Find your way</DialogTitle>
          <DialogDescription>
            Jump to a page in your workspace.
          </DialogDescription>
          <Input
            className="mt-5"
            aria-label="Search pages"
            placeholder="Search pages…"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <div className="mt-3 space-y-1">
            {navigation
              .filter((item) =>
                `${item.label} ${item.description}`
                  .toLowerCase()
                  .includes(search.toLowerCase()),
              )
              .map(({ to, label, description, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => {
                    setSearchOpen(false);
                    setSearch('');
                  }}
                  className="flex items-center gap-3 rounded-lg p-3 hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Icon className="size-5 text-muted-foreground" />
                  <span>
                    <span className="block text-sm font-medium">{label}</span>
                    <span className="text-xs text-muted-foreground">
                      {description}
                    </span>
                  </span>
                </Link>
              ))}
            {!navigation.some((item) =>
              `${item.label} ${item.description}`
                .toLowerCase()
                .includes(search.toLowerCase()),
            ) && (
              <p role="status" className="p-4 text-sm text-muted-foreground">
                No pages found.
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
