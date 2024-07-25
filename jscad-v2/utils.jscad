const jscad = require("@jscad/modeling");

const { degToRad } = jscad.utils;
const { translate, rotate, mirrorX } = jscad.transforms;
const { subtract } = jscad.booleans;
const { cuboid } = jscad.primitives;
const { main: beveledCube } = require("./beveledCube.jscad");

const { abs, cos, sin, sqrt, round, max } = Math;
const roundPrec = (number, prec) => round(number * 10 ** prec) / 10 ** prec;

const rotateDeg = ([x, y, z], ...rest) => {
    return rotate([degToRad(x), degToRad(y), degToRad(z)], ...rest);
};

const hatch = (config) => {
    const { x, y, z, distance, strength, bevel, rotation, cutoffPercent, maxIterations } = config;
    const hatchBase = () => cuboid({ size: [x, y, z] });

    let hatch = () =>
        rotateDeg([0, 0, 0], beveledCube({ size: [distance, distance, z], r: bevel, exclude: ["t", "b"] }));

    const hatches = [];

    const alpha = degToRad(rotation);

    const e = degToRad((rotation + 45) % 90);
    const f = sin(e);
    const g = cos(e);
    const h = sqrt(distance ** 2 / 2);

    const s = roundPrec(max(f, g) * h, 2);

    const addHatch = (i, j) => {
        const a = i * (strength + distance);
        const b = j * (strength + distance);

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

const generateCompartments = ({ x, y, z, wallStrength, compartments, yRelatives, fun }) => {
    console.log(wallStrength)
    const cutouts = [];

    // see ./compartment-algorithm.jpg for visualization of the translation algorithm
    const yCompCount = compartments.length;

    const sum = (accumulator, currentValue) => accumulator + currentValue;
    const yTotalRelativeSize = yRelatives ? yRelatives.reduce(sum) : compartments.length;

    let translateY = -y / 2 - wallStrength;
    for (let xi = 0; xi < yCompCount; xi++) {
        const xCompCount = compartments[xi].length || compartments[xi];
        const xTotalRelativeSize = compartments[xi].length ? compartments[xi].reduce(sum) : compartments[xi];

        const yCurrentRelativeSize = yRelatives ? yRelatives[xi] : 1;
        const compartmentY = (y - wallStrength * (yCompCount - 1)) * (yCurrentRelativeSize / yTotalRelativeSize);
        translateY += compartmentY / 2 + wallStrength;

        let translateX = -x / 2 - wallStrength;
        for (let yi = 0; yi < xCompCount; yi++) {
            const xCurrentRelativeSize = compartments[xi].length ? compartments[xi][yi] : 1;
            const compartmentX = (x - wallStrength * (xCompCount - 1)) * (xCurrentRelativeSize / xTotalRelativeSize);
            translateX += compartmentX / 2 + wallStrength;

            cutouts.push(translate([translateX, translateY, 0], fun({ compartmentX, compartmentY })));
            translateX += compartmentX / 2;
        }
        translateY += compartmentY / 2;
    }
    return cutouts;
};

const generateCompartmentCutouts = ({
    x,
    y,
    z,
    wallStrength,
    compartments,
    yRelatives,
    bevel,
    includeNorthBevel,
    includeSouthBevel,
    includeEastBevel,
    includeWestBevel,
}) => {
    console.log(wallStrength)
    return generateCompartments({
        x,
        y,
        z,
        wallStrength,
        compartments,
        yRelatives,
        fun: ({ compartmentX, compartmentY }) =>
            beveledCube({
                x: compartmentX,
                y: compartmentY,
                z,
                r: bevel,
                include: [
                    includeNorthBevel && "bn",
                    includeSouthBevel && "bs",
                    includeEastBevel && "be",
                    includeWestBevel && "bw",
                    includeNorthBevel && includeEastBevel && "ne",
                    includeNorthBevel && includeWestBevel && "nw",
                    includeSouthBevel && includeEastBevel && "se",
                    includeSouthBevel && includeWestBevel && "sw",
                ],
            }),
    });
};

const generateCompartmentHatch = ({
    x,
    y,
    z,
    wallStrength,
    compartments,
    yRelatives,
    bevel,
    distance,
    strength,
    rotation,
    cutoffPercent,
    maxIterations = 3,
}) => {
    return generateCompartments({
        x,
        y,
        z,
        wallStrength,
        compartments,
        yRelatives,
        fun: ({ compartmentX, compartmentY }) =>
            hatch({
                x: compartmentX,
                y: compartmentY,
                z,
                distance,
                strength,
                bevel,
                rotation,
                cutoffPercent,
                maxIterations,
            }),
    });
};

module.exports = { rotateDeg, generateCompartmentCutouts, generateCompartmentHatch, hatch };
