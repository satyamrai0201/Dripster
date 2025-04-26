import mongoose from 'mongoose';

const dripSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    category: { type: String },
    size: [{ type: String }], // e.g., ['S', 'M', 'L']
    color: { type: String },
    imageUrl: { type: String },
    inStock: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
  },
  {
    collection: 'dripster',
  }
);

const Drip = mongoose.models.Drip || mongoose.model('Drip', dripSchema);

export default Drip;