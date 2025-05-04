// src/types/express.d.ts
import { Role } from "../generated/prisma";

declare global {
  namespace Express {
    interface Request {
      user?: User;
      product?: Product;
    }

    interface User {
      id: string;
      email: string;
      firstname: string;
      lastname: string;
      role: Role;
      provider?: string | null;
      providerId?: string | null;
      sessionToken?: string | null;
      createdAt: Date | string;
    }
    interface Product {
      id: string;
      name: string | null;
      description?: string | null;
      price: number;
      stock: number;
      imageUrl?: string;
      categoryId: string;
      createdAt: Date | string;
      updatedAt: Date | string;
    }
  }
}
