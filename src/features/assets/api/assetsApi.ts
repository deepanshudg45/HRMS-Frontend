import api from "@/lib/api";
import { StandardResponse } from "@/types/api";
import {
  Asset,
  AssetFilters,
  AssetsListData,
  CreateAssetPayload,
  UpdateAssetPayload,
} from "../types/assets.types";

export const getAssets = async (filters: AssetFilters = {}) => {
  const res = await api.get<StandardResponse<AssetsListData>>("api/v1/assets", {
    params: filters,
  });

  return res.data;
};

export const getAsset = async (id: string) => {
  const res = await api.get<StandardResponse<Asset>>(`api/v1/assets/${id}`);
  return res.data;
};

export const createAsset = async (data: CreateAssetPayload) => {
  const res = await api.post<StandardResponse<Asset>>("api/v1/assets", data);
  return res.data;
};

export const updateAsset = async (id: string, data: UpdateAssetPayload) => {
  const res = await api.put<StandardResponse<Asset>>(`api/v1/assets/${id}`, data);
  return res.data;
};

export const softDeleteAsset = async (id: string) => {
  const res = await api.patch<StandardResponse<Asset>>(
    `api/v1/assets/${id}/soft-delete`
  );
  return res.data;
};
