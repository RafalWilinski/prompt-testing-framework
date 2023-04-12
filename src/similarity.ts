function jaroSimilarity(s1: string, s2: string): number {
  if (s1 === s2) return 1;

  const len1 = s1.length;
  const len2 = s2.length;
  const matchWindow = Math.floor(Math.max(len1, len2) / 2) - 1;

  const matches1 = new Array<boolean>(len1);
  const matches2 = new Array<boolean>(len2);

  let matches = 0;
  let transpositions = 0;

  for (let i = 0; i < len1; i++) {
    const start = Math.max(0, i - matchWindow);
    const end = Math.min(i + matchWindow + 1, len2);

    for (let j = start; j < end; j++) {
      if (matches2[j] || s1[i] !== s2[j]) continue;

      matches1[i] = true;
      matches2[j] = true;

      matches++;
      break;
    }
  }

  if (matches === 0) return 0;

  let k = 0;
  for (let i = 0; i < len1; i++) {
    if (!matches1[i]) continue;

    while (!matches2[k]) k++;

    if (s1[i] !== s2[k]) transpositions++;

    k++;
  }

  const jaroDistance =
    (1 / 3) *
    (matches / len1 +
      matches / len2 +
      (matches - transpositions / 2) / matches);

  return jaroDistance;
}

export function jaroWinklerSimilarity(
  s1: string,
  s2: string,
  p: number = 0.1,
  l: number = 4
): number {
  const jaro = jaroSimilarity(s1, s2);

  let prefix = 0;

  for (let i = 0; i < Math.min(s1.length, s2.length, l); i++) {
    if (s1[i] === s2[i]) {
      prefix++;
    } else {
      break;
    }
  }

  return jaro + prefix * p * (1 - jaro);
}
