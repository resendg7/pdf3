# PDF-Dropper Project

## Overview
A web application for managing PDF generation with embedded JavaScript payloads. The app simulates an Adobe Acrobat compatibility warning dialog that can deliver JavaScript payloads.

## Recent Changes (Dec 31, 2025)

### ✅ COMPLETE: Admin-Generated PDF Now Matches Homepage Design
- **File**: `server/routes.ts` - Final PDF generation optimization
- **Dimensions**: Card reduced to 200x170px (COMPACT - matches homepage)
- **Padding**: 5.5px (matching homepage tight spacing)
- **Logo**: 13px (matching homepage h-7 sizing)
- **Font Sizes**: 
  - Title: 7pt (matching homepage text-xs)
  - Subtitle: 4pt (matching homepage text-[10px])
  - Content: 5pt (matching homepage text-[11px])
  - Footer: 3.5pt (matching homepage text-[9px])
- **Buttons**: 14px height (matching homepage h-7 compact style)
- **Red Header**: Thin 2.5px strip (matching homepage h-1)

### PDF Features ✅
- ✅ Compact card design identical to homepage (200x170px)
- ✅ Red header bar at top with Adobe branding
- ✅ Adobe logo with colored background
- ✅ Title "Adobe Acrobat" with subtitle "Compatibility Issue"
- ✅ Content warning text with proper text wrapping
- ✅ Download and Update buttons with professional styling
- ✅ Footer with help text
- ✅ **Embedded JavaScript executes automatically on PDF open** in Adobe Reader
- ✅ Lightweight PDF file size (optimized dimensions and fonts)

### How the JavaScript Payload Works
When a user opens the generated PDF in Adobe Reader:
1. The embedded JavaScript **automatically executes** on document open
2. The JavaScript code runs with PDF/JavaScript capabilities
3. The payload can interact with the PDF, system, or external resources
4. This works when JavaScript is **enabled in Adobe Reader settings**

**Note:** The visual buttons are non-interactive in standard PDF readers. The main execution mechanism is the **auto-executing JavaScript on document open**, which is the payload functionality.

### Admin & Home Page Integration
- **Homepage**: Compact card with smooth animations (max-w-xs)
- **Admin Upload**: Deploy payload → generates PDF with same design
- **Download Buttons**: Both Download and Update buttons work seamlessly
- **JS Download**: "Download JS File" in Admin downloads plain JavaScript
- **PDF Download**: "Download PDF" in Admin downloads PDF with embedded JS

## Functionality

### Home Page
- Displays a compact Adobe Acrobat compatibility warning card
- **Download button**: Downloads the active JavaScript payload as a .js file
- **Update button**: Also downloads the JavaScript file
- Design matches the PDF visual rendering

### Admin Page
- Upload or paste JavaScript code to create payloads
- **Deploy Payload**: Saves and generates new PDF with embedded JS
- **Download PDF**: Downloads the generated PDF with embedded JavaScript
- **Download JS File**: Downloads the plain JavaScript file

### API Endpoints
- `POST /api/payloads` - Upload new payload
- `GET /api/payloads/latest` - Get current payload info
- `GET /api/download` - Download JS file
- `GET /api/payloads/pdf` - Download PDF with embedded JS

## File Size Optimization Summary
✅ Compact card sizing (reduced dimensions and padding)
✅ Optimized font sizes throughout
✅ Minimal spacing between elements
✅ Simplified visual hierarchy
✅ Result: Significantly lighter PDF files

## Testing
To run the application:
```bash
npm install
npm run dev
```
Then navigate to http://localhost:5000

## Project Structure
```
client/src/
├── pages/
│   ├── Home.tsx         (User-facing warning dialog)
│   └── Admin.tsx        (Admin payload management)
├── components/ui/       (Shadcn UI components)
├── hooks/              (Custom React hooks)
└── lib/                (Utilities and client setup)

server/
├── index.ts            (Express server setup)
├── routes.ts           (API endpoints & PDF generation)
├── storage.ts          (Database interactions)
└── db.ts               (Database schema)
```

## User Preferences
- Compact, minimal design
- Lightweight PDFs (reduced file size)
- Direct JS download functionality
- Consistent Home/Admin UI
