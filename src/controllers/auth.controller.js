import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';
export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash });
    res.status(201).json({ id: user._id, name: user.name, email: user.email });
  } catch (err) { next(err); }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Credencials incorrectes' });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: 'Credencials incorrectes' });
    const token = jwt.sign({ sub: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES ?? '7d' });
    res.json({ token });
  } catch (err) { next(err); }
}