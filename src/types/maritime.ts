export interface MaritimeDataItem {
    valid_from: string;
    valid_to: string;
    time_desc: string;
    weather: string;
    weather_desc: string;
    warning_desc: string;
    station_remark: string;
    wave_cat: string;
    wave_desc: string;
    wind_from: string;
    wind_to: string;
    wind_speed_min: number;
    wind_speed_max: number;
}

export interface MaritimeApiResponse {
    code: string;
    name: string;
    issued: string;
    info?: string;
    data: MaritimeDataItem[];
}
