import { useQuery } from "@tanstack/react-query";

export function useRole() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-role"],
    queryFn: async () => {
      const response = await fetch("/api/admin/me", { credentials: "include" });
      if (!response.ok) throw new Error("Unable to load staff role");
      return response.json() as Promise<{ role: string }>;
    },
    retry: false,
  });
  const role = data?.role ?? "staff";
  return {
    role,
    isSuperAdmin: role === "super_admin",
    isLoaded: !isLoading,
  };
}