const jscad = require("@jscad/modeling");

const { squareHatch: hatchFun } = require("./utils.jscad")
const { main: beveledCube } = require("./beveledCube.jscad");
const { subtract } = jscad.booleans;

const getParameterDefinitions = () => {
    return [
        { name: "x", type: "float", initial: 60, caption: "Width" },
        { name: "y", type: "float", initial: 60, caption: "Depth" },
        { name: "z", type: "float", initial: 3, caption: "Height" },
        { name: "borderStrength", type: "float", initial: 3, caption: "Boarder strength" },
        { name: "strength", type: "float", initial: 3, caption: "Bridge strength" },
        { name: "rotation", type: "float", initial: 30, caption: "Rotation" },
        { name: "distance", type: "float", initial: 10, caption: "Distance" },
        { name: "cornerBevel", type: "float", initial: 1, caption: "Corner bevel" },
        { name: "cutoffPercent", type: "float", initial: 50, caption: "Maximum cutoff" },
        { name: "maxIterations", type: "float", initial: 5, caption: "Maximum Iterations" },
    ];
};

const hatchPanel = (config) => {

    const hatchConfig = {...config,
        x: config.x - config.borderStrength,
        y: config.y - config.borderStrength,
    }
    const hatch = hatchFun(hatchConfig)
    const panelBase = beveledCube(config);

    return subtract(panelBase, hatch)
};

module.exports = { main: hatchPanel, getParameterDefinitions, includeHatchParameters: getParameterDefinitions().map(p => ({...p, name: "hatch_" + p.name, caption: "Hatch " + p.caption})) };
