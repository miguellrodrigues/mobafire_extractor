import axios from 'axios';
import fs from 'fs';

const url = 'https://ddragon.leagueoflegends.com/';

const ddragon_api = axios.create({
  baseURL: url,
});


async function fetch_champions() {
  const champions_file_path = 'src/model/champions_enUS.json';
  const { data } = await ddragon_api.get(`/cdn/12.2.1/data/en_US/champion.json`);

  const champions = data.data;

  const champions_file = JSON.stringify(champions, null, 2);

  fs.writeFileSync(champions_file_path, champions_file);
}

async function fetch_items(language: string) {
  const response = await ddragon_api.get(`/cdn/12.2.1/data/en_US/${language}.json`);
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

export { fetch_champions, fetch_items };