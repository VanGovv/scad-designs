const jscad = require("@jscad/modeling");

const { subtract } = jscad.booleans;
const { cuboid } = jscad.primitives;
const { translate } = jscad.transforms;

const getParameterDefinitions = () => {
  return [
    { name: "holderWidth", type: "int", initial: 93.2, caption: "inner holder width" },
    { name: "holderLength", type: "int", initial: 165.8, caption: "outer holder length" },
    { name: "holderHeight", type: "int", initial: 40, caption: "inner holder height" },
    { name: "wallSize", type: "float", initial: 1.2, caption: "Wall size" },
  ];
};

const main = ({ holderWidth, holderLength, holderHeight, wallSize }) => {
  const inner = translate([0,0,wallSize/2],cuboid({ size: [holderWidth, holderLength - 2 * wallSize, holderHeight] }));
  const outer = cuboid({ size: [holderWidth + wallSize * 2, holderLength, holderHeight + wallSize] });

  return subtract(outer, inner);
};

module.exports = { main, getParameterDefinitions };
