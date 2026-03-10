import { Call } from "./dummyCalls";
import { formatDuration } from "./utils";
import { format } from "date-fns";
import { de } from "date-fns/locale";

const STATUS_LABELS: Record<string, string> = {
  erfolgreich: "Erfolgreich",
  nicht_erfolgreich: "Nicht erfolgreich",
  weitergeleitet: "Weitergeleitet",
};

export function exportCallsToCSV(calls: Call[]): void {
  const headers = [
    "ID",
    "Kunde",
    "Telefon",
    "Datum",
    "Dauer",
    "Status",
    "Betreff",
    "Zusammenfassung",
    "Mitarbeiter",
  ];

  const rows = calls.map((call) => [
    call.id,
    call.customerName,
    call.customerPhone,
    format(call.timestamp, "dd.MM.yyyy HH:mm", { locale: de }),
    formatDuration(call.duration),
    STATUS_LABELS[call.status] || call.status,
    call.subject,
    call.summary,
    call.employeeAssigned,
  ]);

  const csvContent = [
    headers.join(";"),
    ...rows.map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(";")
    ),
  ].join("\n");

  const blob = new Blob(["\ufeff" + csvContent], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `anrufprotokoll_${format(new Date(), "yyyy-MM-dd")}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export function exportCallToPDF(call: Call): void {
  import("jspdf").then(({ jsPDF }) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 20;

    // Title
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Anrufprotokoll", pageWidth / 2, y, { align: "center" });
    y += 15;

    // Call info
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");

    const info = [
      ["Kunde:", call.customerName],
      ["Telefon:", call.customerPhone],
      ["Datum:", format(call.timestamp, "dd.MM.yyyy HH:mm", { locale: de })],
      ["Dauer:", formatDuration(call.duration)],
      ["Status:", STATUS_LABELS[call.status] || call.status],
      ["Betreff:", call.subject],
      ["Mitarbeiter:", call.employeeAssigned],
    ];

    for (const [label, value] of info) {
      doc.setFont("helvetica", "bold");
      doc.text(label, 20, y);
      doc.setFont("helvetica", "normal");
      doc.text(value, 60, y);
      y += 7;
    }

    y += 5;

    // Summary
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text("Zusammenfassung", 20, y);
    y += 8;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    for (const bullet of call.summaryBullets) {
      const lines = doc.splitTextToSize(`• ${bullet}`, pageWidth - 40);
      doc.text(lines, 20, y);
      y += lines.length * 5 + 2;
    }

    y += 5;

    // Transcript
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text("Transkript", 20, y);
    y += 8;

    doc.setFontSize(9);
    for (const line of call.transcript) {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      doc.setFont("helvetica", "bold");
      doc.text(`${line.speaker}:`, 20, y);
      doc.setFont("helvetica", "normal");
      const textLines = doc.splitTextToSize(line.text, pageWidth - 55);
      doc.text(textLines, 45, y);
      y += textLines.length * 4.5 + 3;
    }

    doc.save(`anruf_${call.id}_${format(call.timestamp, "yyyy-MM-dd")}.pdf`);
  });
}

export function exportSingleCallToCSV(call: Call): void {
  exportCallsToCSV([call]);
}
