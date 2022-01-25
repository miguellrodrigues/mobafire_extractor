import fs from 'fs';
import { extract_build_items_from_mobafire } from './services/mobafire';

const items = JSON.parse(fs.readFileSync('src/data/items.json', 'utf8'));
const champions = JSON.parse(fs.readFileSync('src/data/champions.json', 'utf8'));


async function extract_champions_name_and_id(champions_raw: any) {
  const champions_names = Object.keys(champions_raw);
  const champions = champions_names.map((name) => {
      return {
        id: champions_raw[name].key,
        name: name
      }
  });

  const champions_file = JSON.stringify(champions, null, 2);

  fs.writeFileSync('./src/data/champions.json', champions_file);
}

async function extract_items_name_and_id(items_raw: any) {
  const items = items_raw.map((item: { id: string; name: string; }) => {
    return {
      id: item.id,
      name: item.name
    }
  });

  const items_file = JSON.stringify(items, null, 2);

  fs.writeFileSync('./src/data/items.json', items_file);
}


async function generate_lol_build_file_from_url(url: string) {
  const { blocks, author, champion_name } = await extract_build_items_from_mobafire(url);

  for (const block of blocks) {
    for (const item of block.items) {
      const found = items.find((item_raw: { id: string; name: string }) => {
        return item_raw.name === item.id;
      });

      if (found) {
        item.id = found.id;
      }
    }
  }

  const champion_id = Number(
    champions.find((champion: { name: string; id: string; }) => {
      return champion.name.toLowerCase() === champion_name.toLocaleLowerCase();
    }).id
  );

  const lol_build = {
    title: champion_name,
    associatedMaps: [],
    associatedChampions: [champion_id],
    _notes: url,
    _author: author,
    blocks
  };

  const lol_build_file_path = `src/builds/${champion_name}_${author}.json`;
  const lol_build_file = JSON.stringify(lol_build, null, 2);

  fs.writeFileSync(lol_build_file_path, lol_build_file);
}

export { generate_lol_build_file_from_url, extract_champions_name_and_id, extract_items_name_and_id };