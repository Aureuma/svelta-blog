import data from './stock-images.json';

type StockImage = {
  id: string;
  filename: string;
  width: number;
  height: number;
  photographer: string;
  url: string;
  source: string;
};

export const stockImages = data as StockImage[];

export const getStockImage = (id: string) =>
  stockImages.find((item) => item.id === id) || null;
