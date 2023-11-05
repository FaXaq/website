interface ReverseGeocodingJSONAddress {
    road: string,
    village: string,
    state_district: string,
    state: string,
    'ISO3166-2-lvl4'?: string,
    'ISO3166-2-lvl6'?: string,
    postcode: string,
    municipality: string,
    county: string,
    region: string,
    country: string,
    country_code: string
  }

export interface ReverseGeocodingJSON {
    place_id: number,
    license: string,
    osm_type: string,
    osl_id: number,
    lat: string,
    lon: string,
    category: string,
    type: string,
    place_rank: number,
    importance: number,
    addresstype: string,
    name: string,
    display_name: string,
    address: ReverseGeocodingJSONAddress,
    boundingbox: [string, string, string, string]
  }

export default async function reverseGeocodingSearch({ lat, lon }: { lat: number, lon: number }): Promise<ReverseGeocodingJSON> {
  return await (await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`, {
    headers: {
      Referer: 'https://norra.fr'
    }
  })).json() as unknown as ReverseGeocodingJSON
}
