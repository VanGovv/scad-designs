const jscad = require("@jscad/modeling");
const { hatch, rotateDeg } = require("../utils.jscad");
const doubleWalledBox = require("../doubleWalledBox.jscad").main;
const { subtract } = jscad.booleans;

const getParameterDefinitions = () => {
    return [
        {
            name: "part",
            type: "choice",
            caption: "part",
            values: ["top", "bottom"],
        },];
};

const main = (params) => {
    return spiritBox(params);
};

const getModelName = () => "spiritBoxBot";

module.exports = { main, getParameterDefinitions, getModelName };

const spiritBox = ({part}) => {
    const box = doubleWalledBox({
        x: 154,
        y: 100,
        z: 230,
        innerWallStrength: 1,
        outerWallStrength: 1,
        floorStrength: 1,
        coverStrength: 1,
        innerBevelRadius: 0,
        outerBevelRadius: 1,
        splitHeightP: 40,
        slideP: 20,
        clearance: 0.2,
        includeWalls: false,
        part
    });

    return subtract(
        box,
        rotateDeg(
            [90, 0, 0],
            hatch({
                x: 134 + 4,
                y: 210 + 2,
                z: 100 + 8,
                distance: 24,
                strength: 8,
                bevel: 2,
                rotation: 45,
                cutoffPercent: 50,
                maxIterations: 4
            })
        )
    );
};
