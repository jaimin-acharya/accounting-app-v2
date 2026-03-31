export type Category =
  | "Vendor"
  | "Labour"
  | "Material"
  | "Labour Attendance"
  | "Material Stock"
  | "Other";

export type TransactionType = "Debit" | "Credit";

export interface Entry {
  id: string;
  date: string;
  siteName: string;
  category: Category;
  partyName: string;
  quantity: number;
  amount: number;
  transactionType: TransactionType;
  notes: string;
  createdAt: string;
}

export const CATEGORIES: Category[] = [
  "Vendor",
  "Labour",
  "Material",
  "Labour Attendance",
  "Material Stock",
  "Other",
];

export const TRANSACTION_TYPES: TransactionType[] = ["Debit", "Credit"];
