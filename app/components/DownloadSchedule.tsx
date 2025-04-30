// components/DownloadSchedule.tsx
import React from 'react';
import jsPDF from 'jspdf';

interface DownloadScheduleProps {
  workDays: Date[];          // blue
  publicHolidays: Date[];    // red
}

const DownloadSchedule: React.FC<DownloadScheduleProps> = ({
  workDays,
  publicHolidays,
}) => {
  const handleDownload = () => {
    const doc = new jsPDF('p', 'mm', 'a4');
    const now = new Date();
    const year = now.getFullYear();
    const startMonth = now.getMonth();    // ← current month (0–11)
    const workSet = new Set(workDays.map(d => d.toDateString()));
    const holidaySet = new Set(publicHolidays.map(d => d.toDateString()));
  
    const cellW = 25, cellH = 20, margin = 10;

    for (let month = startMonth; month < 12; month++) {
      // Start a new page except for January
      if (month > startMonth) doc.addPage();

      // Header: Month name
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      const monthName = new Date(year, month).toLocaleString('default', { month: 'long' });
      doc.text(`${monthName} ${year}`, margin, 20);

      // Weekday labels
      const weekdays = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
      doc.setFontSize(10);
      weekdays.forEach((wd, i) => {
        doc.text(wd, margin + i * cellW + cellW/2 - 4, 30);
      });

      // First day offset & days in month
      const firstDay = new Date(year, month, 1);
      const offset = (firstDay.getDay() + 6) % 7; // JS: 0=Sun, shift so 0=Mon
      const daysInMonth = new Date(year, month + 1, 0).getDate();

      let x = margin;
      let y = 35;

      // blank cells before 1st
      for (let b = 0; b < offset; b++) {
        doc.rect(x + b*cellW, y, cellW, cellH); // empty cell
      }

      // draw days
      for (let d = 1; d <= daysInMonth; d++) {
        const date = new Date(year, month, d);
        const key = date.toDateString();
        // choose color
        if (holidaySet.has(key))       doc.setFillColor(255, 150, 150); // light red
        else if (workSet.has(key))     doc.setFillColor(150, 200, 255); // light blue
        else                           doc.setFillColor(240, 240, 240); // light gray

        // draw filled cell
        const col = (offset + d - 1) % 7;
        const row = Math.floor((offset + d - 1) / 7);
        const cellX = margin + col * cellW;
        const cellY = y + row * cellH;

        doc.rect(cellX, cellY, cellW, cellH, 'F'); // filled box
        doc.setDrawColor(200);
        doc.rect(cellX, cellY, cellW, cellH);      // border

        // day number
        doc.setTextColor(0);
        doc.setFontSize(10);
        doc.text(String(d), cellX + 2, cellY + 6);
      }
    }

    doc.save(`Schedule_${year}.pdf`);
  };

  return (
    <button onClick={handleDownload} style={{
      background: '#4CAF50', color: 'white',
      padding: '8px 16px', border: 'none',
      borderRadius: '4px', cursor: 'pointer',
    }}>
      Download Calendar PDF
    </button>
  );
};

export default DownloadSchedule;
