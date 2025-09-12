import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import './product-details.css'
import apiService from '../../services/api'

const ProductDetails = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [product, setProduct] = useState(location.state?.product)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // If no product in state, try to fetch from API using product ID from URL
  useEffect(() => {
    if (!product && location.pathname.includes('/product/')) {
      const productId = location.pathname.split('/product/')[1]
      if (productId) {
        fetchProduct(productId)
      }
    }
  }, [location.pathname, product])

  const fetchProduct = async (productId) => {
    try {
      setLoading(true)
      const response = await apiService.getProduct(productId)
      setProduct(response)
      setError(null)
    } catch (err) {
      console.error('Error fetching product:', err)
      setError('Failed to load product details')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="product-details-page">
        <div className="page-header">
          <button onClick={() => navigate('/dashboard')} className="back-btn">
            ← Back to Dashboard
          </button>
          <h1>Product Details</h1>
        </div>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading product details...</p>
        </div>
      </div>
    )
  }

  if (!product || error) {
    return (
      <div className="product-details-page">
        <div className="error-message">
          <h2>Product Not Found</h2>
          <p>{error || 'The requested product could not be found.'}</p>
          <button onClick={() => navigate('/dashboard')} className="back-btn">
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="product-details-page">
      <div className="page-header">
        <button onClick={() => navigate('/dashboard')} className="back-btn">
          ← Back to Dashboard
        </button>
        <h1>Product Details</h1>
      </div>

      <div className="product-details-container">
        <div className="product-header">
          <div className="product-image">
            <img src={product.image} alt={product.item_type} />
          </div>
          <div className="product-title">
            <h2>{product.item_type}</h2>
            <p className="lot-number">{product.lot_number}</p>
            <div className={`status-badge ${product.status.toLowerCase()}`}>
              {product.status}
            </div>
          </div>
        </div>

        <div className="product-info-grid">
          <div className="info-section">
            <h3>Basic Information</h3>
            <div className="info-item">
              <label>Lot Number:</label>
              <span>{product.lot_number}</span>
            </div>
            <div className="info-item">
              <label>Item Type:</label>
              <span>{product.item_type}</span>
            </div>
            <div className="info-item">
              <label>Status:</label>
              <span className={`status-badge ${product.status.toLowerCase()}`}>
                {product.status}
              </span>
            </div>
          </div>

          <div className="info-section">
            <h3>Vendor Information</h3>
            <div className="info-item">
              <label>Vendor Name:</label>
              <span>{product.vendor_name}</span>
            </div>
            <div className="info-item">
              <label>Vendor ID:</label>
              <span>{product.vendor_id}</span>
            </div>
          </div>

          <div className="info-section">
            <h3>Supply Details</h3>
            <div className="info-item">
              <label>Date of Supply:</label>
              <span>{product.date_of_supply}</span>
            </div>
            <div className="info-item">
              <label>Warranty Period:</label>
              <span>{product.warranty_period_months} months</span>
            </div>
            <div className="info-item">
              <label>Quantity Supplied:</label>
              <span>{product.quantity_supplied.toLocaleString()}</span>
            </div>
          </div>

          <div className="info-section">
            <h3>Inspection Details</h3>
            <div className="info-item">
              <label>Inspection Date:</label>
              <span>{product.inspection_date}</span>
            </div>
            <div className="info-item">
              <label>Inspected By:</label>
              <span>{product.inspected_by}</span>
            </div>
          </div>
        </div>

        <div className="action-buttons">
          <button onClick={() => navigate('/dashboard')} className="secondary-btn">
            Back to Dashboard
          </button>
          <button onClick={() => navigate('/add-entries', { state: { product } })} className="primary-btn">
            Add New Entries
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductDetails
