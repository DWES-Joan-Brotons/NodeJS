import { Router } from 'express';
import { validationResult } from 'express-validator';
import * as controller from '../controllers/products.controller.js';
import { productCreateRules, productUpdateRules } from '../validation/products.rules.js';


/**
 * @openapi
 * tags:
 *   - name: Products
 *     description: Operacions sobre productes
 *
 * /api/v1/products:
 *   get:
 *     summary: Llistar productes
 *     tags: [Products]
 *     security: [{ "bearerAuth": [] }]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, minimum: 1, default: 1 }
 *         description: Pàgina actual
 *       - in: query
 *         name: limit
 *         schema: { type: integer, minimum: 1, maximum: 100, default: 10 }
 *         description: Elements per pàgina
 *       - in: query
 *         name: q
 *         schema: { type: string }
 *         description: Cerca per nom o sku
 *       - in: query
 *         name: active
 *         schema: { type: boolean }
 *         description: Filtra actius/inactius
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/Product' }
 *                 page: { type: integer }
 *                 limit: { type: integer }
 *                 total: { type: integer }
 *                 pages: { type: integer }
 *
 *   post:
 *     summary: Crear producte
 *     tags: [Products]
 *     security: [{ "bearerAuth": [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/ProductCreate' }
 *           examples:
 *             ok: { value: { name: "Tassa", sku: "TAS-001", price: 4.5, stock: 20 } }
 *             invalid: { value: { name: "", price: -1 } }
 *     responses:
 *       201: { description: Creat }
 *       409: { description: SKU duplicat }
 *       422:
 *         description: Validació incorrecta
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *
 * /api/v1/products/{id}:
 *   get:
 *     summary: Obtindre producte per ID
 *     tags: [Products]
 *     security: [{ "bearerAuth": [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: OK }
 *       404: { description: No trobat }
 *
 *   put:
 *     summary: Actualitzar producte
 *     tags: [Products]
 *     security: [{ "bearerAuth": [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/ProductUpdate' }
 *     responses:
 *       200: { description: OK }
 *       404: { description: No trobat }
 *       409: { description: SKU duplicat }
 *       422:
 *         description: Validació incorrecta
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *
 *   delete:
 *     summary: Esborrar producte
 *     tags: [Products]
 *     security: [{ "bearerAuth": [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204: { description: Esborrat }
 *       404: { description: No trobat }
 */
const router = Router();

const validate = (rules) => [
  ...rules,
  (req, res, next) => {
    const result = validationResult(req);
    if (!result.isEmpty()) return res.status(422).json({ errors: result.array() });
    next();
  }
];

// Rutas generales
router.get('/', controller.list);
router.post('/', validate(productCreateRules), controller.create);

// RUTA ESPECÍFICA (debe ir antes de /:id)
router.get('/export.csv', controller.exportToCsv);

// Rutas con parámetro dinámico
router.get('/:id', controller.getById);
router.put('/:id', validate(productUpdateRules), controller.update);
router.delete('/:id', controller.remove);

export default router;