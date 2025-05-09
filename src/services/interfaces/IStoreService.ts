import { IProducts } from "./IProductService";

export interface IStore {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  products?: IProducts;
}

export interface IStoreService {
  createStore(data: {
    name: string;
    description: string;
    ownerId: string;
  }): Promise<IStore>;
  //   updateStore(data: { name: string; ownerId: string }): Promise<IStore>;
  //   findStoreById(id: string): Promise<IStore | null>;
  //   findStoreByOwner(id: string): Promise<IStore | null>;
}
