import mongoose from 'mongoose';

// Define the schema for order items
const orderItemSchema = new mongoose.Schema({
  item: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true,
    min: 0
  }
}, { _id: false });

// Define the main FoodOrder schema
const foodOrderSchema = new mongoose.Schema({
  roomNumber: {
    type: String,
    required: true
  },
  items: {
    type: [orderItemSchema],
    required: true,
    validate: {
      validator: function(items: any[]) {
        return items.length > 0;
      },
      message: 'At least one item is required'
    }
  },
  deliveryTime: {
    type: String,
    required: true
  },
  specialInstructions: {
    type: String,
    default: ''
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'preparing', 'delivered', 'cancelled'],
    default: 'pending'
  },
  type: {
    type: String,
    enum: ['room-service', 'amenity'],
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
foodOrderSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Create the model if it doesn't exist, otherwise use the existing one
export const FoodOrder = mongoose.models.FoodOrder || mongoose.model('FoodOrder', foodOrderSchema); 