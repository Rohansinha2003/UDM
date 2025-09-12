const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  lot_number: {
    type: String,
    required: true,
    unique: true,
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
productSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

// Index for better query performance
productSchema.index({ lot_number: 1 });
productSchema.index({ item_type: 1 });
productSchema.index({ vendor_id: 1 });
productSchema.index({ status: 1 });
productSchema.index({ created_at: -1 });

module.exports = mongoose.model('Product', productSchema);
