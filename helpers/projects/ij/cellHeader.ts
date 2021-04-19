const ALPHABET = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']

/**
 * Should provide a unique name for the table cell header :
 * A, B, C, .... AA, AB, AC, ..., BA, BB, ..., AAA,
 */
export function getCellHeaderTitle (cellNumber: number): string {
  const quotient = Math.floor(cellNumber / ALPHABET.length)
  const remainder = cellNumber % ALPHABET.length
  if (quotient === 0) {
    return ALPHABET[remainder]
  }

  if (quotient > ALPHABET.length) {
    /**
     * We have to substract one to the quotient because one occurence has been used here
     * to determine this letter
     */
    return getCellHeaderTitle(quotient - 1) + ALPHABET[remainder]
  }

  return ALPHABET[quotient - 1] + ALPHABET[remainder]
}
