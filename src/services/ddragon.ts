import axios from 'axios';
import fs from 'fs';

const url = 'https://ddragon.leagueoflegends.com/';

const ddragon_api = axios.create({
  baseURL: url,
});

async function fetch_champions(language: string, version: string) {
  const champions_file_path = `src/data/champions_${language}.json`;
  const { data } = await ddragon_api.get(`/cdn/${version}/data/${language}/champion.json`);

  const raw_champions = data.data;
  const champions = Array<Champion>();

  for (const name in raw_champions) {
    const champion = raw_champions[name];

    champions.push({
      ...champion
    });
  }

  const champions_file = JSON.stringify(champions, null, 2);

  fs.writeFileSync(champions_file_path, champions_file);

  return champions;
}

async function fetch_items(language: string, version: string) {
  const response = await ddragon_api.get(`/cdn/${version}/data/${language}/item.json`);
  const data = response.data;
  
  const raw_items = data.data;

  const items_file = JSON.stringify(raw_items, null, 2);
  const items_file_path = `src/data/items_${language}.json`;

  fs.writeFileSync(items_file_path, items_file);

  return raw_items;
}

export { fetch_champions, fetch_items };