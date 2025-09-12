import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './add-product.css'
import gemLogo from '../../assets/gem-new-logo-v6.png'

const AddProduct = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    lot_number: '',
    item_type: '',
    vendor_name: '',
    vendor_id: '',
    date_of_supply: '',
    warranty_period_months: '',
    quantity_supplied: '',
    inspection_date: '',
    inspected_by: '',
    status: 'Accepted',
    image: null
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Here you would typically send the data to your backend
    console.log('Product data:', {
      ...formData,
      quantity_supplied: parseInt(formData.quantity_supplied),
      warranty_period_months: parseInt(formData.warranty_period_months),
      image: formData.image || gemLogo
    })
    
    // Reset form
    setFormData({
      lot_number: '',
      item_type: '',
      vendor_name: '',
      vendor_id: '',
      date_of_supply: '',
      warranty_period_months: '',
      quantity_supplied: '',
      inspection_date: '',
      inspected_by: '',
      status: 'Accepted',
      image: null
    })
    
    setIsSubmitting(false)
    
    // Navigate back to dashboard
    navigate('/dashboard')
  }

  const handleChange = (e) => {
    const { name, value, files } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'image' ? files[0] : value
    }))
  }

  const handleCancel = () => {
    navigate('/dashboard')
  }

  return (
    <div className="add-product-page">
      <div className="page-header">
        <button onClick={handleCancel} className="back-btn">
          ← Back to Dashboard
        </button>
        <h1>Add New Product</h1>
      </div>

      <div className="add-product-container">
        <div className="form-header">
          <h2>Product Information</h2>
          <p>Fill in the details below to add a new product to the system.</p>
        </div>

        <form onSubmit={handleSubmit} className="add-product-form">
          <div className="form-sections">
            <div className="form-section">
              <h3>Basic Information</h3>
              <div className="form-group">
                <label>Lot Number *</label>
                <input
                  type="text"
                  name="lot_number"
                  value={formData.lot_number}
                  onChange={handleChange}
                  placeholder="e.g., UDM-2025-CLIP-001"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Item Type *</label>
                <input
                  type="text"
                  name="item_type"
                  value={formData.item_type}
                  onChange={handleChange}
                  placeholder="e.g., Elastic Rail Clip"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Status *</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                >
                  <option value="Accepted">Accepted</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
            </div>

            <div className="form-section">
              <h3>Vendor Information</h3>
              <div className="form-group">
                <label>Vendor Name *</label>
                <input
                  type="text"
                  name="vendor_name"
                  value={formData.vendor_name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Vendor ID *</label>
                <input
                  type="text"
                  name="vendor_id"
                  value={formData.vendor_id}
                  onChange={handleChange}
                  placeholder="e.g., V12345"
                  required
                />
              </div>
            </div>

            <div className="form-section">
              <h3>Supply Details</h3>
              <div className="form-group">
                <label>Date of Supply *</label>
                <input
                  type="date"
                  name="date_of_supply"
                  value={formData.date_of_supply}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Warranty Period (months) *</label>
                <input
                  type="number"
                  name="warranty_period_months"
                  value={formData.warranty_period_months}
                  onChange={handleChange}
                  min="1"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Quantity Supplied *</label>
                <input
                  type="number"
                  name="quantity_supplied"
                  value={formData.quantity_supplied}
                  onChange={handleChange}
                  min="1"
                  required
                />
              </div>
            </div>

            <div className="form-section">
              <h3>Inspection Details</h3>
              <div className="form-group">
                <label>Inspection Date *</label>
                <input
                  type="date"
                  name="inspection_date"
                  value={formData.inspection_date}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Inspected By *</label>
                <input
                  type="text"
                  name="inspected_by"
                  value={formData.inspected_by}
                  onChange={handleChange}
                  placeholder="e.g., RDSO"
                  required
                />
              </div>
            </div>

            <div className="form-section">
              <h3>Product Image</h3>
              <div className="form-group">
                <label>Product Image</label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleChange}
                />
                <p className="file-help">Upload an image of the product (optional)</p>
              </div>
            </div>
          </div>
          
          <div className="form-actions">
            <button type="button" onClick={handleCancel} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" className="submit-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Adding Product...' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddProduct
