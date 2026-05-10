const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: [
      'user:registered',
      'user:login',
      'product:created',
      'product:viewed',
      'product:updated',
      'product:deleted',
      'cart:item_added',
      'cart:item_removed',
      'order:created',
      'order:status_changed',
      'category:selected'
    ]
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  metadata: {
    ip: String,
    userAgent: String,
    source: {
      type: String,
      enum: ['web', 'pwa', 'mobile'],
      default: 'web'
    }
  }
}, {
  timestamps: true
});

eventSchema.index({ type: 1, createdAt: -1 });
eventSchema.index({ userId: 1, createdAt: -1 });
eventSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Event', eventSchema);
