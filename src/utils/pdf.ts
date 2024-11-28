import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export async function generateWishlistPDF() {
  const wishlistPreview = document.getElementById('wishlistPreview');
  if (!wishlistPreview) return null;

  try {
    // Create PDF
    const pdf = new jsPDF('p', 'mm', 'a4');
    const canvas = await html2canvas(wishlistPreview, {
      scale: 2,
      useCORS: true,
      logging: false
    });

    // Add image to PDF
    const imgData = canvas.toDataURL('image/png');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

    return pdf;
  } catch (error) {
    console.error('Error generating PDF:', error);
    return null;
  }
}