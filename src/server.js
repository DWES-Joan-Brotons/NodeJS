import 'dotenv/config';
import app from './app.js';
import { connectDB } from './lib/db.js';

const PORT = process.env.PORT ?? 3000;
const URI = process.env.MONGO_URI;

(async () => {
  await connectDB(URI);
  app.listen(PORT, () => {
    console.log(`API a http://localhost:${PORT}`);
  });
})();