const jscad = require("@jscad/modeling");

const beveledCube = require("./beveledCube.jscad").main;
const { rotateDeg } = require("./utils.jscad");

const { cylinder } = jscad.primitives;
const { translate } = jscad.transforms;
const { subtract, union } = jscad.booleans;

const getParameterDefinitions = () => {
    return [
        // { name: "x", type: "float", initial: 90, caption: "X" },
        // { name: "y", type: "float", initial: 60, caption: "Y" },
        // { name: "z", type: "float", initial: 15, caption: "Z" },
        // { name: "wallStrength", type: "float", initial: 1.2, caption: "Wall size" },
        // { name: "innerWallStrength", type: "float", initial: 1.2, caption: "Inner wall size" },
        // { name: "floorStrength", type: "float", initial: 1.2, caption: "Floor strength" },
        // { name: "innerBevel", type: "float", initial: 5, caption: "Inner Bevel" },
        // { name: "outerBevel", type: "float", initial: 0, caption: "Outer Bevel" },
        // { name: "compartments", type: "text", initial: "[1, 1]", size: 20, caption: "Compartments:" },
        // { name: "yRelatives", type: "text", initial: "", size: 20, caption: "Relational size of x compartments:" },
        // // advanced bevel settings
        // { name: "bevel", type: "group", initial: "closed", caption: "Advanced bevel settings" },
        // { name: "includeFloorBevel", type: "checkbox", checked: true, caption: "Include floor bevel" },
        // { name: "includeNorthBevel", type: "checkbox", checked: true, caption: "Include northern bevel" },
        // { name: "includeSouthBevel", type: "checkbox", checked: true, caption: "Include southern bevel" },
        // { name: "includeEastBevel", type: "checkbox", checked: true, caption: "Include eastern bevel" },
        // { name: "includeWestBevel", type: "checkbox", checked: true, caption: "Include western bevel" },
        // // advanced shear settings
        // { name: "shear", type: "group", initial: "closed", caption: "Advanced shear settings" },
        // { name: "shearHeight", type: "float", caption: "Shear height" },
        // { name: "shearFullSizeX", type: "float", caption: "Shear full size X" },
        // { name: "shearFullSizeY", type: "float", caption: "Shear full size Y" },
        // { name: "shearFloorSizeX", type: "float", caption: "Shear floor size X" },
        // { name: "shearFloorSizeY", type: "float", caption: "Shear floor size Y" },
        // { name: "shearTopSizeX", type: "float", caption: "Shear top size X" },
        // { name: "shearTopSizeY", type: "float", caption: "Shear top size Y" },
        // //magnet settings
        // { name: "magnetGroup", type: "group", initial: "closed", caption: "Magnet settings" },
        // { name: "magnetDiameter", type: "float", initial: 4, caption: "Magnet diameter" },
        // { name: "magnetHeight", type: "float", initial: 2, caption: "Magnet height" },
        // { name: "magnetInset", type: "float", initial: 0, caption: "Magnet inset" },
        // { name: "magnetWallStrength", type: "float", initial: 0.8, caption: "Magnet height" },
        // { name: "includeTopMagnets", type: "checkbox", checked: true, caption: "Include top magnets" },
        // { name: "includeFloorMagnets", type: "checkbox", checked: false, caption: "Include floor magnets" },
    ];
};

const main = (params) => {
    return diceHolder(params);
};

const diceHolder = ({
    dieSide = 16,
    rowCount = 5,
    dicePerRow = 10,
    rowDistance = -.8,
    wallStrength = 1.2,
    floorStrength = 1.2,
    magnetDiameter = 0,
    magnetHeight = 4.1,
    magnetWallClearance = 0.8,
    innerBevel = 1,
    outerBevel = magnetDiameter / 2 + magnetWallClearance,
}) => {
    const dieDiag = Math.sqrt(2 * dieSide ** 2);
    const x = (rowCount + .5) * dieDiag + (rowCount - 1) * rowDistance + (magnetDiameter + magnetWallClearance * 2) * 2;
    const y = dicePerRow * dieSide + 2 * wallStrength;
    const z = dieDiag / 2 + floorStrength;

    console.log(innerBevel);

    const body = beveledCube({ size: [x, y, z], r: outerBevel, exclude: ["t", "b"] });

    const rowCutout = rotateDeg(
        [0, 45, 0],
        beveledCube({ size: [dieSide, dicePerRow * dieSide, dieSide], r: innerBevel, include: ["bs", "tn"] })
    );

    const topRowCutout = translate([(-(dieDiag + rowDistance) * (rowCount - .5)) / 2, 0, z / 2], rowCutout);
    const bottomRowCutout = translate([(-(dieDiag + rowDistance) * (rowCount - 1.5)) / 2, 0, -z / 2], rowCutout);

    const cutouts = [];

    for (let i = 0; i < rowCount; i++) {
        cutouts.push(translate([i * (dieDiag + rowDistance), 0, 0], topRowCutout));
        cutouts.push(translate([i * (dieDiag + rowDistance), 0, 0], bottomRowCutout));
    }

    return subtract(body, cutouts);
};

module.exports = { main, getParameterDefinitions, diceHolder };
