const jscad = require("@jscad/modeling");
const { union } = require("@jscad/modeling/src/operations/booleans");
const { degToRad } = require("@jscad/modeling/src/utils");

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

        // advanced bevel settings
        { name: "fingerCutouts", type: "group", initial: "opened", caption: "Finger cutout settings" },
        { name: "includeNorthCutout", type: "checkbox", checked: true, caption: "Include northern cutout" },
        { name: "includeSouthCutout", type: "checkbox", checked: true, caption: "Include southern cutout" },
        { name: "includeEastCutout", type: "checkbox", checked: true, caption: "Include eastern cutout" },
        { name: "includeWestCutout", type: "checkbox", checked: true, caption: "Include western cutout" },
        { name: "includeInnerWallCutouts", type: "checkbox", checked: true, caption: "Include inner cutouts" },
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
        cardClearance = 0.5,
        wallStrength = 1.2,
        floorStrength = 1.2,
        stackCount = 1,
        cutoutWidth = cardWidth / 2,
        includeNorthCutout = true,
        includeSouthCutout = true,
        includeEastCutout = true,
        includeWestCutout = true,
        includeInnerWallCutouts = true,
        includeFloorCutouts = true,
    } = config;

    const assembedCardHolder = [];

    const translationBase = -(stackCount - 1) / 2;
    for (let i = 0; i < stackCount; i++) {
        assembedCardHolder.push(
            translate(
                [0, (cardWidth + cardClearance + wallStrength) * (translationBase + i), 0],
                singleCardHolder({
                    ...config,
                    includeWestCutout: (i === 0 && includeInnerWallCutouts) || (i !== 0 && includeWestCutout),
                    includeEastCutout:
                        (i === stackCount - 1 && includeInnerWallCutouts) ||
                        (i !== stackCount - 1 && includeEastCutout),
                })
            )
        );
    }

    return assembedCardHolder;
};

const singleCardHolder = ({
    cardHeight,
    cardWidth,
    holderHeight,
    cardClearance = 0.5,
    wallStrength = 1.2,
    floorStrength = 1.2,
    cutoutWidth = cardWidth / 2,
    includeNorthCutout = false,
    includeSouthCutout = false,
    includeEastCutout = true,
    includeWestCutout = true,
    includeFloorCutouts = true,
}) => {
    const boxX = cardHeight + cardClearance + wallStrength * 2;
    const boxY = cardWidth + cardClearance + wallStrength * 2;
    const outerBox = cuboid({
        size: [boxX, boxY, holderHeight],
    });
    const cutouts = [];
    cutouts.push(
        translate(
            [0, 0, floorStrength / 2],
            cuboid({
                size: [cardHeight + cardClearance, cardWidth + cardClearance, holderHeight - floorStrength],
            })
        )
    );

    const fingerCutout = union(
        translate(
            [0, -wallStrength, 0],
            cylinder({
                radius: cutoutWidth / 2 + 0.1,
                height: holderHeight,
            })
        ),
        translate([0, 0, 0], cuboid({ size: [cutoutWidth, wallStrength, holderHeight] })),
        translate(
            [cutoutWidth * 0.75, 0, (holderHeight - cutoutWidth / 2) / 2],
            rotateDeg([-90, 0, 0], bevel(holderHeight, cutoutWidth / 2))
        ),
        translate(
            [-cutoutWidth * 0.75, 0, (holderHeight - cutoutWidth / 2) / 2],
            rotateDeg([90, 180, 0], bevel(holderHeight, cutoutWidth / 2))
        )
    );

    const zOffset = includeFloorCutouts ? 0 : floorStrength;
    if (includeEastCutout) {
        cutouts.push(translate([0, -boxY / 2, zOffset], rotateDeg([0, 0, 180], fingerCutout)));
    }
    if (includeWestCutout) {
        cutouts.push(translate([0, boxY / 2, zOffset], rotateDeg([0, 0, 0], fingerCutout)));
    }
    if (includeNorthCutout) {
        cutouts.push(translate([boxX / 2, 0, zOffset], rotateDeg([0, 0, -90], fingerCutout)));
    }
    if (includeSouthCutout) {
        cutouts.push(translate([-boxX / 2, 0, zOffset], rotateDeg([0, 0, 90], fingerCutout)));
    }

    return subtract(outerBox, cutouts);
};
