import api from "@/lib/api";
import { StandardResponse } from "@/types/api";

export const getUsers = async () => {
  const res = await api.get<StandardResponse<any[]>>("/users");
  return res.data.data;
};