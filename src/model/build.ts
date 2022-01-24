interface Item {
  id: string;
  count: number;
};

interface Block {
  type: string;

  items: Array<Item>;
};

export { Block, Item };