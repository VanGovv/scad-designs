const basicBitBox = require("../basicBitBox.jscad").main;
const basicCardHolder = require("../basicCardHolder.jscad").main;

const jscad = require("@jscad/modeling");
const { cuboid, cylinder } = jscad.primitives;
const { translate } = jscad.transforms;
const { subtract, union } = jscad.booleans;
const { rotateDeg } = require("../utils.jscad");

const configs = {
    token: basicBitBox({
        x: 142,
        y: 154,
        z: 19,
        wallStrength: 1.6,
        floorStrength: 1.2,
        innerBevel: 16,
        outerBevel: 2,
        compartments: [1,2],
        includeNorthBevel: true,
        includeSouthBevel: true,
        includeEastBevel: true,
        includeWestBevel: true,
        includeTopMagnets: true,
        includeFloorMagnets: true,
        magnetDiameter: 4.2,
        magnetHeight: 2.2,
        magnetWallStrength: 1.2,
        magnetInset: 0.48,
    }),
    token2: basicBitBox({
        x: 142,
        y: 154,
        z: 19,
        wallStrength: 1.6,
        floorStrength: 1.2,
        innerBevel: 16,
        outerBevel: 2,
        compartments: [2,[3,1]],
        includeNorthBevel: true,
        includeSouthBevel: true,
        includeEastBevel: true,
        includeWestBevel: true,
        includeTopMagnets: true,
        includeFloorMagnets: true,
        magnetDiameter: 4.2,
        magnetHeight: 2.2,
        magnetWallStrength: 1.2,
        magnetInset: 0.48,
    }),
    tokenCover: basicBitBox({
        x: 142,
        y: 154,
        z: 3,
        wallStrength: 1.6,
        floorStrength: 3,
        innerBevel: 16,
        outerBevel: 2,
        includeNorthBevel: true,
        includeSouthBevel: true,
        includeEastBevel: true,
        includeWestBevel: true,
        includeFloorMagnets: true,
        magnetDiameter: 4.2,
        magnetHeight: 2.2,
        magnetWallStrength: 1.2,
        magnetInset: 0.4,
    }),
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
            initial: "token2",
        },
    ];
};

module.exports = { main, getParameterDefinitions };