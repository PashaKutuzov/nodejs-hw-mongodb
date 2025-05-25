function parsedType(value) {
  const isString = typeof value === 'string';
  if (!isString) {
    return;
  }
  const isType = (value) => ['personal', 'home', 'work'].includes(value);
  if (isType(value)) return value;
}
function parsedIsFavourite(value) {
  if (value === 'true') return true;
  if (value === 'false') return false;
  return;
}
export function parseFilterParams(query) {
  const { type, isFavourite } = query;

  const parseType = parsedType(type);
  const parseIsFavourite = parsedIsFavourite(isFavourite);
  return {
    type: parseType,
    isFavourite: parseIsFavourite,
  };
}
