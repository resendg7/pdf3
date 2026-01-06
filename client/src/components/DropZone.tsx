import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, FileText, Loader2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useUploadFile } from "@/hooks/use-uploads";
import { cn } from "@/lib/utils";

export function DropZone() {
  const { mutate: uploadFile, isPending } = useUploadFile();
  const [uploadProgress, setUploadProgress] = useState(0); // Simulated progress

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      // Start simulated progress
      setUploadProgress(0);
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      uploadFile(file, {
        onSuccess: () => {
          clearInterval(interval);
          setUploadProgress(100);
          setTimeout(() => setUploadProgress(0), 500); // Reset after delay
        },
        onError: () => {
          clearInterval(interval);
          setUploadProgress(0);
        }
      });
    });
  }, [uploadFile]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxFiles: 5,
    disabled: isPending
  });

  return (
    <div className="w-full max-w-2xl mx-auto mb-12">
      <div
        {...getRootProps()}
        className={cn(
          "relative group cursor-pointer overflow-hidden rounded-3xl border-2 border-dashed transition-all duration-300 ease-out p-12 text-center",
          isDragActive 
            ? "border-primary bg-primary/5 scale-[1.02] shadow-2xl shadow-primary/10" 
            : "border-border hover:border-primary/50 hover:bg-muted/30 bg-card/50",
          isDragReject && "border-destructive bg-destructive/5",
          isPending && "pointer-events-none opacity-80"
        )}
      >
        <input {...getInputProps()} />
        
        <div className="relative z-10 flex flex-col items-center justify-center space-y-4">
          <div className={cn(
            "p-4 rounded-full transition-all duration-300",
            isDragActive ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
          )}>
            {isPending ? (
              <Loader2 className="w-8 h-8 animate-spin" />
            ) : (
              <UploadCloud className="w-8 h-8" />
            )}
          </div>
          
          <div className="space-y-1">
            <h3 className="text-xl font-bold font-display tracking-tight text-foreground">
              {isDragActive ? "Drop PDF here" : "Upload Documents"}
            </h3>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto">
              Drag and drop your PDF files here, or click to browse.
            </p>
          </div>
        </div>

        {/* Progress Bar Overlay */}
        <AnimatePresence>
          {uploadProgress > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-0 bg-background/50 backdrop-blur-sm flex items-end"
            >
              <div 
                className="h-1 bg-primary w-full transition-all duration-300 ease-out"
                style={{ width: `${uploadProgress}%` }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
