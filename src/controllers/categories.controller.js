import { Category } from '../models/category.model.js';
export async function list(req, res, next) {
  try { res.json(await Category.find().sort({ name: 1 }).lean()); }
  catch (err) { next(err); }
}
export async function create(req, res, next) {
  try { res.status(201).json(await Category.create(req.body)); }
  catch (err) { next(err); }
}