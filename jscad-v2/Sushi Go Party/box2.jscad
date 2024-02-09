const jscad = require("@jscad/modeling");

const beveledCube = require("../beveledCube.jscad").main;

const { translate } = jscad.transforms;
const { subtract } = jscad.booleans;
const { cuboid, cylinder } = jscad.primitives;

const getParameterDefinitions = () => {
  return [
    { name: "cardWidth", type: "int", initial: 57, caption: "card width" },
    { name: "cardHeight", type: "int", initial: 90, caption: "card height" },
    { name: "deckHeight", type: "int", initial: 65, caption: "deck height" },
    { name: "cutout", type: "int", initial: 0.8, caption: "cutout size", min: 0.5, max: 0.95 },
    { name: "wallSize", type: "float", initial: 1.2, caption: "Wall size" },
    { name: "floorSize", type: "float", initial: 0.8, caption: "Floor size" },
    { name: "bevel", type: "int", initial: 5, caption: "Bevel" },
    { name: "magnetD", type: "float", initial: 4.2, caption: "magnetD" },
    { name: "magnetH", type: "float", initial: 2.2, caption: "magnetH" },
  ];
};

const main = ({ cardWidth, cardHeight, cutout, deckHeight, wallSize, floorSize, bevel, magnetD, magnetH }) => {
  const holder = translate(
    [0, 0, -(cardWidth / 2 + floorSize) / 2],
    cuboid({
      size: [deckHeight + wallSize * 2, cardHeight + wallSize * 4 + magnetD * 2, cardWidth / 2 + floorSize],
    })
  );

  const cutouts = [];

  cutouts.push(cuboid({ size: [deckHeight, cardHeight, cardWidth] }));

  cutouts.push(beveledCube({ x: deckHeight + wallSize * 2 + 2 * bevel, y: cardHeight * cutout, z: cardWidth * cutout, r: bevel }));

  cutouts.push(translate([(deckHeight + wallSize * 2) / 2 - magnetD , (cardHeight + wallSize * 2 + magnetD) / 2, -magnetH / 2], cylinder({ radius: magnetD / 2, height: magnetH })));
  cutouts.push(translate([(deckHeight + wallSize * 2) / 2 - magnetD , -(cardHeight + wallSize * 2 + magnetD) / 2, -magnetH / 2], cylinder({ radius: magnetD / 2, height: magnetH })));
  cutouts.push(translate([-(deckHeight + wallSize * 2) / 2 + magnetD , (cardHeight + wallSize * 2 + magnetD) / 2, -magnetH / 2], cylinder({ radius: magnetD / 2, height: magnetH })));
  cutouts.push(translate([-(deckHeight + wallSize * 2) / 2 + magnetD , -(cardHeight + wallSize * 2 + magnetD) / 2, -magnetH / 2], cylinder({ radius: magnetD / 2, height: magnetH })));

  result = [];

  result.push(subtract(holder, ...cutouts));

  return result;
};

module.exports = { main, getParameterDefinitions };
