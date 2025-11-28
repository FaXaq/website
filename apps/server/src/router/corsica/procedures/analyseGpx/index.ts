import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import type { GPXTrkPart } from "@repo/schemas/api/procedures/corsica";
import { AnalyseGPXInput, AnalyseGPXOutput } from "@repo/schemas/api/procedures/corsica";
import { TRPCError } from "@trpc/server";

import { config } from "../../../../config";
import { t } from "../../../../trpc";
import { generateS3Key } from "../../utils/prefix";
import { parseGPX } from "../mergeGpx/utils/parseActivity";
import getDistanceVariations from "./utils/getDistanceVariations";
import getElevationVariations from "./utils/getElevationVariations";
import getMapAnalysis from "./utils/getMapAnalysis";
import getSpeedAnalysis from "./utils/getSpeedAnalysis";
import getTimeAnalysis from "./utils/getTimeAnalysis";
import { trackHasTime } from "./utils/trackHasTime";

export const analyseGPXProcedure = t.procedure
  .input(AnalyseGPXInput)
  .output(AnalyseGPXOutput)
  .mutation(async ({ input }) => {
    try {
      const s3Client = new S3Client({
        region: config.S3_REGION,
        endpoint: config.S3_ENDPOINT,
        credentials: {
          accessKeyId: config.S3_ACCESS_KEY,
          secretAccessKey: config.S3_SECRET_KEY,
        },
      });

      const command = new GetObjectCommand({
        Bucket: config.S3_BUCKET_NAME,
        Key: input.example ? generateS3Key(input.id, 'analyse/example') : generateS3Key(input.id, 'analyse/custom'),
      });

      const response = await s3Client.send(command);
      if (!response.Body) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'File not found' });
      }

      // create blob from response.Body
      const body = await response.Body.transformToByteArray();
      const blob = new Blob([new Uint8Array(body)], { type: response.ContentType });
      const file = new File([blob], input.id, { type: response.ContentType });

      const parsedFile = await parseGPX(file);
      let trkpts: Array<GPXTrkPart> = [];

      try {
        trkpts = parsedFile.gpx.trk.trkseg.trkpt;
      } catch (e) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Cannot find track parts', cause: e });
      }

      const elevationAnalysis = getElevationVariations(trkpts);
      const distanceAnalysis = getDistanceVariations(trkpts);

      const mapAnalysis = await getMapAnalysis(trkpts);
      if (trackHasTime(parsedFile)) {
        return {
          name: parsedFile.gpx.trk.name,
          activity: parsedFile.gpx.trk.type,
          time: getTimeAnalysis(parsedFile),
          map: mapAnalysis,
          elevation: elevationAnalysis,
          distance: distanceAnalysis,
          points: [
            ...trkpts
          ],
          speed: getSpeedAnalysis(trkpts)
        };
      }

      return {
        name: parsedFile.gpx.trk.name,
        activity: parsedFile.gpx.trk.type,
        map: mapAnalysis,
        elevation: elevationAnalysis,
        distance: distanceAnalysis,
        points: [
          ...trkpts
        ],
      };
    } catch (error) {
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Error analysing GPX file', cause: error });
    }
  });