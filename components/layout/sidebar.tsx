"use client";

import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  HardHat,
  Package,
  ClipboardCheck,
  Boxes,
  Receipt,
  ChevronLeft,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, id: "dashboard" },
  { label: "Vendors", icon: Users, id: "vendors" },
  { label: "Labour", icon: HardHat, id: "labour" },
  { label: "Material", icon: Package, id: "material" },
  { label: "Labour Attendance", icon: ClipboardCheck, id: "labour-attendance" },
  { label: "Material Stock", icon: Boxes, id: "material-stock" },
  { label: "Other Expenses", icon: Receipt, id: "other" },
];

interface SidebarProps {
  activeItem: string;
  onItemClick: (id: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onMobileOpenChange: (open: boolean) => void;
}

function SidebarContent({
  activeItem,
  onItemClick,
  collapsed,
  onToggleCollapse,
  isMobile,
}: {
  activeItem: string;
  onItemClick: (id: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  isMobile: boolean;
}) {
  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-border/50 px-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80 shadow-md shadow-primary/20">
          <Building2 className="h-5 w-5 text-white" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <h2 className="truncate text-sm font-bold tracking-tight text-foreground">
              Dhruvanshi
            </h2>
            <p className="truncate text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
              Construction
            </p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {navItems.map((item) => {
          const isActive = activeItem === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onItemClick(item.id)}
              className={cn(
                "group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary/10 text-primary shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-full bg-primary" />
              )}
              <item.icon
                className={cn(
                  "h-4.5 w-4.5 shrink-0 transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground group-hover:text-foreground"
                )}
              />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Collapse toggle (desktop only) */}
      {!isMobile && (
        <div className="border-t border-border/50 p-3">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-center"
            onClick={onToggleCollapse}
          >
            <ChevronLeft
              className={cn(
                "h-4 w-4 transition-transform duration-200",
                collapsed && "rotate-180"
              )}
            />
          </Button>
        </div>
      )}
    </div>
  );
}

export function AppSidebar({
  activeItem,
  onItemClick,
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onMobileOpenChange,
}: SidebarProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Sheet open={mobileOpen} onOpenChange={onMobileOpenChange}>
        <SheetContent side="left" className="w-72 p-0">
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
          <SidebarContent
            activeItem={activeItem}
            onItemClick={(id) => {
              onItemClick(id);
              onMobileOpenChange(false);
            }}
            collapsed={false}
            onToggleCollapse={onToggleCollapse}
            isMobile={true}
          />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-30 h-screen border-r border-border/50 bg-card/80 backdrop-blur-xl transition-all duration-300",
        collapsed ? "w-[72px]" : "w-64"
      )}
    >
      <SidebarContent
        activeItem={activeItem}
        onItemClick={onItemClick}
        collapsed={collapsed}
        onToggleCollapse={onToggleCollapse}
        isMobile={false}
      />
    </aside>
  );
}
