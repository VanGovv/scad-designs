const jscad = require("@jscad/modeling");

const beveledCube = require("../beveledCube.jscad").main;

const { translate } = jscad.transforms;
const { subtract } = jscad.booleans;
const { cuboid } = jscad.primitives;

const getParameterDefinitions = () => {
  return [
    { name: "cardWidth", type: "int", initial: 57, caption: "card width" },
    { name: "cardHeight", type: "int", initial: 88, caption: "card height" },
    { name: "deckHeight", type: "int", initial: 65, caption: "deck height" },
    { name: "cutout", type: "int", initial: 0.8, caption: "cutout size", min: 0.5, max: 0.95 },
    { name: "wallSize", type: "float", initial: 1.2, caption: "Wall size" },
    { name: "floorSize", type: "float", initial: 0.8, caption: "Floor size" },
    { name: "bevel", type: "int", initial: 5, caption: "Bevel" },
    { name: "showHolder", type: "checkbox", checked: false, caption: "Show holder" },
    { name: "showCover", type: "checkbox", checked: true, caption: "Show cover" },
  ];
};

const main = ({ cardWidth, cardHeight, cutout, deckHeight, wallSize, floorSize, bevel, showHolder, showCover }) => {
  const holder = translate(
    [0, 0, -(cardWidth / 2 + floorSize) / 2],
    cuboid({
      size: [deckHeight + wallSize * 2, cardHeight + wallSize * 2, cardWidth / 2 + floorSize],
    })
  );

  const cover = translate(
    [0, 0, floorSize / 2],
    cuboid({
      size: [deckHeight + wallSize * 4, cardHeight + wallSize * 4, cardWidth + 2 * floorSize],
    })
  );

  const cutouts = [];

  cutouts.push(cuboid({ size: [deckHeight, cardHeight, cardWidth] }));

  cutouts.push(beveledCube({ x: deckHeight + wallSize * 2 + 2 * bevel, y: cardHeight * cutout, z: cardWidth * cutout, r: bevel }));

  result = [];

  if (showHolder) result.push(subtract(holder, ...cutouts));
  if (showCover) result.push(subtract(cover, ...cutouts, subtract(holder, ...cutouts)));

  return result;
};

module.exports = { main, getParameterDefinitions };
