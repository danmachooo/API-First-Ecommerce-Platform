import prisma from "../../lib/prisma/client.lib";
import { IStore, IStoreService } from "../interfaces/IStoreService";

export class StoreService implements IStoreService {
  async createStore(data: {
    name: string;
    description: string;
    ownerId: string;
  }): Promise<IStore> {
    return await prisma.store.create({
      data: {
        name: data.name,
        description: data.description,
        ownerId: data.ownerId,
      },
    });
  }
}
