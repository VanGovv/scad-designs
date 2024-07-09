const doubleWalledBox = require("../doubleWalledBox.jscad").main;

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
        z: 26.5,
        innerWallStrength: 0.8,
        outerWallStrength: 0.8,
        floorStrength: part === "bottom" ? 0.48 : 0.96,
        innerBevelRadius: part === "bottom" ? 6 : 0,
        outerBevelRadius: 0,
        splitHeightP: 60,
        slideP: 30,
        clearance: 0.1,
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
            hatchCutoffPercent: 70
        }),
        part,
    });

const configs = {
    playerTop: playerConfig("top"),
    playerBottom: playerConfig("bottom"),
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
