import { useQuery } from '@tanstack/react-query';
import { invoicesApi } from '../api/client';

export const useInvoice = (bookingId) => {
  return useQuery({
    queryKey: ['invoice', bookingId],
    queryFn: () => invoicesApi.getByBookingId(bookingId).then(res => res.data),
    enabled: !!bookingId,
    retry: false,
  });
};
