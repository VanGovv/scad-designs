const jscad = require("@jscad/modeling");

const { rotateDeg } = require("./utils.jscad");

const { cuboid } = jscad.primitives;
const { translate, mirrorX } = jscad.transforms;
const { subtract } = jscad.booleans;
const { degToRad } = jscad.utils;

const beveledCube = require("./beveledCube.jscad").main;

const { abs, cos, sin, sqrt, round, max } = Math;
const roundPrec = (number, prec) => round(number * 10 ** prec) / 10 ** prec;

const getParameterDefinitions = () => {
    return [
        { name: "x", type: "float", initial: 60, caption: "Width" },
        { name: "y", type: "float", initial: 60, caption: "Depth" },
        { name: "z", type: "float", initial: 30, caption: "Height" },
        { name: "strength", type: "float", initial: 5, caption: "Bridge strength" },
        { name: "rotation", type: "float", initial: 30, caption: "Rotation" },
        { name: "distance", type: "float", initial: 10, caption: "Distance" },
        { name: "cornerBevel", type: "float", initial: 1, caption: "Corner bevel" },
        { name: "cutoffPercent", type: "float", initial: 50, caption: "Maximum cutoff" },
        { name: "maxIterations", type: "float", initial: 5, caption: "Maximum Iterations" },
    ];
};

const hatch = (config) => {
    console.log(config)
    const { x, y, z, distance, strength, cornerBevel, rotation, cutoffPercent, maxIterations } = config;
    const hatchBase = () => cuboid({ size: [x, y, z] });

    let hatch = () => rotateDeg([0, 0, 0], beveledCube({ size: [distance, distance, z], r: cornerBevel, exclude: ['t', 'b'] }));

    const hatches = [];

    const alpha = degToRad(rotation);

    const e = degToRad((rotation + 45) % 90);
    const f = sin(e);
    const g = cos(e);
    const h = sqrt(distance ** 2 / 2);

    const s = roundPrec(max(f, g) * h, 2);

    const addHatch = (i, j) => {

        const a = i * (strength + distance)
        const b = j * (strength + distance)


        const xOffset = roundPrec(cos(alpha) * a + sin(alpha) * b, 2); // , 2);
        const yOffset = roundPrec(cos(alpha) * b - sin(alpha) * a, 2); // + abs(s), 2);

        if (
            abs(xOffset) <= x / 2 - abs(s) + (2 * s * cutoffPercent) / 100 &&
            abs(yOffset) <= y / 2 - abs(s) + (2 * s * cutoffPercent) / 100
        ) {
            hatches.push(translate([a, b, 0], hatch()));
        }
    };

    for (let i = -maxIterations; i <= maxIterations; i++) {
        for (let j = -maxIterations; j <= maxIterations; j++) {
            addHatch(i, j);
        }
    }

    // debug config
    // return union(cuboid({ size: [x, y, z/2] }), rotateDeg([0, 0, rotation], mirrorX(hatches)));

    return subtract(hatchBase(), subtract(hatchBase(), rotateDeg([0, 0, rotation], mirrorX(hatches))));
};

module.exports = { main: hatch, getParameterDefinitions, includeHatchParameters: getParameterDefinitions().map(p => ({...p, name: "hatch_" + p.name, caption: "Hatch " + p.caption})) };
