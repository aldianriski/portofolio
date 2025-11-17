import jsPDF from 'jspdf';

interface ResumeData {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  experience: Array<{
    company: string;
    position: string;
    start_date: string;
    end_date: string | null;
    description: string;
    achievements: string[];
  }>;
  education: Array<{
    institution: string;
    degree: string;
    field_of_study: string;
    gpa: string;
    start_date: string;
    end_date: string;
  }>;
  skills: Array<{
    name: string;
    category: string;
  }>;
  certifications: Array<{
    name: string;
    issuer: string;
    issue_date: string;
    expiry_date: string | null;
  }>;
}

export async function generateResumePDF(data: ResumeData): Promise<void> {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;
  let yPosition = margin;

  // Helper function to add text with word wrap
  const addText = (text: string, fontSize: number = 10, isBold: boolean = false) => {
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', isBold ? 'bold' : 'normal');
    const lines = doc.splitTextToSize(text, contentWidth);

    lines.forEach((line: string) => {
      if (yPosition > pageHeight - margin) {
        doc.addPage();
        yPosition = margin;
      }
      doc.text(line, margin, yPosition);
      yPosition += fontSize * 0.5;
    });
  };

  const addSpace = (space: number = 5) => {
    yPosition += space;
  };

  const addSection = (title: string) => {
    addSpace(8);
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 3;
    addText(title, 14, true);
    addSpace(3);
  };

  // Header
  doc.setFillColor(41, 128, 185);
  doc.rect(0, 0, pageWidth, 50, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text(data.name, margin, 20);

  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text(data.title, margin, 30);

  doc.setFontSize(9);
  doc.text(`${data.email} | ${data.phone} | ${data.location}`, margin, 40);

  // Reset text color
  doc.setTextColor(0, 0, 0);
  yPosition = 60;

  // Summary
  if (data.summary) {
    addSection('PROFESSIONAL SUMMARY');
    addText(data.summary, 10);
  }

  // Experience
  if (data.experience && data.experience.length > 0) {
    addSection('PROFESSIONAL EXPERIENCE');

    data.experience.forEach((exp, index) => {
      if (index > 0) addSpace(5);

      addText(exp.company, 11, true);
      addText(`${exp.position}`, 10);

      const startDate = new Date(exp.start_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
      const endDate = exp.end_date ? new Date(exp.end_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : 'Present';
      addText(`${startDate} - ${endDate}`, 9);

      addSpace(2);

      // Remove HTML tags from description
      const cleanDescription = exp.description.replace(/<[^>]*>/g, '');
      if (cleanDescription) {
        addText(cleanDescription, 9);
      }

      if (exp.achievements && exp.achievements.length > 0) {
        addSpace(2);
        exp.achievements.forEach(achievement => {
          addText(`• ${achievement}`, 9);
        });
      }
    });
  }

  // Education
  if (data.education && data.education.length > 0) {
    addSection('EDUCATION');

    data.education.forEach((edu, index) => {
      if (index > 0) addSpace(5);

      addText(edu.institution, 11, true);
      addText(`${edu.degree}${edu.field_of_study ? ` in ${edu.field_of_study}` : ''}`, 10);

      if (edu.gpa) {
        addText(`GPA: ${edu.gpa}`, 9);
      }

      const startYear = new Date(edu.start_date).getFullYear();
      const endYear = new Date(edu.end_date).getFullYear();
      addText(`${startYear} - ${endYear}`, 9);
    });
  }

  // Skills
  if (data.skills && data.skills.length > 0) {
    addSection('SKILLS');

    const hardSkills = data.skills.filter(s => s.category === 'hard');
    const softSkills = data.skills.filter(s => s.category === 'soft');

    if (hardSkills.length > 0) {
      addText('Technical Skills:', 10, true);
      addText(hardSkills.map(s => s.name).join(', '), 9);
      addSpace(3);
    }

    if (softSkills.length > 0) {
      addText('Soft Skills:', 10, true);
      addText(softSkills.map(s => s.name).join(', '), 9);
    }
  }

  // Certifications
  if (data.certifications && data.certifications.length > 0) {
    addSection('CERTIFICATIONS');

    data.certifications.forEach((cert, index) => {
      if (index > 0) addSpace(3);

      addText(cert.name, 10, true);
      addText(`${cert.issuer}`, 9);

      const issueDate = new Date(cert.issue_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
      const expiryText = cert.expiry_date
        ? ` - Expires: ${new Date(cert.expiry_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}`
        : '';
      addText(`Issued: ${issueDate}${expiryText}`, 9);
    });
  }

  // Footer
  const footerY = pageHeight - 10;
  doc.setFontSize(8);
  doc.setTextColor(128, 128, 128);
  doc.text(`Generated on ${new Date().toLocaleDateString()}`, margin, footerY);
  doc.text('Page 1 of 1', pageWidth - margin - 30, footerY);

  // Save the PDF
  const filename = `${data.name.replace(/\s+/g, '_')}_Resume_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(filename);
}
