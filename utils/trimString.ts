export const trimString = (
  value: string | null | undefined,
  characterCap: number,
) => {
  const text = value ?? "";
  if (text.length <= characterCap) return text;
  const trimmed = text.slice(0, Math.max(0, characterCap));
  const wordBoundary = trimmed.lastIndexOf(" ");
  return (wordBoundary > 0 ? trimmed.slice(0, wordBoundary) : trimmed) + "...";
};
