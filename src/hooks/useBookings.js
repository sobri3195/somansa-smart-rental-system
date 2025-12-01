import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingsApi } from '../api/client';

export const useBookings = (params = {}) => {
  return useQuery({
    queryKey: ['bookings', params],
    queryFn: () => bookingsApi.getAll(params).then(res => res.data),
    staleTime: 2 * 60 * 1000,
  });
};

export const useBooking = (id) => {
  return useQuery({
    queryKey: ['booking', id],
    queryFn: () => bookingsApi.getById(id).then(res => res.data),
    enabled: !!id,
  });
};

export const useBookingLookup = (code) => {
  return useQuery({
    queryKey: ['booking-lookup', code],
    queryFn: () => bookingsApi.lookupByCode(code).then(res => res.data),
    enabled: !!code && code.length > 0,
    retry: false,
  });
};

export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (bookingData) => bookingsApi.create(bookingData).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['availability'] });
    },
  });
};
