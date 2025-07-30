export function ensureTrailingEmpty<T extends { key: string; value: string | number }>(
  items: T[],
  setItems: (items: T[]) => void,
  defaultEmpty: T
) {
  const lastItem = items[items.length - 1];
  const isFilled = lastItem?.key !== '' || lastItem?.value !== '';

  if (isFilled) {
    setItems([...items, defaultEmpty]);
  }
}
