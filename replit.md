# PDF-Dropper

## Overview

PDF-Dropper is a web application for generating PDFs with embedded JavaScript payloads. The application displays an Adobe Acrobat-styled compatibility warning dialog on the homepage, while an admin panel allows uploading JavaScript files that get embedded into generated PDFs. When users open the PDF in Adobe Reader, the embedded JavaScript executes automatically.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight client-side router)
- **State Management**: TanStack React Query for server state and caching
- **Styling**: Tailwind CSS with shadcn/ui component library (New York style)
- **Animations**: Framer Motion for smooth UI transitions
- **Build Tool**: Vite with React plugin and Replit-specific plugins

The frontend has two main routes:
- `/` - Public homepage showing the Adobe-styled warning card with Download/Update buttons
- `/admin` - Admin panel for uploading JavaScript payloads and downloading generated PDFs

Path aliases are configured for clean imports:
- `@/` maps to `client/src/`
- `@shared/` maps to `shared/`
- `@assets/` maps to `attached_assets/`

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript with ESM modules
- **PDF Generation**: Puppeteer renders HTML to PDF with embedded JavaScript that auto-executes on document open
- **API Design**: RESTful endpoints with Zod schema validation defined in `shared/routes.ts`

Key API endpoints:
- `POST /api/payloads` - Upload JavaScript payload and generate PDF
- `GET /api/payloads/latest` - Retrieve the most recent payload metadata
- `GET /api/download` - Download the JavaScript file (with query param for type)
- `GET /api/payloads/pdf` - Download the generated PDF with embedded JS

### Data Storage
- **Database**: PostgreSQL (requires `DATABASE_URL` environment variable)
- **ORM**: Drizzle ORM with drizzle-zod for type-safe schema validation
- **Schema Location**: `shared/schema.ts`

Database schema has a single `payloads` table:
- `id` - Serial primary key
- `filename` - Name of the uploaded JavaScript file
- `jsContent` - The JavaScript code content
- `pdfData` - Base64-encoded generated PDF
- `contentType` - MIME type (defaults to application/pdf)
- `createdAt` - Timestamp

### Build System
- Custom build script in `script/build.ts` using esbuild for server bundling and Vite for client
- Server dependencies are selectively bundled to optimize cold start times
- Production build outputs to `dist/` directory

## External Dependencies

### Database
- **PostgreSQL**: Required database connection via `DATABASE_URL` environment variable
- Uses `pg` package with Drizzle ORM for queries
- Database migrations managed via `drizzle-kit push` command

### PDF Generation
- **Puppeteer**: Headless Chrome for rendering HTML to PDF
- PDFs are generated server-side with JavaScript embedded for auto-execution in Adobe Reader

### Frontend Libraries
- **shadcn/ui**: Pre-built accessible components using Radix UI primitives
- **Framer Motion**: Animation library for smooth transitions
- **react-dropzone**: File upload drag-and-drop functionality
- **date-fns**: Date formatting utilities

### Development Tools
- **Vite**: Development server with HMR
- **Replit Plugins**: Runtime error overlay, cartographer, and dev banner for Replit environment