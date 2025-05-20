// API base URL
export const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Format currency
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount);
};

// Product categories
export const CATEGORIES = [
  'Bread',
  'Cake',
  'Pastry',
  'Cookies',
  'Dessert'
];
