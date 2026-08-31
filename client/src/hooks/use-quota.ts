import { useQuery } from "@tanstack/react-query";

export function useQuota() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["uploads", "quota"],
    queryFn: async () => {
      const token = localStorage.getItem('access_token');
      const headers: HeadersInit = { "Content-Type": "application/json" };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      const res = await fetch("/api/uploads/quota", { headers });
      if (!res.ok) throw new Error("Failed to fetch quota");
      return res.json();
    },
    refetchInterval: 0,
    retry: false,
  });

  return { quota: data as { max: number; used: number; remaining: number } | undefined, isLoading, error, refetch };
}
