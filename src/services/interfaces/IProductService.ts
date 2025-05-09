export interface IProducts {
  id: string;
  name: string;
  description: string;
  storeId: string;
  price: number;
  stocks: number;
  imageUrl: string;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
}
