"use client";

import { Entry, Category, TransactionType, CATEGORIES, TRANSACTION_TYPES } from "@/types/entry";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Pencil,
  Copy,
  Trash2,
  Inbox,
  Save,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { generateId } from "@/lib/storage";

interface EntriesTableProps {
  entries: Entry[];
  onEdit: (entry: Entry) => void;
  onDelete: (id: string) => void;
  onDuplicate?: (entry: Entry) => void;
}

const categoryColors: Record<string, string> = {
  Vendor:
    "bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300",
  Labour:
    "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300",
  Material:
    "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary",
  "Labour Attendance":
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
  "Material Stock":
    "bg-slate-100 text-slate-700 dark:bg-slate-500/20 dark:text-slate-300",
  Other:
    "bg-zinc-100 text-zinc-700 dark:bg-zinc-500/20 dark:text-zinc-300",
};

export function EntriesTable({ entries, onEdit, onDelete, onDuplicate }: EntriesTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editEntry, setEditEntry] = useState<Entry | null>(null);
  const [editForm, setEditForm] = useState({
    date: "",
    siteName: "",
    category: "Vendor" as Category,
    partyName: "",
    quantity: 0,
    amount: 0,
    transactionType: "Debit" as TransactionType,
    notes: "",
  });
  const [editErrors, setEditErrors] = useState<Record<string, boolean>>({});

  function openEditDialog(entry: Entry) {
    setEditEntry(entry);
    setEditForm({
      date: entry.date,
      siteName: entry.siteName,
      category: entry.category,
      partyName: entry.partyName,
      quantity: entry.quantity,
      amount: entry.amount,
      transactionType: entry.transactionType,
      notes: entry.notes,
    });
    setEditErrors({});
  }

  function closeEditDialog() {
    setEditEntry(null);
    setEditErrors({});
  }

  function validateEdit(): boolean {
    const errs: Record<string, boolean> = {};
    if (!editForm.date) errs.date = true;
    if (!editForm.siteName.trim()) errs.siteName = true;
    if (!editForm.partyName.trim()) errs.partyName = true;
    setEditErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleEditSubmit() {
    if (!editEntry || !validateEdit()) return;
    const updated: Entry = {
      ...editEntry,
      date: editForm.date,
      siteName: editForm.siteName.trim(),
      category: editForm.category,
      partyName: editForm.partyName.trim(),
      quantity: Number(editForm.quantity) || 0,
      amount: Number(editForm.amount) || 0,
      transactionType: editForm.transactionType,
      notes: editForm.notes.trim(),
    };
    onEdit(updated);
    closeEditDialog();
  }

  function handleDuplicate(entry: Entry) {
    if (onDuplicate) {
      onDuplicate(entry);
    } else {
      const duplicated: Entry = {
        ...entry,
        id: generateId(),
        createdAt: new Date().toISOString(),
      };
      onEdit(duplicated);
    }
  }

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/50 py-16">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
          <Inbox className="h-7 w-7 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-sm font-semibold">No entries found</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Add your first entry using the form above.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto rounded-xl border border-border/50">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="text-xs font-semibold">Date</TableHead>
              <TableHead className="text-xs font-semibold">
                Site Name
              </TableHead>
              <TableHead className="text-xs font-semibold">Category</TableHead>
              <TableHead className="text-xs font-semibold">
                Party / Name
              </TableHead>
              <TableHead className="text-right text-xs font-semibold">
                Qty
              </TableHead>
              <TableHead className="text-right text-xs font-semibold">
                Amount
              </TableHead>
              <TableHead className="text-xs font-semibold">Type</TableHead>
              <TableHead className="text-xs font-semibold">Notes</TableHead>
              <TableHead className="w-[50px] text-right text-xs font-semibold">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map((entry, index) => (
              <TableRow
                key={entry.id}
                className={cn(
                  "group/row transition-colors",
                  index % 2 === 0 ? "bg-transparent" : "bg-muted/30"
                )}
              >
                <TableCell className="whitespace-nowrap text-xs">
                  {new Date(entry.date).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </TableCell>
                <TableCell className="text-xs font-medium">
                  {entry.siteName}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={cn(
                      "text-[10px] font-medium",
                      categoryColors[entry.category]
                    )}
                  >
                    {entry.category}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs">{entry.partyName}</TableCell>
                <TableCell className="text-right text-xs">
                  {entry.quantity}
                </TableCell>
                <TableCell className="text-right text-xs font-medium">
                  ₹{entry.amount.toLocaleString("en-IN")}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-[10px] font-semibold",
                      entry.transactionType === "Debit"
                        ? "border-rose-200 bg-rose-50 text-rose-600 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-400"
                        : "border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400"
                    )}
                  >
                    {entry.transactionType}
                  </Badge>
                </TableCell>
                <TableCell className="max-w-[200px] truncate text-xs text-muted-foreground">
                  {entry.notes || "—"}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 opacity-0 transition-opacity group-hover/row:opacity-100 data-[state=open]:opacity-100"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44">
                      <DropdownMenuItem
                        onClick={() => openEditDialog(entry)}
                        className="gap-2 text-xs"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Edit Entry
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDuplicate(entry)}
                        className="gap-2 text-xs"
                      >
                        <Copy className="h-3.5 w-3.5" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => setDeleteId(entry.id)}
                        variant="destructive"
                        className="gap-2 text-xs"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete Entry
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* ─── Edit Entry Dialog ─── */}
      <Dialog open={!!editEntry} onOpenChange={(open) => !open && closeEditDialog()}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Pencil className="h-4 w-4 text-primary" />
              Edit Entry
            </DialogTitle>
            <DialogDescription>
              Make changes to this entry. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              {/* Date */}
              <div className="space-y-1.5">
                <Label htmlFor="edit-date" className="text-xs font-medium">
                  Date <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="edit-date"
                  type="date"
                  value={editForm.date}
                  onChange={(e) =>
                    setEditForm({ ...editForm, date: e.target.value })
                  }
                  className={editErrors.date ? "border-destructive" : ""}
                />
              </div>

              {/* Site Name */}
              <div className="space-y-1.5">
                <Label htmlFor="edit-site" className="text-xs font-medium">
                  Site Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="edit-site"
                  placeholder="e.g. Sector 21 Site"
                  value={editForm.siteName}
                  onChange={(e) =>
                    setEditForm({ ...editForm, siteName: e.target.value })
                  }
                  className={editErrors.siteName ? "border-destructive" : ""}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Category */}
              <div className="space-y-1.5">
                <Label htmlFor="edit-category" className="text-xs font-medium">
                  Category
                </Label>
                <Select
                  value={editForm.category}
                  onValueChange={(v) =>
                    setEditForm({ ...editForm, category: v as Category })
                  }
                >
                  <SelectTrigger id="edit-category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Party Name */}
              <div className="space-y-1.5">
                <Label htmlFor="edit-party" className="text-xs font-medium">
                  Party / Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="edit-party"
                  placeholder="e.g. Ramesh Traders"
                  value={editForm.partyName}
                  onChange={(e) =>
                    setEditForm({ ...editForm, partyName: e.target.value })
                  }
                  className={editErrors.partyName ? "border-destructive" : ""}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {/* Quantity */}
              <div className="space-y-1.5">
                <Label htmlFor="edit-quantity" className="text-xs font-medium">
                  Quantity
                </Label>
                <Input
                  id="edit-quantity"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={editForm.quantity || ""}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      quantity: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>

              {/* Amount */}
              <div className="space-y-1.5">
                <Label htmlFor="edit-amount" className="text-xs font-medium">
                  Amount (₹)
                </Label>
                <Input
                  id="edit-amount"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={editForm.amount || ""}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      amount: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>

              {/* Transaction Type */}
              <div className="space-y-1.5">
                <Label htmlFor="edit-type" className="text-xs font-medium">
                  Type
                </Label>
                <Select
                  value={editForm.transactionType}
                  onValueChange={(v) =>
                    setEditForm({
                      ...editForm,
                      transactionType: v as TransactionType,
                    })
                  }
                >
                  <SelectTrigger id="edit-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TRANSACTION_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-1.5">
              <Label htmlFor="edit-notes" className="text-xs font-medium">
                Notes
              </Label>
              <Textarea
                id="edit-notes"
                rows={2}
                placeholder="Additional notes..."
                value={editForm.notes}
                onChange={(e) =>
                  setEditForm({ ...editForm, notes: e.target.value })
                }
                className="resize-none"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={closeEditDialog} className="gap-1.5">
              <X className="h-3.5 w-3.5" />
              Cancel
            </Button>
            <Button
              onClick={handleEditSubmit}
              className="gap-1.5 bg-primary text-white hover:bg-primary/80"
            >
              <Save className="h-3.5 w-3.5" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Delete Confirmation Dialog ─── */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trash2 className="h-4 w-4 text-destructive" />
              Delete Entry
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this entry? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (deleteId) {
                  onDelete(deleteId);
                  setDeleteId(null);
                }
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
