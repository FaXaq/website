// Thanks to
// https://github.com/cwilso/PitchDetect/pull/23
// https://github.com/dalatant
// https://alexanderell.is/posts/tuner/

// https://en.wikipedia.org/wiki/Root_mean_square
function getRootMeanSquare(buffer: Float32Array) {
  let sum = 0;
  for (let i = 0; i < buffer.length; i++) {
    sum += buffer[i]! * buffer[i]!;
  }
  return Math.sqrt(sum / buffer.length);
}

function buildBufferWithThreshold(buffer: Float32Array) {
  // Since the main sound is a sum of frequencies it can be seen as a composed sine wave
  // We can predict that it will repeat, so we can narrow the buffer down, to several occurences with a threshold
  let r1 = 0;
  let r2 = buffer.length - 1;
  const thres = 0.2;

  // Split buffer un half and check where we lose frequency amplitude so we can work on less data
  for (let i = 0; i < buffer.length / 2; i++) {
    if (Math.abs(buffer[i]!) < thres) {
      r1 = i;
      break;
    }
  }

  for (let i = 1; i < buffer.length / 2; i++) {
    if (Math.abs(buffer[buffer.length - i]!) < thres) {
      r2 = buffer.length - i;
      break;
    }
  }

  return buffer.slice(r1, r2);
}

// Implements the ACF2+ algorithm
export function autoCorrelate(buffer: Float32Array, sampleRate: number) {
  // Calculate the root mean square to see if we have enough signal to perform operations
  const rootMeanSquare = getRootMeanSquare(buffer);

  if (rootMeanSquare < 0.01) {
    return -1;
  }

  const newBuffer = buildBufferWithThreshold(buffer);

  // Build correlation array containing ordinates values multiplied by a moving offset.
  // The index that will have the greater value will be the peak of our sine wave
  const correlation = new Array(newBuffer.length).fill(0);
  for (let i = 0; i < newBuffer.length; i++) {
    for (let j = 0; j < newBuffer.length - i; j++) {
      correlation[i] += newBuffer[j]! * newBuffer[j + i]!;
    }
  }

  let d = 0;

  // Find the first bottom within our new range
  while (correlation[d] > correlation[d + 1]) {
    d++;
  }

  let maxVal = -1;
  let maxPos = -1;

  // From that index find the first peak within the correlation array, our desired abscissa
  for (let i = d; i < newBuffer.length; i++) {
    if (correlation[i] > maxVal) {
      maxVal = correlation[i];
      maxPos = i;
    }
  }
  let T0 = maxPos;

  // From the original author:
  // interpolation is parabolic interpolation. It helps with precision. We suppose that a parabola pass through the
  // three points that comprise the peak. 'a' and 'b' are the unknowns from the linear equation system and b/(2a) is
  // the "error" in the abscissa. Well x1,x2,x3 should be y1,y2,y3 because they are the ordinates.
  // ----
  // Note: x1, x2 and x3 were the previous names of y1, y2 and y3
  // ----
  // From me:
  // What I can comprehend on this, is that we have a parabolic equation, but are unsure which of those three points
  // is the closest to our desired frequency. This bits sorts it out by comparing which is closer to the parabolic
  // peak.
  const y1 = correlation[T0 - 1];
  const y2 = correlation[T0];
  const y3 = correlation[T0 + 1];

  const a = (y1 + y3 - 2 * y2) / 2;
  const b = (y3 - y1) / 2;
  if (a) {
    T0 = T0 - b / (2 * a);
  }

  return sampleRate / T0;
}