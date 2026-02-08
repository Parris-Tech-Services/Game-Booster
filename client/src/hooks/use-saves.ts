import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type InsertSave, type Save } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

// Fetch all saves
export function useSaves() {
  return useQuery({
    queryKey: [api.saves.list.path],
    queryFn: async () => {
      const res = await fetch(api.saves.list.path);
      if (!res.ok) throw new Error("Failed to fetch saves");
      return api.saves.list.responses[200].parse(await res.json());
    },
  });
}

// Fetch single save
export function useSave(id: number) {
  return useQuery({
    queryKey: [api.saves.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.saves.get.path, { id });
      const res = await fetch(url);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch save");
      return api.saves.get.responses[200].parse(await res.json());
    },
  });
}

// Create new save
export function useCreateSave() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (data: InsertSave) => {
      const res = await fetch(api.saves.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create save");
      return api.saves.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.saves.list.path] });
      toast({
        title: "Game Saved",
        description: "Your progress has been recorded in the archives.",
        className: "bg-slate-900 border-amber-900 text-amber-100",
      });
    },
    onError: () => {
      toast({
        title: "Save Failed",
        description: "The archives rejected your entry.",
        variant: "destructive",
      });
    }
  });
}

// Delete save
export function useDeleteSave() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.saves.delete.path, { id });
      const res = await fetch(url, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete save");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.saves.list.path] });
      toast({
        title: "Save Deleted",
        description: "The record has been stricken from history.",
        className: "bg-slate-900 border-amber-900 text-amber-100",
      });
    },
  });
}
