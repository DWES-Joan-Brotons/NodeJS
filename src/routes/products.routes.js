import { Router } from 'express';
import { validationResult } from 'express-validator';
import * as controller from '../controllers/products.controller.js';
import { productCreateRules, productUpdateRules } from '../validation/products.rules.js';

const router = Router();
const validate = (rules) => [
  ...rules,
  (req, res, next) => {
    const result = validationResult(req);
    if (!result.isEmpty()) return res.status(422).json({ errors: result.array() });
    next();
  }
];

router.get('/', controller.list);
router.get('/:id', controller.getById);
router.post('/', validate(productCreateRules), controller.create);
router.put('/:id', validate(productUpdateRules), controller.update);
router.delete('/:id', controller.remove);
export default router;