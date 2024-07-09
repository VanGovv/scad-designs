const basicBitBox = require("../basicBitBox.jscad").main;
const basicCardHolder2 = require("../basicCardHolder2.jscad").main;

const configs = {
    setup: basicBitBox({
        x: 216.8,
        y: 70,
        z: 20,
        wallStrength: 1.2,
        floorStrength: .96,
        innerBevel: 0,
        outerBevel: 1,
        compartments: [[91.8, 30.6,30.6,36.8, 19.8]],
        includeNorthBevel: true,
        includeSouthBevel: true,
        includeEastBevel: true,
        includeWestBevel: true,
        includeTopMagnets: false,
        includeFloorMagnets: false,
    }),
    player: basicBitBox({
        x: 95.5,
        y: 70,
        z: 15,
        wallStrength: 1.2,
        floorStrength: .96,
        innerBevel: 5,
        outerBevel: 1,
        compartments: [1],
        includeNorthBevel: true,
        includeSouthBevel: true,
        includeEastBevel: true,
        includeWestBevel: true,
        includeTopMagnets: false,
        includeFloorMagnets: false,
    }),
    activePlay: basicBitBox({
        x: 140.4,
        y: 48,
        z: 15,
        wallStrength: 1.2,
        floorStrength: .96,
        innerBevel: 10,
        outerBevel: 1,
        compartments: [[2,3,3]],
        includeNorthBevel: false,
        includeSouthBevel: false,
        includeEastBevel: true,
        includeWestBevel: true,
        includeTopMagnets: false,
        includeFloorMagnets: false,
    }),
    expansionSetup: basicBitBox({
        x: 76.5,
        y: 48,
        z: 15,
        wallStrength: 1.2,
        floorStrength: .96,
        innerBevel: 1,
        outerBevel: 1,
        compartments: [1],
        includeNorthBevel: true,
        includeSouthBevel: true,
        includeEastBevel: true,
        includeWestBevel: true,
        includeTopMagnets: false,
        includeFloorMagnets: false,
    }),
    cards : basicCardHolder2({
        cardHeight: 97 -2.4,
        cardWidth: 70 - .96,
        holderDepth: 45 - 2.4,
        cardClearance: 0,
        wallStrength: 1.2,
        floorStrength: .96,
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
