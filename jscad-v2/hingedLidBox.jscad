const jscad = require("@jscad/modeling");

const beveledCube = require("./beveledCube.jscad").main;
const { generateShearedCompartmentCutouts } = require("./utils.jscad");

const { cylinder } = jscad.primitives;
const { translate } = jscad.transforms;
const { subtract, union } = jscad.booleans;

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
        { name: "includeFloorBevel", type: "checkbox", checked: true, caption: "Include floor bevel" },
        { name: "includeNorthBevel", type: "checkbox", checked: true, caption: "Include northern bevel" },
        { name: "includeSouthBevel", type: "checkbox", checked: true, caption: "Include southern bevel" },
        { name: "includeEastBevel", type: "checkbox", checked: true, caption: "Include eastern bevel" },
        { name: "includeWestBevel", type: "checkbox", checked: true, caption: "Include western bevel" },

        // advanced shear settings
        { name: "shear", type: "group", initial: "closed", caption: "Advanced shear settings" },
        { name: "shearHeight", type: "float", caption: "Shear height" },
        { name: "shearFullSizeX", type: "float", caption: "Shear full size X" },
        { name: "shearFullSizeY", type: "float", caption: "Shear full size Y" },
        { name: "shearFloorSizeX", type: "float", caption: "Shear floor size X" },
        { name: "shearFloorSizeY", type: "float", caption: "Shear floor size Y" },
        { name: "shearTopSizeX", type: "float", caption: "Shear top size X" },
        { name: "shearTopSizeY", type: "float", caption: "Shear top size Y" },

        //magnet settings
        { name: "magnetGroup", type: "group", initial: "closed", caption: "Magnet settings" },
        { name: "magnetDiameter", type: "float", initial: 4, caption: "Magnet diameter" },
        { name: "magnetHeight", type: "float", initial: 2, caption: "Magnet height" },
        { name: "magnetInset", type: "float", initial: 0, caption: "Magnet inset" },
        { name: "magnetWallStrength", type: "float", initial: 0.8, caption: "Magnet height" },
        { name: "includeTopMagnets", type: "checkbox", checked: true, caption: "Include top magnets" },
        { name: "includeFloorMagnets", type: "checkbox", checked: false, caption: "Include floor magnets" },

        //hinge settings
        { name: "hingeGroup", type: "group", initial: "closed", caption: "Hinge settings" },
        { name: "hingeDiameter", type: "float", initial: 4, caption: "Hinge diameter" },
        { name: "hingeWallStrength", type: "float", initial: 4, caption: "Hinge wall strength" },
    ];
};

const main = (params) => {
    return basicBitBox(params);
};

module.exports = { main, getParameterDefinitions };

