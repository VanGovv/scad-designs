const basicBitBox = require("../basicBitBox.jscad").main;
const basicCardHolder = require("../basicCardHolder.jscad").main;

const configs = {
    stone: basicBitBox({
        x: 97.4,
        y: 91.2,
        z: 25,
        wallStrength: 1.6,
        floorStrength: 1.2,
        innerBevel: 15,
        outerBevel: 1,
        compartments: [1],
        includeNorthBevel: true,
        includeSouthBevel: true,
        includeEastBevel: true,
        includeWestBevel: true,
        includeTopMagnets: false,
        includeFloorMagnets: false,
    }),
    workers: basicBitBox({
        x: 215,
        y: 65.8,
        z: 25,
        wallStrength: 1.6,
        floorStrength: 1.2,
        innerBevel: 15,
        outerBevel: 1,
        compartments: [4],
        includeNorthBevel: false,
        includeSouthBevel: false,
        includeEastBevel: true,
        includeWestBevel: true,
        includeTopMagnets: false,
        includeFloorMagnets: false,
    }),
    cards: basicCardHolder({
        cardHeight: 88.8,
        cardWidth: 57,
        holderHeight: 25,
        cardClearance: 0,
        wallStrength: 1.2,
        floorStrength: 1.2,
        stackCount: 2,
        cutoutWidth: 28.5,
        includeNorthCutout: true,
        includeSouthCutout: true,
        includeEastCutout: true,
        includeWestCutout: true,
        includeInnerWallCutouts: true,
        includeFloorCutouts: true,
    }),
};

const main = ({ selection }) => {
    console.log(selection);
    return configs[selection];
};

const getParameterDefinitions = () => {
    return [
        {
            name: "selection",
            type: "choice",
            caption: "Select element",
            values: Object.keys(configs),
            initial: Object.keys(configs)[0],
        },
    ];
};

module.exports = { main, getParameterDefinitions };
