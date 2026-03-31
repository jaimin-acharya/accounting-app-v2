"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Entry } from "@/types/entry";
import { loadEntries, saveEntries } from "@/lib/storage";
import {
  calculateStats,
  filterEntries,
  getUniqueSiteNames,
} from "@/lib/calculations";
import { exportToPDF, exportToExcel } from "@/lib/export";
import { AppSidebar } from "@/components/layout/sidebar";
import { AppHeader } from "@/components/layout/header";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { EntryForm } from "@/components/dashboard/entry-form";
import { Filters } from "@/components/dashboard/filters";
import { EntriesTable } from "@/components/dashboard/entries-table";
import { CategoryChart } from "@/components/dashboard/category-chart";
import { RecentEntries } from "@/components/dashboard/recent-entries";
import { Toaster, toast } from "sonner";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

export default function DashboardPage() {
  const isMobile = useIsMobile();

  // State
  const [entries, setEntries] = useState<Entry[]>([]);
  const [editingEntry, setEditingEntry] = useState<Entry | null>(null);
  const [activeNav, setActiveNav] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Filters
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterSite, setFilterSite] = useState("All");
  const [filterType, setFilterType] = useState("All");

  // Load on mount
  useEffect(() => {
    setMounted(true);
    setEntries(loadEntries());
  }, []);

  // Save when entries change
  useEffect(() => {
    if (mounted) {
      saveEntries(entries);
    }
  }, [entries, mounted]);

  // Sorted entries (newest first)
  const sortedEntries = useMemo(
    () =>
      [...entries].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      ),
    [entries]
  );

  // Filtered entries
  const filteredEntries = useMemo(
    () =>
      filterEntries(sortedEntries, {
        search,
        category: filterCategory,
        siteName: filterSite,
        transactionType: filterType,
      }),
    [sortedEntries, search, filterCategory, filterSite, filterType]
  );

  // Stats
  const stats = useMemo(() => calculateStats(entries), [entries]);

  // Unique site names
  const uniqueSiteNames = useMemo(
    () => getUniqueSiteNames(entries),
    [entries]
  );

  // Handlers
  const handleSubmit = useCallback(
    (entry: Entry) => {
      setEntries((prev) => {
        const exists = prev.find((e) => e.id === entry.id);
        if (exists) {
          toast.success("Entry updated successfully");
          return prev.map((e) => (e.id === entry.id ? entry : e));
        } else {
          toast.success("Entry added successfully");
          return [...prev, entry];
        }
      });
      setEditingEntry(null);
    },
    []
  );

  const handleDelete = useCallback((id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
    toast.success("Entry deleted");
  }, []);

  const handleEditFromPopup = useCallback(
    (entry: Entry) => {
      setEntries((prev) => {
        const exists = prev.find((e) => e.id === entry.id);
        if (exists) {
          toast.success("Entry updated successfully");
          return prev.map((e) => (e.id === entry.id ? entry : e));
        } else {
          toast.success("Entry duplicated successfully");
          return [...prev, entry];
        }
      });
    },
    []
  );

  const handleDuplicate = useCallback(
    (entry: Entry) => {
      const duplicated: Entry = {
        ...entry,
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        createdAt: new Date().toISOString(),
      };
      setEntries((prev) => [...prev, duplicated]);
      toast.success("Entry duplicated successfully");
    },
    []
  );

  const handleExportPDF = useCallback(() => {
    exportToPDF(filteredEntries);
    toast.success("PDF exported");
  }, [filteredEntries]);

  const handleExportExcel = useCallback(() => {
    exportToExcel(filteredEntries);
    toast.success("Excel exported");
  }, [filteredEntries]);

  const handleResetFilters = useCallback(() => {
    setSearch("");
    setFilterCategory("All");
    setFilterSite("All");
    setFilterType("All");
  }, []);

  // Apply nav filter
  useEffect(() => {
    switch (activeNav) {
      case "vendors":
        setFilterCategory("Vendor");
        break;
      case "labour":
        setFilterCategory("Labour");
        break;
      case "material":
        setFilterCategory("Material");
        break;
      case "labour-attendance":
        setFilterCategory("Labour Attendance");
        break;
      case "material-stock":
        setFilterCategory("Material Stock");
        break;
      case "other":
        setFilterCategory("Other");
        break;
      default:
        setFilterCategory("All");
    }
  }, [activeNav]);

  if (!mounted) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary/30 border-t-primary" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster
        position="top-right"
        richColors
        toastOptions={{
          className: "text-sm",
        }}
      />

      <AppSidebar
        activeItem={activeNav}
        onItemClick={setActiveNav}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileOpen}
        onMobileOpenChange={setMobileOpen}
      />

      <div
        className={cn(
          "min-h-screen transition-all duration-300",
          isMobile ? "ml-0" : sidebarCollapsed ? "ml-[72px]" : "ml-64"
        )}
      >
        <AppHeader
          onMenuClick={() => setMobileOpen(true)}
          onExportPDF={handleExportPDF}
          onExportExcel={handleExportExcel}
          searchValue={search}
          onSearchChange={setSearch}
          hasEntries={entries.length > 0}
        />

        <main className="space-y-6 p-4 md:p-6">
          {/* Stats Overview */}
          <StatsCards stats={stats} />

          {/* Middle section: Form + Charts */}
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <EntryForm
                editingEntry={editingEntry}
                onSubmit={handleSubmit}
                onCancelEdit={() => setEditingEntry(null)}
              />
            </div>
            <div className="space-y-6">
              <CategoryChart entries={entries} />
              <RecentEntries entries={sortedEntries} />
            </div>
          </div>

          {/* Filters */}
          <Filters
            search={search}
            onSearchChange={setSearch}
            category={filterCategory}
            onCategoryChange={setFilterCategory}
            siteName={filterSite}
            onSiteNameChange={setFilterSite}
            transactionType={filterType}
            onTransactionTypeChange={setFilterType}
            uniqueSiteNames={uniqueSiteNames}
            onReset={handleResetFilters}
          />

          {/* Table */}
          <EntriesTable
            entries={filteredEntries}
            onEdit={handleEditFromPopup}
            onDelete={handleDelete}
            onDuplicate={handleDuplicate}
          />

          {/* Footer */}
          <div className="pb-4 text-center text-xs text-muted-foreground">
            {filteredEntries.length} of {entries.length} entries shown
          </div>
        </main>
      </div>
    </>
  );
}
