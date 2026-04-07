import api from "@/lib/api";
import { StandardResponse } from "@/types/api";
import {
  Asset,
  AssetFilters,
  AssetsListResponse,
  AssignAssetPayload,
  AssignAssetResponse,
  CreateAssetPayload,
  CreatedAsset,
  EmployeeOption,
  MyAsset,
  AcknowledgeAssignmentResponse,
  AssetAssignmentHistory,
  ReturnAssetPayload,
  ReturnAssetResponse,
  UpdateAssetPayload,
} from "../types/assets.types";

export const getAssets = async (filters: AssetFilters = {}) => {
  const res = await api.get<
    StandardResponse<
      Array<{
        id: string;
        asset_code: string;
        name: string;
        serial_no: string;
        type: string;
        category: string;
        status: string;
      }>
    >
  >("/api/v1/assets", {
    params: filters,
  });

  return {
    ...res.data,
    data: {
      data: (res.data.data ?? []).map((asset) => ({
        id: asset.id,
        code: asset.asset_code,
        name: asset.name,
        serialNo: asset.serial_no,
        type: asset.type,
        category: asset.category,
        status: asset.status,
      })),
      meta: {
        page: res.data.meta?.page ?? filters.page ?? 1,
        limit: res.data.meta?.limit ?? filters.limit ?? 10,
        total: res.data.meta?.total ?? 0,
      },
    },
  } satisfies StandardResponse<AssetsListResponse>;
};

export const getAsset = async (id: string) => {
  const res = await api.get<StandardResponse<Asset>>(`/api/v1/assets/${id}`);
  return res.data;
};

export const searchEmployees = async (search: string) => {
  const res = await api.get<StandardResponse<EmployeeOption[]>>("/users", {
    params: { search },
  });
  return res.data.data ?? [];
};

export const getMyAssets = async () => {
  const res = await api.get<MyAsset[]>("/api/v1/assets/my");
  return res.data;
};

export const createAsset = async (data: CreateAssetPayload) => {
  const res = await api.post<CreatedAsset>("/api/v1/assets", data);
  return res.data;
};

export const updateAsset = async (id: string, data: UpdateAssetPayload) => {
  const res = await api.put<StandardResponse<Asset>>(`/api/v1/assets/${id}`, data);
  return res.data;
};

export const assignAsset = async (assetId: string, data: AssignAssetPayload) => {
  const res = await api.post<StandardResponse<AssignAssetResponse>>(
    `/api/v1/assets/${assetId}/assign`,
    data
  );
  return res.data;
};

export const returnAsset = async (assetId: string, data: ReturnAssetPayload) => {
  const res = await api.post<ReturnAssetResponse>(
    `/api/v1/assets/${assetId}/return`,
    data
  );
  return res.data;
};

export const getAssetAssignmentHistory = async (assetId: string) => {
  const res = await api.get<AssetAssignmentHistory[]>(
    `/api/v1/assets/${assetId}/assignments`
  );
  return res.data;
};

export const deleteAsset = async (id: string) => {
  await api.delete(`/api/v1/assets/${id}`);
};

export const acknowledgeAssetAssignment = async (assignmentId: string) => {
  const res = await api.patch<AcknowledgeAssignmentResponse>(
    `/api/v1/assets/assignments/${assignmentId}/acknowledge`
  );
  return res.data;
};
