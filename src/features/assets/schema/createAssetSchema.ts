import { z } from "zod";

export const createAssetSchema = z.object({
  asset_type: z.string().min(1),
  asset_name: z.string().min(1),
  brand: z.string().min(1),
  model: z.string().min(1),
  category: z.string().min(1),
  serial_no: z.string().min(1),
  purchase_date: z.date(),
  purchase_cost_inr: z.number(),
  vendor: z.string().min(1),
  warranty_expiry: z.date(),
  location: z.string().min(1),
  notes: z.string().min(1),
});

export type CreateAssetFormValues = z.infer<typeof createAssetSchema>;
