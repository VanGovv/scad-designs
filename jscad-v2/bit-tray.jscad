const jscad = require("@jscad/modeling");

const beveledCube = require("./beveledCube.jscad").main;

const { degToRad } = jscad.utils;
const { translate } = jscad.transforms;
const { hull } = jscad.hulls;
const { subtract } = jscad.booleans;

const getParameterDefinitions = () => {
  return [
    { name: "x", type: "int", initial: 60, caption: "X" },
    { name: "y", type: "int", initial: 60, caption: "Y" },
    { name: "z", type: "int", initial: 15, caption: "Z" },
    { name: "r", type: "int", initial: 15, caption: "R" },
    { name: "wallSize", type: "float", initial: 1.5, caption: "Wall size" },
    { name: "floorStrength", type: "float", initial: 1, caption: "Floor strength" },
    { name: "deg", type: "int", initial: 45, caption: "Degree" },
  ];
};

const main = ({ x, y, z, r, wallSize, floorStrength, deg }) => {
  const o = Math.sin(degToRad(deg)) * z;

  const outer = hull(
    translate([0, 0, z], beveledCube({ x: x + o, y: y + o, z: 0.1, r: r, exclude: ["t", "b"] })),
    translate([0, 0, r / 2], beveledCube({ x, y, z: r, r: [r, 0, 0], exclude: ["t"] }))
  );
  const inner = hull(
    translate([0, 0, wallSize + z], beveledCube({ x: x + o, y: y + o, z: 0.1, r: [r, 0, 0], exclude: ["t", "b"] })),
    translate([0, 0, floorStrength + r / 2], beveledCube({ x: x - wallSize, y: y - wallSize, z: r, r: [r, 0 ,0], exclude: ["t"] }))
  );

  return subtract(outer, inner);
};

module.exports = { main, getParameterDefinitions };
