import { promises as fs } from 'fs';
import path from 'path';
import { parseFile } from 'music-metadata';
import { fileURLToPath } from 'url';

// Xử lý __dirname trong ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateJsonFiles() {
  // Quét thư mục music
  const musicDir = path.join(__dirname, 'public/music');
  const files = await fs.readdir(musicDir);
  const musicFiles = files.filter((file) => file.endsWith('.mp3'));

  const songPromises = musicFiles.map(async (file) => {
    try {
      const metadata = await parseFile(path.join(musicDir, file));
      return {
        url: `music/${file}`,
        title: metadata.common.title || file.replace('.mp3', ''),
        album: metadata.common.album || 'Unknown Album',
      };
    } catch (error) {
      console.error(`Error reading metadata for ${file}:`, error);
      return {
        url: `music/${file}`,
        title: file.replace('.mp3', ''),
        album: 'Unknown Album',
      };
    }
  });

  const songs = await Promise.all(songPromises);

  // Quét thư mục images1
  const imagesDir = path.join(__dirname, 'public/images');
  const imageFiles = (await fs.readdir(imagesDir))
    .filter((file) => /\.(jpg|jpeg|png|gif)$/i.test(file))
    .map((file) => `images/${file}`);

  // Ghi songs.json
  await fs.writeFile('public/songs.json', JSON.stringify(songs, null, 2));

  // Ghi images.json
  await fs.writeFile('public/images.json', JSON.stringify(imageFiles, null, 2));

  console.log('Generated songs.json and images.json');
}

generateJsonFiles().catch(console.error);