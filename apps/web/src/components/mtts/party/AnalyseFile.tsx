import { Box, Button, Skeleton, Slider, Text } from "@chakra-ui/react";
import { useWavesurfer } from "@wavesurfer/react";
import { useEffect, useMemo, useRef, useState } from "react";
import Hover from "wavesurfer.js/dist/plugins/hover.esm.js";

const plugins = [
  Hover.create({
    lineColor: "#ff0000",
    lineWidth: 2,
    labelBackground: "#555",
    labelColor: "#fff",
    labelSize: "11px",
    labelPreferLeft: false,
  }),
];

interface AnalyseFileProps {
  file: File;
}

const AnalyseFile: React.FC<AnalyseFileProps> = ({ file }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const fileUrl = useMemo(() => {
    return URL.createObjectURL(file);
  }, [file]);

  const { wavesurfer, isReady, isPlaying, currentTime } = useWavesurfer({
    container: containerRef,
    url: fileUrl,
    waveColor: "purple",
    height: 100,
    width: "100%",
    plugins,
  });

  const onPlayPause = () => {
    wavesurfer?.playPause();
  };

  useEffect(() => {
    wavesurfer?.setPlaybackRate(playbackRate, true);
  }, [playbackRate]);

  return (
    <>
      <Box ref={containerRef}>
        {!isReady && <Skeleton height="100%" width="100%" />}
      </Box>
      <Text>
        {(() => {
          const totalMs = Math.floor(currentTime * 1000);
          const ms = totalMs % 1000;
          const totalSeconds = Math.floor(currentTime);
          const s = totalSeconds % 60;
          const totalMinutes = Math.floor(totalSeconds / 60);
          const m = totalMinutes % 60;
          const h = Math.floor(totalMinutes / 60);
          return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}:${ms.toString().padStart(3, "0")}`;
        })()}
      </Text>
      <Button onClick={onPlayPause}>{isPlaying ? "Pause" : "Play"}</Button>
      <Slider.Root
        width="200px"
        defaultValue={[playbackRate * 50]}
        onValueChange={(v) => setPlaybackRate((v.value[0] ?? 50) / 50)}
        onDoubleClick={() => setPlaybackRate(1)}
      >
        <Slider.Control>
          <Slider.Track>
            <Slider.Range />
          </Slider.Track>
          <Slider.Thumbs />
        </Slider.Control>
      </Slider.Root>
      <Text>{(playbackRate * 100).toFixed(2)}%</Text>
    </>
  );
};

export default AnalyseFile;
