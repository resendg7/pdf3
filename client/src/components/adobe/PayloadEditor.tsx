import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface PayloadEditorProps {
  filename: string;
  setFilename: (val: string) => void;
  content: string;
  setContent: (val: string) => void;
}

export function PayloadEditor({ filename, setFilename, content, setContent }: PayloadEditorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payload Content</CardTitle>
        <CardDescription>
          Paste your payload content directly or verify the content of the uploaded file.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="filename">Target Filename</Label>
          <Input 
            id="filename" 
            value={filename} 
            onChange={(e) => setFilename(e.target.value)}
            placeholder="update.exe"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="content">Payload Content</Label>
          <span className="text-xs text-muted-foreground">(Changes are reflected in the PDF during deployment)</span>
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="font-mono text-sm min-h-[400px] bg-slate-900 text-slate-50 p-4 border-slate-800 focus-visible:ring-slate-400"
            placeholder="// Paste your payload content here..."
          />
        </div>
      </CardContent>
    </Card>
  );
}
