import { Header } from '../types/commonTypes';

export function ensureTrailingEmpty(
  items: Header[],
  setItems: (items: Header[]) => void,
  defaultEmpty: Header
) {
  const last = items[items.length - 1];

  const isLastEmpty =
    last &&
    last.key === defaultEmpty.key &&
    last.value === defaultEmpty.value &&
    last.enabled === defaultEmpty.enabled;

  if (!isLastEmpty) {
    setItems([...items, { ...defaultEmpty }]);
  }
}
