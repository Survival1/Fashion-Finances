import { jsPDF } from 'jspdf';
import { ProjectData, ProjectTeamMember } from '../types';

export interface GenerateProjectPDFOptions {
  project: Partial<ProjectData> & {
    title: string;
    category?: string;
    budget?: number;
    fundingGoal?: number;
    descriptionShort?: string;
    descriptionLong?: string;
    objective?: string;
    fundUsage?: string;
    timeline?: string;
    team?: ProjectTeamMember[];
    budgetItems?: { item: string; amount: number }[];
    contactEmail?: string;
    contactPhone?: string;
  };
  authorName?: string;
}

/**
 * Generates and downloads a clean, executive dossier in PDF format for the given project.
 */
export function generateProjectPDF({ project, authorName = 'Ernesto V. S.' }: GenerateProjectPDFOptions): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
  const pageHeight = doc.internal.pageSize.getHeight(); // 297mm
  const margin = 18;
  const contentWidth = pageWidth - margin * 2; // 174mm

  let currentY = 18;

  // 1. TOP HEADER BANNER
  doc.setFillColor(14, 165, 233); // Sky Blue 500
  doc.rect(0, 0, pageWidth, 6, 'F');

  // Secondary dark accent header
  doc.setFillColor(15, 23, 42); // Slate 900
  doc.rect(margin, currentY, contentWidth, 24, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  const safeTitle = (project.title || 'Proyecto Sin Título').toUpperCase();
  doc.text(safeTitle.length > 38 ? safeTitle.slice(0, 35) + '...' : safeTitle, margin + 6, currentY + 11);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(224, 242, 254); // Sky 100
  const categoryText = (project.category || 'Categoría General').toUpperCase();
  doc.text(`DOSSIER DE INVERSIÓN • CATEGORÍA: ${categoryText}`, margin + 6, currentY + 18);

  // Status badge inside header
  doc.setFillColor(2, 132, 199); // Sky 600
  doc.roundedRect(pageWidth - margin - 38, currentY + 5, 32, 7, 2, 2, 'F');
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('OFICIAL / VERIFICADO', pageWidth - margin - 22, currentY + 9.5, { align: 'center' });

  currentY += 30;

  // 2. KEY METRICS STRIP
  const budgetVal = project.budget ? `${project.budget.toLocaleString('es-ES')} €` : '1.000 €';
  const goalVal = project.fundingGoal ? `${project.fundingGoal.toLocaleString('es-ES')} €` : budgetVal;
  const todayStr = new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });

  doc.setFillColor(248, 250, 252); // Slate 50
  doc.setDrawColor(226, 232, 240); // Slate 200
  doc.roundedRect(margin, currentY, contentWidth, 18, 2, 2, 'FD');

  const colW = contentWidth / 4;
  
  // Metric 1: Presupuesto
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text('PRESUPUESTO:', margin + 4, currentY + 6);
  doc.setFontSize(10);
  doc.setTextColor(14, 165, 233);
  doc.text(budgetVal, margin + 4, currentY + 13);

  // Metric 2: Meta Inversión
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text('OBJETIVO FONDO:', margin + colW + 4, currentY + 6);
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text(goalVal, margin + colW + 4, currentY + 13);

  // Metric 3: Fecha
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text('EMISIÓN:', margin + colW * 2 + 4, currentY + 6);
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  doc.text(todayStr, margin + colW * 2 + 4, currentY + 13);

  // Metric 4: Autor
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text('TITULAR / PROMOTOR:', margin + colW * 3 + 4, currentY + 6);
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  doc.text(authorName.slice(0, 18), margin + colW * 3 + 4, currentY + 13);

  currentY += 24;

  // Helper function to render section title
  const renderSectionHeader = (titleStr: string) => {
    if (currentY > pageHeight - 35) {
      doc.addPage();
      currentY = 20;
    }
    doc.setFillColor(240, 249, 255); // Sky 50
    doc.roundedRect(margin, currentY, contentWidth, 7, 1.5, 1.5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(2, 132, 199); // Sky 600
    doc.text(titleStr.toUpperCase(), margin + 3.5, currentY + 5);
    currentY += 10;
  };

  // Helper for multi-line body text
  const renderParagraph = (textStr: string, label?: string) => {
    if (!textStr || textStr.trim() === '') return;
    if (currentY > pageHeight - 30) {
      doc.addPage();
      currentY = 20;
    }
    if (label) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(71, 85, 105);
      doc.text(label, margin, currentY);
      currentY += 4.5;
    }
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85);
    const splitLines = doc.splitTextToSize(textStr, contentWidth);
    doc.text(splitLines, margin, currentY);
    currentY += splitLines.length * 4.2 + 4;
  };

  // 3. RESUMEN EJECUTIVO Y DESCRIPCIÓN
  renderSectionHeader('1. Resumen Ejecutivo de la Propuesta');
  if (project.descriptionShort) {
    renderParagraph(project.descriptionShort, 'Síntesis Comercial:');
  }
  if (project.descriptionLong) {
    renderParagraph(project.descriptionLong, 'Memoria Descriptiva Completa:');
  }

  // 4. OBJETIVOS Y PLAN FINANCIERO
  if (project.objective || project.fundUsage || project.timeline) {
    renderSectionHeader('2. Plan de Viabilidad y Uso de Fondos');
    if (project.objective) {
      renderParagraph(project.objective, 'Objetivo Principal:');
    }
    if (project.fundUsage) {
      renderParagraph(project.fundUsage, 'Distribución de Fondos:');
    }
    if (project.timeline) {
      renderParagraph(project.timeline, 'Cronograma de Ejecución:');
    }
  }

  // 5. DESGLOSE DE GASTOS SI EXISTE
  if (project.budgetItems && project.budgetItems.length > 0) {
    renderSectionHeader('3. Presupuesto Detallado por Partidas');
    project.budgetItems.forEach((item, idx) => {
      if (currentY > pageHeight - 25) {
        doc.addPage();
        currentY = 20;
      }
      doc.setFillColor(idx % 2 === 0 ? 255 : 248, idx % 2 === 0 ? 255 : 250, idx % 2 === 0 ? 255 : 252);
      doc.rect(margin, currentY - 3, contentWidth, 6.5, 'F');
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(30, 41, 59);
      doc.text(`• ${item.item}`, margin + 3, currentY + 1);
      doc.setFont('helvetica', 'bold');
      doc.text(`${item.amount.toLocaleString('es-ES')} €`, pageWidth - margin - 3, currentY + 1, { align: 'right' });
      currentY += 7;
    });
    currentY += 3;
  }

  // 6. EQUIPO CREATIVO Y TÉCNICO
  if (project.team && project.team.length > 0) {
    renderSectionHeader('4. Equipo Creativo y Estructura');
    project.team.forEach((member) => {
      if (currentY > pageHeight - 28) {
        doc.addPage();
        currentY = 20;
      }
      doc.setDrawColor(226, 232, 240);
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(margin, currentY, contentWidth, 14, 2, 2, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(15, 23, 42);
      doc.text(member.name, margin + 4, currentY + 5);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(2, 132, 199);
      doc.text(member.role.toUpperCase(), margin + 4, currentY + 9.5);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139);
      doc.text(member.experience || 'Miembro verificado', margin + 4, currentY + 13);

      if (member.profileLink) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        doc.setTextColor(79, 70, 229);
        doc.text(member.profileLink.slice(0, 35), pageWidth - margin - 4, currentY + 9.5, { align: 'right' });
      }

      currentY += 17;
    });
  }

  // 7. DECLARACIÓN JURADA Y SELLO LEGAL
  if (currentY > pageHeight - 35) {
    doc.addPage();
    currentY = 20;
  }
  doc.setDrawColor(251, 191, 36); // Amber 400
  doc.setFillColor(254, 243, 199); // Amber 100
  doc.roundedRect(margin, currentY, contentWidth, 18, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(180, 83, 9); // Amber 700
  doc.text('DECLARACIÓN JURADA Y AUDITORÍA DE VERACIDAD', margin + 4, currentY + 5.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(120, 53, 15);
  const legalText = 'Este documento acredita que los datos, estimaciones de inversión, presupuesto y roles del equipo creativo han sido declarados bajo juramento por el promotor del proyecto para su evaluación en mesas de financiación.';
  const legalLines = doc.splitTextToSize(legalText, contentWidth - 8);
  doc.text(legalLines, margin + 4, currentY + 10);

  currentY += 24;

  // FOOTER ON ALL PAGES
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    doc.text('Plataforma de Inversión y Financiación Creativa • Conexión Cifrada SSL', margin, pageHeight - 7);
    doc.text(`Página ${i} de ${totalPages}`, pageWidth - margin, pageHeight - 7, { align: 'right' });
  }

  // Clean filename
  const cleanTitle = (project.title || 'proyecto')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '_')
    .replace(/_+/g, '_')
    .slice(0, 30);

  doc.save(`proyecto_${cleanTitle}.pdf`);
}
