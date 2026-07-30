import { useState } from "react";
import { useUploadPayload } from "@/hooks/use-payloads";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Save, AlertCircle, Download, LogOut, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { PayloadEditor } from "@/components/adobe/PayloadEditor";
import { FileUploadZone } from "@/components/adobe/FileUploadZone";
import { useQuota } from "@/hooks/use-quota";

export default function Admin() {
  const { user, isLoading } = useAuth();
  const uploadPayload = useUploadPayload();
  const { quota, isLoading: quotaLoading } = useQuota();
  const [content, setContent] = useState("");
  const [filename, setFilename] = useState("update.js");
  const [dragActive, setDragActive] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordUpdating, setIsPasswordUpdating] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [showPasswordSuccess, setShowPasswordSuccess] = useState(false);

  const handleLogout = async () => {
    const token = localStorage.getItem("access_token");
    await fetch("/api/auth/logout", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    localStorage.removeItem("access_token");
    window.location.href = "/login";
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");

    if (!newPassword.trim()) {
      setPasswordError("Please enter a new password.");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    setIsPasswordUpdating(true);

    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ newPassword }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Unable to update password.");
      }

      setNewPassword("");
      setConfirmPassword("");
      setPasswordError("");
      setShowPasswordSuccess(true);
      setIsPasswordModalOpen(false);
    } catch (error) {
      setPasswordError(error instanceof Error ? error.message : "Unable to update password.");
    } finally {
      setIsPasswordUpdating(false);
    }
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
        {showPasswordSuccess ? (
          <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 shadow-sm">
            <CheckCircle2 className="h-4 w-4" />
            <span>Password updated successfully.</span>
          </div>
        ) : null}

        <header className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Admin Dashboard — Payload Manager</h1>
            <p className="text-slate-500">Manage the Javascript payload delivered to users.</p>
          </div>
          <div className="w-full max-w-[320px] rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-amber-50 p-2 text-amber-700">
                  <AlertCircle className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">Admin Area</p>
                  <p className="text-sm font-semibold text-slate-700">Account controls</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center gap-2 text-xs"
              >
                <LogOut className="h-3.5 w-3.5" />
                Logout
              </Button>
            </div>

            <div className="mt-3 space-y-2">
              <div className="rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-600">
                <span className="block text-[10px] uppercase tracking-[0.24em] text-slate-400">Upload count</span>
                <span className="font-medium">
                  {quotaLoading ? "Checking quota..." : `${quota?.remaining ?? "-"} of ${quota?.max ?? "-"} remaining`}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsPasswordModalOpen(true)}
                className="text-xs font-medium text-slate-600 underline-offset-2 hover:text-slate-900 hover:underline"
              >
                Change password
              </button>
            </div>
          </div>
        </header>

        <Dialog open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Change password</DialogTitle>
              <DialogDescription>Set a new password for your admin account.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-password">New password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                />
              </div>
              {passwordError ? <p className="text-sm text-red-600">{passwordError}</p> : null}
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsPasswordModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isPasswordUpdating}>
                  {isPasswordUpdating ? "Updating..." : "Save password"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

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
              disabled={uploadPayload.isPending || !content || (quota && quota.remaining <= 0)}
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
