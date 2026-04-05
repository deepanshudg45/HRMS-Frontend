import api from "@/lib/api";
import { StandardResponse } from "@/types/api";
import {
  Asset,
  AssetFilters,
  AssetSummary,
  CreateAssetPayload,
  UpdateAssetPayload,
} from "../types/assets.types";

export const getAssets = async (filters: AssetFilters = {}) => {
  const res = await api.get<StandardResponse<AssetSummary[]>>("/api/v1/assets", {
    params: filters,
  });

  return res.data;
};

export const getAsset = async (id: string) => {
  const res = await api.get<StandardResponse<Asset>>(`/api/v1/assets/${id}`);
  return res.data;
};

export const createAsset = async (data: CreateAssetPayload) => {
  const res = await api.post<Asset>("/api/v1/assets", data);
  return res.data;
};

export const updateAsset = async (id: string, data: UpdateAssetPayload) => {
  const res = await api.put<StandardResponse<Asset>>(`/api/v1/assets/${id}`, data);
  return res.data;
};

export const deleteAsset = async (id: string) => {
  await api.delete(`/api/v1/assets/${id}`);
};
