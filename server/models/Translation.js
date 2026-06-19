import mongoose from 'mongoose';

const translationSchema = new mongoose.Schema({
  originalText: {
    type: String,
    required: true,
    index: true,
  },
  vietnameseText: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['move', 'ability', 'type', 'status', 'flavor', 'general'],
    index: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Compound index for fast lookups
translationSchema.index({ originalText: 1, category: 1 }, { unique: true });

const Translation = mongoose.model('Translation', translationSchema);

export default Translation;
