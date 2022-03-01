import fs from 'fs';
import { extract_build_items_from_mobafire } from './services/mobafire';

const items = JSON.parse(fs.readFileSync('src/data/items.json', 'utf8'));
const champions = JSON.parse(fs.readFileSync('src/data/champions.json', 'utf8'));


async function generate_lol_build_file_from_url(url: string, index?: number) {
  const { blocks, author, champion_name } = await extract_build_items_from_mobafire(url);

  for (const block of blocks) {
    for (const block_item of block.items) {
      const found = items.find((item: {key: string, name: string}) => {
        return item.name === block_item.id;
      });

      if (found) {
        block_item.id = found.key;
      }
    }
  }
  
  const champion_id = Number(champions.find((champion: { name: string }) => {
    return champion.name.toLocaleLowerCase() === champion_name.toLocaleLowerCase();
  }).key);

  const lol_build = {
    title: champion_name,
    associatedMaps: [],
    associatedChampions: [champion_id],
    _notes: url,
    _author: author,
    blocks
  };

  const lol_build_file = JSON.stringify(lol_build, null, 2);
  var lol_build_file_path = `src/builds/${champion_name}_${author}.json`;

  if (index) {
    fs.mkdirSync(`src/builds/${champion_name}/Recommended`, { recursive: true });
    lol_build_file_path = `src/builds/${champion_name}/Recommended/RIOT_ItemSet_${index}.json`;
  }
  
  fs.writeFileSync(lol_build_file_path, lol_build_file);

  return {
    author,
    champion_name
  }
}

export { generate_lol_build_file_from_url };