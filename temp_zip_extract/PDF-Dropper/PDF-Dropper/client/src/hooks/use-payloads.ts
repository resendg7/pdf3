import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type InsertPayload } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useUploadPayload() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertPayload) => {
      // Validate with shared schema before sending
      const validated = api.payloads.upload.input.parse(data);
      
      const res = await fetch(api.payloads.upload.path, {
        method: api.payloads.upload.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = await res.json();
          throw new Error(error.message || "Validation failed");
        }
        throw new Error("Failed to upload payload");
      }

      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Payload uploaded successfully. Users will now receive this file.",
        variant: "default",
      });
      // Invalidate relevant queries if we had a list of payloads
      queryClient.invalidateQueries({ queryKey: [api.payloads.getLatest.path] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    },
  });
}
