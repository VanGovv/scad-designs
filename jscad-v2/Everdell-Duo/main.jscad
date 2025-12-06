const jscad = require("@jscad/modeling");
const { subtract, union } = jscad.booleans;
const { cylinder } = jscad.primitives;
const { translate } = jscad.transforms;
const basicBitBox = require("../basicBitBox.jscad").main;
const { fingerCutout, generateCompartmentHexHatch, rotateDeg } = require("../utils.jscad");
const beveledCube = require("../beveledCube.jscad").main;

const holderAndCover = (holderName, config) => {
    const {
        x,
        y,
        z,
        wallStrength,
        innerBevel,
        outerBevel,
        compartments,
        yRelatives,
        coverHeight,
        coverStrength,
        coverClearance,
    } = config;
    return {
        [holderName]: basicBitBox({
            ...config,
            x: x - 2 * wallStrength - coverClearance,
            y: y - 2 * wallStrength - coverClearance,
            z: z - coverStrength,
        }),
        [holderName + "Cover"]: subtract(
            basicBitBox({
                x,
                y,
                z: coverHeight,
                wallStrength: wallStrength,
                floorStrength: coverStrength,
                innerBevel: outerBevel,
                outerBevel: outerBevel + wallStrength,
                includeFloorBevel: false,
            }),
            generateCompartmentHexHatch({
                x: x - 2 * wallStrength - coverClearance,
                y: y - 2 * wallStrength - coverClearance,
                z: coverHeight,
                yRelatives,
                compartments,
                wallStrength,
                bevel: innerBevel,
                hexDiameter: 6,
                strength: 2,
                negative: true,
            })
        ),
    };
};

const configs = {
    events: ((
        config = {
            x: 195,
            y: 48,
            z: 22,
            wallStrength: 1.6,
            innerWallStrength: 14,
            floorStrength: 0.8,
            innerBevel: 0.8,
            outerBevel: 2.4,
            compartments: [[1.5, 6, 6, 6, 6, 6, 1.5, 4]],
            includeNorthBevel: true,
            includeSouthBevel: true,
            includeEastBevel: true,
            includeWestBevel: true,
            cutoutWidth: 25,
        }
    ) => {
        const { x, z, wallStrength, cutoutWidth } = config;
        return subtract(
            basicBitBox(config),
            translate([0, 0, (z - cutoutWidth / 2) / 2], fingerCutout(cutoutWidth, x - 2 * wallStrength))
        );
    })(),
    ...holderAndCover("resources", {
        x: 194,
        y: 47,
        z: 18.6,
        wallStrength: 0.8,
        floorStrength: 0.8,
        innerBevel: 12,
        outerBevel: 1.6,
        compartments: [[3, 2, 2, 2]],
        coverHeight: 10,
        coverStrength: 1.6,
        coverClearance: 0.1,
    }),
    ...holderAndCover("vp", {
        x: 194,
        y: 47,
        z: 18.6,
        wallStrength: 0.8,
        floorStrength: 0.8,
        innerBevel: 12,
        outerBevel: 1.6,
        compartments: [[3, 3, 2]],
        coverHeight: 10,
        coverStrength: 1.6,
        coverClearance: 0.1,
    }),
    ...((
        config = {
            x: 94,
            y: 72.5,
            z: 18.6,
            wallStrength: 0.8,
            floorStrength: 0.8,
            innerBevel: 12,
            outerBevel: 1.6,
            compartments: [[1, 1], 1],
            yRelatives: [3, 2],
            coverHeight: 10,
            coverStrength: 1.6,
            coverClearance: 0.2,
        }
    ) => {
        const { player, playerCover } = holderAndCover("player", config);

        return {
            player: subtract(
                player,
                translate([0, 0, (config.z - 1) / 2], beveledCube({ size: [45.5, 67, 1], r: 0.5, exclude: ["t", "b"] }))
            ),
            playerCover,
        };
    })(),
    ...((
        config = {
            x: 94,
            y: 122,
            z: 18.6,
            wallStrength: 0.8,
            floorStrength: 0.8,
            innerBevel: 8,
            outerBevel: 1.6,
            compartments: [1, 1, 1],
            yRelatives: [3, 2.2, 1.8],
            coverHeight: 10,
            coverStrength: 1.6,
            coverClearance: 0.2,
        }
    ) => {
        const { campaign: holder, campaignCover } = holderAndCover("campaign", config);
        const { x, y, z, innerBevel, wallStrength, coverClearance, coverStrength, floorStrength } = config;
        const size = [x - 2 * wallStrength - coverClearance, ((y - 5 * wallStrength) / 7) * 3, z - coverStrength];

        const insert = beveledCube({
            size,
            r: 0.8,
            exclude: ["t"],
        });

        const CardAndDieInsert = translate(
            [0, -y / 2 + size[1] / 2 + 2 * wallStrength, 0],
            subtract(
                insert,
                translate(
                    [-x / 2 + 10, 0, 0],
                    translate(
                        [0, 0, z - coverStrength - 16],
                        beveledCube({ size: [16.5, 16.5, 16.5], r: 0.5, exclude: ["t"] })
                    ),
                    translate([0, 0, 14], beveledCube({ size: [20, size[1], 20], r: 10 }))
                ),
                translate([10, 0, floorStrength], beveledCube({ size: [68, 46, size[2]], r: 0.5, exclude: ["t"] })),
                translate([x / 2, 0, size[2] - 20 + 1.6], fingerCutout(40, 20))
            )
        );

        const campaign = subtract(
            union(
                subtract(holder, translate([0, -y / 2 + size[1] / 2 + 2 * wallStrength, 0], insert)),
                CardAndDieInsert
            ),
            translate([0, 15, size[2] / 2 - 2.5 / 2], beveledCube({ size: [80, 50.5, 2.5], r: 2, exclude: ["t", "b"] }))
        );

        return {
            campaign: campaign,
            campaignCover,
        };
    })(),
    cardsAndRiver: subtract(
        beveledCube({
            size: [50, 68 + 57 + 3 * 4, 18.6 * 2],
            r: 1.6,
            exclude: ["t"],
        }),
        translate(
            [0, (68 + 57 + 3 * 4) / 2 - 68 / 2 - 4, 1.6 / 2],
            beveledCube({
                size: [50 - 1.6, 68, 18.6 * 2 - 1.6],
                r: 0.8,
                exclude: ["t"],
            }),
            translate([0, 0, (18.6 * 2 - 1.6 - 25 / 2) / 2], fingerCutout(25, 50))
        ),
        translate(
            [0, -(68 + 57 + 3 * 4) / 2 + 57 / 2 + 4, 18.6 - 16 / 2],
            beveledCube({
                size: [50 - 1.6, 57, 16],
                r: 0.8,
                exclude: ["t"],
            }),
            translate([0, 0, (16 - 25 / 2) / 2], fingerCutout(25, 50))
        )
    ),
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
            initial: Object.keys(configs)[7],
        },
    ];
};

module.exports = { main, getParameterDefinitions };
