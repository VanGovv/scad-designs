const jscad = require("@jscad/modeling");
const { degToRad } = jscad.utils;
const { cuboid, cylinder } = jscad.primitives;
const { translate, rotate } = jscad.transforms;
const { subtract, union } = jscad.booleans;

const { fingerCutout, rotateDeg, generateCompartmentHexHatch } = require("../utils.jscad");
const { beveledCube } = require("../beveledCube.jscad");
const { boxAndCover } = require("../basicBitBox.jscad");
const { basicCardHolderWithCompartments } = require("../basicCardHolder2.jscad");

const configs = {
    ...boxAndCover("resources", {
        x: 155,
        y: 64.5,
        z: 20,
        wallStrength: 0.8,
        innerWallStrength: 1.2,
        floorStrength: 0.8,
        innerBevel: 12,
        outerBevel: 1.6,
        compartments: [[2, 2, 1]],
    }),
    ...boxAndCover("player", {
        x: 120,
        y: 49.6,
        z: 21.8,
        wallStrength: 0.8,
        innerWallStrength: 1.2,
        floorStrength: 0.8,
        innerBevel: 12,
        outerBevel: 1.6,
        compartments: [[2, 3]],
    }),
    cards: basicCardHolderWithCompartments({
        cardHeight: 70,
        cardWidth: 48.4,
        holderDepth: 44,
        cardClearance: 0,
        wallStrength: 1.2,
        floorStrength: 1.2,
        compartments: [[5.6, 10, 22], 2],
    }),
    ...(({
        x = 50.5 + 4 * 0.8, // 155 max, 50.5 min,
        y = 78.5,
        z = 13, // 27.6
        totalZ = 27.6,
        coverStrength = 1.2,
        wallStrength = 0.8,
        floorStrength = 0.8,
        clearance = 0.1,
        outerBevel = 1.6,
        distance = 6.5,
    } = {}) => {
        const baseSize = { x: x - 2 * wallStrength, y: y - 2 * wallStrength, z };

        const base = translate(
            [0, 0, -z / 2],
            beveledCube({
                ...baseSize,
                r: outerBevel,
                exclude: ["t", "n"],
            }),
        );

        const trainingGroundsBase = translate(
            [0, 0, -(25.5 + floorStrength) / 2],
            beveledCube({
                size: [55.5 + 2 * wallStrength, y - 2 * wallStrength, 25.5 + floorStrength],
                r: outerBevel,
                exclude: ["t", "s"],
            }),
        );

        const trainingGrounds = translate(
            [0, 0, -18 / 2],
            beveledCube({
                size: [55.5, 74.5, 18],
                r: 0.8,
                exclude: ["t", "b"],
            }),
        );

        const trainingGroundsHolder = translate(
            [-x / 2 - 55.5 / 2, 0, 25.5 + floorStrength - z],
            subtract(
                trainingGroundsBase,
                trainingGrounds,
                translate(
                    [-55.5 / 2 - wallStrength, 0, -(25.5 + floorStrength) / 2],
                    cylinder({ radius: 12, height: 25.5 + floorStrength }),
                ),
                translate([-55.5 / 2 - wallStrength / 2, 0, -12], fingerCutout(48, wallStrength)),
            ),
        );

        const cutouts = [];

        const cutout = ([x, y, z]) =>
            translate(
                [0, -baseSize.y / 2 + y / 2 + wallStrength, (totalZ - z - floorStrength - coverStrength)/2 + .5],
                beveledCube({
                    size: [x, y, z],
                    r: 0.2,
                    exclude: ["t", "b"],
                }),
            );

        //ascendTiles
        cutouts.push(cutout([50.5, 14, 25.5]));

        //wares 1
        cutouts.push(
            translate(
                [
                    baseSize.x / 2 - wallStrength - 20.5 / 2 - (baseSize.x - wallStrength * 2 - 20.5 * 2) / 4,
                    14 + distance,
                    0,
                ],
                cutout([20.5, 9.2, 20.5]),
            ),
        );

        //wares 2
        cutouts.push(
            translate(
                [
                    -(baseSize.x / 2 - wallStrength - 20.5 / 2 - (baseSize.x - wallStrength * 2 - 20.5 * 2) / 4),
                    14 + distance,
                    0,
                ],
                cutout([20.5, 9.2, 20.5]),
            ),
        );

        //lantern tiles
        cutouts.push(
            translate(
                [
                    +(baseSize.x / 2 - wallStrength - 20.5 / 2 - (baseSize.x - wallStrength * 2 - 20.5 * 2) / 4),
                    14 + 9.2 + distance * 2,
                    0,
                ],
                cutout([20.5, 14, 20.5]),
            ),
        );

        //garden tiles
        cutouts.push(
            translate(
                [
                    baseSize.x / 2 - wallStrength - 20.5 / 2 - (baseSize.x - wallStrength * 2 - 20.5 * 2) / 4,
                    14 + 9.2 + 14 + distance * 3,
                    0,
                ],
                cutout([20.5, 18, 20.5]),
            ),
        );

        // //point tiles
        // cutouts.push(
        //     translate(
        //         [
        //             -(baseSize.x / 2 - wallStrength - 20.5 / 2 - (baseSize.x - wallStrength * 2 - 20.5 * 2) / 4),
        //             13.5 + 8.8 + 13.5 + distance * 3,
        //             0,
        //         ],
        //         cutout([20.5, 4.7, 18.5]),
        //     ),
        // );

        //action tiles
        cutouts.push(
            translate(
                [-14, baseSize.y / 2 - 27.6 / 2 - 9, 1],
                rotateDeg(
                    [90, 0, 90],
                    cylinder({
                        height: 13.5,
                        radius: 27.6 / 2,
                        segments: 6,
                    }),
                ),
            ),
        );

        const setupCoverBase = beveledCube({
            size: [x + 55.5 + 2 * wallStrength, y, 18],
            r: [outerBevel + wallStrength, 0.4, outerBevel + wallStrength],
            exclude: ["t"],
        });

        const coverCutout = translate(
            [0, 0, floorStrength / 2],
            beveledCube({
                size: [x + 55.5 + clearance, y - 2 * wallStrength + clearance, 18 - floorStrength],
                r: [outerBevel, 0.4, outerBevel],
                exclude: ["t"],
            }),
        );

        const coverCutout1 = translate(
            [
                // -(x + 55.5 + 2 * wallStrength) / 2 + (x - 2 * wallStrength + clearance) / 2 + wallStrength,
                0,
                // (z - (15 - coverStrength)) / 2,
            ],
            generateCompartmentHexHatch({
                x: x + 55.5 + clearance - 2 * wallStrength,
                y: y - 2 * wallStrength + clearance - 2 * wallStrength,
                z: 18,
                wallStrength: 1.6,
                compartments: [[x, 55.5]],
                yRelatives: [1],
                bevel: 8,
                hexDiameter: 6,
                strength: 1.2,
                negative:true
            }),
        );

        return {
            setup: union(subtract(base, cutouts), trainingGroundsHolder),
            setupCover: subtract(setupCoverBase, coverCutout, coverCutout1),
        };

        subtract(base, trainingGrounds);
    })(),
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
            initial: Object.keys(configs)[6],
        },
    ];
};

module.exports = { main, getParameterDefinitions };
