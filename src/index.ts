import fs from 'fs';
import { generate_lol_build_file_from_url } from './build_extractor';
import { get_champion_builds_from_mobafire } from './services/mobafire';

/* Extract all */

const champions = JSON.parse(fs.readFileSync('src/data/champions.json', 'utf8'));

async function extract_all() {
 const urls = await get_champion_builds_from_mobafire(champions);

  for (const url of urls) {
    const { author, champion_name } = await generate_lol_build_file_from_url(
      `https://www.mobafire.com${url.href}`
    );
    console.log(`${champion_name} by ${author}`);
  }
}

extract_all();

/* Extract One */

/*async function extract_one(url: string) {
  await generate_lol_build_file_from_url(url);
}

extract_one('https://www.mobafire.com/league-of-legends/build/12-01-desperate-nasus-challenger-nasus-mid-in-depth-guide-605021');*/