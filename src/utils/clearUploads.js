import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsPath = path.join(__dirname, '../../uploads');

export async function clearUploads() {
  try {
    const files = await fs.readdir(uploadsPath);
    await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(uploadsPath, file);
        const stat = await fs.stat(filePath);
        if (stat.isFile()) {
          await fs.unlink(filePath);
          console.log(`Deleted: ${file}`);
        }
      })
    );
    console.log('Uploads folder cleared.');
  } catch (err) {
    console.error('Error clearing uploads:', err);
  }
}

export default clearUploads;