import { useQuery } from "@tanstack/react-query";
import { getDashboardApi } from "../api/home.api";

export const getDashboardHook = () => {
  const token = localStorage.getItem("token");

  return useQuery({
    queryKey: ["get-dashboard"],
    queryFn: getDashboardApi,
    enabled: !!token,
  });
};
