import type { MaritimeApiResponse } from '../types/maritime';

const BASE_URL = 'https://peta-maritim.bmkg.go.id/public_api/perairan';

export async function fetchMaritimeData(
    areaCode: string,
    areaName: string
): Promise<MaritimeApiResponse> {
    const url = `${BASE_URL}/${areaCode}_${encodeURIComponent(areaName)}.json`;
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Error fetching maritime data: ${response.status} ${response.statusText}`);
    }

    const data: MaritimeApiResponse = await response.json();
    return data;
}
