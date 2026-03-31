"use client";

import { useState, useEffect } from "react";
import { Entry, Category, TransactionType, CATEGORIES, TRANSACTION_TYPES } from "@/types/entry";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Save, X } from "lucide-react";
import { generateId } from "@/lib/storage";

interface EntryFormProps {
  editingEntry: Entry | null;
  onSubmit: (entry: Entry) => void;
  onCancelEdit: () => void;
}

const emptyForm = {
  date: new Date().toISOString().split("T")[0],
  siteName: "",
  category: "Vendor" as Category,
  partyName: "",
  quantity: 0,
  amount: 0,
  transactionType: "Debit" as TransactionType,
  notes: "",
};

export function EntryForm({
  editingEntry,
  onSubmit,
  onCancelEdit,
}: EntryFormProps) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (editingEntry) {
      setForm({
        date: editingEntry.date,
        siteName: editingEntry.siteName,
        category: editingEntry.category,
        partyName: editingEntry.partyName,
        quantity: editingEntry.quantity,
        amount: editingEntry.amount,
        transactionType: editingEntry.transactionType,
        notes: editingEntry.notes,
      });
      setErrors({});
    } else {
      setForm(emptyForm);
    }
  }, [editingEntry]);

  function validate(): boolean {
    const newErrors: Record<string, boolean> = {};
    if (!form.date) newErrors.date = true;
    if (!form.siteName.trim()) newErrors.siteName = true;
    if (!form.partyName.trim()) newErrors.partyName = true;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    const entry: Entry = {
      id: editingEntry?.id || generateId(),
      date: form.date,
      siteName: form.siteName.trim(),
      category: form.category,
      partyName: form.partyName.trim(),
      quantity: Number(form.quantity) || 0,
      amount: Number(form.amount) || 0,
      transactionType: form.transactionType,
      notes: form.notes.trim(),
      createdAt: editingEntry?.createdAt || new Date().toISOString(),
    };

    onSubmit(entry);
    setForm(emptyForm);
    setErrors({});
  }

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-base">
          {editingEntry ? (
            <>
              <Save className="h-4 w-4 text-primary" />
              Edit Entry
            </>
          ) : (
            <>
              <Plus className="h-4 w-4 text-primary" />
              Add New Entry
            </>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Date */}
            <div className="space-y-1.5">
              <Label htmlFor="entry-date" className="text-xs font-medium">
                Date <span className="text-destructive">*</span>
              </Label>
              <Input
                id="entry-date"
                type="date"
                value={form.date}
                onChange={(e) =>
                  setForm({ ...form, date: e.target.value })
                }
                className={errors.date ? "border-destructive" : ""}
              />
            </div>

            {/* Site Name */}
            <div className="space-y-1.5">
              <Label htmlFor="entry-site" className="text-xs font-medium">
                Site Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="entry-site"
                placeholder="e.g. Sector 21 Site"
                value={form.siteName}
                onChange={(e) =>
                  setForm({ ...form, siteName: e.target.value })
                }
                className={errors.siteName ? "border-destructive" : ""}
              />
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <Label htmlFor="entry-category" className="text-xs font-medium">
                Category
              </Label>
              <Select
                value={form.category}
                onValueChange={(v) =>
                  setForm({ ...form, category: v as Category })
                }
              >
                <SelectTrigger id="entry-category">
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
              <Label htmlFor="entry-party" className="text-xs font-medium">
                Party / Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="entry-party"
                placeholder="e.g. Ramesh Traders"
                value={form.partyName}
                onChange={(e) =>
                  setForm({ ...form, partyName: e.target.value })
                }
                className={errors.partyName ? "border-destructive" : ""}
              />
            </div>

            {/* Quantity */}
            <div className="space-y-1.5">
              <Label htmlFor="entry-quantity" className="text-xs font-medium">
                Quantity
              </Label>
              <Input
                id="entry-quantity"
                type="number"
                min="0"
                placeholder="0"
                value={form.quantity || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    quantity: parseFloat(e.target.value) || 0,
                  })
                }
              />
            </div>

            {/* Amount */}
            <div className="space-y-1.5">
              <Label htmlFor="entry-amount" className="text-xs font-medium">
                Amount (₹)
              </Label>
              <Input
                id="entry-amount"
                type="number"
                min="0"
                placeholder="0"
                value={form.amount || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    amount: parseFloat(e.target.value) || 0,
                  })
                }
              />
            </div>

            {/* Transaction Type */}
            <div className="space-y-1.5">
              <Label htmlFor="entry-type" className="text-xs font-medium">
                Transaction Type
              </Label>
              <Select
                value={form.transactionType}
                onValueChange={(v) =>
                  setForm({
                    ...form,
                    transactionType: v as TransactionType,
                  })
                }
              >
                <SelectTrigger id="entry-type">
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

            {/* Notes */}
            <div className="space-y-1.5">
              <Label htmlFor="entry-notes" className="text-xs font-medium">
                Notes
              </Label>
              <Textarea
                id="entry-notes"
                rows={1}
                placeholder="Additional notes..."
                value={form.notes}
                onChange={(e) =>
                  setForm({ ...form, notes: e.target.value })
                }
                className="min-h-9 resize-none"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-2">
            <Button
              type="submit"
              className="gap-1.5 bg-primary text-white hover:bg-primary/80"
            >
              {editingEntry ? (
                <>
                  <Save className="h-3.5 w-3.5" />
                  Update Entry
                </>
              ) : (
                <>
                  <Plus className="h-3.5 w-3.5" />
                  Add Entry
                </>
              )}
            </Button>
            {editingEntry && (
              <Button
                type="button"
                variant="outline"
                className="gap-1.5"
                onClick={() => {
                  onCancelEdit();
                  setForm(emptyForm);
                  setErrors({});
                }}
              >
                <X className="h-3.5 w-3.5" />
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
