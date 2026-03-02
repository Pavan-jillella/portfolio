import { PayStub, Employer } from "@/types";
import { formatCurrency } from "@/lib/finance-utils";

// Default employee info (can be overridden)
const DEFAULT_EMPLOYEE = {
  name: "Pavan Jillella",
  id: "968383",
  department: "Software Developer and Analyst",
};

const DEFAULT_COMPANY = {
  name: "Stemtree Education Center LLC",
  address: "220 Maple Ave W",
  city: "Vienna, VA 22180",
};

export async function generatePayStubPDF(
  stub: PayStub,
  employer?: Employer
): Promise<Blob> {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "mm", format: "letter" });

  const pw = doc.internal.pageSize.getWidth(); // page width
  const m = 15; // margin
  const cw = pw - m * 2; // content width
  let y = 12;

  // Colors
  const navy = [15, 30, 60] as const;
  const darkGray = [40, 40, 40] as const;
  const medGray = [100, 100, 100] as const;
  const lightGray = [220, 225, 230] as const;
  const headerBg = [235, 238, 242] as const;
  const white = [255, 255, 255] as const;
  const emerald = [16, 150, 100] as const;

  // ─── Helper functions ─────────────────────────────────────
  function drawBox(x: number, yy: number, w: number, h: number) {
    doc.setDrawColor(...medGray);
    doc.setLineWidth(0.3);
    doc.rect(x, yy, w, h);
  }

  function sectionHeader(label: string, yy: number): number {
    doc.setFillColor(...navy);
    doc.rect(m, yy, cw, 6, "F");
    doc.setTextColor(...white);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text(label, m + 3, yy + 4.2);
    return yy + 6;
  }

  function tableHeader(cols: { label: string; x: number; align?: "right" | "left" }[], yy: number): number {
    doc.setFillColor(...headerBg);
    doc.rect(m, yy, cw, 5.5, "F");
    doc.setDrawColor(...lightGray);
    doc.line(m, yy + 5.5, m + cw, yy + 5.5);
    doc.setTextColor(...darkGray);
    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    for (const col of cols) {
      doc.text(col.label, col.x, yy + 3.8, { align: col.align || "left" });
    }
    return yy + 5.5;
  }

  function tableRow(cols: { text: string; x: number; align?: "right" | "left"; bold?: boolean }[], yy: number): number {
    doc.setTextColor(...darkGray);
    doc.setFontSize(8);
    for (const col of cols) {
      doc.setFont("helvetica", col.bold ? "bold" : "normal");
      doc.text(col.text, col.x, yy + 3.5, { align: col.align || "left" });
    }
    doc.setDrawColor(...lightGray);
    doc.line(m, yy + 5, m + cw, yy + 5);
    return yy + 5;
  }

  // ─── Top border ────────────────────────────────────────────
  doc.setFillColor(...navy);
  doc.rect(0, 0, pw, 3, "F");

  // ─── Company and Employee Info ─────────────────────────────
  y = 8;

  // Company (left side)
  const companyName = employer?.name || stub.employer_name || DEFAULT_COMPANY.name;
  doc.setTextColor(...navy);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(companyName, m, y + 5);

  doc.setTextColor(...medGray);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text(DEFAULT_COMPANY.address, m, y + 10);
  doc.text(DEFAULT_COMPANY.city, m, y + 14);

  // "EARNINGS STATEMENT" label (right side)
  doc.setTextColor(...navy);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("EARNINGS STATEMENT", pw - m, y + 5, { align: "right" });

  doc.setTextColor(...medGray);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text("NON-NEGOTIABLE", pw - m, y + 10, { align: "right" });

  y += 20;

  // ─── Employee / Pay Period Info Boxes ──────────────────────
  const boxH = 22;
  const halfW = cw / 2 - 1.5;

  // Left box: Employee info
  drawBox(m, y, halfW, boxH);
  doc.setFillColor(...headerBg);
  doc.rect(m, y, halfW, 5.5, "F");
  doc.setTextColor(...navy);
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.text("EMPLOYEE INFORMATION", m + 3, y + 3.8);

  doc.setTextColor(...darkGray);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  const infoY = y + 8;
  doc.setFont("helvetica", "bold");
  doc.text("Name:", m + 3, infoY + 1);
  doc.setFont("helvetica", "normal");
  doc.text(DEFAULT_EMPLOYEE.name, m + 20, infoY + 1);

  doc.setFont("helvetica", "bold");
  doc.text("ID:", m + 3, infoY + 5.5);
  doc.setFont("helvetica", "normal");
  doc.text(DEFAULT_EMPLOYEE.id, m + 20, infoY + 5.5);

  doc.setFont("helvetica", "bold");
  doc.text("Dept:", m + 3, infoY + 10);
  doc.setFont("helvetica", "normal");
  doc.text(DEFAULT_EMPLOYEE.department, m + 20, infoY + 10);

  // Right box: Pay period info
  const rx = m + halfW + 3;
  drawBox(rx, y, halfW, boxH);
  doc.setFillColor(...headerBg);
  doc.rect(rx, y, halfW, 5.5, "F");
  doc.setTextColor(...navy);
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.text("PAY INFORMATION", rx + 3, y + 3.8);

  doc.setTextColor(...darkGray);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("Pay Date:", rx + 3, infoY + 1);
  doc.setFont("helvetica", "normal");
  doc.text(stub.pay_date, rx + 25, infoY + 1);

  doc.setFont("helvetica", "bold");
  doc.text("Period:", rx + 3, infoY + 5.5);
  doc.setFont("helvetica", "normal");
  doc.text(`${stub.pay_period_start} to ${stub.pay_period_end}`, rx + 25, infoY + 5.5);

  doc.setFont("helvetica", "bold");
  doc.text("Pay Type:", rx + 3, infoY + 10);
  doc.setFont("helvetica", "normal");
  const payType = employer?.pay_type || "hourly";
  doc.text(payType.charAt(0).toUpperCase() + payType.slice(1).replace("_", " "), rx + 25, infoY + 10);

  y += boxH + 6;

  // ─── EARNINGS Section ──────────────────────────────────────
  y = sectionHeader("EARNINGS", y);

  const eCol = {
    desc: m + 3,
    hours: m + 70,
    rate: m + 100,
    current: pw - m - 3,
  };

  y = tableHeader([
    { label: "Description", x: eCol.desc },
    { label: "Hours", x: eCol.hours },
    { label: "Rate", x: eCol.rate },
    { label: "Current", x: eCol.current, align: "right" },
  ], y);

  // Regular hours
  const regularPay = stub.regular_hours * stub.hourly_rate;
  y = tableRow([
    { text: "Regular", x: eCol.desc },
    { text: stub.regular_hours.toFixed(2), x: eCol.hours },
    { text: `$${stub.hourly_rate.toFixed(2)}`, x: eCol.rate },
    { text: formatCurrency(regularPay), x: eCol.current, align: "right" },
  ], y);

  // Overtime hours
  if (stub.overtime_hours > 0) {
    const otRate = employer?.overtime_multiplier
      ? stub.hourly_rate * employer.overtime_multiplier
      : stub.hourly_rate * 1.5;
    const otPay = stub.overtime_hours * otRate;
    y = tableRow([
      { text: "Overtime (1.5x)", x: eCol.desc },
      { text: stub.overtime_hours.toFixed(2), x: eCol.hours },
      { text: `$${otRate.toFixed(2)}`, x: eCol.rate },
      { text: formatCurrency(otPay), x: eCol.current, align: "right" },
    ], y);
  }

  // Gross Pay total
  doc.setFillColor(...headerBg);
  doc.rect(m, y, cw, 6, "F");
  doc.setTextColor(...navy);
  doc.setFontSize(8.5);
  doc.setFont("helvetica", "bold");
  doc.text("GROSS PAY", m + 3, y + 4.2);
  doc.text(formatCurrency(stub.gross_pay), pw - m - 3, y + 4.2, { align: "right" });
  y += 6;

  // Border around earnings
  drawBox(m, y - 6 - (stub.overtime_hours > 0 ? 16.5 : 11.5) - 5.5, cw, (stub.overtime_hours > 0 ? 28 : 23) + 5.5);

  y += 6;

  // ─── DEDUCTIONS Section ────────────────────────────────────
  y = sectionHeader("DEDUCTIONS", y);

  const dCol = {
    desc: m + 3,
    current: pw - m - 3,
  };

  y = tableHeader([
    { label: "Description", x: dCol.desc },
    { label: "Current", x: dCol.current, align: "right" },
  ], y);

  const deductions = [
    { label: "Federal Income Tax", amount: stub.deductions.federal_tax },
    { label: "State Income Tax (VA)", amount: stub.deductions.state_tax },
    { label: "Social Security (FICA)", amount: stub.deductions.social_security },
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
      y = tableRow([
        { text: ded.label, x: dCol.desc },
        { text: `-${formatCurrency(ded.amount)}`, x: dCol.current, align: "right" },
      ], y);
    }
  }

  // Total Deductions
  const totalDeductions = deductions.reduce((s, d) => s + d.amount, 0);
  doc.setFillColor(...headerBg);
  doc.rect(m, y, cw, 6, "F");
  doc.setTextColor(180, 40, 40);
  doc.setFontSize(8.5);
  doc.setFont("helvetica", "bold");
  doc.text("TOTAL DEDUCTIONS", m + 3, y + 4.2);
  doc.text(`-${formatCurrency(totalDeductions)}`, pw - m - 3, y + 4.2, { align: "right" });
  y += 12;

  // ─── NET PAY Section ───────────────────────────────────────
  // Dashed "tear" line (simulated perforated edge)
  doc.setDrawColor(...medGray);
  doc.setLineDashPattern([2, 1.5], 0);
  doc.line(m, y, m + cw, y);
  doc.setLineDashPattern([], 0);
  y += 6;

  // Net Pay box
  doc.setFillColor(...navy);
  doc.roundedRect(m, y, cw, 18, 2, 2, "F");

  doc.setTextColor(...white);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("NET PAY", m + 6, y + 7);

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text("Amount deposited to your account", m + 6, y + 12);

  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(formatCurrency(stub.net_pay), pw - m - 6, y + 11, { align: "right" });

  y += 24;

  // ─── Summary Row ───────────────────────────────────────────
  const sumBoxW = cw / 3 - 2;
  const summaryItems: { label: string; value: string; color: readonly [number, number, number] }[] = [
    { label: "Gross Pay", value: formatCurrency(stub.gross_pay), color: navy },
    { label: "Total Deductions", value: `-${formatCurrency(totalDeductions)}`, color: [180, 40, 40] as const },
    { label: "Net Pay", value: formatCurrency(stub.net_pay), color: emerald },
  ];

  for (let i = 0; i < summaryItems.length; i++) {
    const sx = m + i * (sumBoxW + 3);
    drawBox(sx, y, sumBoxW, 14);
    doc.setTextColor(...medGray);
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.text(summaryItems[i].label, sx + sumBoxW / 2, y + 4.5, { align: "center" });

    doc.setTextColor(...summaryItems[i].color);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(summaryItems[i].value, sx + sumBoxW / 2, y + 10.5, { align: "center" });
  }

  y += 20;

  // ─── Charts Section ──────────────────────────────────────
  y = sectionHeader("PAY BREAKDOWN", y);
  y += 4;

  // ── Donut Chart: Deductions Breakdown (left side) ──
  const chartColors: readonly [number, number, number][] = [
    [59, 130, 246],   // blue - Federal Tax
    [168, 85, 247],   // purple - State Tax
    [245, 158, 11],   // amber - Social Security
    [20, 184, 166],   // teal - Medicare
    [244, 63, 94],    // rose - Other
  ];

  const activeDeductions = deductions.filter((d) => d.amount > 0);
  const donutCx = m + 30;
  const donutCy = y + 24;
  const donutR = 18;
  const donutInner = 10;

  if (activeDeductions.length > 0 && totalDeductions > 0) {
    let startAngle = -Math.PI / 2;
    for (let i = 0; i < activeDeductions.length; i++) {
      const slice = (activeDeductions[i].amount / totalDeductions) * Math.PI * 2;
      const endAngle = startAngle + slice;
      const color = chartColors[i % chartColors.length];

      // Draw arc segment using small line segments
      doc.setFillColor(...color);
      const steps = Math.max(Math.ceil(slice * 30), 4);
      const points: [number, number][] = [];

      // Outer arc
      for (let s = 0; s <= steps; s++) {
        const a = startAngle + (slice * s) / steps;
        points.push([donutCx + Math.cos(a) * donutR, donutCy + Math.sin(a) * donutR]);
      }
      // Inner arc (reverse)
      for (let s = steps; s >= 0; s--) {
        const a = startAngle + (slice * s) / steps;
        points.push([donutCx + Math.cos(a) * donutInner, donutCy + Math.sin(a) * donutInner]);
      }

      // Draw filled polygon using triangle fan
      if (points.length >= 3) {
        doc.setLineWidth(0);
        for (let t = 1; t < points.length - 1; t++) {
          doc.triangle(
            points[0][0], points[0][1],
            points[t][0], points[t][1],
            points[t + 1][0], points[t + 1][1],
            "F"
          );
        }
      }

      startAngle = endAngle;
    }

    // White center circle for donut effect
    doc.setFillColor(...white);
    doc.circle(donutCx, donutCy, donutInner, "F");

    // Center text
    doc.setTextColor(...navy);
    doc.setFontSize(6);
    doc.setFont("helvetica", "bold");
    doc.text("TOTAL", donutCx, donutCy - 1, { align: "center" });
    doc.setFontSize(7);
    doc.text(formatCurrency(totalDeductions), donutCx, donutCy + 3, { align: "center" });

    // Legend (right of donut)
    const legendX = m + 58;
    let legendY = y + 8;
    doc.setFontSize(7);
    for (let i = 0; i < activeDeductions.length; i++) {
      const color = chartColors[i % chartColors.length];
      doc.setFillColor(...color);
      doc.rect(legendX, legendY - 2, 3, 3, "F");
      doc.setTextColor(...darkGray);
      doc.setFont("helvetica", "normal");
      doc.text(activeDeductions[i].label, legendX + 5, legendY + 0.5);
      doc.setTextColor(...medGray);
      const pct = ((activeDeductions[i].amount / totalDeductions) * 100).toFixed(1);
      doc.text(`${formatCurrency(activeDeductions[i].amount)} (${pct}%)`, legendX + 5, legendY + 4);
      legendY += 8;
    }
  }

  // ── Horizontal Bar Chart: Gross vs Net (right side) ──
  const barX = pw / 2 + 8;
  const barW = pw - m - barX;
  const barH = 8;
  let barY = y + 6;

  const barItems: { label: string; value: number; color: readonly [number, number, number] }[] = [
    { label: "Gross Pay", value: stub.gross_pay, color: navy },
    { label: "Deductions", value: totalDeductions, color: [180, 40, 40] },
    { label: "Net Pay", value: stub.net_pay, color: emerald },
  ];

  const maxBar = Math.max(...barItems.map((b) => b.value));

  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...navy);
  doc.text("EARNINGS vs DEDUCTIONS", barX, barY);
  barY += 5;

  for (const item of barItems) {
    // Label
    doc.setTextColor(...darkGray);
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.text(item.label, barX, barY + 3);

    // Bar background
    const bx = barX + 28;
    const bw = barW - 28;
    doc.setFillColor(...headerBg);
    doc.roundedRect(bx, barY, bw, barH, 1.5, 1.5, "F");

    // Bar fill
    const fillW = maxBar > 0 ? (item.value / maxBar) * bw : 0;
    if (fillW > 0) {
      doc.setFillColor(...item.color);
      doc.roundedRect(bx, barY, Math.max(fillW, 3), barH, 1.5, 1.5, "F");
    }

    // Value on bar
    doc.setTextColor(...white);
    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    if (fillW > 20) {
      doc.text(formatCurrency(item.value), bx + fillW - 2, barY + 5.2, { align: "right" });
    } else {
      doc.setTextColor(...darkGray);
      doc.text(formatCurrency(item.value), bx + fillW + 2, barY + 5.2);
    }

    barY += barH + 3;
  }

  // Take-home percentage
  const takeHomePct = stub.gross_pay > 0 ? ((stub.net_pay / stub.gross_pay) * 100).toFixed(1) : "0";
  barY += 2;
  doc.setTextColor(...emerald);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text(`Take-Home: ${takeHomePct}%`, barX + (barW) / 2, barY + 1, { align: "center" });

  y += 54;

  // ─── Footer ────────────────────────────────────────────────
  doc.setTextColor(...lightGray);
  doc.setFontSize(6.5);
  doc.setFont("helvetica", "normal");
  doc.text(
    `Generated on ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })} ● This document is for informational purposes only`,
    pw / 2,
    y + 3,
    { align: "center" }
  );

  // Bottom border
  doc.setFillColor(...navy);
  doc.rect(0, doc.internal.pageSize.getHeight() - 3, pw, 3, "F");

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
