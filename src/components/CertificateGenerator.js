import React from 'react';
import { jsPDF } from "jspdf";
import { storage, databases } from '../appwrite';
import { ID } from 'appwrite';

class CertificateGenerator {
  constructor({ student, onCertificateGenerated }) {
    this.student = student;
    this.onCertificateGenerated = onCertificateGenerated;
  }

  async generateAndSaveCertificate() {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    // Set white background
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, 297, 210, 'F');

    // Add green diagonal background using triangles
    doc.setFillColor(0, 150, 136); // Teal green
    doc.triangle(0, 0, 0, 210, 100, 210, 'F');
    doc.triangle(0, 0, 100, 210, 297, 0, 'F');

    // Add yellow accent stripe using triangles
    doc.setFillColor(218, 165, 32); // Golden yellow
    doc.triangle(70, 210, 120, 210, 297, 30, 'F');
    doc.triangle(120, 210, 297, 30, 297, 0, 'F');

    // Add decorative circles
    doc.setFillColor(0, 150, 136); // Teal circle
    doc.circle(270, 180, 15, 'F');
    doc.setFillColor(218, 165, 32); // Yellow circle
    doc.circle(250, 150, 8, 'F');
    doc.setFillColor(220, 20, 20); // Red circle
    doc.circle(260, 130, 5, 'F');
    doc.setFillColor(200, 200, 200); // Gray circle
    doc.circle(240, 170, 6, 'F');
    doc.setFillColor(34, 139, 34); // Green circle
    doc.circle(265, 160, 4, 'F');

    // Add serial number - moved further left and up
    doc.setFontSize(10);
    const certId = `SL No. ATC/Ashu/${new Date().getFullYear()}/${String(this.student.$id).padStart(3, '0')}`;
    doc.text(certId, 15, 15); // Adjusted position

    // Add title and header text - moved down slightly to create gap from SL NO
    doc.setFont("helvetica", "bold");
    doc.setFontSize(36);
    doc.setTextColor(0, 0, 0);
    doc.text("Ashuganj Training Center", 150, 35, { align: "center" }); // Moved down

    // Add address - adjusted positions accordingly
    doc.setFontSize(12);
    doc.text("Address: Shop no: 4, Hazi Jakir Market Road", 150, 45, { align: "center" });
    doc.text("Ashuganj Bazar, Ashuganj (3402), Brahmanbaria.", 150, 50, { align: "center" });

    // Add Certificate text
    doc.setFontSize(40);
    doc.setTextColor(220, 20, 20); // Red color
    doc.text("CERTIFICATE", 150, 70, { align: "center" });
    
    // OF APPRECIATION - now also in red
    doc.setFontSize(24);
    doc.setTextColor(220, 20, 20); // Changed to red to match CERTIFICATE
    doc.text("OF APPRECIATION", 150, 80, { align: "center" });

    // Add "The Certificate is Presented to"
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text("The Certificate is Presented to", 150, 95, { align: "center" });

    // Add student name and ID
    doc.setFontSize(32);
    doc.setTextColor(0, 0, 0);
    doc.text(this.student.name.toUpperCase(), 150, 115, { align: "center" });

    // Add student ID
    doc.setFontSize(14);
    doc.text(`Student ID : ${this.student.$id}`, 150, 125, { align: "center" });

    // Add course details - check if fatherName exists before adding it
    doc.setFontSize(14);
    if (this.student.fatherName) {
        doc.text(`C/O ${this.student.fatherName}`, 150, 135, { align: "center" });
    }
    doc.text("for successfully completing the training on", 150, 145, { align: "center" });
    doc.setFontSize(18);
    doc.text(this.student.courseName, 150, 155, { align: "center" });
    doc.setFontSize(14);

    // Calculate dates using admission date
    const admissionDate = new Date(this.student.AdmissionDate);
    const startDate = admissionDate.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });

    // Calculate end date based on admission date and course duration
    const endDate = new Date(admissionDate);
    const durationInMonths = parseInt(this.student.courseDuration) || 3; // default to 3 if not specified
    endDate.setMonth(endDate.getMonth() + durationInMonths);
    const formattedEndDate = endDate.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });

    // Display the date range
    doc.text(`From ${startDate} to ${formattedEndDate}`, 150, 165, { align: "center" });

    // Add signature lines - adjusted positions
    doc.line(50, 185, 100, 185);
    doc.text("Course Co-ordinator", 75, 190, { align: "center" });
    
    doc.line(200, 185, 250, 185);
    doc.text("Head of the Institution", 225, 190, { align: "center" });

    const pdfBlob = doc.output('blob');
    const fileName = `${this.student.name}_certificate.pdf`;

    try {
      const file = new File([pdfBlob], fileName, { type: 'application/pdf' });
      const uploadedFile = await storage.createFile('6712c9920009f390ec55', ID.unique(), file);
      
      await databases.updateDocument(
        '6712ba950038c0ce021e',
        '6712baa70033ebb43466',
        this.student.$id,
        { certificateFileId: uploadedFile.$id }
      );

      if (this.onCertificateGenerated) {
        this.onCertificateGenerated(uploadedFile.$id);
      }
      
      return uploadedFile.$id;
    } catch (error) {
      console.error('Error saving certificate', error);
      throw error;
    }
  }
}

export default CertificateGenerator;
