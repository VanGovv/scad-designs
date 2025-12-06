const jscad = require("@jscad/modeling");
const basicBitBox = require("../basicBitBox.jscad").main;
const basicCardHolder = require("../basicCardHolder2.jscad").main;
const { cylinder } = jscad.primitives;
const { subtract, union } = jscad.booleans;
const { translate } = jscad.transforms;
const { generateCompartmentHexHatch, rotateDeg } = require("../utils.jscad");
const beveledCube = require("../beveledCube.jscad").beveledCube;

const configs = {
    player: ((config) => {
        return subtract(
            union(
                basicBitBox(config),
                translate(
                    [0, 0, -4],
                    basicBitBox({
                        ...config,
                        x: config.x - config.wallStrength * 2,
                        y: config.y - config.wallStrength * 2,
                        z: config.z - 9,
                        wallStrength: 2,
                        innerBevel: 2,
                        outerBevel: 0,
                    })
                )
            ),
            translate(
                [config.x / 2 - config.wallStrength / 2, 0, config.z / 2],
                rotateDeg([0, 90, 0], cylinder({ radius: 10, height: config.wallStrength + 5 }))
            ),
            translate(
                [-config.x / 2 + config.wallStrength / 2, 0, config.z / 2],
                rotateDeg([0, 90, 0], cylinder({ radius: 10, height: config.wallStrength + 5 }))
            )
        );
    })({
        x: 62,
        y: 92.5,
        z: 36,
        wallStrength: 1.2,
        floorStrength: 0.8,
        innerBevel: 0.5,
        outerBevel: 2,
        includeFloorBevel: false,
    }),
    playerCover: playerCover({
        x: 64.6,
        y: 95.1,
        z: 18,
        wallStrength: 1.2,
        floorStrength: 0.8,
        innerBevel: 2,
        outerBevel: 2,
        includeFloorBevel: false,
    }),
    cards: cardHolder(),
    money: basicBitBox({
        x: 123.5,
        y: 96.5,
        z: 12.8,
        wallStrength: 1.2,
        floorStrength: 0.8,
        innerBevel: 10,
        outerBevel: 2,
        compartments: [[5, 2]],
    }),
    moneyCover: playerCover({
        x: 126,
        y: 99,
        z: 7.2,
        wallStrength: 1.2,
        floorStrength: 1.2,
        innerBevel: 2,
        outerBevel: 3.2,
        includeFloorBevel: false,
    }),
    solo: basicBitBox({
        x: 123.5,
        y: 96.5,
        z: 8.6,
        wallStrength: 1.2,
        floorStrength: 0.8,
        innerBevel: 0.8,
        outerBevel: 2,
        compartments: [1, 1],
        yRelatives: [2, 1],
    }),
    soloCover: playerCover({
        x: 126,
        y: 99,
        z: 5.2,
        wallStrength: 1.2,
        floorStrength: 1.2,
        innerBevel: 2,
        outerBevel: 3.2,
        includeFloorBevel: false,
    }),
    setup: union(
        basicBitBox({
            y: 123.4,
            x: 58,
            z: 18,
            wallStrength: 1.2,
            innerWallStrength: 0.8,
            floorStrength: 0.8,
            innerBevel: 0.8,
            outerBevel: 2,
            compartments: [1, [22.4, 32.4]],
            yRelatives: [45.1, 75.1],
        }),
        translate(
            [-(58 - 22.4 - 2.4) / 2, (123.4 - 75.1 - 2.4) / 2, 0],
            basicBitBox({
                y: 75.1 + 1.6,
                x: 22.4 + 1.6,
                z: 18,
                wallStrength: 0.8,
                floorStrength: 0.8,
                innerBevel: 0.8,
                outerBevel: 1.6,
                compartments: [1, 1],
                yRelatives: [56.2, 18.5],
            })
        )
    ),
    setupCover: union(
        playerCover({
            y: 123.4,
            x: 58,
            z: 15.2,
            wallStrength: 1.2,
            innerWallStrength: 0.8,
            floorStrength: 0.8,
            innerBevel: 0.8,
            outerBevel: 2,
            includeFloorBevel: false,
        }),
        translate(
            [0, 0, 3.4],
            basicBitBox({
                y: 126,
                x: 60.5,
                z: 22,
                wallStrength: 1.2,
                innerWallStrength: 0.8,
                floorStrength: 0,
                innerBevel: 2,
                outerBevel: 3.2,
                compartments: [1],
            })
        )
    ),
};

function playerCover(config) {
    const { x, y, z, wallStrength, innerBevel } = config;
    const base = basicBitBox(config);
    const hatch = generateCompartmentHexHatch({
        x: x - wallStrength * 4,
        y: y - wallStrength * 4,
        z,
        wallStrength: wallStrength,
        compartments: [1],
        bevel: innerBevel,
        hexDiameter: 6,
        strength: 2,
        negative: true,
    });

    return subtract(union(base), hatch);
}

function cardHolder() {
    const base = (depth) =>
        basicCardHolder({
            cardHeight: 90,
            cardWidth: 60,
            holderDepth: depth,
            cardClearance: 0,
            wallStrength: 1.2,
            floorStrength: 0.72,
        });

    const fourth = base((48 - 6) / 4);

    return union(
        translate([-91.2, 0, 0], union(base(29 - 1.2 * 1.5), translate([0, (48 - 1.2) / 2, 0], base(19 - 1.2 * 1.5)))),
        translate(
            [0, 4.1, 0],
            union(base(37.2 - 1.2 * 1.5), translate([0, (48 - 1.2) / 2, 0], base(10.8 - 1.2 * 1.5)))
        ),
        translate(
            [91.2, 9.2, 0],
            union(
                translate([0, -17.55, 0], fourth),
                translate([0, -5.75, 0], fourth),
                translate([0, 5.75, 0], fourth),
                translate([0, 17.55, 0], fourth)
            )
        )
    );
}

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
            initial: Object.keys(configs)[8],
        },
    ];
};

module.exports = { main, getParameterDefinitions };
