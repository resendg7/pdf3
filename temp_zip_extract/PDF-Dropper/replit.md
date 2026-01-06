# PDF-Dropper

## Overview

PDF-Dropper is a web application for generating PDFs with embedded JavaScript payloads. The application simulates an Adobe Acrobat compatibility warning dialog and can deliver JavaScript that auto-executes when the PDF is opened in Adobe Reader. It features an admin interface for uploading JavaScript payloads and a public-facing homepage that displays the generated warning dialog.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Animations**: Framer Motion for smooth UI transitions
- **Build Tool**: Vite with React plugin

The frontend follows a page-based structure with two main routes:
- `/` - Public homepage displaying the Adobe-styled warning card
- `/admin` - Admin panel for uploading JavaScript payloads

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript with ESM modules
- **PDF Generation**: Puppeteer for rendering HTML to PDF with embedded JavaScript
- **API Design**: RESTful endpoints with Zod schema validation

Key API endpoints:
- `POST /api/payloads` - Upload new JavaScript payload
- `GET /api/payloads/latest` - Retrieve the most recent payload
- `GET /api/download` - Download the JavaScript file
- `GET /api/payloads/pdf` - Download the generated PDF

### Data Storage
- **Database**: PostgreSQL via Neon serverless
- **ORM**: Drizzle ORM with drizzle-zod for schema validation
- **Schema**: Single `payloads` table storing filename, JavaScript content, and base64-encoded PDF data

### Build System
- Custom build script using esbuild for server bundling and Vite for client
- Shared code between client and server via `@shared` path alias
- TypeScript path aliases for clean imports (`@/`, `@shared/`, `@assets/`)

## External Dependencies

### Database
- **Neon PostgreSQL**: Serverless PostgreSQL database (requires `DATABASE_URL` environment variable)
- **Drizzle Kit**: Database migration and push tooling

### PDF Generation
- **Puppeteer**: Headless Chrome for HTML-to-PDF conversion with JavaScript embedding

### UI Components
- **shadcn/ui**: Full component library built on Radix UI primitives
- **Radix UI**: Accessible, unstyled UI primitives
- **Lucide React**: Icon library

### Development
- **Replit Plugins**: Vite plugins for error overlay, cartographer, and dev banner (development only)