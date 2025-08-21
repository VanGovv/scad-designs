const jscad = require("@jscad/modeling");

const { degToRad } = jscad.utils;
const { translate, rotate, mirrorX } = jscad.transforms;
const { union, subtract } = jscad.booleans;
const { cuboid, cylinder } = jscad.primitives;
const { main: beveledCube } = require("./beveledCube.jscad");
const { main: shearedCube } = require("./shearedCube.jscad");

const { abs, cos, sin, sqrt, round, max, ceil, floor } = Math;
const roundPrec = (number, prec) => round(number * 10 ** prec) / 10 ** prec;

const rotateDeg = ([x, y, z], ...rest) => {
    return rotate([degToRad(x), degToRad(y), degToRad(z)], ...rest);
};

const squareHatch = (config) => {
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

const hexHatch = (config) => {
    const { x, y, z, hexDiameter, strength } = config;

    // * 7/6 due to the reduced size of hexagons compared to circles
    const single = () =>
        rotateDeg([0, 0, 30], cylinder({ radius: ((hexDiameter / 2) * 7) / 6, height: z, segments: 6 }));

    const d = strength + hexDiameter;
    const r = d / 2;
    const verticalOffset = sqrt(d ** 2 - r ** 2);

    const horizontalCount = round(x / d) - 1;
    const verticalCount = round(y / verticalOffset);

    const row = (n) => {
        const res = [];
        for (let i = -n / 2; i <= n / 2; i++) {
            res.push(translate([d * i, 0, 0], single()));
        }
        return union(...res);
    };

    const res = [];
    for (let i = 0; i <= verticalCount; i++) {
        const foo = -verticalCount / 2 + i;
        const newRow = row(horizontalCount + abs(i % 2));
        res.push(translate([0, sqrt(d ** 2 - r ** 2) * foo, 0], newRow));
    }

    return res;
};

const generateCompartments = ({ x, y, z, wallStrength, wallStrengthX, wallStrengthY, compartments, yRelatives, fun }) => {
    wallStrengthX = wallStrengthX || wallStrength;
    wallStrengthY = wallStrengthY || wallStrength;

    const cutouts = [];

    // see ./compartment-algorithm.jpg for visualization of the translation algorithm
    const yCompCount = compartments.length;

    const sum = (accumulator, currentValue) => accumulator + currentValue;
    const yTotalRelativeSize = yRelatives ? yRelatives.reduce(sum) : compartments.length;

    let translateY = -y / 2 - wallStrengthY;
    for (let xi = 0; xi < yCompCount; xi++) {
        const xCompCount = compartments[xi].length || compartments[xi];
        const xTotalRelativeSize = compartments[xi].length ? compartments[xi].reduce(sum) : compartments[xi];

        const yCurrentRelativeSize = yRelatives ? yRelatives[xi] : 1;
        const compartmentY = (y - wallStrengthY * (yCompCount - 1)) * (yCurrentRelativeSize / yTotalRelativeSize);
        translateY += compartmentY / 2 + wallStrengthY;

        let translateX = -x / 2 - wallStrengthX;
        for (let yi = 0; yi < xCompCount; yi++) {
            const xCurrentRelativeSize = compartments[xi].length ? compartments[xi][yi] : 1;
            const compartmentX = (x - wallStrengthX * (xCompCount - 1)) * (xCurrentRelativeSize / xTotalRelativeSize);
            translateX += compartmentX / 2 + wallStrengthX;

            cutouts.push(translate([translateX, translateY, 0], fun({ compartmentX, compartmentY })));
            translateX += compartmentX / 2;
        }
        translateY += compartmentY / 2;
    }
    return cutouts;
};

const generateShearedCompartmentCutouts = ({
    x,
    y,
    z,
    wallStrength,
    wallStrengthX,
    wallStrengthY,
    compartments,
    yRelatives,
    bevel,
    includeFloorBevel,
    includeNorthBevel,
    includeSouthBevel,
    includeEastBevel,
    includeWestBevel,
    shearHeight,
    shearFullSizeX,
    shearFullSizeY,
    shearFloorSizeX,
    shearFloorSizeY,
    shearTopSizeX,
    shearTopSizeY,
}) => {
    console.log(z, shearHeight)
    return generateCompartments({
        x,
        y,
        z,
        wallStrength,
        wallStrengthX,
        wallStrengthY,
        compartments,
        yRelatives,
        fun: ({ compartmentX, compartmentY }) =>
            translate([0, 0, ((shearHeight || z) - z)/2], shearedCube({
                x: compartmentX,
                y: compartmentY,
                z: shearHeight || z,
                r: bevel,
                include: [
                    includeFloorBevel && includeNorthBevel && "bn",
                    includeFloorBevel && includeSouthBevel && "bs",
                    includeFloorBevel && includeEastBevel && "be",
                    includeFloorBevel && includeWestBevel && "bw",
                    includeNorthBevel && includeEastBevel && "ne",
                    includeNorthBevel && includeWestBevel && "nw",
                    includeSouthBevel && includeEastBevel && "se",
                    includeSouthBevel && includeWestBevel && "sw",
                ],
                fullSizeX: shearFullSizeX,
                fullSizeY: shearFullSizeY,
                floorSizeX: shearFloorSizeX,
                floorSizeY: shearFloorSizeY,
                topSizeX: shearTopSizeX,
                topSizeY: shearTopSizeY,
           })),
    });
};

const generateBeveledCompartmentCutouts = ({
    x,
    y,
    z,
    wallStrength,
    compartments,
    yRelatives,
    bevel,
    includeFloorBevel,
    includeNorthBevel,
    includeSouthBevel,
    includeEastBevel,
    includeWestBevel,
}) => {
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
                    includeFloorBevel && includeNorthBevel && "bn",
                    includeFloorBevel && includeSouthBevel && "bs",
                    includeFloorBevel && includeEastBevel && "be",
                    includeFloorBevel && includeWestBevel && "bw",
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
            rectHatch({
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

module.exports = { rotateDeg, generateShearedCompartmentCutouts, generateBeveledCompartmentCutouts, generateCompartmentHatch, squareHatch, hexHatch };
