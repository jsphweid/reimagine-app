export function removeTypename<T extends { __typename?: any }>(
  obj: T
): Omit<T, "__typename"> {
  return {
    ...obj,
    __typename: undefined,
  };
}

// stolen from https://stackoverflow.com/questions/36280818/how-to-convert-file-to-base64-in-javascript
export const toBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
