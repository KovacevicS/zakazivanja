export const pocetneOpcije = [
  // Ponedeljak - Petak (od 9 do 19)
  ...Array.from({ length: 40 }, (_, i) => {
    const hour = 9 + Math.floor(i / 4);
    const minute = i % 4 === 0 ? '00' : (i % 4) * 15;
    return {
      value: `${hour.toString().padStart(2, '0')}:${minute}`,
      label: `${hour.toString().padStart(2, '0')}:${minute}`,
      vreme: new Date(0, 0, 0, hour, minute),
      slobodan: true,
    };
  })
];
export const pocetneOpcijeSubtom = [ // Subota (od 9 do 15:45)
...Array.from({ length: 28 }, (_, i) => {
  const hour = 9 + Math.floor(i / 4);
  const minute = i % 4 === 0 ? '00' : (i % 4) * 15;
  if (hour === 15 && minute === 45) return null; // Skip 15:45 for Saturday
  return {
    value: `${hour.toString().padStart(2, '0')}:${minute}`,
    label: `${hour.toString().padStart(2, '0')}:${minute}`,
    vreme: new Date(0, 0, 0, hour, minute),
    slobodan: true,
  };
}).filter((option) => option !== null)]