/**
 * @openapi
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         id: { type: string }
 *         name: { type: string, minLength: 2 }
 *         sku: { type: string, pattern: '^[A-Z0-9-]+$' }
 *         price: { type: number, minimum: 0 }
 *         stock: { type: integer, minimum: 0 }
 *         active: { type: boolean }
 *       required: [id, name, price, stock]
 *     ProductCreate:
 *       type: object
 *       properties:
 *         name: { type: string, minLength: 2 }
 *         sku: { type: string, pattern: '^[A-Z0-9-]+$' }
 *         price: { type: number, minimum: 0 }
 *         stock: { type: integer, minimum: 0 }
 *         active: { type: boolean }
 *       required: [name, price, stock]
 *     ProductUpdate:
 *       type: object
 *       properties:
 *         name: { type: string, minLength: 2 }
 *         sku: { type: string, pattern: '^[A-Z0-9-]+$' }
 *         price: { type: number, minimum: 0 }
 *         stock: { type: integer, minimum: 0 }
 *         active: { type: boolean }
 *     Error:
 *       type: object
 *       properties:
 *         error: { type: string }
 *         errors:
 *           type: array
 *           items: { type: object }
 */
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    trim: true, 
    minlength: 3 // CAMBIO: Mínimo 3 caracteres
  },
  sku: { 
    type: String, 
    unique: true, 
    sparse: true, 
    trim: true, 
    match: /^[A-Z0-9-]+$/ // Solo mayúsculas, números y guiones
  },
  price: { type: Number, required: true, min: 0 },
  stock: { type: Number, required: true, min: 0 },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  active: { type: Boolean, default: true }
}, { timestamps: true });

export const Product = mongoose.model('Product', productSchema);