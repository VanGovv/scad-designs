const jscad = require("@jscad/modeling");
const { union } = require("@jscad/modeling/src/operations/booleans");

const beveledCube = require("./beveledCube.jscad").main;

const { cylinder } = jscad.primitives;
const { translate } = jscad.transforms;
const { subtract } = jscad.booleans;

const getParameterDefinitions = () => {
    return [
        { name: "x", type: "float", initial: 90, caption: "X" },
        { name: "y", type: "float", initial: 60, caption: "Y" },
        { name: "z", type: "float", initial: 15, caption: "Z" },
        { name: "wallStrength", type: "float", initial: 1.2, caption: "Wall size" },
        { name: "floorStrength", type: "float", initial: 1.2, caption: "Floor strength" },
        { name: "innerBevel", type: "float", initial: 5, caption: "Inner Bevel" },
        { name: "outerBevel", type: "float", initial: 0, caption: "Outer Bevel" },
        { name: "compartments", type: "text", initial: "[1, 1]", size: 20, caption: "Compartments:" },
        { name: "yRelatives", type: "text", initial: "", size: 20, caption: "Relational size of x compartments:" },

        // advanced bevel settings
        { name: "bevel", type: "group", initial: "closed", caption: "Advanced bevel settings" },
        { name: "includeNorthBevel", type: "checkbox", checked: true, caption: "Include northern bevel" },
        { name: "includeSouthBevel", type: "checkbox", checked: true, caption: "Include southern bevel" },
        { name: "includeEastBevel", type: "checkbox", checked: true, caption: "Include eastern bevel" },
        { name: "includeWestBevel", type: "checkbox", checked: true, caption: "Include western bevel" },

        //magnet settings
        { name: "magnetGroup", type: "group", initial: "closed", caption: "Magnet settings" },
        { name: "magnetDiameter", type: "float", initial: 4, caption: "Magnet diameter" },
        { name: "magnetHeight", type: "float", initial: 2, caption: "Magnet height" },
        { name: "magnetWallStrength", type: "float", initial: 0.8, caption: "Magnet height" },
        { name: "includeTopMagnets", type: "checkbox", checked: true, caption: "Include top magnets" },
        { name: "includeFloorMagnets", type: "checkbox", checked: false, caption: "Include floor magnets" },
    ];
};

const main = (params) => {
    return basicBitBox(params);
};

module.exports = { main, getParameterDefinitions };

const basicBitBox = ({
    x = 90,
    y = 60,
    z = 30,
    wallStrength = 1.2,
    floorStrength = 1.2,
    innerBevel = 5,
    outerBevel = 0,
    compartments: compartmentJson = [1],
    yRelatives: yRelativesJson,
    includeNorthBevel = true,
    includeSouthBevel = true,
    includeEastBevel = true,
    includeWestBevel = true,
    magnetDiameter,
    magnetHeight,
    magnetWallStrength = .8,
    includeTopMagnets = false,
    includeFloorMagnets = false,
}) => {
    // parse compartment json representation
    const compartments = typeof compartmentJson === "string" ? JSON.parse(compartmentJson) : compartmentJson;
    const yRelatives = typeof yRelativesJson === "string" ? JSON.parse(yRelativesJson) : yRelativesJson;

    const outerBox = beveledCube({ x: x, y: y, z: z, r: outerBevel, exclude: ["t"] });

    const cutouts = [];

    // see ./compartment-algorithm.jpg for visualization of the translation algorithm
    const sum = (accumulator, currentValue) => accumulator + currentValue;
    const yCompCount = compartments.length;
    const yTotalRelativeSize = yRelatives ? yRelatives.reduce(sum) : compartments.length;

    let translateY = -y / 2;
    for (let xi = 0; xi < yCompCount; xi++) {
        const xCompCount = compartments[xi].length || compartments[xi];
        const xTotalRelativeSize = compartments[xi].length ? compartments[xi].reduce(sum) : compartments[xi];

        const yCurrentRelativeSize = yRelatives ? yRelatives[xi] : 1;
        const ySize = (y - wallStrength * (1 + yCompCount)) * (yCurrentRelativeSize / yTotalRelativeSize);
        translateY += ySize / 2 + wallStrength;

        let translateX = -x / 2;
        for (let yi = 0; yi < xCompCount; yi++) {
            const xCurrentRelativeSize = compartments[xi].length ? compartments[xi][yi] : 1;
            const xSize = (x - wallStrength * (1 + xCompCount)) * (xCurrentRelativeSize / xTotalRelativeSize);
            translateX += xSize / 2 + wallStrength;

            cutouts.push(
                translate(
                    [translateX, translateY, floorStrength / 2],
                    beveledCube({
                        x: xSize,
                        y: ySize,
                        z: z - floorStrength,
                        r: innerBevel,
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
                    })
                )
            );
            translateX += xSize / 2;
        }
        translateY += ySize / 2;
    }

    const holder = subtract(outerBox, ...cutouts);

    const magnetCutouts = [];
    const magnetColumns = [];

    if (magnetDiameter && magnetHeight && (includeFloorMagnets || includeTopMagnets)) {
        const magnetCutout = cylinder({ radius: magnetDiameter / 2, height: magnetHeight });
        const offset = (magnetDiameter + magnetWallStrength * 2) / 2;
        const zOffset = z / 2 - magnetHeight / 2;

        if (includeTopMagnets) {
            magnetCutouts.push(translate([x / 2 - offset, y / 2 - offset, zOffset], magnetCutout));
            magnetCutouts.push(translate([-x / 2 + offset, y / 2 - offset, zOffset], magnetCutout));
            magnetCutouts.push(translate([x / 2 - offset, -y / 2 + offset, zOffset], magnetCutout));
            magnetCutouts.push(translate([-x / 2 + offset, -y / 2 + offset, zOffset], magnetCutout));
        }
        if (includeFloorMagnets) {
            magnetCutouts.push(translate([x / 2 - offset, y / 2 - offset, -zOffset], magnetCutout));
            magnetCutouts.push(translate([-x / 2 + offset, y / 2 - offset, -zOffset], magnetCutout));
            magnetCutouts.push(translate([x / 2 - offset, -y / 2 + offset, -zOffset], magnetCutout));
            magnetCutouts.push(translate([-x / 2 + offset, -y / 2 + offset, -zOffset], magnetCutout));
        }
        const columnSize = magnetDiameter + magnetWallStrength * 2;

        const magnetColumn = (include) =>
            beveledCube({
                x: columnSize,
                y: columnSize,
                z,
                r: magnetDiameter / 2 + magnetWallStrength,
                include,
            });

        magnetColumns.push(translate([x / 2 - offset, y / 2 - offset, 0], magnetColumn("nw")));
        magnetColumns.push(translate([x / 2 - offset, -y / 2 + offset, 0], magnetColumn("ne")));
        magnetColumns.push(translate([-x / 2 + offset, y / 2 - offset, 0], magnetColumn("sw")));
        magnetColumns.push(translate([-x / 2 + offset, -y / 2 + offset, 0], magnetColumn("se")));
    }

    return subtract(union(holder, magnetColumns), ...magnetCutouts);
};
