const jscad = require("@jscad/modeling");
const { union } = require("@jscad/modeling/src/operations/booleans");
const bevel = require("./beveledCube.jscad").bevel;
const { main: hatch } = require("./hatch.jscad");
const { generateCompartments, rotateDeg } = require("./utils.jscad");

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
        {
            name: "part",
            type: "choice",
            caption: "Select element",
            values: ["holder", "cover"],
            initial: "holder",
        },
        

    ];
};

const main = (params) => {
    return basicCardHolder(params);
};

const basicCardHolder = (config) => {
    const {
        cardHeight,
        cardWidth,
        holderDepth,
        cardClearance = 0.5,
        wallStrength = 1.2,
        floorStrength = 1.2,
        cutoutWidth = cardWidth / 2,
        includeHatch = false,
        hatch_clearance,
        hatch_strength,
        hatch_distance,
        hatch_cornerBevel,
        hatch_cutoffPercent,
        hatch_maxIterations,
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

    const fingerCutout = translate(
        [0, 0, -cutoutWidth / 4],
        union(
            cuboid({
                size: [cutoutWidth, boxY, cutoutWidth / 2],
            }),
            translate([cutoutWidth * 0.75, 0, 0], rotateDeg([-90, 0, 0], bevel(boxY, cutoutWidth / 2))),
            translate([-cutoutWidth * 0.75, 0, 0], rotateDeg([90, 180, 0], bevel(boxY, cutoutWidth / 2))),
            translate(
                [0, 0, -cutoutWidth / 4],
                rotateDeg(
                    [90, 180, 0],
                    cylinder({
                        height: boxY,
                        radius: cutoutWidth / 2,
                    })
                )
            )
        )
    );

    if (includeHatch) {
        cutouts.push(
            rotateDeg([90, 0, 0], hatch({
                x: boxX - hatch_clearance * 2,
                z: boxY,
                y: cardWidth - hatch_clearance * 2,
                rotation: 45,
                strength: hatch_strength,
                distance: hatch_distance,
                cornerBevel: hatch_cornerBevel,
                cutoffPercent: hatch_cutoffPercent,
                maxIterations: hatch_maxIterations,
            }))
        );
    }

    cutouts.push(translate([0, 0, (cardWidth + floorStrength) / 2], rotateDeg([0, 0, 0], fingerCutout)));

    return subtract(outerBox, cutouts);
};

const basicCardHolderWithCompartments = (config) => {
    return union(...generateCompartments({
        ...config,
        x: config.holderDepth - 2 * config.wallStrength,
        y: config.cardHeight * config.compartments.length + config.wallStrength * (config.compartments.length - 1),
        z: config.cardWidth,
        fun: ({ compartmentX, compartmentY }) => rotateDeg([0,0,90], basicCardHolder({...config, holderDepth: compartmentX, cardHeight: compartmentY }))
    }))
}

module.exports = { main, getParameterDefinitions, basicCardHolder, basicCardHolderWithCompartments };