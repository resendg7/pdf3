import { DropZone } from "@/components/DropZone";
import { FileGrid } from "@/components/FileGrid";
import { useUploads } from "@/hooks/use-uploads";
import { FileText } from "lucide-react";

export default function Home() {
  const { data: uploads = [], isLoading } = useUploads();

  return (
    <div className="min-h-screen bg-background bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <FileText className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
              PDF Dropper
            </h1>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground font-medium">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-muted/50 border border-border/50">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              System Online
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Manage your PDFs <br />
            <span className="text-muted-foreground">with simple elegance.</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-lg mx-auto leading-relaxed">
            Drag, drop, and organize your documents in a beautiful, secure environment designed for productivity.
          </p>
        </div>

        {/* Upload Area */}
        <DropZone />

        {/* File List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-semibold tracking-tight">Your Documents</h3>
            <span className="text-sm text-muted-foreground font-mono bg-muted/50 px-3 py-1 rounded-full">
              {uploads.length} {uploads.length === 1 ? 'file' : 'files'}
            </span>
          </div>
          <FileGrid files={uploads} isLoading={isLoading} />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8 mt-12 bg-muted/20">
        <div className="container max-w-7xl mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} PDF Dropper. Crafted with care.</p>
        </div>
      </footer>
    </div>
  );
}
