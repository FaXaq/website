import type { INTERVAL_NAME } from '@repo/mtts';
import { INTERVALS, Note, SCALES } from '@repo/mtts';
import { createFileRoute } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';
import z from 'zod';

import { ScaleBuilderSettingsProvider } from '@/components/mtts/scale-builder/context/settings';
import { ScaleBuilder } from '@/components/mtts/scale-builder/ScaleBuilder';

export const Route = createFileRoute('/projects/mtts/scale-builder')({
  component: RouteComponent,
  validateSearch: zodValidator(z.object({
    'rootNote': z.string().default(new Note().SPN),
    'scaleIntervals': z.array(z.custom<INTERVAL_NAME>((value) => typeof value === 'string' && Object.keys(INTERVALS).includes(value))).default(SCALES.MAJOR.intervals.map(interval => interval.name)),
  }))
});

function RouteComponent() {
  return <ScaleBuilderSettingsProvider>
    <ScaleBuilder />
  </ScaleBuilderSettingsProvider>;
}
