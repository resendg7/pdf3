import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { type Payload, type InsertPayload } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export function usePayloads() {
  const { toast } = useToast();

  const latestQuery = useQuery<Payload>({
    queryKey: [api.payloads.getLatest.path],
  });

  const uploadMutation = useMutation({
    mutationFn: async (payload: InsertPayload) => {
      const res = await apiRequest("POST", api.payloads.upload.path, payload);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.payloads.getLatest.path] });
      // refresh daily quota
      queryClient.invalidateQueries({ queryKey: ["uploads", "quota"] });
      toast({
        title: "Success",
        description: "Payload uploaded and PDF generated.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    latest: latestQuery.data,
    isLoading: latestQuery.isLoading,
    upload: uploadMutation.mutate,
    isUploading: uploadMutation.isPending,
    downloadUrl: api.payloads.download.path,
    pdfUrl: api.payloads.downloadPdf.path,
  };
}

export function useUploadPayload() {
  const { upload, isUploading } = usePayloads();
  return { mutate: upload, isPending: isUploading };
}
