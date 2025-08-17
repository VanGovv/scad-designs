const jscad = require("@jscad/modeling");

const { hexHatch: hatchFun } = require("./utils.jscad")
const { main: beveledCube } = require("./beveledCube.jscad");
const { subtract } = jscad.booleans;

const getParameterDefinitions = () => {
    return [
        { name: "x", type: "float", initial: 50, caption: "Width" },
        { name: "y", type: "float", initial: 70, caption: "Depth" },
        { name: "z", type: "float", initial: 3, caption: "Height" },
        { name: "borderStrength", type: "float", initial: 5, caption: "Border strength" },
        { name: "strength", type: "float", initial: 3, caption: "Bridge strength" },
        { name: "hexDiameter", type: "float", initial: 10, caption: "Hex diameter" },
    ];
};

const hatchPanel = (config) => {

    const hatchConfig = {...config,
        x: config.x - config.borderStrength * 2,
        y: config.y - config.borderStrength * 2,
    }
    const hatch = hatchFun(hatchConfig)
    const hatchBase = beveledCube(hatchConfig);
    const panelBase = beveledCube(config);

    return subtract(panelBase, subtract(hatchBase, subtract(hatchBase, hatch)))
};

module.exports = { main: hatchPanel, getParameterDefinitions, includeHatchParameters: getParameterDefinitions().map(p => ({...p, name: "hatch_" + p.name, caption: "Hatch " + p.caption})) };
