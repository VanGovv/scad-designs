const jscad = require("@jscad/modeling");

const basicBitBox = require("../basicBitBox.jscad").main;

const { cylinder } = jscad.primitives;
const { translate } = jscad.transforms;
const { subtract, union } = jscad.booleans;

const main = () => {
    const x = 250,
        y = 210,
        z = 3.5,
        radius = 15,
        floorStrength = 1.2,
        wallStrength = 1.6,
        cutoutDiameter = 15,
        cutoutDistance = 10,
        cutoutDepth = 0.2;

    const tray = basicBitBox({
        x: x + 2 * wallStrength,
        y: y + 2 * wallStrength,
        z: z + floorStrength,
        outerBevel: [radius + wallStrength, 0, 0],
        innerBevel: radius,
        floorStrength: floorStrength,
        wallStrength: wallStrength,
        includeFloorBevel: false,
    });

    const cutouts = [];

    // cutout for removing stat/skill tokens
    {
        const cutoutDiameter = 16;
        const tokenDiameter = 18.6;
        for (let i = 0; i < 4; i++) {
            const skillCutout = 
                translate(
                    [0, 56 + tokenDiameter / 2 + i * (6.4 + tokenDiameter) - y / 2 - wallStrength, -z / 2],
                    cylinder({ radius: cutoutDiameter / 2, height: floorStrength })
                );
            // left cutouts
            cutouts.push(translate([-x / 2 - wallStrength + 22.4 + tokenDiameter / 2, 0, 0], skillCutout));
            //right cutouts
            cutouts.push(translate([-(-x / 2 - wallStrength + 22.4 + tokenDiameter / 2), 0, 0], skillCutout));
        }
    }

    // circular cutouts for stress reduction
    const cutoutRows = Math.floor((x - cutoutDistance * 2) / (cutoutDiameter + cutoutDistance));
    const cutoutColumns = Math.floor((y - cutoutDistance * 2) / (cutoutDiameter + cutoutDistance));
    for (let i = -cutoutRows / 2; i <= cutoutRows / 2; i++) {
        for (let j = -cutoutColumns / 2; j <= cutoutColumns / 2; j++) {
            cutouts.push(
                translate(
                    [
                        i * (cutoutDistance + cutoutDiameter),
                        j * (cutoutDistance + cutoutDiameter),
                        -(z + floorStrength) / 2 + cutoutDepth / 2,
                    ],
                    cylinder({
                        radius: cutoutDiameter / 2,
                        height: cutoutDepth,
                    })
                )
            );
        }
    }

    return subtract(tray, cutouts);
};

module.exports = { main };
