import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './dashboard.css'
import gemLogo from '../../assets/gem-new-logo-v6.png'
import reactLogo from '../../assets/react.svg'
import apiService from '../../services/api'

const Dashboard = () => {
  const navigate = useNavigate()
  const [products, setProducts] = useState([
    {
      _id: "sample-1",
      lot_number: "UDM-2025-SLEEPER-001",
      item_type: "Sleeper",
      vendor_name: "Railway Components Ltd.",
      vendor_id: "V12346",
      date_of_supply: "2025-01-15",
      warranty_period_months: 36,
      quantity_supplied: 1000,
      inspection_date: "2025-01-10",
      inspected_by: "RDSO",
      status: "Accepted",
      image: gemLogo
    },
    {
      _id: "sample-2",
      lot_number: "UDM-2025-CLIP-001",
      item_type: "Elastic Rail Clip",
      vendor_name: "ABC Steel Pvt Ltd",
      vendor_id: "V12345",
      date_of_supply: "2025-01-15",
      warranty_period_months: 24,
      quantity_supplied: 50000,
      inspection_date: "2025-01-10",
      inspected_by: "RDSO",
      status: "Accepted",
      image: reactLogo
    },
    {
      _id: "sample-3",
      lot_number: "UDM-2025-TRACK-001",
      item_type: "Rail Track",
      vendor_name: "Steel Rail Corp.",
      vendor_id: "V12347",
      date_of_supply: "2025-01-20",
      warranty_period_months: 60,
      quantity_supplied: 5000,
      inspection_date: "2025-01-18",
      inspected_by: "RDSO",
      status: "Accepted",
      image: gemLogo
    },
    {
      _id: "sample-4",
      lot_number: "UDM-2025-CLIP-002",
      item_type: "Rail Clip",
      vendor_name: "Fastening Systems Ltd.",
      vendor_id: "V12348",
      date_of_supply: "2025-01-05",
      warranty_period_months: 18,
      quantity_supplied: 25000,
      inspection_date: "2025-01-03",
      inspected_by: "RDSO",
      status: "Accepted",
      image: reactLogo
    }
  ])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Optional: Fetch additional products from API (keeping the original 4 as default)
  useEffect(() => {
    const fetchAdditionalProducts = async () => {
      try {
        const response = await apiService.getProducts()
        if (response.products && response.products.length > 0) {
          // Add API products to the existing sample products
          setProducts(prevProducts => [...prevProducts, ...response.products])
        }
      } catch (err) {
        console.log('API not available, using sample data only')
        // Silently fail and keep using sample data
      }
    }

    fetchAdditionalProducts()
  }, [])

  const handleProductClick = (product) => {
    navigate('/product-details', { state: { product } })
  }

  const handleAddEntries = () => {
    navigate('/add-entries')
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Railway UDM Portal</h1>
        <p>Product Management Dashboard</p>
        {error && <div className="error-message">{error}</div>}
      </div>
      
      <div className="products-grid">
        {products.map(product => (
          <div 
            key={product._id || product.lot_number} 
            className="product-card"
            onClick={() => handleProductClick(product)}
          >
            <div className="product-image">
              <img src={product.image} alt={product.item_type} />
            </div>
            <div className="product-info">
              <h3>{product.item_type}</h3>
              <p className="lot-number">{product.lot_number}</p>
            </div>
          </div>
        ))}
        
        <div 
          className="product-card add-product-card"
          onClick={handleAddEntries}
        >
          <div className="add-product-icon">
            <span>+</span>
          </div>
          <div className="product-info">
            <h3>Add Entries</h3>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard