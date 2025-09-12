import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import './add-entries.css'
import gemLogo from '../../assets/gem-new-logo-v6.png'
import apiService from '../../services/api'

const AddEntries = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const selectedProduct = location.state?.product
  
  const [formData, setFormData] = useState({
    lot_number: selectedProduct?.lot_number || '',
    item_type: selectedProduct?.item_type || '',
    vendor_name: selectedProduct?.vendor_name || '',
    vendor_id: selectedProduct?.vendor_id || '',
    date_of_supply: '',
    warranty_period_months: selectedProduct?.warranty_period_months || '',
    quantity_supplied: '',
    inspection_date: '',
    inspected_by: selectedProduct?.inspected_by || '',
    status: 'Accepted',
    image: selectedProduct?.image || gemLogo
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    
    try {
      // Check if user is authenticated
      const token = localStorage.getItem('token')
      console.log('Current token:', token)
      
      if (!token) {
        // For testing purposes, let's try to login automatically
        console.log('No token found, attempting to login with test credentials...')
        try {
          const loginResponse = await apiService.login('testuser', 'password123')
          console.log('Auto-login successful:', loginResponse)
          // Token should now be in localStorage
        } catch (loginErr) {
          console.error('Auto-login failed:', loginErr)
          setError('Please log in to add entries. Auto-login failed.')
          setTimeout(() => {
            navigate('/')
          }, 2000)
          return
        }
      }

      // Prepare the entry data
      const entryData = {
        lot_number: formData.lot_number,
        item_type: formData.item_type,
        vendor_name: formData.vendor_name,
        vendor_id: formData.vendor_id,
        date_of_supply: formData.date_of_supply,
        warranty_period_months: parseInt(formData.warranty_period_months),
        quantity_supplied: parseInt(formData.quantity_supplied),
        inspection_date: formData.inspection_date,
        inspected_by: formData.inspected_by,
        status: formData.status,
        image: formData.image || gemLogo,
        entry_type: 'New_Supply',
        product_id: selectedProduct?._id || null
      }

      console.log('Sending entry data:', entryData)

      // Save to database
      const response = await apiService.createEntry(entryData)
      
      console.log('Entry created successfully:', response)
      
      // Show success message (you could add a toast notification here)
      alert('Entry added successfully!')
      
      // Navigate back to dashboard or product details
      if (selectedProduct) {
        navigate('/product-details', { state: { product: selectedProduct } })
      } else {
        navigate('/dashboard')
      }
      
    } catch (err) {
      console.error('Error creating entry:', err)
      console.error('Error details:', {
        message: err.message,
        stack: err.stack,
        name: err.name
      })
      
      // Handle specific error cases
      if (err.message.includes('Authentication required')) {
        setError('Please log in to add entries.')
        // Redirect to login after a short delay
        setTimeout(() => {
          navigate('/')
        }, 2000)
      } else if (err.message.includes('Unable to connect to server')) {
        setError('Cannot connect to server. Please check if the backend is running.')
      } else {
        setError(err.message || 'Failed to create entry. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, files } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'image' ? files[0] : value
    }))
  }

  const handleCancel = () => {
    if (selectedProduct) {
      navigate('/product-details', { state: { product: selectedProduct } })
    } else {
      navigate('/dashboard')
    }
  }

  const testApiConnection = async () => {
    try {
      console.log('Testing API connection...')
      const response = await apiService.healthCheck()
      console.log('API health check:', response)
      alert('API connection successful!')
    } catch (err) {
      console.error('API test failed:', err)
      alert('API connection failed: ' + err.message)
    }
  }

  return (
    <div className="add-entries-page">
      <div className="page-header">
        <button onClick={handleCancel} className="back-btn">
          ← Back {selectedProduct ? 'to Product' : 'to Dashboard'}
        </button>
        <h1>Add New Entries</h1>
      </div>

      <div className="add-entries-container">
        <div className="form-header">
          <h2>Entry Information</h2>
          <p>
            {selectedProduct 
              ? `Add new entries for ${selectedProduct.item_type} (${selectedProduct.lot_number})`
              : 'Fill in the details below to add new entries to an existing product.'
            }
          </p>
        </div>

        <form onSubmit={handleSubmit} className="add-entries-form">
          {error && (
            <div className="error-message">
              <p>{error}</p>
            </div>
          )}
          <div className="form-sections">
            <div className="form-section">
              <h3>Product Information</h3>
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
            <button type="button" onClick={testApiConnection} className="test-btn">
              Test API
            </button>
            <button type="button" onClick={handleCancel} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" className="submit-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Adding Entry...' : 'Add Entry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddEntries
