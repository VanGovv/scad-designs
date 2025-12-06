const basicBitBox = require("../basicBitBox.jscad").main;
const basicCardHolder = require("../basicCardHolder3.jscad").main;

const jscad = require("@jscad/modeling");
const { translate } = jscad.transforms;
const { subtract, union } = jscad.booleans;
const { cylinder } = jscad.primitives;
const { beveledCube } = require("../beveledCube.jscad");
const { generateCompartments, generateCompartmentHexHatch, rotateDeg } = require("../utils.jscad");
const { hull } = jscad.hulls;

const configs = {
    token: basicBitBox({
        x: 142,
        y: 154,
        z: 19,
        wallStrength: 1.6,
        floorStrength: 1.2,
        innerBevel: 16,
        outerBevel: 2,
        compartments: [1, 2],
        includeNorthBevel: true,
        includeSouthBevel: true,
        includeEastBevel: true,
        includeWestBevel: true,
        includeTopMagnets: true,
        includeFloorMagnets: true,
        magnetDiameter: 4.2,
        magnetHeight: 2.2,
        magnetWallStrength: 1.2,
        magnetInset: 0.48,
    }),
    token2: basicBitBox({
        x: 142,
        y: 154,
        z: 19,
        wallStrength: 1.6,
        floorStrength: 1.2,
        innerBevel: 16,
        outerBevel: 2,
        compartments: [2, [3, 1]],
        yRelatives: [2, 3],
        includeNorthBevel: true,
        includeSouthBevel: true,
        includeEastBevel: true,
        includeWestBevel: true,
        includeTopMagnets: true,
        includeFloorMagnets: true,
        magnetDiameter: 4.2,
        magnetHeight: 2.2,
        magnetWallStrength: 1.2,
        magnetInset: 0.48,
    }),
    tokenCover: basicBitBox({
        x: 142,
        y: 154,
        z: 3,
        wallStrength: 1.6,
        floorStrength: 3,
        innerBevel: 16,
        outerBevel: 2,
        includeNorthBevel: true,
        includeSouthBevel: true,
        includeEastBevel: true,
        includeWestBevel: true,
        includeFloorMagnets: true,
        magnetDiameter: 4.2,
        magnetHeight: 2.2,
        magnetWallStrength: 1.2,
        magnetInset: 0.4,
    }),
    player: ((config) => {
        return subtract(
            basicBitBox(config),
            translate(
                [config.x / 2 - 0.5, 13, config.z / 2],
                rotateDeg([0, 90, 0], cylinder({ radius: 6, height: 1 }))
            ),
            translate(
                [-config.x / 2 + 0.5, 13, config.z / 2],
                rotateDeg([0, 90, 0], cylinder({ radius: 6, height: 1 }))
            )
        );
    })({
        x: 80,
        y: 110,
        z: 20,
        wallStrength: 1.6,
        floorStrength: 0.8,
        innerBevel: 14,
        outerBevel: 2,
        compartments: [2, 1],
        yRelatives: [5, 3],
        includeNorthBevel: true,
        includeSouthBevel: true,
        includeEastBevel: true,
        includeWestBevel: true,
        includeTopMagnets: true,
        magnetDiameter: 3.4,
        magnetHeight: 2.2,
        magnetWallStrength: 1.2,
        magnetInset: 0.48,
    }),
    playerCover: playerCover({
        x: 80,
        y: 110,
        z: 3.6,
        wallStrength: 1.6,
        floorStrength: 1.2,
        innerBevel: 14,
        outerBevel: 2,
        compartments: [2, 1],
        yRelatives: [5, 3],
        includeNorthBevel: true,
        includeSouthBevel: true,
        includeEastBevel: true,
        includeWestBevel: true,
        includeFloorBevel: false,
        includeTopMagnets: true,
        magnetDiameter: 3.4,
        magnetHeight: 2.2,
        magnetWallStrength: 1.2,
        magnetInset: 0.48,
    }),
    cardHolder: basicCardHolder({
        cardHeight: 94,
        cardWidth: 63,
        holderHeight: 51.3, // 52.5
        wallStrength: 1.2,
        floorStrength: 1.2,
        stackCount: 3,
        part: "holder",
    }),
    cardHolderCover: basicCardHolder({
        cardHeight: 94,
        cardWidth: 63,
        holderHeight: 51.3, // 52.5
        wallStrength: 1.2,
        floorStrength: 1.2,
        stackCount: 2,
        part: "cover",
    }),
};

const main = ({ modelName }) => {
    return configs[modelName];
};

const getParameterDefinitions = () => {
    return [
        {
            name: "modelName",
            type: "choice",
            caption: "Select element",
            values: Object.keys(configs),
            initial: "player",
        },
    ];
};

function playerCover(config) {
    const height = 2.5;
    const width = 2;
    const clearance = 0.1;
    const shear = 0.1 + clearance;

    const { x, y, z, wallStrength, floorStrength, innerBevel, compartments, yRelatives } = config;

    const base = basicBitBox(config);

    // const base2 = translate(
    //     [0, 0, floorStrength / 2 + height / 2],
    //     generateCompartments({
    //         x: x - wallStrength * 2,
    //         y: y - wallStrength * 2,
    //         z,
    //         wallStrength,
    //         compartments,
    //         yRelatives,
    //         fun: ({ compartmentX, compartmentY }) =>
    //             subtract(
    //                 hull(
    //                     translate(
    //                         [0, 0, -height / 2],
    //                         beveledCube({
    //                             x: compartmentX - clearance,
    //                             y: compartmentY - clearance,
    //                             z: 0.1,
    //                             r: innerBevel,
    //                             exclude: ["t", "b"],
    //                         })
    //                     ),
    //                     translate(
    //                         [0, 0, height / 2 - 0.1],
    //                         beveledCube({
    //                             x: compartmentX - shear * 2,
    //                             y: compartmentY - shear * 2,
    //                             z: 0.1,
    //                             r: innerBevel,
    //                             exclude: ["t", "b"],
    //                         })
    //                     )
    //                 ),
    //                 beveledCube({
    //                     x: compartmentX - width * 2,
    //                     y: compartmentY - width * 2,
    //                     z: height,
    //                     r: innerBevel,
    //                     exclude: ["t", "b"],
    //                 })
    //             ),
    //     })
    // );
    const hatch = translate(
        [0, 0, 0],
        generateCompartmentHexHatch({
            x: x - wallStrength * 2,
            y: y - wallStrength * 2,
            z,
            wallStrength: wallStrength,
            compartments,
            yRelatives,
            bevel: innerBevel,
            hexDiameter: 6,
            strength: 2,
            negative: true,
        })
    );

    return subtract(union(base), hatch);
}

module.exports = { main, getParameterDefinitions };
