export function shuffleArray<T> (array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

export function getRandomEntity<T> (entities: T[]): T {
  return entities[Math.floor(Math.random() * entities.length)]
}

export function getRandomEntities<T> (entities: T[], number: number = 1, unique: boolean = true): T[] {
  const randomEntities: T[] = []

  while (randomEntities.length < number) {
    const randomEntity = getRandomEntity(entities)
    if (unique && randomEntities.findIndex(i => JSON.stringify(randomEntity) === JSON.stringify(i)) < 0) {
      randomEntities.push(randomEntity)
    }
  }

  return randomEntities
}

export function scale (index: number, rangeStart: number, rangeStop: number, outRangeStart: number, outRangeStop: number): number {
  const inRange = rangeStop - rangeStart
  const inDistance = index - rangeStart
  const inPercentage = (inDistance / inRange) * 100
  const outRange = outRangeStop - outRangeStart
  const outIndex = inPercentage * outRange / 100
  return outIndex <= outRangeStop ? outIndex <= outRangeStart ? outRangeStart : Math.ceil(outIndex) : outRangeStop
}

/**
 * see : https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
 */

export function hexToRgb (hex: string): { r: number, g: number, b: number } {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null
}
