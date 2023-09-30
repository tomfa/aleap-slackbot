export function tokenizeString(string: string) {
  const array = string.split(' ').filter((element) => {
    return element !== '';
  });
  console.log('Tokenized version:', array);
  return array;
}
