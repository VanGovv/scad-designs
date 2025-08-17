const { squareHatch: hatchFun } = require("./utils.jscad")

const getParameterDefinitions = () => {
    return [
        { name: "x", type: "float", initial: 60, caption: "Width" },
        { name: "y", type: "float", initial: 60, caption: "Depth" },
        { name: "z", type: "float", initial: 30, caption: "Height" },
        { name: "strength", type: "float", initial: 5, caption: "Bridge strength" },
        { name: "rotation", type: "float", initial: 30, caption: "Rotation" },
        { name: "distance", type: "float", initial: 10, caption: "Distance" },
        { name: "cornerBevel", type: "float", initial: 1, caption: "Corner bevel" },
        { name: "cutoffPercent", type: "float", initial: 50, caption: "Maximum cutoff" },
        { name: "maxIterations", type: "float", initial: 5, caption: "Maximum Iterations" },
    ];
};

const hatch = (config) => {
    console.log(config)
    return hatchFun(config)
};

module.exports = { main: hatch, getParameterDefinitions, includeHatchParameters: getParameterDefinitions().map(p => ({...p, name: "hatch_" + p.name, caption: "Hatch " + p.caption})) };