const hingedLidBox = ({
    x = 90,
    y = 60,
    z = 30,
    wallStrength = 1.2,
    wallStrengthX,
    wallStrengthY,
    floorStrength = 1.2,
    innerBevel = 5,
    outerBevel = 0,
    compartments: compartmentJson = [1],
    yRelatives: yRelativesJson,
    includeFloorBevel = true,
    includeNorthBevel = true,
    includeSouthBevel = true,
    includeEastBevel = true,
    includeWestBevel = true,
    shearHeight,
    shearFullSizeX,
    shearFullSizeY,
    shearFloorSizeX,
    shearFloorSizeY,
    shearTopSizeX,
    shearTopSizeY,
    magnetDiameter,
    magnetHeight,
    magnetInset = 0,
    magnetWallStrength = 0.8,
    includeTopMagnets = false,
    includeFloorMagnets = false,
    includeMagnets = [],
}) => {
    // parse compartment json representation
    const compartments =
        typeof compartmentJson === "string" && compartmentJson !== "" ? JSON.parse(compartmentJson) : compartmentJson;
    const yRelatives =
        typeof yRelativesJson === "string" && yRelativesJson !== "" ? JSON.parse(yRelativesJson) : yRelativesJson;

    if (!includeMagnets) includeMagnets = [];

    const outerBox = beveledCube({ x, y, z, r: outerBevel, exclude: ["t"], getBevels: true });

    const cutouts = translate(
        [0, 0, floorStrength / 2],
        generateShearedCompartmentCutouts({
            x: x - 2 * (wallStrengthX || wallStrength),
            y: y - 2 * (wallStrengthY || wallStrength),
            z: z - floorStrength,
            wallStrength,
            wallStrengthX: wallStrengthX || wallStrength,
            wallStrengthY: wallStrengthY || wallStrength,
            compartments,
            yRelatives,
            bevel: innerBevel,
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
        })
    );

    const holder = subtract(outerBox.c, cutouts);

    const magnetCutouts = [];
    const magnetColumns = [];

    if (includeTopMagnets) {
        includeMagnets.push("TNE", "TNW", "TSE", "TSW");
    }
    if (includeFloorMagnets) {
        includeMagnets.push("FNE", "FNW", "FSE", "FSW");
    }

    if (magnetDiameter && magnetHeight && includeMagnets.length > 0) {
        const magnetCutout = cylinder({ radius: magnetDiameter / 2, height: magnetHeight });
        const offset = (magnetDiameter + magnetWallStrength * 2) / 2;
        const zOffset = z / 2 - magnetHeight / 2 - magnetInset;

        if (includeMagnets.includes("TNE"))
            magnetCutouts.push(translate([x / 2 - offset, y / 2 - offset, zOffset], magnetCutout));
        if (includeMagnets.includes("TSE"))
            magnetCutouts.push(translate([-x / 2 + offset, y / 2 - offset, zOffset], magnetCutout));
        if (includeMagnets.includes("TNW"))
            magnetCutouts.push(translate([x / 2 - offset, -y / 2 + offset, zOffset], magnetCutout));
        if (includeMagnets.includes("TSW"))
            magnetCutouts.push(translate([-x / 2 + offset, -y / 2 + offset, zOffset], magnetCutout));
        if (includeMagnets.includes("FNE"))
            magnetCutouts.push(translate([x / 2 - offset, y / 2 - offset, -zOffset], magnetCutout));
        if (includeMagnets.includes("FSE"))
            magnetCutouts.push(translate([-x / 2 + offset, y / 2 - offset, -zOffset], magnetCutout));
        if (includeMagnets.includes("FNW"))
            magnetCutouts.push(translate([x / 2 - offset, -y / 2 + offset, -zOffset], magnetCutout));
        if (includeMagnets.includes("FSW"))
            magnetCutouts.push(translate([-x / 2 + offset, -y / 2 + offset, -zOffset], magnetCutout));

        const columnSize = magnetDiameter + magnetWallStrength * 2;

        const magnetColumn = (include) =>
            beveledCube({
                x: columnSize,
                y: columnSize,
                z,
                r: magnetDiameter / 2 + magnetWallStrength,
                include,
            });

        if (includeMagnets.includes("TNE") || includeMagnets.includes("FNE"))
            magnetColumns.push(translate([x / 2 - offset, y / 2 - offset, 0], magnetColumn("nw")));
        if (includeMagnets.includes("TSE") || includeMagnets.includes("FSE"))
            magnetColumns.push(translate([-x / 2 + offset, y / 2 - offset, 0], magnetColumn("sw")));
        if (includeMagnets.includes("TNW") || includeMagnets.includes("FNW"))
            magnetColumns.push(translate([x / 2 - offset, -y / 2 + offset, 0], magnetColumn("ne")));
        if (includeMagnets.includes("TSW") || includeMagnets.includes("FSW"))
            magnetColumns.push(translate([-x / 2 + offset, -y / 2 + offset, 0], magnetColumn("se")));
    }

    return subtract(union(holder, magnetColumns), ...magnetCutouts, outerBox.bevels);
};
