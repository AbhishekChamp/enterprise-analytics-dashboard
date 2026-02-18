import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import toast from 'react-hot-toast';

interface PDFExportOptions {
  title: string;
  subtitle?: string;
  filename?: string;
  orientation?: 'portrait' | 'landscape';
}

export const exportToPDF = <T extends object>(
  data: T[],
  columns: { key: keyof T; header: string }[],
  options: PDFExportOptions
): void => {
  if (!data.length) {
    toast('No data to export', { icon: '⚠️' });
    return;
  }

  const doc = new jsPDF({
    orientation: options.orientation || 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const { title, subtitle, filename = 'report' } = options;

  // Add title
  doc.setFontSize(20);
  doc.text(title, 14, 20);

  // Add subtitle
  if (subtitle) {
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(subtitle, 14, 28);
  }

  // Add timestamp
  doc.setFontSize(10);
  doc.setTextColor(128);
  doc.text(`Generated on ${new Date().toLocaleString()}`, 14, subtitle ? 34 : 28);

  // Prepare table data
  const headers = columns.map((col) => col.header);
  const rows = data.map((item) =>
    columns.map((col) => {
      const value = item[col.key];
      if (value === null || value === undefined) return '';
      if (typeof value === 'object') return JSON.stringify(value);
      return String(value);
    })
  );

  // Add table
  autoTable(doc, {
    head: [headers],
    body: rows,
    startY: subtitle ? 40 : 34,
    styles: {
      fontSize: 9,
      cellPadding: 2,
    },
    headStyles: {
      fillColor: [59, 130, 246], // Primary blue
      textColor: 255,
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
  });

  // Save the PDF
  doc.save(`${filename}_${new Date().toISOString().split('T')[0]}.pdf`);
};

export const exportChartToPNG = async (
  chartElement: HTMLElement,
  filename: string = 'chart'
): Promise<void> => {
  try {
    // Use html2canvas to capture the chart
    const html2canvas = (await import('html2canvas')).default;
    
    const canvas = await html2canvas(chartElement, {
      backgroundColor: null,
      scale: 2, // High resolution
      useCORS: true,
      logging: false,
    });

    // Convert to PNG and download
    const link = document.createElement('a');
    link.download = `${filename}_${new Date().toISOString().split('T')[0]}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  } catch (error) {
    console.error('Failed to export chart:', error);
    throw error;
  }
};

export const exportChartToSVG = (
  svgElement: SVGSVGElement,
  filename: string = 'chart'
): void => {
  try {
    // Clone the SVG to avoid modifying the original
    const clone = svgElement.cloneNode(true) as SVGSVGElement;
    
    // Add styles inline
    const styles = document.createElementNS('http://www.w3.org/2000/svg', 'style');
    styles.textContent = `
      text { font-family: system-ui, -apple-system, sans-serif; }
    `;
    clone.insertBefore(styles, clone.firstChild);
    
    // Serialize
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(clone);
    
    // Create blob and download
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.download = `${filename}_${new Date().toISOString().split('T')[0]}.svg`;
    link.href = url;
    link.click();
    
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to export SVG:', error);
    throw error;
  }
};
