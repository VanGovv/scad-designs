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
        { name: "cardWidth", type: "float", initial: 50, caption: "Card width" },
        { name: "holderDepth", type: "float", initial: 25, caption: "Holder Height" },
        { name: "cardClearance", type: "float", initial: 0.5, caption: "Card clearance" },
        { name: "wallStrength", type: "float", initial: 1.2, caption: "Wall size" },
        { name: "floorStrength", type: "float", initial: 0.96, caption: "Floor strength" },
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
        holderDepth,
        cardClearance = 0.5,
        wallStrength = 1.2,
        floorStrength = 1.2,
        cutoutWidth = cardWidth / 2,
    } = config;
    const boxX = cardHeight + cardClearance + wallStrength * 2;
    const boxY = holderDepth + cardClearance + wallStrength * 2;
    const outerBox = cuboid({
        size: [boxX, boxY, cardWidth + floorStrength],
    });
    const cutouts = [];
    cutouts.push(
        translate(
            [0, 0, floorStrength / 2],
            cuboid({
                size: [cardHeight + cardClearance, holderDepth + cardClearance, cardWidth],
            })
        )
    );

    const fingerCutout = union(
        cuboid({
            size: [cutoutWidth, cutoutWidth / 2, cutoutWidth / 2],
        }),
        translate([cutoutWidth * 0.75, 0, 0], rotateDeg([-90, 0, 0], bevel(cutoutWidth / 2, cutoutWidth / 2))),
        translate([-cutoutWidth * 0.75, 0, 0], rotateDeg([90, 180, 0], bevel(cutoutWidth / 2, cutoutWidth / 2))),
        translate(
            [0, 0, -cutoutWidth / 4],
            rotateDeg(
                [90, 180, 0],
                cylinder({
                    height: cutoutWidth / 2,
                    radius: cutoutWidth / 2,
                })
            )
        )
    );

    // TODO
    cutouts.push(translate([0, -boxY / 2, cutoutWidth * .75 + wallStrength/2 + .2], rotateDeg([0, 0, 180], fingerCutout)));
    cutouts.push(translate([0, boxY / 2, cutoutWidth * .75 + wallStrength/2 + .2], rotateDeg([0, 0, 0], fingerCutout)));

    return subtract(outerBox, cutouts);
};
