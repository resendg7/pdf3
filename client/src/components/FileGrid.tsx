import { Upload } from "@shared/schema";
import { FileText, Download, Trash2, Calendar, HardDrive } from "lucide-react";
import { format } from "date-fns";
import { useDeleteUpload } from "@/hooks/use-uploads";
import { motion, AnimatePresence } from "framer-motion";
import { api, buildUrl } from "@shared/routes";

interface FileGridProps {
  files: Upload[];
  isLoading: boolean;
}

export function FileGrid({ files, isLoading }: FileGridProps) {
  const { mutate: deleteFile } = useDeleteUpload();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-48 rounded-2xl bg-muted/50 animate-pulse border border-border/50" />
        ))}
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="inline-flex items-center justify-center p-4 rounded-full bg-muted mb-4">
          <FileText className="w-6 h-6 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">No files yet</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Upload your first PDF to get started
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <AnimatePresence mode="popLayout">
        {files.map((file) => (
          <motion.div
            key={file.id}
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="group relative bg-card hover:bg-card/80 border border-border/50 hover:border-primary/20 rounded-2xl p-5 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-xl bg-primary/5 text-primary group-hover:bg-primary/10 transition-colors">
                <FileText className="w-6 h-6" />
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <a
                  href={buildUrl(api.uploads.download.path, { id: file.id })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                  title="Download"
                >
                  <Download className="w-4 h-4" />
                </a>
                <button
                  onClick={() => deleteFile(file.id)}
                  className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <h3 className="font-semibold text-foreground truncate pr-2 mb-1" title={file.originalName}>
              {file.originalName}
            </h3>

            <div className="flex items-center gap-4 text-xs text-muted-foreground mt-4 font-mono">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3 h-3" />
                {format(new Date(file.createdAt), "MMM d, yyyy")}
              </div>
              <div className="flex items-center gap-1.5">
                <HardDrive className="w-3 h-3" />
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </div>
            </div>

            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-b-2xl" />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
