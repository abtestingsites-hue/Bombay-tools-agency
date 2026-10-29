import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const images = [
  // Hero
  {
    url: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=900&auto=format&fit=crop&q=85',
    dest: 'public/images/hero/hero-tools.jpg',
  },
  // Categories
  {
    url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80',
    dest: 'public/images/categories/electrical-materials.jpg',
  },
  {
    url: 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=800&auto=format&fit=crop&q=80',
    dest: 'public/images/categories/hardware-fasteners.jpg',
  },
  {
    url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop&q=80',
    dest: 'public/images/categories/plumbing-materials.jpg',
  },
  {
    url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?w=800&auto=format&fit=crop&q=80',
    dest: 'public/images/categories/construction-materials.jpg',
  },
  {
    url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&auto=format&fit=crop&q=80',
    dest: 'public/images/categories/bathware-sanitaryware.jpg',
  },
  {
    url: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=800&auto=format&fit=crop&q=80',
    dest: 'public/images/categories/tools-accessories.jpg',
  },
  {
    url: 'https://images.unsplash.com/photo-1574757987642-5755f08392c5?w=800&auto=format&fit=crop&q=80',
    dest: 'public/images/categories/pumps-equipment.jpg',
  },
  // Products
  {
    url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80',
    dest: 'public/images/products/finolex-cable.jpg',
  },
  {
    url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
    dest: 'public/images/products/havells-mcb.jpg',
  },
  {
    url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop&q=80',
    dest: 'public/images/products/ashirvad-pipe.jpg',
  },
  {
    url: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=800&auto=format&fit=crop&q=80',
    dest: 'public/images/products/supreme-elbow.jpg',
  },
  {
    url: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&auto=format&fit=crop&q=80',
    dest: 'public/images/products/bosch-grinder.jpg',
  },
  {
    url: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=800&auto=format&fit=crop&q=80',
    dest: 'public/images/products/stanley-tape.jpg',
  },
  {
    url: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=800&auto=format&fit=crop&q=80',
    dest: 'public/images/products/godrej-lock.jpg',
  },
  {
    url: 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=800&auto=format&fit=crop&q=80',
    dest: 'public/images/products/ss-bolts.jpg',
  },
  {
    url: 'https://images.unsplash.com/photo-1574757987642-5755f08392c5?w=800&auto=format&fit=crop&q=80',
    dest: 'public/images/products/crompton-pump.jpg',
  },
  {
    url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?w=800&auto=format&fit=crop&q=80',
    dest: 'public/images/products/dr-fixit-lw.jpg',
  },
  {
    url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&auto=format&fit=crop&q=80',
    dest: 'public/images/products/jaquar-mixer.jpg',
  },
  // Branding / Fallback
  {
    url: 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=800&auto=format&fit=crop&q=80',
    dest: 'public/images/branding/placeholder.jpg',
  },
];

async function downloadImage(item) {
  const fullDest = path.join(rootDir, item.dest);
  fs.mkdirSync(path.dirname(fullDest), { recursive: true });

  try {
    console.log(`Downloading ${item.dest}...`);
    const res = await fetch(item.url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    const buffer = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(fullDest, buffer);
    console.log(`Saved ${item.dest} (${buffer.length} bytes)`);
  } catch (err) {
    console.error(`Failed to download ${item.url}:`, err.message);
  }
}

async function run() {
  for (const item of images) {
    await downloadImage(item);
  }
  console.log('Finished downloading all images!');
}

run();

