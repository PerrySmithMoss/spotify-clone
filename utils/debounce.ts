export const debounce = <Args extends unknown[]>(
  func: (...args: Args) => unknown,
  delay: number,
) => {
  let timeout: ReturnType<typeof setTimeout> | undefined;
  const debounced = (...args: Args) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
  debounced.cancel = () => {
    if (timeout) clearTimeout(timeout);
    timeout = undefined;
  };
  return debounced;
};
