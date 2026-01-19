import mongoose from 'mongoose';
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, unique: true }
}, { timestamps: false });
export const Category = mongoose.model('Category', categorySchema);