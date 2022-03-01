import { fetch_champions, fetch_items } from './ddragon';
import fs from 'fs';


async function update_champions(language: string, version: string) {
  const champions = await fetch_champions(language, version);
  
  const maped_champions = champions.map(champion => {
    return {
      key: champion.key,
      name: champion.name.replace(/\s/g, '').replace('\'', ''),
    }
  });

  const champions_file = JSON.stringify(maped_champions, null, 2);
  const champions_file_path = 'src/data/champions.json';

  fs.writeFileSync(champions_file_path, champions_file);
}

async function update_items(language: string, version: string) {
  const raw_items = await fetch_items(language, version)
  const items = Array<{
    key: string,
    name: string,
  }>();

  for (const key in raw_items) {
    let item = {
      key: key,
      name: raw_items[key].name,
    };

    items.push(item);
  }

  const items_file = JSON.stringify(items, null, 2);
  const items_file_path = 'src/data/items.json';

  fs.writeFileSync(items_file_path, items_file);
}

async function update_data(version: string) {
  await update_champions('en_US', version);
  await update_items('en_US', version);
}

export { update_data };