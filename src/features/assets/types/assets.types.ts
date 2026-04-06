export interface AssetSummary {
  id: string;
  code: string;
  name: string;
  serialNo: string;
  type: string;
  category: string;
  status: string;
  location?: string;
  assignedToName?: string;
}

export interface AssetFilters {
  search?: string;
  status?: string;
  type?: string;
  category?: string;
  page?: number;
  limit?: number;
}

export interface AssetsListMeta {
  total: number;
  page: number;
  limit: number;
}

export interface AssetsListResponse {
  data: AssetSummary[];
  meta: AssetsListMeta;
}

export interface Asset {
  id: string;
  assetCode: string;
  assetName: string;
  assetType: string;
  assetCategory: string;
  status: string;
  serialNo: string;
  brand: string;
  model: string;
  purchaseDate: string;
  purchaseCostINR: number;
  vendor: string;
  warrantyExpiry: string;
  location: string;
  notes: string;
  currentAssignee?: {
    name?: string;
    employeeCode?: string;
    assignedOn?: string;
    employeeId: string;
  };
  assignmentId?: string;
}

export interface CreateAssetPayload {
  assetType: string;
  assetName: string;
  brand: string;
  model: string;
  assetCategory: string;
  serialNo: string;
  purchaseDate: string;
  purchaseCostINR: number;
  vendor: string;
  warrantyExpiry: string;
  location: string;
  notes: string;
}

export interface UpdateAssetPayload extends Partial<CreateAssetPayload> {}
