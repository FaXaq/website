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
