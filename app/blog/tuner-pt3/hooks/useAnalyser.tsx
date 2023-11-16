export const FFT_SIZE = 32768

export function useAnalyser(stream: MediaStream, fftSize: number = FFT_SIZE): [] | [AnalyserNode, MediaStreamAudioSourceNode] {
  if (!stream ) {
    return []
  }
  const ctx = new AudioContext()
  const analyser = ctx.createAnalyser()
  analyser.fftSize = fftSize
  analyser.minDecibels = -100;
  analyser.maxDecibels = -10;
  analyser.smoothingTimeConstant = 0.85;
  const sourceNode = ctx.createMediaStreamSource(stream)
  sourceNode.connect(analyser)
  return [analyser, sourceNode]
}