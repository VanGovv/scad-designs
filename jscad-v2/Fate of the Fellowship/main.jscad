const basicBitBox = require("../basicBitBox.jscad").main;
const basicCardHolder = require("../basicCardHolder.jscad").main;

const jscad = require("@jscad/modeling");
const { cuboid, cylinder } = jscad.primitives;
const { translate } = jscad.transforms;
const { subtract, union } = jscad.booleans;
const { rotateDeg } = require("../utils.jscad");

const configs = {
    troops: basicBitBox({
        x: 155,
        y: 43,
        z: 14,
        wallStrength: 1.6,
        floorStrength: 1.2,
        innerBevel: 16,
        outerBevel: 1.2,
        compartments: [4],
        includeNorthBevel: true,
        includeSouthBevel: true,
        includeEastBevel: true,
        includeWestBevel: true,
        includeTopMagnets: true,
        includeFloorMagnets: true,
        magnetDiameter: 5.1,
        magnetHeight: 1.1,
        magnetWallStrength: 1.2,
        magnetInset: 0.4,
    }),
    token: basicBitBox({
        x: 155,
        y: 43,
        z: 14,
        wallStrength: 1.6,
        floorStrength: 1.2,
        innerBevel: 16,
        outerBevel: 1.2,
        compartments: [4],
        includeNorthBevel: true,
        includeSouthBevel: true,
        includeEastBevel: true,
        includeWestBevel: true,
        includeTopMagnets: true,
        includeFloorMagnets: true,
        magnetDiameter: 5.1,
        magnetHeight: 1.1,
        magnetWallStrength: 1.2,
        magnetInset: 0.4,
    }),
    tokenCover: basicBitBox({
        x: 155,
        y: 43,
        z: 2,
        wallStrength: 1.6,
        floorStrength: 2,
        innerBevel: 6,
        outerBevel: 1.2,
        compartments: [4],
        includeNorthBevel: true,
        includeSouthBevel: true,
        includeEastBevel: true,
        includeWestBevel: true,
        includeTopMagnets: true,
        magnetDiameter: 5.1,
        magnetHeight: 1.1,
        magnetWallStrength: 1.2,
        magnetInset: 0.4,
    }),
    largeCards: largeCards(),
    characters: basicBitBox({
        x: 122,
        y: 82,
        z: 12,
        wallStrength: 1.6,
        floorStrength: 0.8,
        innerBevel: 1.2,
        outerBevel: 1.2,
        compartments: [1],
        includeNorthBevel: true,
        includeSouthBevel: true,
        includeEastBevel: true,
        includeWestBevel: true,
        includeTopMagnets: true,
        magnetDiameter: 5.2,
        magnetHeight: 1.1,
        magnetWallStrength: 1.2,
        magnetInset: 0.4,
    }),
    charactersCover: basicBitBox({
        x: 122,
        y: 82,
        z: 2,
        wallStrength: 1.6,
        floorStrength: 0.8,
        innerBevel: 1.2,
        outerBevel: 1.2,
        compartments: [1],
        includeNorthBevel: true,
        includeSouthBevel: true,
        includeEastBevel: true,
        includeWestBevel: true,
        includeTopMagnets: true,
        magnetDiameter: 5.1,
        magnetHeight: 1.1,
        magnetWallStrength: 1.2,
        magnetInset: 0.4,
    }),
    evilTroops: basicBitBox({
        x: 55,
        y: 53,
        z: 24,
        wallStrength: 1.6,
        floorStrength: 1.2,
        innerBevel: 18,
        outerBevel: 1.2,
        compartments: [1],
        includeNorthBevel: true,
        includeSouthBevel: true,
        includeEastBevel: true,
        includeWestBevel: true,
        includeTopMagnets: true,
        magnetDiameter: 4.1,
        magnetHeight: 2.1,
        magnetWallStrength: 1.2,
        magnetInset: 0.4,
    }),
    evilTroopsCover: basicBitBox({
        x: 55,
        y: 53,
        z: 6,
        wallStrength: 1.6,
        floorStrength: 1.2,
        innerBevel: 18,
        outerBevel: 1.2,
        compartments: [1],
        includeFloorBevel: false,
        includeNorthBevel: true,
        includeSouthBevel: true,
        includeEastBevel: true,
        includeWestBevel: true,
        includeTopMagnets: true,
        magnetDiameter: 4.1,
        magnetHeight: 2.1,
        magnetWallStrength: 1.2,
        magnetInset: 0.4,
    }),
    sanctuaryHolder: basicBitBox({
        x: 81,
        y: 28,
        z: 10,
        wallStrength: 1.6,
        wallStrengthX: 6,
        floorStrength: 1.2,
        innerBevel: 0.5,
        outerBevel: 1.2,
        compartments: [2],
        includeFloorBevel: true,
        includeNorthBevel: true,
        includeSouthBevel: true,
        includeEastBevel: true,
        includeWestBevel: true,
        includeTopMagnets: true,
        magnetDiameter: 4.2,
        magnetHeight: 2.1,
        magnetWallStrength: 0.8,
        magnetInset: 0.4,
        shearHeight: 28.6,
        shearFloorSizeY: 14,
    }),
    sanctuaryHolderCover: basicBitBox({
        x: 81,
        y: 28,
        z: 21,
        wallStrength: 1.6,
        wallStrengthX: 6,
        floorStrength: 1.2,
        innerBevel: 0.5,
        outerBevel: 1.2,
        compartments: [2],
        includeFloorBevel: true,
        includeNorthBevel: true,
        includeSouthBevel: true,
        includeEastBevel: true,
        includeWestBevel: true,
        includeTopMagnets: true,
        magnetDiameter: 4.2,
        magnetHeight: 2.1,
        magnetWallStrength: 0.8,
        magnetInset: 0.4,
    }),
    diceHolder: union(
        basicBitBox({
            x: 63.8, // +16 + .5 + 2.4 = 19
            y: 52,
            z: 9.5,
            wallStrength: 1.6,
            wallStrengthX: 7.4,
            floorStrength: 1.2,
            innerBevel: 0.5,
            outerBevel: 1.2,
            compartments: [1],
            includeFloorBevel: true,
            includeNorthBevel: true,
            includeSouthBevel: true,
            includeEastBevel: true,
            includeWestBevel: true,
            includeTopMagnets: true,
            magnetDiameter: 4.2,
            magnetHeight: 2.1,
            magnetWallStrength: 1.6,
            magnetInset: 0.4,
        }),
        translate(
            [-31.9 - 9.9 + 1.6, 0, 0],
            basicBitBox({
                x: 19.8,
                y: 52,
                z: 9.5,
                wallStrength: 1.6,
                floorStrength: 1.2,
                innerBevel: 0.5,
                outerBevel: 1.2,
                compartments: [1],
                includeFloorBevel: true,
                includeNorthBevel: true,
                includeSouthBevel: true,
                includeEastBevel: true,
                includeWestBevel: true,
            })
        ),
        translate(
            [-9.1, 0, 0],
            basicBitBox({
                x: 82,
                y: 52,
                z: 9.5,
                wallStrength: 1.6,
                floorStrength: 1.2,
                innerBevel: 0.5,
                outerBevel: 1.2,
                compartments: [1],
                includeFloorBevel: true,
                includeNorthBevel: true,
                includeSouthBevel: true,
                includeEastBevel: true,
                includeWestBevel: true,
            })
        )
    ),
};

