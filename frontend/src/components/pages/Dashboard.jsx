import React, { useState } from 'react'
import './dashboard.css'

const Dashboard = () => {
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'Sleeper',
      image: '/api/placeholder/300/200',
      manufacturer: 'Railway Components Ltd.',
      inspectionDate: '2024-01-15',
      maintenanceLogs: [
        { date: '2024-01-15', action: 'Routine inspection', status: 'Passed' },
        { date: '2023-12-01', action: 'Maintenance check', status: 'Completed' }
      ]
    },
    {
      id: 2,
      name: 'Elastic Rail Clip',
      image: '/api/placeholder/300/200',
      manufacturer: 'Track Solutions Inc.',
      inspectionDate: '2024-01-10',
      maintenanceLogs: [
        { date: '2024-01-10', action: 'Tension adjustment', status: 'Passed' },
        { date: '2023-11-20', action: 'Replacement', status: 'Completed' }
      ]
    },
    {
      id: 3,
      name: 'Rail Track',
      image: '/api/placeholder/300/200',
      manufacturer: 'Steel Rail Corp.',
      inspectionDate: '2024-01-20',
      maintenanceLogs: [
        { date: '2024-01-20', action: 'Track alignment check', status: 'Passed' },
        { date: '2023-12-15', action: 'Surface grinding', status: 'Completed' }
      ]
    },
    {
      id: 4,
      name: 'Rail Clip',
      image: '/api/placeholder/300/200',
      manufacturer: 'Fastening Systems Ltd.',
      inspectionDate: '2024-01-05',
      maintenanceLogs: [
        { date: '2024-01-05', action: 'Clip tension test', status: 'Passed' },
        { date: '2023-11-30', action: 'Lubrication', status: 'Completed' }
      ]
    }
  ])

  const handleProductClick = (product) => {
    setSelectedProduct(product)
  }

  const handleAddProduct = (newProduct) => {
    setProducts([...products, { ...newProduct, id: products.length + 1 }])
    setShowAddProduct(false)
  }

  const closeModal = () => {
    setSelectedProduct(null)
    setShowAddProduct(false)
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Railway UDM Portal</h1>
        <p>Product Management Dashboard</p>
      </div>
      
      <div className="products-grid">
        {products.map(product => (
          <div 
            key={product.id} 
            className="product-card"
            onClick={() => handleProductClick(product)}
          >
            <div className="product-image">
              <img src={product.image} alt={product.name} />
            </div>
            <div className="product-info">
              <h3>{product.name}</h3>
            </div>
          </div>
        ))}
        
        <div 
          className="product-card add-product-card"
          onClick={() => setShowAddProduct(true)}
        >
          <div className="add-product-icon">
            <span>+</span>
          </div>
          <div className="product-info">
            <h3>Add Product</h3>
          </div>
        </div>
      </div>

      {/* Product Details Modal */}
      {selectedProduct && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="close-button" onClick={closeModal}>×</button>
            <div className="modal-header">
              <img src={selectedProduct.image} alt={selectedProduct.name} />
              <h2>{selectedProduct.name}</h2>
            </div>
            <div className="modal-body">
              <div className="product-details">
                <div className="detail-item">
                  <label>Manufacturer:</label>
                  <span>{selectedProduct.manufacturer}</span>
                </div>
                <div className="detail-item">
                  <label>Last Inspection:</label>
                  <span>{selectedProduct.inspectionDate}</span>
                </div>
              </div>
              <div className="maintenance-logs">
                <h3>Maintenance Logs</h3>
                <div className="logs-list">
                  {selectedProduct.maintenanceLogs.map((log, index) => (
                    <div key={index} className="log-item">
                      <div className="log-date">{log.date}</div>
                      <div className="log-action">{log.action}</div>
                      <div className={`log-status ${log.status.toLowerCase()}`}>
                        {log.status}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddProduct && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content add-product-modal" onClick={e => e.stopPropagation()}>
            <button className="close-button" onClick={closeModal}>×</button>
            <h2>Add New Product</h2>
            <AddProductForm onSubmit={handleAddProduct} onCancel={closeModal} />
          </div>
        </div>
      )}
    </div>
  )
}

// Add Product Form Component
const AddProductForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    manufacturer: '',
    inspectionDate: '',
    image: null
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleChange = (e) => {
    const { name, value, files } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'image' ? files[0] : value
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="add-product-form">
      <div className="form-group">
        <label>Product Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="form-group">
        <label>Manufacturer:</label>
        <input
          type="text"
          name="manufacturer"
          value={formData.manufacturer}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="form-group">
        <label>Inspection Date:</label>
        <input
          type="date"
          name="inspectionDate"
          value={formData.inspectionDate}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="form-group">
        <label>Product Image:</label>
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="form-actions">
        <button type="button" onClick={onCancel} className="cancel-btn">
          Cancel
        </button>
        <button type="submit" className="submit-btn">
          Add Product
        </button>
      </div>
    </form>
  )
}

export default Dashboard