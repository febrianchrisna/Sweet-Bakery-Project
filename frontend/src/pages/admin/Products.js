import { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../utils';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    featured: false,
    image: ''
  });
  
  // Categories for the dropdown
  const categories = ['Bread', 'Cake', 'Pastry', 'Cookies', 'Dessert'];

  // Modern bakery design styles
  const styles = {
    pageContainer: {
      padding: '30px 20px',
      maxWidth: '1300px',
      margin: '0 auto',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    header: {
      marginBottom: '30px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '20px',
      paddingBottom: '15px',
      borderBottom: '1px solid rgba(184, 92, 56, 0.2)',
    },
    headerTitle: {
      fontSize: '2.5rem',
      color: '#5A2828',
      margin: 0,
      fontWeight: '700',
    },
    addButton: {
      backgroundColor: '#B85C38',
      color: 'white',
      border: 'none',
      padding: '12px 24px',
      borderRadius: '8px',
      fontWeight: '600',
      fontSize: '1rem',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      transition: 'all 0.2s ease',
    },
    addButtonHover: {
      backgroundColor: '#5A2828',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 10px rgba(184, 92, 56, 0.3)',
    },
    addButtonIcon: {
      width: '20px',
      height: '20px',
    },
    errorContainer: {
      backgroundColor: 'rgba(244, 67, 54, 0.1)',
      color: '#D32F2F',
      padding: '15px 20px',
      borderRadius: '10px',
      margin: '20px 0',
      fontSize: '1rem',
      borderLeft: '4px solid #D32F2F',
    },
    loadingContainer: {
      padding: '50px',
      textAlign: 'center',
      color: '#777',
      fontSize: '1.1rem',
    },
    // Form styles
    formOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      zIndex: 999,
      display: showForm ? 'flex' : 'none',
      justifyContent: 'center',
      alignItems: 'center',
      backdropFilter: 'blur(4px)',
    },
    formContainer: {
      backgroundColor: 'white',
      borderRadius: '15px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
      width: '100%',
      maxWidth: '800px',
      maxHeight: '90vh',
      overflow: 'auto',
      position: 'relative',
    },
    formHeader: {
      backgroundColor: '#FFFAF0',
      padding: '20px 30px',
      borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
      position: 'sticky',
      top: 0,
      zIndex: 2,
    },
    formTitle: {
      fontSize: '1.5rem',
      color: '#5A2828',
      fontWeight: '600',
      margin: 0,
    },
    formContent: {
      padding: '30px',
    },
    formGroup: {
      marginBottom: '25px',
    },
    formLabel: {
      display: 'block',
      marginBottom: '8px',
      color: '#5A2828',
      fontWeight: '600',
      fontSize: '1rem',
    },
    formRequired: {
      color: '#B85C38',
      marginLeft: '3px',
    },
    formInput: {
      width: '100%',
      padding: '12px 15px',
      border: '1px solid rgba(0, 0, 0, 0.1)',
      borderRadius: '8px',
      fontSize: '1rem',
      transition: 'border-color 0.2s ease',
      boxSizing: 'border-box',
    },
    formInputFocus: {
      borderColor: '#B85C38',
      outline: 'none',
      boxShadow: '0 0 0 3px rgba(184, 92, 56, 0.1)',
    },
    formRow: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '20px',
    },
    formTextarea: {
      width: '100%',
      padding: '12px 15px',
      border: '1px solid rgba(0, 0, 0, 0.1)',
      borderRadius: '8px',
      fontSize: '1rem',
      transition: 'border-color 0.2s ease',
      minHeight: '120px',
      resize: 'vertical',
      boxSizing: 'border-box',
    },
    formSelect: {
      width: '100%',
      padding: '12px 15px',
      border: '1px solid rgba(0, 0, 0, 0.1)',
      borderRadius: '8px',
      fontSize: '1rem',
      transition: 'border-color 0.2s ease',
      backgroundColor: 'white',
      boxSizing: 'border-box',
      appearance: 'none',
      backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'right 15px center',
      backgroundSize: '15px',
    },
    checkboxContainer: {
      display: 'flex',
      alignItems: 'center',
      margin: '10px 0',
    },
    checkboxInput: {
      width: '18px',
      height: '18px',
      marginRight: '10px',
      cursor: 'pointer',
      accentColor: '#B85C38',
    },
    formActions: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '15px',
      marginTop: '30px',
      borderTop: '1px solid rgba(0, 0, 0, 0.05)',
      paddingTop: '20px',
    },
    cancelButton: {
      padding: '10px 20px',
      backgroundColor: '#f5f5f5',
      color: '#666',
      border: 'none',
      borderRadius: '8px',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    cancelButtonHover: {
      backgroundColor: '#e0e0e0',
    },
    saveButton: {
      padding: '10px 25px',
      backgroundColor: '#B85C38',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    saveButtonHover: {
      backgroundColor: '#5A2828',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 10px rgba(184, 92, 56, 0.3)',
    },
    // Table styles
    tableContainer: {
      backgroundColor: 'white',
      borderRadius: '15px',
      boxShadow: '0 5px 20px rgba(0, 0, 0, 0.05)',
      overflow: 'hidden',
    },
    noProducts: {
      padding: '30px',
      textAlign: 'center',
      color: '#777',
      fontSize: '1.1rem',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
    },
    tableHeader: {
      backgroundColor: '#FFFAF0',
      borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
      color: '#5A2828',
    },
    tableHeaderCell: {
      padding: '15px 20px',
      textAlign: 'left',
      fontWeight: '600',
      fontSize: '0.95rem',
    },
    tableRow: {
      transition: 'background-color 0.2s ease',
      borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
    },
    tableRowHover: {
      backgroundColor: 'rgba(184, 92, 56, 0.03)',
    },
    tableCell: {
      padding: '15px 20px',
      fontSize: '0.95rem',
      color: '#555',
    },
    tableCellId: {
      fontWeight: '600',
      color: '#5A2828',
    },
    tableCellPrice: {
      color: '#B85C38',
      fontWeight: '600',
    },
    featuredBadge: {
      backgroundColor: 'rgba(138, 177, 125, 0.15)',
      color: '#8AB17D',
      padding: '5px 12px',
      borderRadius: '20px',
      fontSize: '0.85rem',
      fontWeight: '600',
      display: 'inline-block',
    },
    productImage: {
      width: '60px',
      height: '60px',
      borderRadius: '8px',
      objectFit: 'cover',
      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    },
    actionButtons: {
      display: 'flex',
      gap: '10px',
    },
    editButton: {
      padding: '8px 12px',
      backgroundColor: 'rgba(33, 150, 243, 0.1)',
      color: '#1976D2',
      border: 'none',
      borderRadius: '6px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      fontSize: '0.9rem',
    },
    editButtonHover: {
      backgroundColor: 'rgba(33, 150, 243, 0.2)',
    },
    deleteButton: {
      padding: '8px 12px',
      backgroundColor: 'rgba(244, 67, 54, 0.1)',
      color: '#D32F2F',
      border: 'none',
      borderRadius: '6px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      fontSize: '0.9rem',
    },
    deleteButtonHover: {
      backgroundColor: 'rgba(244, 67, 54, 0.2)',
    },
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/products`);
      setProducts(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again later.');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      stock: '',
      featured: false,
      image: ''
    });
    setEditingProduct(null);
  };

  const handleAddNew = () => {
    resetForm();
    setShowForm(true);
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      category: product.category,
      stock: product.stock.toString(),
      featured: product.featured,
      image: product.image || ''
    });
    setEditingProduct(product.id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.price || !formData.category) {
      setError('Please fill in all required fields.');
      return;
    }
    
    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock)
      };
      
      if (editingProduct) {
        // Update existing product
        await axios.put(`${BASE_URL}/products/${editingProduct}`, productData);
      } else {
        // Create new product
        await axios.post(`${BASE_URL}/products`, productData);
      }
      
      // Refresh products list
      fetchProducts();
      
      // Reset form and hide it
      resetForm();
      setShowForm(false);
      setError(null);
    } catch (err) {
      console.error('Error saving product:', err);
      setError(err.response?.data?.message || 'Failed to save product. Please try again.');
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`${BASE_URL}/products/${productId}`);
        fetchProducts();
      } catch (err) {
        console.error('Error deleting product:', err);
        setError('Failed to delete product. Please try again.');
      }
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.header}>
        <h1 style={styles.headerTitle}>Manage Products</h1>
        <button 
          onClick={handleAddNew} 
          style={styles.addButton}
          onMouseOver={e => {
            e.target.style.backgroundColor = styles.addButtonHover.backgroundColor;
            e.target.style.transform = styles.addButtonHover.transform;
            e.target.style.boxShadow = styles.addButtonHover.boxShadow;
          }}
          onMouseOut={e => {
            e.target.style.backgroundColor = styles.addButton.backgroundColor;
            e.target.style.transform = 'none';
            e.target.style.boxShadow = 'none';
          }}
        >
          <svg style={styles.addButtonIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Add New Product
        </button>
      </div>
      
      {error && <div style={styles.errorContainer}>{error}</div>}
      
      {/* Product form modal */}
      <div style={styles.formOverlay}>
        <div style={styles.formContainer}>
          <div style={styles.formHeader}>
            <h2 style={styles.formTitle}>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
          </div>
          
          <form onSubmit={handleSubmit} style={styles.formContent}>
            <div style={styles.formGroup}>
              <label style={styles.formLabel} htmlFor="name">
                Product Name<span style={styles.formRequired}>*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                style={styles.formInput}
                onFocus={e => e.target.style.boxShadow = styles.formInputFocus.boxShadow}
                onBlur={e => e.target.style.boxShadow = 'none'}
                required
              />
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.formLabel} htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                style={styles.formTextarea}
                onFocus={e => e.target.style.boxShadow = styles.formInputFocus.boxShadow}
                onBlur={e => e.target.style.boxShadow = 'none'}
              />
            </div>
            
            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.formLabel} htmlFor="price">
                  Price (Rp)<span style={styles.formRequired}>*</span>
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  min="0"
                  step="1000"
                  value={formData.price}
                  onChange={handleChange}
                  style={styles.formInput}
                  onFocus={e => e.target.style.boxShadow = styles.formInputFocus.boxShadow}
                  onBlur={e => e.target.style.boxShadow = 'none'}
                  required
                />
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.formLabel} htmlFor="stock">
                  Stock<span style={styles.formRequired}>*</span>
                </label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  min="0"
                  value={formData.stock}
                  onChange={handleChange}
                  style={styles.formInput}
                  onFocus={e => e.target.style.boxShadow = styles.formInputFocus.boxShadow}
                  onBlur={e => e.target.style.boxShadow = 'none'}
                  required
                />
              </div>
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.formLabel} htmlFor="category">
                Category<span style={styles.formRequired}>*</span>
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                style={styles.formSelect}
                onFocus={e => e.target.style.boxShadow = styles.formInputFocus.boxShadow}
                onBlur={e => e.target.style.boxShadow = 'none'}
                required
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.formLabel} htmlFor="image">Image URL</label>
              <input
                type="text"
                id="image"
                name="image"
                value={formData.image}
                onChange={handleChange}
                style={styles.formInput}
                onFocus={e => e.target.style.boxShadow = styles.formInputFocus.boxShadow}
                onBlur={e => e.target.style.boxShadow = 'none'}
              />
            </div>
            
            <div style={styles.checkboxContainer}>
              <input
                type="checkbox"
                id="featured"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                style={styles.checkboxInput}
              />
              <label style={styles.formLabel} htmlFor="featured">Featured Product</label>
            </div>
            
            <div style={styles.formActions}>
              <button 
                type="button" 
                onClick={() => setShowForm(false)} 
                style={styles.cancelButton}
                onMouseOver={e => {
                  e.target.style.backgroundColor = styles.cancelButtonHover.backgroundColor;
                }}
                onMouseOut={e => {
                  e.target.style.backgroundColor = styles.cancelButton.backgroundColor;
                }}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                style={styles.saveButton}
                onMouseOver={e => {
                  e.target.style.backgroundColor = styles.saveButtonHover.backgroundColor;
                  e.target.style.transform = styles.saveButtonHover.transform;
                  e.target.style.boxShadow = styles.saveButtonHover.boxShadow;
                }}
                onMouseOut={e => {
                  e.target.style.backgroundColor = styles.saveButton.backgroundColor;
                  e.target.style.transform = 'none';
                  e.target.style.boxShadow = 'none';
                }}
              >
                {editingProduct ? 'Update Product' : 'Add Product'}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {loading ? (
        <div style={styles.loadingContainer}>Loading products...</div>
      ) : (
        <div style={styles.tableContainer}>
          {products.length === 0 ? (
            <div style={styles.noProducts}>No products available.</div>
          ) : (
            <table style={styles.table}>
              <thead style={styles.tableHeader}>
                <tr>
                  <th style={styles.tableHeaderCell}>ID</th>
                  <th style={styles.tableHeaderCell}>Image</th>
                  <th style={styles.tableHeaderCell}>Name</th>
                  <th style={styles.tableHeaderCell}>Category</th>
                  <th style={styles.tableHeaderCell}>Price</th>
                  <th style={styles.tableHeaderCell}>Stock</th>
                  <th style={styles.tableHeaderCell}>Featured</th>
                  <th style={styles.tableHeaderCell}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr 
                    key={product.id} 
                    style={styles.tableRow}
                    onMouseOver={e => {
                      e.currentTarget.style.backgroundColor = styles.tableRowHover.backgroundColor;
                    }}
                    onMouseOut={e => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <td style={{...styles.tableCell, ...styles.tableCellId}}>{product.id}</td>
                    <td style={styles.tableCell}>
                      <img 
                        src={product.image || '/images/product-placeholder.jpg'} 
                        alt={product.name} 
                        style={styles.productImage}
                      />
                    </td>
                    <td style={styles.tableCell}>{product.name}</td>
                    <td style={styles.tableCell}>{product.category}</td>
                    <td style={{...styles.tableCell, ...styles.tableCellPrice}}>
                      Rp {product.price.toLocaleString()}
                    </td>
                    <td style={styles.tableCell}>{product.stock}</td>
                    <td style={styles.tableCell}>
                      {product.featured ? 
                        <span style={styles.featuredBadge}>Yes</span> : 
                        'No'
                      }
                    </td>
                    <td style={styles.tableCell}>
                      <div style={styles.actionButtons}>
                        <button 
                          onClick={() => handleEdit(product)}
                          style={styles.editButton}
                          onMouseOver={e => {
                            e.target.style.backgroundColor = styles.editButtonHover.backgroundColor;
                          }}
                          onMouseOut={e => {
                            e.target.style.backgroundColor = styles.editButton.backgroundColor;
                          }}
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(product.id)}
                          style={styles.deleteButton}
                          onMouseOver={e => {
                            e.target.style.backgroundColor = styles.deleteButtonHover.backgroundColor;
                          }}
                          onMouseOut={e => {
                            e.target.style.backgroundColor = styles.deleteButton.backgroundColor;
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
