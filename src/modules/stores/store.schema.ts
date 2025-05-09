import { z } from "zod";

export const createStore = z.object({
  name: z.string().nonempty({ message: "A Store name is required." }),
  description: z.string().nonempty("A Store description is required"),
});

export type StoreInput = z.infer<typeof createStore>;
