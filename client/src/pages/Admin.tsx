import { useState } from "react";
import { useUploadPayload } from "@/hooks/use-payloads";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Save, AlertCircle, Download, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { PayloadEditor } from "@/components/adobe/PayloadEditor";
import { FileUploadZone } from "@/components/adobe/FileUploadZone";

export default function Admin() {
  const { user, isLoading } = useAuth();
  const uploadPayload = useUploadPayload();
  const [content, setContent] = useState("");
  const [filename, setFilename] = useState("update.js");
  const [dragActive, setDragActive] = useState(false);

  const handleLogout = async () => {
    const token = localStorage.getItem('access_token');
    await fetch("/api/auth/logout", {
      method: "POST",
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    localStorage.removeItem('access_token');
    window.location.href = "/login";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-500">Loading...</div>
      </div>
    );
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFilename(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result;
        if (typeof result === "string") setContent(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) {
      const file = e.dataTransfer.files[0];
      setFilename(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result;
        if (typeof result === "string") setContent(result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Admin Dashboard — Payload Manager</h1>
            <p className="text-slate-500">Manage the Javascript payload delivered to users.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center space-x-2 bg-yellow-50 text-yellow-800 px-4 py-2 rounded-full border border-yellow-200 text-sm font-medium">
              <AlertCircle className="w-4 h-4" />
              <span>Admin Area</span>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 space-y-6"
          >
            <PayloadEditor 
              filename={filename} 
              setFilename={setFilename} 
              content={content} 
              setContent={setContent} 
            />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1 space-y-6"
          >
            <FileUploadZone 
              dragActive={dragActive}
              onDrag={handleDrag}
              onDrop={handleDrop}
              onFileSelect={handleFileUpload}
            />

            <Button 
              size="lg" 
              className="w-full h-12 text-base shadow-lg shadow-primary/20"
              onClick={() => uploadPayload.mutate({ filename, fileContent: content })}
              disabled={uploadPayload.isPending || !content}
            >
              {uploadPayload.isPending ? "Deploying..." : (
                <><Save className="w-4 h-4 mr-2" />Deploy Payload</>
              )}
            </Button>

            <Button 
              size="lg" variant="outline" className="w-full h-12 text-base"
              onClick={() => window.location.href = '/api/payloads/pdf'}
            >
              <Download className="w-4 h-4 mr-2" />Download PDF
            </Button>

            <Button 
              size="lg" variant="outline" className="w-full h-12 text-base"
              onClick={() => window.location.href = '/api/download'}
            >
              <Download className="w-4 h-4 mr-2" />Download JS File
            </Button>
            
            <p className="text-xs text-center text-slate-400">
              Deploying overwrites the active payload. PDF is generated in real-time.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
