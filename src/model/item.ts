interface Image {
  full: string;
  sprite: string;
  group: string;
  x: number;
  y: number;
  w: number;
  h: number;
};

interface Gold {
  base: number;
  purchasable: boolean;
  total: number;
  sell: number;
};

interface Item {
  id: string;

  name: string;

  description: string;

  colloq: string;

  plaintext: string;

  from: string[];

  into: string[];

  image: Image;

  gold: Gold;

  tags: string[];

  stats: {
    [key: string]: number;
  };

  depth: number;
}