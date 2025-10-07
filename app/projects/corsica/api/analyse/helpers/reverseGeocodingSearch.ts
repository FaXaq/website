import { ReverseGeocodingJSON } from "@/projects/corsica/analyse/types"

export default async function reverseGeocodingSearch({ lat, lon }: { lat: number, lon: number }): Promise<ReverseGeocodingJSON> {
  try {
    return await (await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`, {
      headers: {
        Referer: 'https://norra.fr'
      }
    })).json() as unknown as ReverseGeocodingJSON
  } catch (err) {
    console.error(err)
    return undefined
  }
}
