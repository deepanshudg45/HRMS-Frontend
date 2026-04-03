import { useQuery } from "@tanstack/react-query";
import { getAssets } from "../api/assetsApi";
import { AssetFilters } from "../types/assets.types";

export const useAssets = (filters: AssetFilters) => {
  const { page = 1, limit = 10, status = "", type = "", category = "", search = "" } =
    filters;

  return useQuery({
    queryKey: ["assets", page, limit, status, type, category, search],
    queryFn: () =>
      getAssets({
        page,
        limit,
        status,
        type,
        category,
        search,
      }),
  });
};
