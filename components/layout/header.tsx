"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Menu,
  Search,
  FileDown,
  FileSpreadsheet,
  Sun,
  Moon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useIsMobile } from "@/hooks/use-mobile";

interface HeaderProps {
  onMenuClick: () => void;
  onExportPDF: () => void;
  onExportExcel: () => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  hasEntries: boolean;
}

export function AppHeader({
  onMenuClick,
  onExportPDF,
  onExportExcel,
  searchValue,
  onSearchChange,
  hasEntries,
}: HeaderProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const isMobile = useIsMobile();

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border/50 bg-background/80 px-4 backdrop-blur-xl md:px-6">
      {/* Mobile menu */}
      {isMobile && (
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0 md:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>
      )}

      {/* Title (hidden on mobile) */}
      <div className="hidden items-center gap-2 md:flex">
        <h1 className="text-lg font-bold tracking-tight text-foreground">
          Dashboard
        </h1>
      </div>

      {/* Search */}
      <div className="relative ml-auto max-w-sm flex-1 md:ml-0 md:max-w-xs">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search entries..."
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-9 pl-9 text-sm"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          size="sm"
          className="hidden gap-1.5 text-xs sm:flex"
          onClick={onExportPDF}
          disabled={!hasEntries}
        >
          <FileDown className="h-3.5 w-3.5" />
          Export to PDF
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="hidden gap-1.5 text-xs sm:flex"
          onClick={onExportExcel}
          disabled={!hasEntries}
        >
          <FileSpreadsheet className="h-3.5 w-3.5" />
          Export to Excel
        </Button>
        {/* Mobile export buttons */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 sm:hidden"
          onClick={onExportPDF}
          disabled={!hasEntries}
        >
          <FileDown className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 sm:hidden"
          onClick={onExportExcel}
          disabled={!hasEntries}
        >
          <FileSpreadsheet className="h-4 w-4" />
        </Button>

        {/* Theme toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() =>
            setTheme(resolvedTheme === "dark" ? "light" : "dark")
          }
        >
          {resolvedTheme === "dark" ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </Button>
      </div>
    </header>
  );
}
