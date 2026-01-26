import { Product } from '../models/product.model.js';

export async function list(req, res, next) {
  try {
    // 1. Extraer parámetros de query con valores por defecto
    const { q, active, category, minPrice, maxPrice } = req.query;
    
    // Paginación: convertimos a número y aseguramos mínimos
    const page = Math.max(parseInt(req.query.page ?? '1', 10), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit ?? '10', 10), 1), 100);
    const skip = (page - 1) * limit;

    // Ordenación: por defecto creación descendente
    const sort = req.query.sort ?? '-createdAt'; 

    // 2. Construir el filtro (Search + Filters)
    const filter = {};
    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: 'i' } }, 
        { sku: { $regex: q, $options: 'i' } }
      ];
    }
    if (active !== undefined) filter.active = active === 'true';
    if (category) filter.categoryId = category;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // 3. Ejecutar consultas en paralelo
    const [total, data] = await Promise.all([
      Product.countDocuments(filter),
      Product.find(filter)
        .populate('categoryId', 'name')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean()
    ]);

    // 4. Respuesta estructurada
    res.json({
      data,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    next(err);
  }
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

// Nueva función: Exportar a CSV
export async function exportToCsv(req, res, next) {
  try {
    // Obtenemos todos los productos ordenados por nombre
    const products = await Product.find().sort({ name: 1 }).lean();
    
    // Campos a exportar
    const fields = ['_id', 'name', 'sku', 'price', 'stock', 'active', 'createdAt'];
    let csv = fields.join(',') + '\n';

    products.forEach((product) => {
      const row = fields.map(fieldName => {
        let value = product[fieldName] ?? '';
        
        if (value instanceof Date) value = value.toISOString();
        value = String(value);

        // Escapar comillas dobles si el valor contiene comas
        if (value.includes(',') || value.includes('"')) {
          value = `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      });
      csv += row.join(',') + '\n';
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="products.csv"');
    res.status(200).send(csv);

  } catch (err) {
    next(err);
  }
}