const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Product = require('../models/Product');
const auth = require('../middleware/auth');

// Get all products
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status, item_type } = req.query;
    const query = { created_by: req.user.id };

    // Add search filters
    if (search) {
      query.$or = [
        { lot_number: { $regex: search, $options: 'i' } },
        { item_type: { $regex: search, $options: 'i' } },
        { vendor_name: { $regex: search, $options: 'i' } }
      ];
    }

    if (status) {
      query.status = status;
    }

    if (item_type) {
      query.item_type = { $regex: item_type, $options: 'i' };
    }

    const products = await Product.find(query)
      .sort({ created_at: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('created_by', 'name email');

    const total = await Product.countDocuments(query);

    res.json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
});

// Get single product
router.get('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findOne({ 
      _id: req.params.id, 
      created_by: req.user.id 
    }).populate('created_by', 'name email');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Error fetching product', error: error.message });
  }
});

// Create new product
router.post('/', auth, async (req, res) => {
  try {
    const {
      lot_number,
      item_type,
      vendor_name,
      vendor_id,
      date_of_supply,
      warranty_period_months,
      quantity_supplied,
      inspection_date,
      inspected_by,
      status,
      image
    } = req.body;

    // Check if lot number already exists
    const existingProduct = await Product.findOne({ lot_number });
    if (existingProduct) {
      return res.status(400).json({ message: 'Product with this lot number already exists' });
    }

    const product = new Product({
      lot_number,
      item_type,
      vendor_name,
      vendor_id,
      date_of_supply,
      warranty_period_months,
      quantity_supplied,
      inspection_date,
      inspected_by,
      status: status || 'Accepted',
      image,
      created_by: req.user.id
    });

    await product.save();
    res.status(201).json({ message: 'Product created successfully', product });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Error creating product', error: error.message });
  }
});

// Update product
router.put('/:id', auth, async (req, res) => {
  try {
    const {
      lot_number,
      item_type,
      vendor_name,
      vendor_id,
      date_of_supply,
      warranty_period_months,
      quantity_supplied,
      inspection_date,
      inspected_by,
      status,
      image
    } = req.body;

    // Check if lot number already exists (excluding current product)
    if (lot_number) {
      const existingProduct = await Product.findOne({ 
        lot_number, 
        _id: { $ne: req.params.id } 
      });
      if (existingProduct) {
        return res.status(400).json({ message: 'Product with this lot number already exists' });
      }
    }

    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, created_by: req.user.id },
      {
        lot_number,
        item_type,
        vendor_name,
        vendor_id,
        date_of_supply,
        warranty_period_months,
        quantity_supplied,
        inspection_date,
        inspected_by,
        status,
        image,
        updated_at: new Date()
      },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product updated successfully', product });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Error updating product', error: error.message });
  }
});

// Delete product
router.delete('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ 
      _id: req.params.id, 
      created_by: req.user.id 
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
});

// Get product statistics
router.get('/stats/overview', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const stats = await Product.aggregate([
      { $match: { created_by: mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          totalProducts: { $sum: 1 },
          totalQuantity: { $sum: '$quantity_supplied' },
          acceptedProducts: {
            $sum: { $cond: [{ $eq: ['$status', 'Accepted'] }, 1, 0] }
          },
          rejectedProducts: {
            $sum: { $cond: [{ $eq: ['$status', 'Rejected'] }, 1, 0] }
          },
          pendingProducts: {
            $sum: { $cond: [{ $eq: ['$status', 'Pending'] }, 1, 0] }
          }
        }
      }
    ]);

    const itemTypeStats = await Product.aggregate([
      { $match: { created_by: mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: '$item_type',
          count: { $sum: 1 },
          totalQuantity: { $sum: '$quantity_supplied' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({
      overview: stats[0] || {
        totalProducts: 0,
        totalQuantity: 0,
        acceptedProducts: 0,
        rejectedProducts: 0,
        pendingProducts: 0
      },
      itemTypeBreakdown: itemTypeStats
    });
  } catch (error) {
    console.error('Error fetching product stats:', error);
    res.status(500).json({ message: 'Error fetching product statistics', error: error.message });
  }
});

module.exports = router;
