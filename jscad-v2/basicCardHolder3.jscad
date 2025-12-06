const jscad = require("@jscad/modeling");
const { union } = require("@jscad/modeling/src/operations/booleans");
const { degToRad } = require("@jscad/modeling/src/utils");
``;

const beveledCube = require("./beveledCube.jscad").beveledCube;
const bevel = require("./beveledCube.jscad").bevel;
const rotateDeg = require("./beveledCube.jscad").rotateDeg;

const { cuboid, cylinder } = jscad.primitives;
const { translate } = jscad.transforms;
const { subtract } = jscad.booleans;

const getParameterDefinitions = () => {
    return [
        { name: "cardHeight", type: "float", initial: 88, caption: "Card height" },
        { name: "cardWidth", type: "float", initial: 57, caption: "Card width" },
        { name: "holderHeight", type: "float", initial: 25, caption: "Holder Height" },
        { name: "cardClearance", type: "float", initial: 0.5, caption: "Card clearance" },
        { name: "wallStrength", type: "float", initial: 1.2, caption: "Wall size" },
        { name: "floorStrength", type: "float", initial: 0.96, caption: "Floor strength" },
        { name: "stackCount", type: "int", initial: 2, caption: "Stack Count" },
    ];
};

const main = (params) => {
    return basicCardHolder(params);
};

module.exports = { main, getParameterDefinitions };

const basicCardHolder = (config) => {
    const {
        cardHeight,
        cardWidth,
        holderHeight,
        cardClearance = 1,
        wallStrength = 1.2,
        floorStrength = 1.2,
        stackCount = 3,
        cutoutWidth = 20,
        part = "holder",
        partClearance = 0.4,
        overHangHeight = 6,
    } = config;

    const holderSize = {
        x: (cardWidth + wallStrength + cardClearance) * stackCount + wallStrength,
        y: cardHeight + wallStrength + cardClearance,
        z: holderHeight,
    };

    const holder = cuboid({
        size: Object.values(holderSize),
    });

    const coverSize = {
        x: holderSize.x + +wallStrength * 2 + partClearance,
        y: holderSize.y + wallStrength + partClearance,
        z: holderSize.z + floorStrength,
    };

    const cover = cuboid({
        size: Object.values(coverSize),
    });

    const cutoutHeight = holderHeight - floorStrength - overHangHeight;

    const cutout = () =>
        cuboid({
            size: [cardWidth + cardClearance, cardHeight + cardClearance, holderHeight - floorStrength],
        });

    const frontBevel = translate(
        [0, (holderSize.y - cutoutHeight) / 2, floorStrength / 2 + overHangHeight / 2],
        rotateDeg(
            [0, 90, 180],
            subtract(
                cuboid({ size: [cutoutHeight, cutoutHeight, coverSize.x] }),
                translate(
                    [cutoutHeight / 2, cutoutHeight / 2, 0],
                    cylinder({ radius: cutoutHeight, height: coverSize.x })
                )
            )
        )
    );

    const fingerCutout = () =>
        translate(
            [0, 0, -cutoutWidth / 4],
            union(
                cuboid({
                    size: [cutoutWidth, coverSize.z, cutoutWidth / 2],
                }),
                translate([cutoutWidth * 0.75, 0, 0], rotateDeg([-90, 0, 0], bevel(coverSize.z, cutoutWidth / 2))),
                translate([-cutoutWidth * 0.75, 0, 0], rotateDeg([90, 180, 0], bevel(coverSize.z, cutoutWidth / 2))),
                translate(
                    [0, 0, -cutoutWidth / 4],
                    rotateDeg(
                        [90, 180, 0],
                        cylinder({
                            height: coverSize.z,
                            radius: cutoutWidth / 2,
                        })
                    )
                )
            )
        );

    const cutouts = [];
    const extras = [];

    for (let i = -(stackCount - 1) / 2; i <= (stackCount - 1) / 2; i++) {
        cutouts.push(
            translate([(cardWidth + wallStrength + cardClearance) * i, wallStrength / 2, floorStrength / 2], cutout())
        );
        cutouts.push(
            translate(
                [(cardWidth + wallStrength + cardClearance) * i, holderSize.y / 2, 0],
                rotateDeg([-90, 0, 0], fingerCutout())
            )
        );
        if (part === "cover") {
            extras.push(
                translate(
                    [
                        (cardWidth + wallStrength + cardClearance + wallStrength / 2) * i,
                        coverSize.y / 2 - partClearance / 2,
                        -coverSize.z / 2 + overHangHeight / 2 + floorStrength / 2,
                    ],
                    subtract(
                        cuboid({
                            size: [
                                cardWidth + cardClearance + partClearance + wallStrength * 3,
                                wallStrength,
                                overHangHeight + floorStrength,
                            ],
                        }),
                        cuboid({
                            size: [cardWidth - cutoutWidth, wallStrength, overHangHeight + floorStrength],
                        })
                    )
                )
            );
        }
    }

    if (part === "holder") {
        return subtract(holder, frontBevel, cutouts);
    } else if (part === "cover") {
        return union(subtract(
            translate([0, -wallStrength / 2 - partClearance / 2, 0], cover),
            translate([0, 0, floorStrength / 2], holder, frontBevel),
            cutouts
        ), extras);
    }
};
