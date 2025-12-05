/**
 * Services Hooks
 * 
 * Custom hooks for managing services with React Query.
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { serviceService } from "@/services/admin/serviceService";
import { useToast } from "@/hooks/admin/use-toast";
import { Service } from "@/types/admin/service";

/**
 * Hook for fetching all services for a professional
 */
export function useServices(proffessionnelId: string) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["admin-services", proffessionnelId],
    queryFn: () => serviceService.getServices(proffessionnelId),
    enabled: !!proffessionnelId,
  });

  return {
    services: data || [],
    count: data?.length || 0,
    isLoading,
    error,
    refetch,
  };
}

/**
 * Hook for fetching a single service by ID
 */
export function useService(serviceId: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-service", serviceId],
    queryFn: () => serviceService.getServiceById(serviceId),
    enabled: !!serviceId,
  });

  return {
    service: data,
    isLoading,
    error,
  };
}

/**
 * Hook for creating a new service
 */
export function useCreateService() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (formData: FormData) => serviceService.createService(formData),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["admin-services"] });
      toast({
        title: "Success",
        description: response.message || "Service created successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create service",
        variant: "destructive",
      });
    },
  });
}

/**
 * Hook for updating a service
 */
export function useUpdateService() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ serviceId, formData }: { serviceId: string; formData: FormData }) => 
      serviceService.updateService(serviceId, formData),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["admin-services"] });
      queryClient.invalidateQueries({ queryKey: ["admin-service"] });
      toast({
        title: "Success",
        description: response.message || "Service updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update service",
        variant: "destructive",
      });
    },
  });
}

/**
 * Hook for deleting a service
 */
export function useDeleteService() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (serviceId: string) => serviceService.deleteService(serviceId),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["admin-services"] });
      toast({
        title: "Success",
        description: response.message || "Service deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete service",
        variant: "destructive",
      });
    },
  });
}

/**
 * Hook for suspending a service
 */
export function useSuspendService() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (serviceId: string) => serviceService.suspendService(serviceId),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["admin-services"] });
      toast({
        title: "Success",
        description: response.message || "Service suspended successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to suspend service",
        variant: "destructive",
      });
    },
  });
}
