import fs from 'fs';
import { generate_lol_build_file_from_url } from './build_extractor';
import { update_data } from './services/data_parser';
import { get_champion_builds_from_mobafire } from './services/mobafire';

// update_data('12.4.1');

/* Extract all */

const champions = JSON.parse(fs.readFileSync('src/data/champions.json', 'utf8'));

async function extract_all() {
  await get_champion_builds_from_mobafire(champions);
}

extract_all();

/* Extract One */

// async function extract_one(url: string) {
//   await generate_lol_build_file_from_url(url);
// }

// extract_one('https://www.mobafire.com/league-of-legends/build/season-12-ap-ad-kennen-all-roles-575084');
