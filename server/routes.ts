import type { Express, Request } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import multer from "multer";
import path from "path";
import fs from "fs";

// Configure multer storage
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const upload = multer({
  dest: uploadDir,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"));
    }
  },
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // API Routes
  app.get(api.uploads.list.path, async (_req, res) => {
    const uploads = await storage.getUploads();
    res.json(uploads);
  });

  app.post(api.uploads.create.path, upload.single("file"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // Store metadata in DB
      const uploadRecord = await storage.createUpload({
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
      });

      res.status(201).json(uploadRecord);
    } catch (err) {
      if (err instanceof Error) {
        res.status(400).json({ message: err.message });
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  });

  app.delete(api.uploads.delete.path, async (req, res) => {
    try {
      const id = Number(req.params.id);
      const upload = await storage.getUpload(id);
      
      if (!upload) {
        return res.status(404).json({ message: "File not found" });
      }

      // Delete from DB
      await storage.deleteUpload(id);

      // Delete from filesystem
      const filePath = path.join(uploadDir, upload.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      res.sendStatus(204);
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  app.get(api.uploads.download.path, async (req, res) => {
    const id = Number(req.params.id);
    const upload = await storage.getUpload(id);

    if (!upload) {
      return res.status(404).json({ message: "File not found" });
    }

    const filePath = path.join(uploadDir, upload.filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found on server" });
    }

    res.download(filePath, upload.originalName);
  });

  return httpServer;
}
