import { body, param } from 'express-validator';
export const productCreateRules = [
  body('name').isString().isLength({ min: 2 }),
  body('price').isFloat({ min: 0 }),
  body('stock').isInt({ min: 0 }),
  body('sku').optional().matches(/^[A-Z0-9-]+$/)
];
export const productUpdateRules = [
  param('id').isMongoId(),
  body('name').optional().isString().isLength({ min: 2 }),
  body('price').optional().isFloat({ min: 0 }),
  body('stock').optional().isInt({ min: 0 }),
  body('sku').optional().matches(/^[A-Z0-9-]+$/),
  body('active').optional().isBoolean()
];