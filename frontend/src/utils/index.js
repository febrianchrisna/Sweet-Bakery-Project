// API base URL - Updated to match your deployed backend
export const BASE_URL = process.env.REACT_APP_API_URL || 'https://bakery-be-663618957788.us-central1.run.app';

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
