/*import { generate_lol_build_file_from_url } from "./build_extractor";

const urls = [
  'https://www.mobafire.com/league-of-legends/build/my-monstrous-mordekaiser-immortal-amp-full-magic-pen-build-565380',
  'https://www.mobafire.com/league-of-legends/build/12-1-reworked-fiddlesticks-jungle-the-detailled-guide-569186',
  'https://www.mobafire.com/league-of-legends/build/12-2-ph45s-in-depth-guide-to-jax-the-grandmaster-503356',
  'https://www.mobafire.com/league-of-legends/build/12-2-carnarius-best-nasus-eu-guide-556341',
  'https://www.mobafire.com/league-of-legends/build/lathyrus-11-22-euw-challenger-guide-not-updated-guide-mo-544216',
  'https://www.mobafire.com/league-of-legends/build/season-12-updated-ad-thresh-top-by-cryobeats-564624',
  'https://www.mobafire.com/league-of-legends/build/giving-amu-deathmu-tank-ap-w-matchups-531668'

]

// extract data

for (const url of urls) {
  generate_lol_build_file_from_url(url);
}*/

import fs from 'fs';
import { get_champion_builds_from_mobafire } from './services/mobafire';
import { generate_lol_build_file_from_url } from "./build_extractor";

const champions = JSON.parse(fs.readFileSync('src/data/champions.json', 'utf8'));

async function extract_all() {
 await get_champion_builds_from_mobafire(champions);
}

extract_all();


