import { Product } from '../models/product.model.js';

export async function list(req, res, next) {
  try {
    const { q, active, minPrice, maxPrice, category } = req.query;
    const filter = {};
    if (q) filter.$or = [{ name: { $regex: q, $options: 'i' } }, { sku: { $regex: q, $options: 'i' } }];
    if (active !== undefined) filter.active = active === 'true';
    if (minPrice) filter.price = { ...filter.price, $gte: Number(minPrice) };
    if (maxPrice) filter.price = { ...filter.price, $lte: Number(maxPrice) };
    if (category) filter.categoryId = category; // id de categoria
    const data = await Product.find(filter)
      .populate('categoryId', 'name')
      .sort({ createdAt: -1 })
      .lean();
    res.json(data);
  } catch (err) { next(err); }
}

export async function getById(req, res, next) {
  try {
    const product = await Product.findById(req.params.id)
      .populate('categoryId', 'name')
      .lean();
    if (!product) return res.status(404).json({ error: 'No trobat' });
    res.json(product);
  } catch (err) { next(err); }
}

export async function create(req, res, next) {
  try {
    const created = await Product.create(req.body);
    res.status(201).json(created);
  } catch (err) {
    if (err?.code === 11000) return res.status(409).json({ error: 'SKU duplicat' });
    if (err?.name === 'ValidationError') return res.status(422).json({ error: err.message });
    next(err);
  }
}

export async function update(req, res, next) {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).lean();
    if (!updated) return res.status(404).json({ error: 'No trobat' });
    res.json(updated);
  } catch (err) {
    if (err?.code === 11000) return res.status(409).json({ error: 'SKU duplicat' });
    if (err?.name === 'ValidationError') return res.status(422).json({ error: err.message });
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    const out = await Product.findByIdAndDelete(req.params.id).lean();
    if (!out) return res.status(404).json({ error: 'No trobat' });
    res.status(204).send();
  } catch (err) { next(err); }
}