export const matchString = (searchString: string, phrase: string) => {
  const regEx = new RegExp(searchString, 'g');
  return phrase.match(regEx);
};