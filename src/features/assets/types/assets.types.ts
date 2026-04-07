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

export interface CreatedAsset {
  id?: string;
  assetCode: string;
  assetName: string;
  assetType: string;
  status: string;
}

export interface MyAsset {
  assignmentId?: string;
  assetCode: string;
  assetType: string;
  assetName: string;
  assignedOn: string;
  acknowledgementStatus: string;
}

export interface AcknowledgeAssignmentResponse {
  id: string;
  employeeId: string;
  acknowledgementStatus: string;
  acknowledgedAt: string;
}

export interface EmployeeOption {
  id?: string;
  employeeId?: string;
  employeeCode?: string;
  name?: string;
  email?: string;
}

export interface AssignAssetPayload {
  employeeId: string;
  assignedOn: string;
  conditionAtAssignment: "GOOD" | "FAIR" | "POOR";
  notes: string;
}

export interface AssignAssetResponse {
  id: string;
  assetId: string;
  employeeId: string;
  assignedOn: string;
  conditionAtAssignment: string;
  notes: string;
  acknowledgementStatus: string;
  assetStatus: string;
}

export interface ReturnAssetPayload {
  returnedOn: string;
  conditionAtReturn: "GOOD" | "DAMAGED" | "LOST";
  returnReason: string;
}

export interface ReturnAssetResponse {
  assetId: string;
  assignmentId: string;
  conditionAtReturn: string;
  returnReason: string;
  returnedOn: string;
  assetStatus: string;
}

export interface AssetAssignmentHistory {
  id: string;
  assetId: string;
  employeeId: string;
  employeeName?: string;
  isActive: boolean;
  assignedOn: string;
  conditionAtAssignment?: string;
  returnedOn?: string;
  conditionAtReturn?: string;
  returnReason?: string;
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
