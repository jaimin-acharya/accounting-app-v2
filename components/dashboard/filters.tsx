"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CATEGORIES } from "@/types/entry";
import { Search, RotateCcw } from "lucide-react";

interface FiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  siteName: string;
  onSiteNameChange: (value: string) => void;
  transactionType: string;
  onTransactionTypeChange: (value: string) => void;
  uniqueSiteNames: string[];
  onReset: () => void;
}

export function Filters({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  siteName,
  onSiteNameChange,
  transactionType,
  onTransactionTypeChange,
  uniqueSiteNames,
  onReset,
}: FiltersProps) {
  return (
    <div className="flex flex-wrap items-end gap-3">
      {/* Search */}
      <div className="relative min-w-[200px] flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search site, party, notes..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-9 pl-9 text-sm"
        />
      </div>

      {/* Category filter */}
      <Select value={category} onValueChange={onCategoryChange}>
        <SelectTrigger className="h-9 w-[160px] text-sm">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="All">All Categories</SelectItem>
          {CATEGORIES.map((cat) => (
            <SelectItem key={cat} value={cat}>
              {cat}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Site Name filter */}
      <Select value={siteName} onValueChange={onSiteNameChange}>
        <SelectTrigger className="h-9 w-[160px] text-sm">
          <SelectValue placeholder="Site" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="All">All Sites</SelectItem>
          {uniqueSiteNames.map((site) => (
            <SelectItem key={site} value={site}>
              {site}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Transaction Type filter */}
      <Select value={transactionType} onValueChange={onTransactionTypeChange}>
        <SelectTrigger className="h-9 w-[130px] text-sm">
          <SelectValue placeholder="Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="All">All Types</SelectItem>
          <SelectItem value="Debit">Debit</SelectItem>
          <SelectItem value="Credit">Credit</SelectItem>
        </SelectContent>
      </Select>

      {/* Reset */}
      <Button
        variant="ghost"
        size="sm"
        className="h-9 gap-1.5 text-xs text-muted-foreground"
        onClick={onReset}
      >
        <RotateCcw className="h-3.5 w-3.5" />
        Reset
      </Button>
    </div>
  );
}
