const mongoose = require('mongoose');

const entrySchema = new mongoose.Schema({
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: false
  },
  lot_number: {
    type: String,
    required: true,
    trim: true
  },
  item_type: {
    type: String,
    required: true,
    trim: true
  },
  vendor_name: {
    type: String,
    required: true,
    trim: true
  },
  vendor_id: {
    type: String,
    required: true,
    trim: true
  },
  date_of_supply: {
    type: Date,
    required: true
  },
  warranty_period_months: {
    type: Number,
    required: true,
    min: 1
  },
  quantity_supplied: {
    type: Number,
    required: true,
    min: 1
  },
  inspection_date: {
    type: Date,
    required: true
  },
  inspected_by: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    required: true,
    enum: ['Accepted', 'Rejected', 'Pending'],
    default: 'Accepted'
  },
  image: {
    type: String,
    default: null
  },
  entry_type: {
    type: String,
    enum: ['New_Supply', 'Replacement', 'Maintenance', 'Inspection'],
    default: 'New_Supply'
  },
  notes: {
    type: String,
    trim: true,
    maxlength: 500
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Update the updated_at field before saving
entrySchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

// Index for better query performance
entrySchema.index({ product_id: 1 });
entrySchema.index({ lot_number: 1 });
entrySchema.index({ item_type: 1 });
entrySchema.index({ vendor_id: 1 });
entrySchema.index({ status: 1 });
entrySchema.index({ entry_type: 1 });
entrySchema.index({ created_at: -1 });

module.exports = mongoose.model('Entry', entrySchema);
