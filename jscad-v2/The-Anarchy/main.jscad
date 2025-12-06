const jscad = require("@jscad/modeling");
const { subtract, union } = jscad.booleans;
const { cuboid } = jscad.primitives;
const { translate } = jscad.transforms;
const basicBitBox = require("../basicBitBox.jscad").main;

const configs = {
    workers: basicBitBox({
        x: 218,
        y: 62,
        z: 18.5,
        wallStrength: 1.2,
        floorStrength: 0.8,
        innerBevel: 10,
        outerBevel: 2,
        compartments: [[3, 3, 4, 4, 5]],
        includeNorthBevel: false,
        includeSouthBevel: false,
        includeEastBevel: true,
        includeWestBevel: true,
    }),
    token: union(
        basicBitBox({
            x: 218,
            y: 62,
            z: 18.5,
            wallStrength: 1.2,
            floorStrength: 0.8,
            innerBevel: 10,
            outerBevel: 2,
            compartments: [[3, 3, 4, 4, 5]],
            includeNorthBevel: false,
            includeSouthBevel: false,
            includeEastBevel: true,
            includeWestBevel: true,
        }),
        translate(
            [-218 / 2 + (((218 - 6 * 1.2) / 19) * 3) / 2 + 1.2, 0, -(18.5 - 0.8) / 2 + 8 / 2 + 0.8],
            subtract(
                cuboid({
                    size: [((218 - 6 * 1.2) / 19) * 3, 62 - 2 * 1.2, 10],
                }),
                translate([0, 15, 0], cuboid({ size: [((218 - 6 * 1.2) / 19) * 3, 15.5, 10] })),
                translate([0, -15, 0], cuboid({ size: [((218 - 6 * 1.2) / 19) * 3, 15.5, 10] })),
                translate([0, 0, 3], cuboid({ size: [(((218 - 6 * 1.2) / 19) * 3) / 3, 62 - 2 * 1.2, 5] }))
            )
        )
    ),
};

const main = ({ modelName }) => {
    console.log(modelName);
    return configs[modelName];
};

const getParameterDefinitions = () => {
    return [
        {
            name: "modelName",
            type: "choice",
            caption: "Select element",
            values: Object.keys(configs),
            initial: Object.keys(configs)[1],
        },
    ];
};

module.exports = { main, getParameterDefinitions };
