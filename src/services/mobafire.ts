import axios from 'axios';
import cheerio from 'cheerio';
import { Block, Item } from '../model/build';

async function extract_build_items_from_mobafire(url: string) {
  const { data } = await axios(url);

  const $ = cheerio.load(data);

  const blocks = Array<Block>();
  const author = $('#scroll-follower-container > div.side-toc > div.side-toc__top > div > span.nickname').text();
  const build = $('#content > div > div.mf-responsive__wrap.mf-redesign.view-guide > div.mf-responsive__topCol > div > div.view-guide__header__top > h1')
  .text().split(' ');
 
  const champion_name = build[0]
                        .replace('\n', '')
                        .replace('\nBuild', '')
                        .replace('\'', '');

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
    author,
    champion_name
  };
}

async function get_champion_builds_from_mobafire(champions: Array<{name: string, id: string}>) {
  const url = 'https://www.mobafire.com/league-of-legends/champion/'
  
  const builds_urls = Array<{
    href: string,
    rating: number,
  }>();

  for (const champion of champions) {
    const champion_url = url + champion.name.toLocaleLowerCase();

    try{
      const { data } = await axios(champion_url);
      const $ = cheerio.load(data);
      
      const urls = Array<{href: string, rating: number}>();

      $('.mf-listings__item').each((i, el) => {
        const rating = $(el).find('.mf-listings__item__rating__circle__inner > span').text();

        //const likes = $(el).find('a > .mf-listings__item__rating > div.mf-listings__item__rating__info > div:nth-child(1)');
        //const likes_count = likes.text().trim();

        urls.push({
          href: el.attribs.href,
          rating: Number(rating)
        });
      });

      // sort by likes
      urls.sort((a, b) => {
        return b.rating - a.rating;
      });

      // get the most liked
      const best_rating = urls[0];

      builds_urls.push(best_rating);
    }catch(e){
    }
  }

  return builds_urls;
}

export { extract_build_items_from_mobafire, get_champion_builds_from_mobafire };