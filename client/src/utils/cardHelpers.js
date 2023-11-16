export const colors = [
  '#ff6600',
  '#ffcc00',
  '#1d9485',
  '#06C1BA',
  '#037CC2',
  '#5871C1',
  '#2F74C4',
  '#cc00ff',
  '#ff00cc',
  '#ff0066',
  '#bfafdd',
  '#adcfd8',
  '#db3e79',
  '#f48686'
];

export const getRandomElement = list => list[Math.floor(Math.random() * list.length)];

export const getRandomColor = () => getRandomElement(colors);

export const hashStringToColor = string => {
  let hash = 0;
  for (let i = 0; i < string.length; i++) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

export const createAcronym = purposeName => {
  return purposeName
    .split(' ')
    .filter(Boolean)
    .map(word => word[0].toUpperCase())
    .join('');
};
