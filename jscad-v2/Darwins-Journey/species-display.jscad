const jscad = require("@jscad/modeling");

const { cuboid } = jscad.primitives;
const { translate } = jscad.transforms;
const { subtract } = jscad.booleans;

const main = (params) => {
    const tileSize = 34.4;
    const tileThickness = 1.9;
    const wallStrength = 1.2;
    const cutoutSpacing = 1.6;
    const floorStrength = 2.4;
    const cornerSize = 6;

    const horizontalCount = 4
    const verticalCount =4




    const bodySize = tileSize + wallStrength * 2;
    const fullHeight = floorStrength + tileThickness ;

    const body = cuboid({
        size: [bodySize, bodySize, fullHeight],
    });

    const cutouts = [];

    cutouts.push(
        cuboid({
            size: [bodySize, bodySize - cornerSize * 2, tileThickness ],
            center: [0, 0, floorStrength / 2],
        })
    );

    cutouts.push(
        cuboid({
            size: [bodySize - cornerSize * 2, bodySize, tileThickness ],
            center: [0, 0, floorStrength / 2],
        })
    );

    cutouts.push(
        cuboid({
            size: [bodySize - wallStrength * 2, bodySize - wallStrength * 2, tileThickness ],
            center: [0, 0, floorStrength / 2],
        })
    );

    cutouts.push(
        cuboid({
            size: [
                bodySize - wallStrength * 2 - cutoutSpacing * 2,
                bodySize - wallStrength * 2 - cutoutSpacing * 2,
                fullHeight,
            ],
        })
    );

    const singleHolder = subtract(body, cutouts);
    

    const holder = []

    for (let i = 0; i < horizontalCount; i++) {
        for (let j = 0; j < verticalCount; j++) {
            holder.push(translate([(bodySize - wallStrength) * i, (bodySize - wallStrength) * j, 0], singleHolder))
        }

    }



    return holder;
};

module.exports = { main };
