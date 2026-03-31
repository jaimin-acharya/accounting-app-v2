"use client";

import { DashboardStats } from "@/lib/calculations";
import { Card, CardContent } from "@/components/ui/card";
import {
  IndianRupee,
  Users,
  HardHat,
  Package,
  ClipboardCheck,
  Boxes,
  TrendingUp,
  TrendingDown,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardsProps {
  stats: DashboardStats;
}

function formatCurrency(value: number): string {
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
  if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
  return `₹${value.toLocaleString("en-IN")}`;
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      label: "Total Expenses",
      value: formatCurrency(stats.totalExpenses),
      rawValue: stats.totalExpenses,
      icon: IndianRupee,
      gradient: "from-rose-500 to-pink-600",
      bgGlow: "bg-rose-500/10",
      iconBg: "bg-rose-500/15",
      iconColor: "text-rose-500",
    },
    {
      label: "Vendor Payments",
      value: formatCurrency(stats.vendorPayments),
      rawValue: stats.vendorPayments,
      icon: Users,
      gradient: "from-violet-500 to-purple-600",
      bgGlow: "bg-violet-500/10",
      iconBg: "bg-violet-500/15",
      iconColor: "text-violet-500",
    },
    {
      label: "Labour Cost",
      value: formatCurrency(stats.labourCost),
      rawValue: stats.labourCost,
      icon: HardHat,
      gradient: "from-blue-500 to-cyan-600",
      bgGlow: "bg-blue-500/10",
      iconBg: "bg-blue-500/15",
      iconColor: "text-blue-500",
    },
    {
      label: "Material Purchases",
      value: formatCurrency(stats.materialPurchases),
      rawValue: stats.materialPurchases,
      icon: Package,
      gradient: "from-amber-500 to-orange-600",
      bgGlow: "bg-amber-500/10",
      iconBg: "bg-amber-500/15",
      iconColor: "text-amber-500",
    },
    {
      label: "Labour Attendance",
      value: stats.labourAttendanceCount.toString(),
      rawValue: stats.labourAttendanceCount,
      icon: ClipboardCheck,
      gradient: "from-emerald-500 to-teal-600",
      bgGlow: "bg-emerald-500/10",
      iconBg: "bg-emerald-500/15",
      iconColor: "text-emerald-500",
    },
    {
      label: "Material Stock",
      value: stats.availableMaterialStock.toString(),
      rawValue: stats.availableMaterialStock,
      icon: Boxes,
      gradient: "from-slate-500 to-zinc-600",
      bgGlow: "bg-slate-500/10",
      iconBg: "bg-slate-500/15",
      iconColor: "text-slate-500",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Main stat cards grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {cards.map((card) => (
          <Card
            key={card.label}
            className="group relative overflow-hidden border-border/50 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
          >
            <div
              className={cn(
                "absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100",
                card.bgGlow
              )}
            />
            <CardContent className="relative p-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">
                    {card.label}
                  </p>
                  <p className="text-xl font-bold tracking-tight">
                    {card.value}
                  </p>
                </div>
                <div
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                    card.iconBg
                  )}
                >
                  <card.icon className={cn("h-4.5 w-4.5", card.iconColor)} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Debit / Credit / Balance summary row */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-emerald-500/20 bg-emerald-500/5">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15">
              <TrendingDown className="h-5 w-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                Total Credit
              </p>
              <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                {formatCurrency(stats.totalCredit)}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-rose-500/20 bg-rose-500/5">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/15">
              <TrendingUp className="h-5 w-5 text-rose-500" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                Total Debit
              </p>
              <p className="text-lg font-bold text-rose-600 dark:text-rose-400">
                {formatCurrency(stats.totalDebit)}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-amber-500/20 bg-amber-500/5">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15">
              <Wallet className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                Balance
              </p>
              <p className="text-lg font-bold text-amber-600 dark:text-amber-400">
                {formatCurrency(stats.balance)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
