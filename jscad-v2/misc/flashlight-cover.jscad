const jscad = require("@jscad/modeling");
const rotateDeg = require("../utils.jscad").rotateDeg;
const { cylinder } = jscad.primitives;
const { translate } = jscad.transforms;
const { subtract, union } = jscad.booleans;

const getParameterDefinitions = () => {
    return [
        {
            name: "modelName",
            type: "text",
            initial: "flashlightCover",
            disabled: true,
            hidden: true,
            caption: "flashlightCover",
        },
        { name: "innerD", type: "int", initial: 40, caption: "innerD" },
        { name: "poleD", type: "int", initial: 3, caption: "poleD" },
        { name: "ringHeight", type: "int", initial: 2, caption: "ringHeight" },
        { name: "poleHeight", type: "int", initial: 50, caption: "poleHeight" },
        { name: "poleCount", type: "int", initial: 8, caption: "poleCount" },
    ];
};

const main = (params) => {
    return flashlightCover(params);
};

const getModelName = () => "flashlightCover";

module.exports = { main, getParameterDefinitions, getModelName };

const flashlightCover = ({ innerD, poleD, ringHeight, poleHeight, poleCount } = {}) => {
    const outer = cylinder({ radius: innerD / 2 + poleD, height: ringHeight, segments: 360 });
    const inner = cylinder({ radius: innerD / 2, height: ringHeight, segments: 360 });

    const pole = cylinder({ radius: poleD / 2, height: poleHeight });
    const poles = [];

    for (let i = 0; i < poleCount; i++) {
        poles.push(
            rotateDeg([0, 0, (360 / poleCount) * i], translate([0, innerD / 2 + poleD / 2, poleHeight / 2], pole))
        );
    }

    return union(subtract(outer, inner), poles);
};
