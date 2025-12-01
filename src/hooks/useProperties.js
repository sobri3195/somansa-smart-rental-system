import { useQuery } from '@tanstack/react-query';
import { propertiesApi } from '../api/client';

export const useProperties = (filters = {}) => {
  return useQuery({
    queryKey: ['properties', filters],
    queryFn: () => propertiesApi.getAll(filters).then(res => res.data),
    staleTime: 5 * 60 * 1000,
  });
};

export const useProperty = (id) => {
  return useQuery({
    queryKey: ['property', id],
    queryFn: () => propertiesApi.getById(id).then(res => res.data),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const usePropertyUnits = (propertyId) => {
  return useQuery({
    queryKey: ['property-units', propertyId],
    queryFn: () => propertiesApi.getUnits(propertyId).then(res => res.data),
    enabled: !!propertyId,
    staleTime: 5 * 60 * 1000,
  });
};
