import { z } from "zod";

export const ChartValueZodType = z.number();
export type ChartValue = z.infer<typeof ChartValueZodType>;

export const ChartLabelZodType = z.number();
export type ChartLabel = z.infer<typeof ChartLabelZodType>;

export const ChartDataZodType = z.array(z.object({
    value: ChartValueZodType,
    label: ChartLabelZodType,
    index: z.number()
}));
export type ChartData = z.infer<typeof ChartDataZodType>;

export const TimeAnalysisZodType = z.object({
    meta: z.string(),
    start: z.string(),
    end: z.string(),
    movingTimeVariations: z.array(z.number()),
    totalMovingTime: z.number()
});
export type TimeAnalysis = z.infer<typeof TimeAnalysisZodType>;

export const CoordinatesZodType = z.object({
    lon: z.number(),
    lat: z.number()
});
export type Coordinates = z.infer<typeof CoordinatesZodType>;

export const ReverseGeocodingJSONAddressZodType = z.object({
    road: z.string(),
    village: z.string().optional(),
    state_district: z.string().optional(),
    state: z.string(),
    'ISO3166-2-lvl4': z.string().optional(),
    'ISO3166-2-lvl6': z.string().optional(),
    postcode: z.string(),
    municipality: z.string().optional(),
    county: z.string().optional(),
    region: z.string(),
    country: z.string(),
    country_code: z.string()
});
export type ReverseGeocodingJSONAddress = z.infer<typeof ReverseGeocodingJSONAddressZodType>;

export const ReverseGeocodingJSONZodType = z.object({
    place_id: z.number(),
    license: z.string().optional(),
    osm_type: z.string(),
    osl_id: z.number().optional(),
    lat: z.string(),
    lon: z.string(),
    category: z.string(),
    type: z.string(),
    place_rank: z.number(),
    importance: z.number(),
    addresstype: z.string(),
    name: z.string(),
    display_name: z.string(),
    address: ReverseGeocodingJSONAddressZodType,
    boundingbox: z.array(z.string()).min(4).max(4),
});

export const MapAnalysisZodType = z.object({
    center: CoordinatesZodType,
    boundaries: z.array(CoordinatesZodType).min(2).max(2),
    reverseGeocodingSearchResult: ReverseGeocodingJSONZodType.optional(),
});
export type MapAnalysis = z.infer<typeof MapAnalysisZodType>;

export const GPXTrkPartZodType = z.object({
    __ATTRIBUTE__lat: z.string(),
    __ATTRIBUTE__lon: z.string(),
    ele: z.number(),
    time: z.string().optional(),
});
export type GPXTrkPart = z.infer<typeof GPXTrkPartZodType>;

export const GPXJsonZodType = z.object({
    '?xml': z.object({
        __ATTRIBUTE__version: z.string(),
        __ATTRIBUTE__encoding: z.string(),
    }),
    gpx: z.object({
        '__ATTRIBUTE__creator': z.string(),
        '__ATTRIBUTE__xmlns:xsi': z.string(),
        '__ATTRIBUTE__xsi:schemaLocation': z.string(),
        '__ATTRIBUTE__version': z.string(),
        '__ATTRIBUTE__xmlns': z.string(),
        metadata: z.object({
            time: z.string().optional(),
        }).optional(),
        trk: z.object({
            name: z.string(),
            type: z.string(),
            trkseg: z.object({
                trkpt: z.array(GPXTrkPartZodType),
            }),
        }),
    }),
});
export type GPXJson = z.infer<typeof GPXJsonZodType>;

export const SpeedAnalysisZodType = z.object({
    maxSpeed: z.number(),
    minSpeed: z.number(),
    averageSpeed: z.number(),
    speedVariations: z.array(z.number()),
});
export type SpeedAnalysis = z.infer<typeof SpeedAnalysisZodType>;

export const DistanceAnalysisZodType = z.object({
    totalDistance: z.number(),
    distanceVariations: z.array(z.number()),
});
export type DistanceAnalysis = z.infer<typeof DistanceAnalysisZodType>;

export const ElevationVariationZodType = z.object({
    elevationGain: z.number(),
    elevationLoss: z.number(),
    gradient: z.number()
});
export type ElevationVariation = z.infer<typeof ElevationVariationZodType>;

export const ElevationVariationAnalysisZodType = z.object({
    totalElevationGain: z.number(),
    totalElevationLoss: z.number(),
    elevationVariations: z.array(ElevationVariationZodType),
});
export type ElevationVariationAnalysis = z.infer<typeof ElevationVariationAnalysisZodType>;

export const AnalysisZodType = z.object({
    name: z.string(),
    activity: z.string(),
    time: TimeAnalysisZodType.optional(),
    map: MapAnalysisZodType,
    elevation: ElevationVariationAnalysisZodType,
    distance: DistanceAnalysisZodType,
    speed: SpeedAnalysisZodType.optional(),
    points: z.array(GPXTrkPartZodType),
});
export type Analysis = z.infer<typeof AnalysisZodType>;