import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export function useAuth() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error("No token found");
      }

      const response = await fetch("/api/auth/me", {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error("Unauthorized");
      }
      
      return response.json();
    },
    retry: false,
  });

  useEffect(() => {
    if (!isLoading && (!data || error)) {
      window.location.href = "/login";
    }
  }, [isLoading, data, error]);

  return {
    user: data?.user,
    isLoading,
    isAuthenticated: !!data?.user,
  };
}
