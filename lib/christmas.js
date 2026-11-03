// Utilidades de temporada navideña. Ajusta las fechas si quieres.
// Mes en JS: 0 = enero ... 10 = noviembre, 11 = diciembre.
export function isChristmasSeason(now = new Date()) {
  const y = now.getFullYear();
  const start = new Date(y, 10, 1); // 1 de noviembre
  const end = new Date(y, 0, 7); // hasta el 6 de enero (inclusive)
  return now >= start || now < end;
}

export function daysToChristmas(now = new Date()) {
  const y = now.getFullYear();
  const today = new Date(y, now.getMonth(), now.getDate());
  const xmas = new Date(y, 11, 25);
  return Math.round((xmas - today) / 86400000);
}
