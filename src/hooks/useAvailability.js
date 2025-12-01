import { useQuery } from '@tanstack/react-query';
import { availabilityApi } from '../api/client';

export const useAvailability = (propertyId, unitId, params) => {
  return useQuery({
    queryKey: ['availability', propertyId, unitId, params],
    queryFn: () => availabilityApi.check(propertyId, unitId, params).then(res => res.data),
    enabled: !!propertyId && !!params?.start && !!params?.end,
    staleTime: 1 * 60 * 1000,
  });
};
