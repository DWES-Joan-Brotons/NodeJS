import { body, param } from 'express-validator';

export const productCreateRules = [
  body('name')
    .isString()
    .trim()
    .isLength({ min: 3 })
    .withMessage('El nom ha de tindre almenys 3 caràcters'),
  
  body('price')
    .isFloat({ min: 0 })
    .withMessage('El preu ha de ser un número positiu'),
  
  body('stock')
    .isInt({ min: 0 })
    .withMessage('L\'estoc ha de ser un enter positiu'),
  
  body('sku')
    .optional()
    .matches(/^[A-Z0-9-]+$/)
    .withMessage('L\'SKU només pot contindre lletres majúscules, números i guions')
];

export const productUpdateRules = [
  param('id').isMongoId().withMessage('ID de producte invàlid'),
  
  body('name')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 3 })
    .withMessage('El nom ha de tindre almenys 3 caràcters'),
  
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('El preu ha de ser un número positiu'),
  
  body('stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('L\'estoc ha de ser un enter positiu'),
  
  body('sku')
    .optional()
    .matches(/^[A-Z0-9-]+$/)
    .withMessage('L\'SKU només pot contindre lletres majúscules, números i guions'),
  
  body('active').optional().isBoolean()
];