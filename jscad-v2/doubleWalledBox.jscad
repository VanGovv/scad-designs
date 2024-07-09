const jscad = require("@jscad/modeling");

const { union } = require("@jscad/modeling/src/operations/booleans");
const { cuboid } = jscad.primitives;
const { translate } = jscad.transforms;
const { subtract } = jscad.booleans;

const beveledCube = require("./beveledCube.jscad").main;
const hatch = require("./hatch.jscad").main;

const getParameterDefinitions = () => {
    return [
        {
            name: "modelName",
            type: "text",
            initial: "doubleWalledBox",
            disabled: true,
            hidden: true,
            caption: "Box with lid",
        },
        {
            name: "part",
            type: "choice",
            caption: "Top or Bottom",
            values: ["bottom", "top"],
            initial: "bottom",
        },
        { name: "x", type: "float", initial: 80, caption: "Width" },
        { name: "y", type: "float", initial: 60, caption: "Depth" },
        { name: "z", type: "float", initial: 50, caption: "Height" },
        { name: "splitHeightP", type: "float", initial: 50, caption: "% height for split of top and bottom" },
        { name: "slideP", type: "float", initial: 25, caption: "Slide height %" },
        { name: "innerWallStrength", type: "float", initial: 0.8, caption: "Inner wall strength" },
        { name: "outerWallStrength", type: "float", initial: 0.8, caption: "Outer wall strength" },
        { name: "floorStrength", type: "float", initial: 0.8, caption: "Floor strength" },
        { name: "innerBevelRadius", type: "float", initial: 1, caption: "Inner bevel radius" },
        { name: "outerBevelRadius", type: "float", initial: 1, caption: "Outer bevel radius" },
        { name: "clearance", type: "float", initial: 0.1, caption: "Clearance for sliding" },
        { name: "includeWalls", type: "checkbox", checked: true, caption: "Include walls in provided sizes" },
        { name: "includeHatch", type: "checkbox", checked: false, caption: "Include hatch" },

        { name: "hatchSettings", type: "group", initial: "closed", caption: "Hatch settings" },
        { name: "hatchClearance", type: "float", initial: 5, caption: "Hatch clearance" },
        { name: "hatchStrength", type: "float", initial: 4, caption: "Hatch strength" },
        { name: "hatchDistance", type: "float", initial: 8, caption: "Hatch distance" },
        { name: "hatchCornerBevel", type: "float", initial: 1, caption: "Hatch corner bevel" },
        { name: "hatchRotation", type: "float", initial: 45, caption: "Hatch rotation" },
        { name: "hatchCutoffPercent", type: "float", initial: 50, caption: "Hatch cutoff percent" },
        { name: "hatchMaxIterations", type: "float", initial: 4, caption: "Hatch max iterations" },
    ];
};

const main = (params) => {
    return doubleWalledBox(params);
};

const getModelName = () => "doubleWalledBox";

module.exports = { main, getParameterDefinitions, getModelName };

const doubleWalledBox = (config) => {
    const {
        x: preX,
        y: preY,
        z: preZ,
        innerWallStrength,
        outerWallStrength,
        floorStrength,
        innerBevelRadius = 0,
        outerBevelRadius = 0,
        splitHeightP,
        slideP,
        clearance,
        includeWalls = false,
        part = "bottom",
        includeHatch = false,
        hatchClearance,
        hatchStrength,
        hatchDistance,
        hatchCornerBevel,
        hatchRotation,
        hatchCutoffPercent,
        hatchMaxIterations,
    } = config;

    const x = includeWalls ? preX : preX + (outerWallStrength + innerWallStrength + clearance) * 2;
    const y = includeWalls ? preY : preY + (outerWallStrength + innerWallStrength + clearance) * 2;
    const z = includeWalls ? preZ : preZ + 2 * floorStrength;

    const splitHeightFrac = splitHeightP / 100;
    const slidefrac = slideP / 100;

    const outerWallBody = beveledCube({
        x,
        y,
        z,
        r: outerBevelRadius,
    });

    const innerWallBody = translate(
        [0, 0, floorStrength],
        beveledCube({
            x: x - 2 * outerWallStrength - clearance,
            y: y - 2 * outerWallStrength - clearance,
            z,
            r: outerBevelRadius,
            exclude: ["t"],
        })
    );

    const outerWall = subtract(outerWallBody, innerWallBody);

    const innerWallCutout = translate(
        [0, 0, floorStrength],
        beveledCube({
            x: x - 2 * (outerWallStrength + innerWallStrength),
            y: y - 2 * (outerWallStrength + innerWallStrength),
            z,
            r: innerBevelRadius,
            exclude: ["t"],
        })
    );

    const innerWall = subtract(innerWallBody, innerWallCutout);

    const outerWallCutoffHeight = part === "bottom" ? z * splitHeightFrac : z * (1 - splitHeightFrac);

    const outerWallFinal = subtract(outerWall, translate([0, 0, outerWallCutoffHeight], cuboid({ size: [x, y, z] })));

    const innerWallCutoffHeight =
        part === "bottom" ? z * (splitHeightFrac + slidefrac) : z * (1 - splitHeightFrac - slidefrac);

    const innerWallFinal = subtract(
        innerWall,
        translate(
            [0, 0, innerWallCutoffHeight],
            beveledCube({
                x: x - 2 * outerWallStrength + clearance,
                y: y - 2 * outerWallStrength + clearance,
                z: z,
                r: outerBevelRadius,
                exclude: ["b", "t"],
            })
        )
    );
    

    if (includeHatch) {
        const hatchCutout = 
            hatch({
                x: x - 2 * innerWallStrength - 2 * outerWallStrength - 2 * hatchClearance,
                y: y - 2 * innerWallStrength - 2 * outerWallStrength - 2 * hatchClearance,
                z,
                distance: hatchDistance,
                strength: hatchStrength,
                cornerBevel: hatchCornerBevel,
                rotation: hatchRotation,
                cutoffPercent: hatchCutoffPercent,
                maxIterations: hatchMaxIterations,
            })
        
        return subtract(union(outerWallFinal, innerWallFinal), hatchCutout);
    }

    return union(outerWallFinal, innerWallFinal);
};
