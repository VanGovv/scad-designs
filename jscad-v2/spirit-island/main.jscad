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
        innerWallStrength: 0.8,
        outerWallStrength: 0.8,
        floorStrength: part === "bottom" ? 0.72 : 0.96,
        innerBevelRadius: part === "bottom" ? 6 : 0,
        outerBevelRadius: 0,
        splitHeightP: 50,
        slideP: 30,
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

const configs = {
    szenarioMarkersTop: szenarioMarkers("top"),
    szenarioMarkersBottom: szenarioMarkers("bottom"),
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
        holderDepth: 91.5,
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
