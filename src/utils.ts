export function removeTypename<T extends { __typename?: any }>(
  obj: T
): Omit<T, "__typename"> {
  return {
    ...obj,
    __typename: undefined,
  };
}