const main = ({ modelName }) => {
    console.log(modelName);
    return configs[modelName];
};

const getParameterDefinitions = () => {
    return [
        {
            name: "modelName",
            type: "choice",
            caption: "Select element",
            values: Object.keys(configs),
            initial: "diceHolder",
        },
    ];
};

module.exports = { main, getParameterDefinitions };

function largeCards() {
    const [x, y, z] = [122.5, 82.5, 63];
    const floorStrength = 5;
    const wallStrength = 1.6;
    const runover = 28;
    const floor = cuboid({
        size: [x + wallStrength + runover, y, floorStrength],
    });
    const diagSide = Math.sqrt(runover ** 2 + runover ** 2);
    const diagCube = translate(
        [x / 2 + wallStrength / 2, 0, runover / 2 + floorStrength / 2],
        cuboid({
            size: [runover, y, runover],
        })
    );
    const diagCut = translate(
        [x / 2 + runover / 2 + wallStrength / 2, 0, runover + floorStrength / 2],
        rotateDeg(
            [0, 45, 0],
            cuboid({
                size: [diagSide, y, diagSide],
            })
        )
    );
    const wall = translate(
        [x / 2 - runover / 2, 0, z / 2 - floorStrength / 2],
        cuboid({
            size: [wallStrength, y, z],
        })
    );

    const cylCutout = translate(
        [x / 2 - runover / 2, 0, z / 2 - floorStrength / 2],
        cylinder({ radius: 20, height: z })
    );
    const rectCutout = translate(
        [x / 2 + wallStrength / 2, 0, z / 2 - floorStrength / 2],
        cuboid({ size: [runover, 40, z] })
    );

    return subtract(union(floor, wall, diagCube), cylCutout, rectCutout, diagCut);
}
