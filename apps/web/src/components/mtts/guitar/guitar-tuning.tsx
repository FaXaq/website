import type { SelectValueChangeDetails } from "@chakra-ui/react";
import { createListCollection, Portal, Select } from "@chakra-ui/react";

import { useGuitarNeck } from "./context";
import type { TTuningName } from "./tunings";
import { TUNINGS, ZodTuningName } from "./tunings";

export const GuitarTuning = () => {
  const { tuning, setGuitarTuning } = useGuitarNeck();
  const tuningOptions = createListCollection({
    items: (Object.keys(TUNINGS) as (keyof typeof TUNINGS)[]).map((key) => ({
      value: key,
      label: TUNINGS[key].name,
    }))
  });

  const handleGuitarTuningChange = (e: SelectValueChangeDetails<{
    value: TTuningName;
    label: TTuningName;
  }>) => {
    if (ZodTuningName.safeParse(e.value[0]).success) {
      setGuitarTuning(TUNINGS[ZodTuningName.parse(e.value[0])]);
    } else {
      setGuitarTuning(TUNINGS.guitar_std);
    }
  };

  return <Select.Root
    collection={tuningOptions}
    size="xs"
    value={[tuning.name]}
    onValueChange={(e) => handleGuitarTuningChange(e)}
    multiple={false}
  >
    <Select.HiddenSelect />
    <Select.Label>Select tuning</Select.Label>
    <Select.Control>
      <Select.Trigger>
        <Select.ValueText placeholder="Select root note" />
      </Select.Trigger>
      <Select.IndicatorGroup>
        <Select.Indicator />
      </Select.IndicatorGroup>
    </Select.Control>
    <Portal>
      <Select.Positioner>
        <Select.Content>
          {tuningOptions.items.map((option) => (
            <Select.Item item={option} key={option.value}>
              {option.label}
              <Select.ItemIndicator />
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Positioner>
    </Portal>
  </Select.Root>;
};
