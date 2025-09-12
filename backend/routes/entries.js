const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Entry = require('../models/Entry');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

// Get all entries
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status, entry_type, product_id } = req.query;
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

    if (entry_type) {
      query.entry_type = entry_type;
    }

    if (product_id) {
      query.product_id = product_id;
    }

    const entries = await Entry.find(query)
      .populate('product_id', 'lot_number item_type')
      .populate('created_by', 'name email')
      .sort({ created_at: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Entry.countDocuments(query);

    res.json({
      entries,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error fetching entries:', error);
    res.status(500).json({ message: 'Error fetching entries', error: error.message });
  }
});

// Get entries for a specific product
router.get('/product/:productId', auth, async (req, res) => {
  try {
    const { productId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    // Verify product belongs to user
    const product = await Product.findOne({ 
      _id: productId, 
      created_by: req.user.id 
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const entries = await Entry.find({ 
      product_id: productId,
      created_by: req.user.id 
    })
      .populate('created_by', 'name email')
      .sort({ created_at: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Entry.countDocuments({ 
      product_id: productId,
      created_by: req.user.id 
    });

    res.json({
      entries,
      product,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error fetching product entries:', error);
    res.status(500).json({ message: 'Error fetching product entries', error: error.message });
  }
});

// Get single entry
router.get('/:id', auth, async (req, res) => {
  try {
    const entry = await Entry.findOne({ 
      _id: req.params.id, 
      created_by: req.user.id 
    })
      .populate('product_id', 'lot_number item_type')
      .populate('created_by', 'name email');

    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }

    res.json(entry);
  } catch (error) {
    console.error('Error fetching entry:', error);
    res.status(500).json({ message: 'Error fetching entry', error: error.message });
  }
});

// Create new entry
router.post('/', auth, async (req, res) => {
  try {
    const {
      product_id,
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
      entry_type,
      notes
    } = req.body;

    // If product_id is provided, verify it exists and belongs to user
    if (product_id) {
      const product = await Product.findOne({ 
        _id: product_id, 
        created_by: req.user.id 
      });
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
    }

    const entry = new Entry({
      product_id,
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
      entry_type: entry_type || 'New_Supply',
      notes,
      created_by: req.user.id
    });

    await entry.save();
    
    // Populate the entry before sending response
    await entry.populate('product_id', 'lot_number item_type');
    await entry.populate('created_by', 'name email');

    res.status(201).json({ message: 'Entry created successfully', entry });
  } catch (error) {
    console.error('Error creating entry:', error);
    res.status(500).json({ message: 'Error creating entry', error: error.message });
  }
});

// Update entry
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
      image,
      entry_type,
      notes
    } = req.body;

    const entry = await Entry.findOneAndUpdate(
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
        entry_type,
        notes,
        updated_at: new Date()
      },
      { new: true, runValidators: true }
    )
      .populate('product_id', 'lot_number item_type')
      .populate('created_by', 'name email');

    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }

    res.json({ message: 'Entry updated successfully', entry });
  } catch (error) {
    console.error('Error updating entry:', error);
    res.status(500).json({ message: 'Error updating entry', error: error.message });
  }
});

// Delete entry
router.delete('/:id', auth, async (req, res) => {
  try {
    const entry = await Entry.findOneAndDelete({ 
      _id: req.params.id, 
      created_by: req.user.id 
    });

    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }

    res.json({ message: 'Entry deleted successfully' });
  } catch (error) {
    console.error('Error deleting entry:', error);
    res.status(500).json({ message: 'Error deleting entry', error: error.message });
  }
});

// Get entry statistics
router.get('/stats/overview', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const stats = await Entry.aggregate([
      { $match: { created_by: mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          totalEntries: { $sum: 1 },
          totalQuantity: { $sum: '$quantity_supplied' },
          acceptedEntries: {
            $sum: { $cond: [{ $eq: ['$status', 'Accepted'] }, 1, 0] }
          },
          rejectedEntries: {
            $sum: { $cond: [{ $eq: ['$status', 'Rejected'] }, 1, 0] }
          },
          pendingEntries: {
            $sum: { $cond: [{ $eq: ['$status', 'Pending'] }, 1, 0] }
          }
        }
      }
    ]);

    const entryTypeStats = await Entry.aggregate([
      { $match: { created_by: mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: '$entry_type',
          count: { $sum: 1 },
          totalQuantity: { $sum: '$quantity_supplied' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    const monthlyStats = await Entry.aggregate([
      { $match: { created_by: mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: {
            year: { $year: '$created_at' },
            month: { $month: '$created_at' }
          },
          count: { $sum: 1 },
          totalQuantity: { $sum: '$quantity_supplied' }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 }
    ]);

    res.json({
      overview: stats[0] || {
        totalEntries: 0,
        totalQuantity: 0,
        acceptedEntries: 0,
        rejectedEntries: 0,
        pendingEntries: 0
      },
      entryTypeBreakdown: entryTypeStats,
      monthlyStats
    });
  } catch (error) {
    console.error('Error fetching entry stats:', error);
    res.status(500).json({ message: 'Error fetching entry statistics', error: error.message });
  }
});

module.exports = router;
