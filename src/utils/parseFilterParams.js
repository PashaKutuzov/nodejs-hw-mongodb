function parsedType(value) {
  const isString = typeof value === 'string';
  if (!isString) {
    return;
  }
  const isType = (value) => ['personal', 'home', 'work'].includes(value);
  if (isType(value)) return value;
}
function parsedIsFavorite(value) {
  if (value === 'true') return true;
  if (value === 'false') return false;
  return;
}
export function parseFilterParams(query) {
  const { type, isFavorite } = query;

  const parseType = parsedType(type);
  const parseIsFavorite = parsedIsFavorite(isFavorite);
  return {
    type: parseType,
    isFavorite: parseIsFavorite,
  };
}
