import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const images = [
  // Categories
  {
    name: 'Category: Electrical Materials',
    url: 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?w=800&auto=format&fit=crop&q=80',
    dest: 'public/images/categories/electrical-materials.jpg',
  },
  {
    name: 'Category: Hardware & Fasteners (Bolts/Nuts)',
    url: 'https://images.unsplash.com/photo-1536842409491-b3bbde0e3b66?w=800&auto=format&fit=crop&q=80',
    dest: 'public/images/categories/hardware-fasteners.jpg',
  },
  {
    name: 'Category: Plumbing Materials (PVC Pipes)',
    url: 'https://images.unsplash.com/photo-1548373220-9a83eb96cdd7?w=800&auto=format&fit=crop&q=80',
    dest: 'public/images/categories/plumbing-materials.jpg',
  },
  {
    name: 'Category: Construction Materials (Masonry Mortar)',
    url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&auto=format&fit=crop&q=80',
    dest: 'public/images/categories/construction-materials.jpg',
  },
  {
    name: 'Category: Bathware & Sanitaryware (Bathroom)',
    url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&auto=format&fit=crop&q=80',
    dest: 'public/images/categories/bathware-sanitaryware.jpg',
  },
  {
    name: 'Category: Tools & Accessories',
    url: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=800&auto=format&fit=crop&q=80',
    dest: 'public/images/categories/tools-accessories.jpg',
  },
  {
    name: 'Category: Pumps & Equipment (Water Pump)',
    url: 'https://images.unsplash.com/photo-1583723708348-b61db101dfe3?w=800&auto=format&fit=crop&q=80',
    dest: 'public/images/categories/pumps-equipment.jpg',
  },

  // Products
  {
    name: 'Product: Finolex Cable',
    url: 'https://images.unsplash.com/photo-1607631755187-298a3f9a640a?w=800&auto=format&fit=crop&q=80',
    dest: 'public/images/products/finolex-cable.jpg',
  },
  {
    name: 'Product: Havells MCB',
    url: 'https://images.unsplash.com/photo-1576446470246-499c738d1c8e?w=800&auto=format&fit=crop&q=80',
    dest: 'public/images/products/havells-mcb.jpg',
  },
  {
    name: 'Product: Ashirvad Pipe',
    url: 'https://images.unsplash.com/photo-1724515543157-e2ed5385d1a6?w=800&auto=format&fit=crop&q=80',
    dest: 'public/images/products/ashirvad-pipe.jpg',
  },
  {
    name: 'Product: Supreme Brass Elbow',
    url: 'https://images.unsplash.com/photo-1596394723269-b2cbca4e6313?w=800&auto=format&fit=crop&q=80',
    dest: 'public/images/products/supreme-elbow.jpg',
  },
  {
    name: 'Product: Bosch Grinder',
    url: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&auto=format&fit=crop&q=80',
    dest: 'public/images/products/bosch-grinder.jpg',
  },
  {
    name: 'Product: Stanley Measuring Tape',
    url: 'https://images.unsplash.com/photo-1589153954867-750a783cce22?w=800&auto=format&fit=crop&q=80',
    dest: 'public/images/products/stanley-tape.jpg',
  },
  {
    name: 'Product: Godrej Door Lock',
    url: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=800&auto=format&fit=crop&q=80',
    dest: 'public/images/products/godrej-lock.jpg',
  },
  {
    name: 'Product: SS Hex Head Bolts',
    url: 'https://images.unsplash.com/photo-1536842409491-b3bbde0e3b66?w=800&auto=format&fit=crop&q=80',
    dest: 'public/images/products/ss-bolts.jpg',
  },
  {
    name: 'Product: Crompton Water Pump',
    url: 'https://images.unsplash.com/photo-1583723708348-b61db101dfe3?w=800&auto=format&fit=crop&q=80',
    dest: 'public/images/products/crompton-pump.jpg',
  },
  {
    name: 'Product: Dr Fixit Waterproofing / Masonry',
    url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&auto=format&fit=crop&q=80',
    dest: 'public/images/products/dr-fixit-lw.jpg',
  },
  {
    name: 'Product: Jaquar Wall Mixer Faucet',
    url: 'https://images.unsplash.com/photo-1630699293299-4a9109afa5e9?w=800&auto=format&fit=crop&q=80',
    dest: 'public/images/products/jaquar-mixer.jpg',
  },
  // Fallback
  {
    name: 'Branding: Placeholder',
    url: 'https://images.unsplash.com/photo-1536842409491-b3bbde0e3b66?w=800&auto=format&fit=crop&q=80',
    dest: 'public/images/branding/placeholder.jpg',
  },
];

async function run() {
  console.log('Downloading accurate images...');
  for (const item of images) {
    const fullDest = path.join(rootDir, item.dest);
    fs.mkdirSync(path.dirname(fullDest), { recursive: true });
    try {
      const res = await fetch(item.url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      fs.writeFileSync(fullDest, buf);
      console.log(`[OK] ${item.name} -> ${item.dest} (${buf.length} bytes)`);
    } catch (e) {
      console.error(`[FAIL] ${item.name}: ${e.message}`);
    }
  }
  console.log('Finished updating local images!');
}

run();

