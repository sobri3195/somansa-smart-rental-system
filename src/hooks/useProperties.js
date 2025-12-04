import { useQuery } from '@tanstack/react-query';
import { dummyProperties, dummyUnits } from '../data/dummyData';

export const useProperties = () => {
  return useQuery({
    queryKey: ['properties'],
    queryFn: () => Promise.resolve(dummyProperties),
    staleTime: 5 * 60 * 1000,
  });
};

export const useProperty = (id) => {
  return useQuery({
    queryKey: ['property', id],
    queryFn: () => {
      const property = dummyProperties.find(p => p.id === Number(id));
      if (!property) {
        return Promise.reject(new Error('Property not found'));
      }
      return Promise.resolve(property);
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const usePropertyUnits = (propertyId) => {
  return useQuery({
    queryKey: ['property-units', propertyId],
    queryFn: () => {
      const units = dummyUnits[Number(propertyId)] || [];
      return Promise.resolve(units);
    },
    enabled: !!propertyId,
    staleTime: 5 * 60 * 1000,
  });
};
