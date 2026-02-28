import { PayStub, Employer } from "@/types";
import { formatCurrency } from "@/lib/finance-utils";

export async function generatePayStubPDF(
  stub: PayStub,
  employer?: Employer
): Promise<Blob> {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "mm", format: "letter" });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let y = 20;

  // Header
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 40, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("PAY STUB", margin, y + 10);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(stub.employer_name, margin, y + 18);

  doc.setFontSize(9);
  doc.text(`Pay Date: ${stub.pay_date}`, pageWidth - margin, y + 10, { align: "right" });
  doc.text(
    `Period: ${stub.pay_period_start} — ${stub.pay_period_end}`,
    pageWidth - margin,
    y + 18,
    { align: "right" }
  );

  y = 50;

  // Reset text color
  doc.setTextColor(30, 41, 59);

  // Earnings section
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("EARNINGS", margin, y);
  y += 8;

  doc.setFillColor(241, 245, 249); // slate-100
  doc.rect(margin, y - 4, pageWidth - margin * 2, 7, "F");
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("Description", margin + 2, y);
  doc.text("Hours", margin + 80, y);
  doc.text("Rate", margin + 110, y);
  doc.text("Amount", pageWidth - margin - 2, y, { align: "right" });
  y += 10;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);

  // Regular hours
  doc.text("Regular Hours", margin + 2, y);
  doc.text(stub.regular_hours.toFixed(2), margin + 80, y);
  doc.text(`$${stub.hourly_rate.toFixed(2)}`, margin + 110, y);
  const regularPay = stub.regular_hours * stub.hourly_rate;
  doc.text(formatCurrency(regularPay), pageWidth - margin - 2, y, { align: "right" });
  y += 7;

  // Overtime hours
  if (stub.overtime_hours > 0) {
    const otRate = employer?.overtime_multiplier
      ? stub.hourly_rate * employer.overtime_multiplier
      : stub.hourly_rate * 1.5;
    const otPay = stub.overtime_hours * otRate;
    doc.text("Overtime Hours", margin + 2, y);
    doc.text(stub.overtime_hours.toFixed(2), margin + 80, y);
    doc.text(`$${otRate.toFixed(2)}`, margin + 110, y);
    doc.text(formatCurrency(otPay), pageWidth - margin - 2, y, { align: "right" });
    y += 7;
  }

  // Gross total
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, y, pageWidth - margin, y);
  y += 6;
  doc.setFont("helvetica", "bold");
  doc.text("Gross Pay", margin + 2, y);
  doc.text(formatCurrency(stub.gross_pay), pageWidth - margin - 2, y, { align: "right" });
  y += 14;

  // Deductions section
  doc.setFontSize(12);
  doc.text("DEDUCTIONS", margin, y);
  y += 8;

  doc.setFillColor(241, 245, 249);
  doc.rect(margin, y - 4, pageWidth - margin * 2, 7, "F");
  doc.setFontSize(8);
  doc.text("Description", margin + 2, y);
  doc.text("Amount", pageWidth - margin - 2, y, { align: "right" });
  y += 10;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);

  const deductions = [
    { label: "Federal Tax", amount: stub.deductions.federal_tax },
    { label: "State Tax (VA)", amount: stub.deductions.state_tax },
    { label: "Social Security", amount: stub.deductions.social_security },
    { label: "Medicare", amount: stub.deductions.medicare },
  ];

  if (stub.deductions.other_deductions > 0) {
    deductions.push({
      label: stub.deductions.other_deductions_label || "Other Deductions",
      amount: stub.deductions.other_deductions,
    });
  }

  for (const ded of deductions) {
    if (ded.amount > 0) {
      doc.text(ded.label, margin + 2, y);
      doc.text(formatCurrency(ded.amount), pageWidth - margin - 2, y, { align: "right" });
      y += 7;
    }
  }

  const totalDeductions = deductions.reduce((s, d) => s + d.amount, 0);
  doc.line(margin, y, pageWidth - margin, y);
  y += 6;
  doc.setFont("helvetica", "bold");
  doc.text("Total Deductions", margin + 2, y);
  doc.text(formatCurrency(totalDeductions), pageWidth - margin - 2, y, { align: "right" });
  y += 16;

  // Net Pay box
  doc.setFillColor(16, 185, 129); // emerald-500
  doc.roundedRect(margin, y - 4, pageWidth - margin * 2, 18, 3, 3, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.text("NET PAY", margin + 6, y + 4);
  doc.setFontSize(16);
  doc.text(formatCurrency(stub.net_pay), pageWidth - margin - 6, y + 6, { align: "right" });

  y += 28;

  // Footer
  doc.setTextColor(148, 163, 184); // slate-400
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.text(
    `Generated on ${new Date().toLocaleDateString()} • This is not an official document`,
    pageWidth / 2,
    y,
    { align: "center" }
  );

  return doc.output("blob");
}

export async function downloadPayStubPDF(
  stub: PayStub,
  employer?: Employer
): Promise<void> {
  const blob = await generatePayStubPDF(stub, employer);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `paystub-${stub.pay_period_start}-${stub.pay_period_end}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
