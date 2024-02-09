const jscad = require("@jscad/modeling");
const { cylinder } = jscad.primitives;
const { translate } = jscad.transforms;
const { subtract } = jscad.booleans;

const getParameterDefinitions = () => {
  return [
    { name: "outerD", type: "int", initial: 100, caption: "outerD" },
    { name: "innerD", type: "int", initial: 95, caption: "innerD" },
    { name: "height", type: "int", initial: 6, caption: "height" },
    { name: "floorStrength", type: "float", initial: .2, caption: "floorStrength" },
    { name: "wallStrength", type: "float", initial: .4, caption: "wallStrength" },
    { name: "segments", type: "int", initial: 36, caption: "segments" },
  ];
};

const main = (params) => {
  return beveledCube(params);
};

module.exports = { main, getParameterDefinitions };

const beveledCube = ({ innerD = 95, outerD = 99, height = 6, floorStrength = 0.2, wallStrength = 0.6, segments = 360 } = {}) => {
  const outer = cylinder({ radius: outerD / 2 + wallStrength, height, segments });
  const cutouts = [];

  cutouts.push(cylinder({ radius: innerD / 2, height, segments }));
  cutouts.push(translate([0, 0, floorStrength / 2], cylinder({ radius: outerD / 2, height: height - floorStrength, segments })));

  return subtract(outer, cutouts);
};
