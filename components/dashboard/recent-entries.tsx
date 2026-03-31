"use client";

import { Entry } from "@/types/entry";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface RecentEntriesProps {
  entries: Entry[];
}

export function RecentEntries({ entries }: RecentEntriesProps) {
  const recent = entries.slice(0, 5);

  if (recent.length === 0) return null;

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Clock className="h-4 w-4 text-primary" />
          Recent Entries
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {recent.map((entry) => (
          <div
            key={entry.id}
            className="flex items-center justify-between gap-3 rounded-lg border border-border/30 p-3 transition-colors hover:bg-muted/50"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="truncate text-sm font-medium">
                  {entry.partyName}
                </p>
                <Badge
                  variant="outline"
                  className={cn(
                    "shrink-0 text-[9px]",
                    entry.transactionType === "Debit"
                      ? "border-rose-200 text-rose-600 dark:border-rose-500/30 dark:text-rose-400"
                      : "border-emerald-200 text-emerald-600 dark:border-emerald-500/30 dark:text-emerald-400"
                  )}
                >
                  {entry.transactionType}
                </Badge>
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {entry.siteName} · {entry.category}
              </p>
            </div>
            <span className="shrink-0 text-sm font-semibold tabular-nums">
              ₹{entry.amount.toLocaleString("en-IN")}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
