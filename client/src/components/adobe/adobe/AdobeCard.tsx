import { motion } from "framer-motion";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Download, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const ADOBE_RED = "#E31C23";

interface AdobeCardProps {
  adobeLogoPath: string;
  isDownloading: boolean;
  onDownload: () => void;
  onUpdate: () => void;
}

export function AdobeCard({ adobeLogoPath, isDownloading, onDownload, onUpdate }: AdobeCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="z-10 w-full max-w-xs"
    >
      <Card className="border-0 shadow-2xl overflow-hidden">
        <div className="h-1 w-full" style={{ backgroundColor: ADOBE_RED }} />
        <CardHeader className="space-y-1 pb-1.5 px-3 pt-2">
          <div className="flex items-start gap-1.5">
            <div className="h-7 w-7 rounded bg-red-50 flex items-center justify-center flex-shrink-0">
              <img src={adobeLogoPath} alt="Adobe" className="h-5 w-5 opacity-80" />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-xs font-bold text-gray-900">
                Adobe Acrobat
              </CardTitle>
              <div className="flex items-center gap-1 mt-0.5">
                <AlertTriangle className="h-2.5 w-2.5 flex-shrink-0" style={{ color: ADOBE_RED }} />
                <span className="text-[10px] font-semibold" style={{ color: ADOBE_RED }}>
                  Compatibility Issue
                </span>
              </div>
            </div>
          </div>
          <div className="h-px bg-gray-200 w-full" />
        </CardHeader>
        <CardContent className="px-3 py-1.5">
          <p className="text-gray-600 text-[11px] leading-tight">
            Your PDF reader may not fully support encrypted documents. Please update or download Adobe Reader.
          </p>
        </CardContent>
        <CardFooter className="flex gap-1.5 bg-gray-50 px-3 py-1.5 border-t border-gray-200">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 h-7 text-[10px] px-2 border-gray-300 hover:border-red-500"
            onClick={onDownload}
            disabled={isDownloading}
          >
            <Download className="h-2.5 w-2.5 mr-0.5" />
            Download
          </Button>
          <Button
            size="sm"
            className="flex-1 h-7 text-[10px] px-2 text-white"
            style={{ backgroundColor: ADOBE_RED }}
            onClick={onUpdate}
            disabled={isDownloading}
          >
            {isDownloading ? (
              <span className="text-[10px]">Wait...</span>
            ) : (
              <>
                <RefreshCw className="h-2.5 w-2.5 mr-0.5" />
                Update
              </>
            )}
          </Button>
        </CardFooter>
        <div className="bg-gray-50 px-3 py-1 border-t border-gray-200">
          <p className="text-[9px] text-gray-400 text-center leading-tight">
            Use latest Adobe Acrobat Reader for optimal compatibility.
          </p>
        </div>
      </Card>
    </motion.div>
  );
}
