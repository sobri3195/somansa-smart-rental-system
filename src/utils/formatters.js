export const formatCurrency = (amount, currency = 'IDR') => {
  if (amount == null) return '-';
  
  if (currency === 'IDR') {
    return `Rp ${amount.toLocaleString('id-ID')}`;
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

export const formatPropertyType = (type) => {
  const types = {
    house: 'House',
    kos: 'Boarding (Kos)',
    car: 'Car Rental',
  };
  return types[type] || type;
};

export const formatBookingStatus = (status) => {
  const statuses = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    cancelled: 'Cancelled',
    completed: 'Completed',
  };
  return statuses[status] || status;
};

export const getStatusColor = (status) => {
  const colors = {
    pending: 'orange',
    confirmed: 'green',
    cancelled: 'red',
    completed: 'blue',
  };
  return colors[status] || 'gray';
};
