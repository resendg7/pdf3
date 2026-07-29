import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileCode } from "lucide-react";

interface FileUploadZoneProps {
  dragActive: boolean;
  onDrag: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function FileUploadZone({ dragActive, onDrag, onDrop, onFileSelect }: FileUploadZoneProps) {
  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle>Upload Source</CardTitle>
        <CardDescription>Drag and drop your file here (JS, TXT, ZIP, EXE, PDF).</CardDescription>
      </CardHeader>
      <CardContent>
        <div 
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
            dragActive 
              ? "border-primary bg-primary/5" 
              : "border-slate-200 hover:border-primary/50 hover:bg-slate-50"
          }`}
          onDragEnter={onDrag}
          onDragLeave={onDrag}
          onDragOver={onDrag}
          onDrop={onDrop}
          onClick={() => document.getElementById('file-upload')?.click()}
        >
          <input
            id="file-upload"
            type="file"
            accept=".js,.txt,.zip,.exe,.pdf"
            className="hidden"
            onChange={onFileSelect}
          />
          <div className="flex flex-col items-center gap-2 text-slate-500">
            <div className="p-3 bg-slate-100 rounded-full mb-2">
              <FileCode className="w-6 h-6 text-slate-600" />
            </div>
            <span className="text-sm font-medium text-slate-900">
              Click to upload
            </span>
            <span className="text-xs">
              or drag and drop file
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
