import { Entry } from "@/types/entry";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

export function exportToPDF(entries: Entry[], title?: string): void {
  const doc = new jsPDF({ orientation: "landscape" });
  const pageTitle = title || "Dhruvanshi Construction";
  const currentDate = new Date().toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Title
  doc.setFontSize(18);
  doc.setTextColor(30, 41, 59); // slate-800
  doc.text(pageTitle, 14, 20);

  // Date
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139); // slate-500
  doc.text(`Generated on: ${currentDate}`, 14, 28);

  // Summary
  const totalDebit = entries
    .filter((e) => e.transactionType === "Debit")
    .reduce((sum, e) => sum + e.amount, 0);
  const totalCredit = entries
    .filter((e) => e.transactionType === "Credit")
    .reduce((sum, e) => sum + e.amount, 0);

  doc.setFontSize(11);
  doc.setTextColor(30, 41, 59);
  doc.text(
    `Total Debit: ₹${totalDebit.toLocaleString("en-IN")}  |  Total Credit: ₹${totalCredit.toLocaleString("en-IN")}  |  Balance: ₹${(totalDebit - totalCredit).toLocaleString("en-IN")}`,
    14,
    36
  );

  // Table
  const tableData = entries.map((entry) => [
    entry.date,
    entry.siteName,
    entry.category,
    entry.partyName,
    entry.quantity.toString(),
    `₹${entry.amount.toLocaleString("en-IN")}`,
    entry.transactionType,
    entry.notes,
  ]);

  autoTable(doc, {
    head: [
      [
        "Date",
        "Site Name",
        "Category",
        "Party Name",
        "Quantity",
        "Amount",
        "Type",
        "Notes",
      ],
    ],
    body: tableData,
    startY: 42,
    styles: {
      fontSize: 8,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [30, 41, 59],
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
  });

  doc.save(`construction-accounts-${new Date().toISOString().split("T")[0]}.pdf`);
}

export function exportToExcel(entries: Entry[]): void {
  const worksheetData = entries.map((entry) => ({
    Date: entry.date,
    "Site Name": entry.siteName,
    Category: entry.category,
    "Party Name": entry.partyName,
    Quantity: entry.quantity,
    Amount: entry.amount,
    "Transaction Type": entry.transactionType,
    Notes: entry.notes,
  }));

  const worksheet = XLSX.utils.json_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Entries");

  // Auto-size columns
  const colWidths = [
    { wch: 12 },
    { wch: 18 },
    { wch: 18 },
    { wch: 20 },
    { wch: 10 },
    { wch: 14 },
    { wch: 14 },
    { wch: 30 },
  ];
  worksheet["!cols"] = colWidths;

  XLSX.writeFile(
    workbook,
    `construction-accounts-${new Date().toISOString().split("T")[0]}.xlsx`
  );
}
