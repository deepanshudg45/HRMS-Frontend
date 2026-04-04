export interface Asset {
  id: string;
  asset_code: string;
  asset_type: string;
  asset_name: string;
  brand: string;
  model?: string;
  status: string;
  location: string;
  serial_no?: string;
  assigned_to: {
    id: string;
    name: string;
  } | null;
  category?: string;
}

export interface AssetFilters {
  search?: string;
  status?: string;
  type?: string;
  category?: string;
  page?: number;
  limit?: number;
}

export interface AssetsListData {
  items: Asset[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateAssetPayload {
  asset_type: string;
  asset_name: string;
  brand: string;
  model: string;
  category: string;
  serial_no: string;
  purchase_date: string;
  purchase_cost_inr: number;
  vendor: string;
  warranty_expiry: string;
  location: string;
  notes: string;
}

export interface UpdateAssetPayload extends Partial<CreateAssetPayload> {}
