import { useQuery } from "@tanstack/react-query";
import { fetchMaritimeData } from "../api/bmkgClient";

export function useMaritimeData(areaCode: string, areaName: string) {
    return useQuery({
        queryKey: ["maritime", areaCode],
        queryFn: () => fetchMaritimeData(areaCode, areaName),
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
    })
}
