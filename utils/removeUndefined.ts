export const removeUndefined = <T,>(x: T | undefined): x is T => {
  return x !== undefined;
};
