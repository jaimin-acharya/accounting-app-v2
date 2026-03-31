import { Entry, Category } from "@/types/entry";

export interface DashboardStats {
  totalExpenses: number;
  vendorPayments: number;
  labourCost: number;
  materialPurchases: number;
  labourAttendanceCount: number;
  availableMaterialStock: number;
  totalDebit: number;
  totalCredit: number;
  balance: number;
}

export function calculateStats(entries: Entry[]): DashboardStats {
  let totalExpenses = 0;
  let vendorPayments = 0;
  let labourCost = 0;
  let materialPurchases = 0;
  let labourAttendanceCount = 0;
  let availableMaterialStock = 0;
  let totalDebit = 0;
  let totalCredit = 0;

  for (const entry of entries) {
    if (entry.transactionType === "Debit") {
      totalExpenses += entry.amount;
      totalDebit += entry.amount;
    } else {
      totalCredit += entry.amount;
    }

    if (entry.category === "Vendor") {
      vendorPayments += entry.amount;
    } else if (entry.category === "Labour") {
      labourCost += entry.amount;
    } else if (entry.category === "Material") {
      materialPurchases += entry.amount;
    } else if (entry.category === "Labour Attendance") {
      labourAttendanceCount += entry.quantity;
    } else if (entry.category === "Material Stock") {
      availableMaterialStock += entry.quantity;
    }
  }

  return {
    totalExpenses,
    vendorPayments,
    labourCost,
    materialPurchases,
    labourAttendanceCount,
    availableMaterialStock,
    totalDebit,
    totalCredit,
    balance: totalDebit - totalCredit,
  };
}

export function filterEntries(
  entries: Entry[],
  filters: {
    search: string;
    category: string;
    siteName: string;
    transactionType: string;
  }
): Entry[] {
  return entries.filter((entry) => {
    const searchLower = filters.search.toLowerCase();
    const matchesSearch =
      !filters.search ||
      entry.siteName.toLowerCase().includes(searchLower) ||
      entry.partyName.toLowerCase().includes(searchLower) ||
      entry.notes.toLowerCase().includes(searchLower);

    const matchesCategory =
      !filters.category ||
      filters.category === "All" ||
      entry.category === filters.category;

    const matchesSite =
      !filters.siteName ||
      filters.siteName === "All" ||
      entry.siteName === filters.siteName;

    const matchesType =
      !filters.transactionType ||
      filters.transactionType === "All" ||
      entry.transactionType === filters.transactionType;

    return matchesSearch && matchesCategory && matchesSite && matchesType;
  });
}

export function getUniqueSiteNames(entries: Entry[]): string[] {
  const sites = new Set(entries.map((e) => e.siteName).filter(Boolean));
  return Array.from(sites).sort();
}

export function getCategoryBreakdown(
  entries: Entry[]
): { category: Category; total: number }[] {
  const map = new Map<Category, number>();
  for (const entry of entries) {
    if (entry.transactionType === "Debit") {
      map.set(entry.category, (map.get(entry.category) || 0) + entry.amount);
    }
  }
  return Array.from(map.entries())
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total);
}
