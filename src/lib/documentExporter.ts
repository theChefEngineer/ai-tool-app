import { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel, ImageRun, Table, TableRow, TableCell, BorderStyle } from 'docx';
import { jsPDF } from 'jspdf';

// Logo URL for the exports
const LOGO_URL = 'https://images.pexels.com/photos/7256897/pexels-photo-7256897.jpeg?auto=compress&cs=tinysrgb&w=100';

/**
 * Export text to a Word document
 * @param text The text to export
 * @param title The title of the document
 * @param originalText Optional original text for comparison
 */
export async function exportToWord(text: string, title: string, originalText?: string): Promise<void> {
  // Create a new document
  const doc = new Document({
    sections: [{
      properties: {},
      children: await createDocumentContent(text, title, originalText)
    }],
  });

  // Generate the document as a blob
  const blob = await Packer.toBlob(doc);
  
  // Create a download link and trigger the download
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${title.replace(/[^a-zA-Z0-9]/g, '_')}.docx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Export text to a PDF document
 * @param text The text to export
 * @param title The title of the document
 * @param originalText Optional original text for comparison
 */
export async function exportToPdf(text: string, title: string, originalText?: string): Promise<void> {
  // Create a new PDF document
  const doc = new jsPDF();
  
  // Add logo
  try {
    const logoImg = await loadImage(LOGO_URL);
    doc.addImage(logoImg, 'JPEG', 10, 10, 30, 30);
  } catch (error) {
    console.error('Error loading logo:', error);
    // Continue without logo if it fails to load
  }
  
  // Add title
  doc.setFontSize(22);
  doc.setTextColor(75, 85, 99); // Slate-600
  doc.text(title, 50, 25);
  
  // Add date
  doc.setFontSize(10);
  doc.setTextColor(107, 114, 128); // Gray-500
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 50, 35);
  
  // Add divider
  doc.setDrawColor(229, 231, 235); // Gray-200
  doc.line(10, 45, 200, 45);
  
  // Add content
  doc.setFontSize(12);
  doc.setTextColor(31, 41, 55); // Gray-800
  
  // If there's original text, create a comparison layout
  if (originalText) {
    doc.text('Original Text:', 10, 60);
    const originalTextLines = doc.splitTextToSize(originalText, 180);
    doc.text(originalTextLines, 10, 70);
    
    const originalTextHeight = originalTextLines.length * 7;
    const startY = 80 + originalTextHeight;
    
    doc.text('Paraphrased Text:', 10, startY);
    const paraphrasedTextLines = doc.splitTextToSize(text, 180);
    doc.text(paraphrasedTextLines, 10, startY + 10);
  } else {
    // Just the paraphrased text
    const textLines = doc.splitTextToSize(text, 180);
    doc.text(textLines, 10, 60);
  }
  
  // Add footer
  const pageCount = doc.internal.getNumberOfPages();
  doc.setFontSize(10);
  doc.setTextColor(107, 114, 128); // Gray-500
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.text('ParaText Pro - AI-Powered Writing Assistant', 10, doc.internal.pageSize.height - 10);
    doc.text(`Page ${i} of ${pageCount}`, 180, doc.internal.pageSize.height - 10);
  }
  
  // Save the PDF
  doc.save(`${title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
}

/**
 * Create the content for a Word document
 */
async function createDocumentContent(text: string, title: string, originalText?: string) {
  const children = [];
  
  // Try to add logo
  try {
    const logoBase64 = await getImageAsBase64(LOGO_URL);
    children.push(new Paragraph({
      children: [
        new ImageRun({
          data: logoBase64,
          transformation: {
            width: 100,
            height: 100,
          },
        }),
      ],
      alignment: AlignmentType.LEFT,
    }));
  } catch (error) {
    console.error('Error adding logo to Word document:', error);
    // Continue without logo
  }
  
  // Add title
  children.push(
    new Paragraph({
      text: title,
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.LEFT,
      spacing: {
        after: 200,
      },
    })
  );
  
  // Add date
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `Generated on: ${new Date().toLocaleDateString()}`,
          color: '666666',
          size: 20,
        }),
      ],
      spacing: {
        after: 400,
      },
    })
  );
  
  // If there's original text, create a comparison table
  if (originalText) {
    const table = new Table({
      rows: [
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph('Original Text')],
              shading: {
                fill: 'F3F4F6', // Gray-100
              },
            }),
            new TableCell({
              children: [new Paragraph('Paraphrased Text')],
              shading: {
                fill: 'F3F4F6', // Gray-100
              },
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph(originalText)],
            }),
            new TableCell({
              children: [new Paragraph(text)],
            }),
          ],
        }),
      ],
      width: {
        size: 100,
        type: 'pct',
      },
    });
    
    children.push(table);
  } else {
    // Just add the paraphrased text
    children.push(
      new Paragraph({
        text: text,
        spacing: {
          line: 360, // 1.5 line spacing
        },
      })
    );
  }
  
  // Add footer
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: 'ParaText Pro - AI-Powered Writing Assistant',
          color: '666666',
          size: 18,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: {
        before: 400,
      },
    })
  );
  
  return children;
}

/**
 * Load an image from a URL
 */
function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = url;
  });
}

/**
 * Convert an image URL to base64
 */
async function getImageAsBase64(url: string): Promise<Uint8Array> {
  try {
    const img = await loadImage(url);
    
    // Create a canvas to draw the image
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    
    // Draw the image on the canvas
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');
    ctx.drawImage(img, 0, 0);
    
    // Get the base64 data
    const base64 = canvas.toDataURL('image/jpeg').split(',')[1];
    
    // Convert base64 to Uint8Array
    const binary = atob(base64);
    const array = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      array[i] = binary.charCodeAt(i);
    }
    
    return array;
  } catch (error) {
    console.error('Error converting image to base64:', error);
    throw error;
  }
}