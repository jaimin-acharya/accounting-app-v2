"use client";

import { getCategoryBreakdown } from "@/lib/calculations";
import { Entry } from "@/types/entry";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

interface CategoryChartProps {
  entries: Entry[];
}

const barColors: Record<string, string> = {
  Vendor: "bg-violet-500",
  Labour: "bg-blue-500",
  Material: "bg-primary",
  "Labour Attendance": "bg-emerald-500",
  "Material Stock": "bg-slate-500",
  Other: "bg-zinc-500",
};

const dotColors: Record<string, string> = {
  Vendor: "bg-violet-500",
  Labour: "bg-blue-500",
  Material: "bg-primary",
  "Labour Attendance": "bg-emerald-500",
  "Material Stock": "bg-slate-500",
  Other: "bg-zinc-500",
};

function formatCurrency(value: number): string {
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
  if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
  return `₹${value.toLocaleString("en-IN")}`;
}

export function CategoryChart({ entries }: CategoryChartProps) {
  const breakdown = getCategoryBreakdown(entries);
  const maxValue = Math.max(...breakdown.map((b) => b.total), 1);

  if (breakdown.length === 0) {
    return null;
  }

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <BarChart3 className="h-4 w-4 text-primary" />
          Expenses by Category
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {breakdown.map((item) => (
          <div key={item.category} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "h-2.5 w-2.5 rounded-full",
                    dotColors[item.category] || "bg-zinc-500"
                  )}
                />
                <span className="font-medium">{item.category}</span>
              </div>
              <span className="font-semibold tabular-nums">
                {formatCurrency(item.total)}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-700 ease-out",
                  barColors[item.category] || "bg-zinc-500"
                )}
                style={{ width: `${(item.total / maxValue) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
