import { Router } from 'express';
import { validationResult } from 'express-validator';
import * as controller from '../controllers/suppliers.controller.js';

/**
 * @openapi
 * tags:
 *   - name: Suppliers
 *     description: Operacions sobre proveïdors
 *
 * /api/v1/suppliers:
 *   get:
 *     summary: Llistar proveïdors
 *     tags: [Suppliers]
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Supplier' }
 *             examples:
 *               example1:
 *                 value:
 *                   - id: "640f2b1c2a1d4c5678e12345"
 *                     name: "Proveïdor A"
 *                     email: "proveidor@example.com"
 *                     phone: "123456789"
 *
 *   post:
 *     summary: Crear proveïdor
 *     tags: [Suppliers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/SupplierCreate' }
 *           examples:
 *             ok:
 *               value:
 *                 name: "Proveïdor B"
 *                 email: "b@example.com"
 *                 phone: "987654321"
 *     responses:
 *       201: { description: Creat }
 *       422:
 *         description: Validació incorrecta
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *
 * /api/v1/suppliers/{id}:
 *   get:
 *     summary: Obtindre proveïdor per ID
 *     tags: [Suppliers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Supplier' }
 *       404: { description: No trobat }
 *
 *   put:
 *     summary: Actualitzar proveïdor
 *     tags: [Suppliers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/SupplierUpdate' }
 *     responses:
 *       200: { description: OK }
 *       404: { description: No trobat }
 *       422:
 *         description: Validació incorrecta
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *
 *   delete:
 *     summary: Esborrar proveïdor
 *     tags: [Suppliers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204: { description: Esborrat }
 *       404: { description: No trobat }
 *
 * components:
 *   schemas:
 *     Supplier:
 *       type: object
 *       properties:
 *         id: { type: string }
 *         name: { type: string, minLength: 2 }
 *         email: { type: string, format: email }
 *         phone: { type: string }
 *       required: [id, name]
 *     SupplierCreate:
 *       type: object
 *       properties:
 *         name: { type: string, minLength: 2 }
 *         email: { type: string, format: email }
 *         phone: { type: string }
 *       required: [name]
 *     SupplierUpdate:
 *       type: object
 *       properties:
 *         name: { type: string, minLength: 2 }
 *         email: { type: string, format: email }
 *         phone: { type: string }
 *     Error:
 *       type: object
 *       properties:
 *         error: { type: string }
 *         errors:
 *           type: array
 *           items: { type: object }
 */

const router = Router();
const validate = (rules) => [
  ...rules,
  (req, res, next) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(422).json({
        message: 'Error de validación',
        errors: result.array({ onlyFirstError: true })
      });
    }
    next();
  }
];

router.get('/', controller.list);
router.get('/:id', controller.getById);
router.post('/', validate([]), controller.create);
router.put('/:id', validate([]), controller.update);
router.delete('/:id', controller.remove);

export default router;