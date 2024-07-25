const doubleWalledBox = require("../doubleWalledBox.jscad").main;
const basicCardHolder2 = require("../basicCardHolder2.jscad").main;

const spiritConfig = (part) =>
    doubleWalledBox({
        x: 153,
        y: 88,
        z: 230,
        innerWallStrength: 1.2,
        outerWallStrength: 1.2,
        floorStrength: 1.2,
        coverStrength: 1.2,
        innerBevelRadius: 0,
        outerBevelRadius: 1,
        splitHeightP: 50,
        slideP: 30,
        clearance: 0.2,
        includeWalls: false,
        part,
    });
const playerConfig = (part) =>
    doubleWalledBox({
        x: 34,
        y: 53,
        z: 21,
        innerWallStrength: 0.8,
        outerWallStrength: 0.8,
        floorStrength: part === "bottom" ? 0.48 : 0.96,
        innerBevelRadius: part === "bottom" ? 6 : 0,
        outerBevelRadius: 0,
        splitHeightP: 50,
        slideP: 37.5,
        clearance: 0.2,
        includeWalls: true,
        ...(part === "bottom" ? {
            includeHatch: false,
        } : {
            includeHatch: true,
            hatchClearance: 2,
            hatchStrength: 3,
            hatchDistance: 12,
            hatchCornerBevel: 2, 
            hatchRotation: 45, 
            hatchCutoffPercent: 70,
            hatchMaxIterations: 2
        }),
        part,
    });
const szenarioMarkers = (part) =>
    doubleWalledBox({
        x: 67,
        y: 60.5,
        z: 26.5,
        innerWallStrength: 8,
        outerWallStrength: 8,
        floorStrength: part === "bottom" ? 0.72 : 0.96,
        innerBevelRadius: part === "bottom" ? 6 : 0,
        outerBevelRadius: 0,
        splitHeightP: 50,
        slideP: 30,
        clearance: 2,
        includeWalls: true,
        compartments: [1, 1],
        yRelatives: [3, 2],
        ...(part === "bottom" ? {
            includeHatch: false,
        } : {
            includeHatch: true,
            hatchClearance: 2,
            hatchStrength: 3,
            hatchDistance: 12,
            hatchCornerBevel: 2, 
            hatchRotation: 45, 
            hatchCutoffPercent: 60,
            hatchMaxIterations: 2
        }),
        part,
    });
const hazardMarkers = (part) =>
    doubleWalledBox({
        x: 160,
        y: 83,
        z: 28.4, // 26.5?
        innerWallStrength: 0.8,
        outerWallStrength: 0.8,
        floorStrength: part === "bottom" ? 0.48 : 0.96,
        innerBevelRadius: part === "bottom" ? 20 : 0,
        includeNorthBevel: false,
        includeSouthBevel: false,
        includeEastBevel: true,
        includeWestBevel: true,
        outerBevelRadius: 0,
        splitHeightP: 50,
        slideP: 30,
        clearance: 0.2,
        includeWalls: true,
        compartments: [5],
        ...(part === "bottom" ? {
            includeHatch: false,
        } : {
            includeHatch: true,
            hatchClearance: 2,
            hatchStrength: 3,
            hatchDistance: 10,
            hatchCornerBevel: 2, 
            hatchRotation: 45, 
            hatchCutoffPercent: 60,
            hatchMaxIterations: 2
        }),
        part,
    });

const configs = {
    szenarioMarkersTop: szenarioMarkers("top"),
    szenarioMarkersBottom: szenarioMarkers("bottom"),
    hazardTest: doubleWalledBox({
        x: 20.6,
        y: 83,
        z: 26.26,
        innerWallStrength: 0.8,
        outerWallStrength: 0,
        floorStrength: 0.24,
        innerBevelRadius: 20,
        includeNorthBevel: false,
        includeSouthBevel: false,
        includeEastBevel: true,
        includeWestBevel: true,
        outerBevelRadius: 0,
        splitHeightP: 50,
        slideP: 30,
        clearance: 0.2,
        includeWalls: true,
        compartments: [1],
        part: "bottom",
        includeHatch: false,
    }),
    hazardMarkersBottom: hazardMarkers("bottom"),
    hazardMarkersTop: hazardMarkers("top"),
    syenarioCardHolder: basicCardHolder2({
        cardHeight: 103,
        cardWidth: 153,
        holderDepth: 9,
        cardClearance: 0,
        wallStrength: .8,
        floorStrength: 1.2,
        cutoutWidth: 50,
    }),
    playerBottom: playerConfig("bottom"),
    playerTop: playerConfig("top"),
    spiritPowerCards: basicCardHolder2({
        cardHeight: 92,
        cardWidth: 66.5,
        holderDepth: 91.5,
        cardClearance: 0,
        wallStrength: .8,
        floorStrength: 1.2
    }),
    playerAids: basicCardHolder2({
        cardHeight: 92,
        cardWidth: 66.5,
        holderDepth: 18,
        cardClearance: 0,
        wallStrength: .8,
        floorStrength: 1.2
    }),
    spiritsBottom: spiritConfig("bottom"),
    spiritsTop: spiritConfig("top"),
};

const main = ({ modelName }) => configs[modelName];

const getParameterDefinitions = () => {
    return [
        {
            name: "modelName",
            type: "choice",
            caption: "Select element",
            values: Object.keys(configs),
            initial: Object.keys(configs)[0],
        },
    ];
};

module.exports = { main, getParameterDefinitions };
