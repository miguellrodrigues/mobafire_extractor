import api from "./services/ddragon"
import fs from 'fs';
import cheerio from 'cheerio';
import { Block, Item } from './model/build';

async function fetch_items(language: string) {
  const response = await api.get(`/cdn/12.2.1/data/en_US/${language}.json`);
  const data = response.data;

  // print keys

  const raw_items = data.data;
  const items = Array<Item>();

  for (const key in raw_items) {
    let item = {
      id: key,
      ...raw_items[key]
    };

    items.push(item);
  }

  // write items file

  const items_file = JSON.stringify(items, null, 2);
  const items_file_path = 'src/model/items_enUS.json';

  fs.writeFileSync(items_file_path, items_file);
}

async function extract_build_items_names_from_mobafire(url: string) {
  const { data } = await api.get(url);

  const $ = cheerio.load(data);

  const blocks = Array<Block>();
  const author = $('#scroll-follower-container > div.side-toc > div.side-toc__top > div > span.nickname').text();

  // find all divs with class 'view-guide__items'
  $('.view-guide__items').each((i, el) => {
    const items = Array<Item>();

    const name = $(el).find('.view-guide__items__bar > span').text();
    let content = $(el).find('.view-guide__items__content');

    // find all items in the content
    content.find('a').each((i, el) => {
      let item_name = $(el).find('span').text();
      items.push({
        id: item_name,
        count: 1
      });
    });

    blocks.push({
      type: name,
      items: items
    });
  });


  return {
    blocks,
    author
  };
}

async function generate_lol_build_file_from_url(champion: string, url: string) {
  const lol_build_file_path = `src/builds/${champion}.json`;
  const { blocks, author } = await extract_build_items_names_from_mobafire(url);

  const items_raw = JSON.parse(fs.readFileSync('src/model/items_enUS.json', 'utf8'));

  const items = items_raw.map((item: { id: string; name: string; }) => {
    return {
      id: item.id,
      name: item.name
    }
  });

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

  const champion_id = await api.get(`/cdn/12.2.1/data/en_US/champion.json`);
  const champion_data = champion_id.data.data;
  const _champion_id = Number([champion_data[champion]['key']])

  const lol_build = {
    title: champion,
    associatedMaps: [],
    associatedChampions: [_champion_id],
    _notes: url,
    _author: author,
    blocks
  };

  const lol_build_file = JSON.stringify(lol_build, null, 2);

  fs.writeFileSync(lol_build_file_path, lol_build_file);
}

generate_lol_build_file_from_url('Nasus', 'https://www.mobafire.com/league-of-legends/build/12-2-carnarius-best-nasus-eu-guide-556341');