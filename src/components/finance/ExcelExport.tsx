"use client";
import { Transaction, MonthlySummary } from "@/types";
import { exportTransactionsCSV, getMonthlyTrend, formatCurrency } from "@/lib/finance-utils";
import * as XLSX from "xlsx";

interface ExcelExportProps {
  transactions: Transaction[];
}

export function ExcelExport({ transactions }: ExcelExportProps) {
  function downloadCSV() {
    const csv = exportTransactionsCSV(transactions);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transactions-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function downloadExcel() {
    const wb = XLSX.utils.book_new();

    // Transactions sheet
    const txData = transactions
      .sort((a, b) => b.date.localeCompare(a.date))
      .map((t) => ({
        Date: t.date,
        Type: t.type,
        Category: t.category,
        Amount: t.amount,
        Description: t.description,
      }));
    const txSheet = XLSX.utils.json_to_sheet(txData);
    XLSX.utils.book_append_sheet(wb, txSheet, "Transactions");

    // Summary sheet
    const trend: MonthlySummary[] = getMonthlyTrend(transactions, 12);
    const summaryData = trend.map((t) => ({
      Month: t.month,
      Income: t.income,
      Expenses: t.expenses,
      "Net Savings": t.net,
      "Savings Rate": t.income > 0 ? `${Math.round((t.net / t.income) * 100)}%` : "0%",
    }));
    const summarySheet = XLSX.utils.json_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, summarySheet, "Monthly Summary");

    // Category breakdown sheet
    const categoryMap = new Map<string, { income: number; expense: number }>();
    transactions.forEach((t) => {
      const existing = categoryMap.get(t.category) || { income: 0, expense: 0 };
      if (t.type === "income") existing.income += t.amount;
      else existing.expense += t.amount;
      categoryMap.set(t.category, existing);
    });
    const catData = Array.from(categoryMap.entries()).map(([cat, data]) => ({
      Category: cat,
      "Total Income": data.income,
      "Total Expenses": data.expense,
      "Net": data.income - data.expense,
    }));
    const catSheet = XLSX.utils.json_to_sheet(catData);
    XLSX.utils.book_append_sheet(wb, catSheet, "Categories");

    const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `finance-report-${new Date().toISOString().slice(0, 10)}.xlsx`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={downloadCSV}
        disabled={transactions.length === 0}
        className="glass-card px-4 py-2 rounded-xl text-xs font-body text-white/40 hover:text-white transition-all hover:border-blue-500/30 disabled:opacity-30 disabled:cursor-not-allowed"
      >
        Export CSV
      </button>
      <button
        onClick={downloadExcel}
        disabled={transactions.length === 0}
        className="glass-card px-4 py-2 rounded-xl text-xs font-body text-white/40 hover:text-white transition-all hover:border-blue-500/30 disabled:opacity-30 disabled:cursor-not-allowed"
      >
        Export Excel
      </button>
    </div>
  );
}
