import { z } from "zod";

export const createAssetSchema = z.object({
  assetType: z.string().min(1),
  assetName: z.string().min(1),
  brand: z.string().min(1),
  model: z.string(),
  assetCategory: z.string().min(1),
  serialNo: z.string(),
  purchaseDate: z.string().min(1),
  purchaseCostINR: z.number(),
  vendor: z.string().min(1),
  warrantyExpiry: z.string().min(1),
  location: z.string().min(1),
  notes: z.string(),
});

export type CreateAssetFormValues = z.infer<typeof createAssetSchema>;
