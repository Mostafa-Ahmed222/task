import fs from "fs";
import PDFDocument from "pdfkit";
import {
  generateCustomerInformation,
  generateHeader,
  generateReportBody,
} from "./report.js";

export function createReport(report, path) {
  let doc = new PDFDocument({ margin: 50, size: "A4", autoFirstPage: true });

  generateHeader(doc); // Invoke `generateHeader` function.
  generateCustomerInformation(doc, report);
  generateReportBody(doc, report);
  doc.end();
  doc.pipe(fs.createWriteStream(path));
}
