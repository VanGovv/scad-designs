const jscad = require("@jscad/modeling");
const { degToRad } = jscad.utils;
const { cuboid, cylinder } = jscad.primitives;
const { translate, rotate } = jscad.transforms;
const { subtract } = jscad.booleans;

const getParameterDefinitions = () => {
    return [
        { name: "x", type: "int", initial: 30, caption: "X" },
        { name: "y", type: "int", initial: 20, caption: "Y" },
        { name: "z", type: "int", initial: 10, caption: "Z" },
        { name: "r", type: "int", initial: 3, caption: "R" },
    ];
};

const main = (params) => {
    return beveledCube(params);
};

const beveledCube = ({
    x,
    y,
    z,
    size,
    r = 0,
    exclude = [],
    include = ["tw", "tn", "ts", "te", "bw", "bn", "bs", "be", "nw", "ne", "sw", "se"],
    getBevels = false,
} = {}) => {

    if (size) {
        [x, y, z] = size;
    }

    exclude.forEach((e) => {
        include = include.filter((x) => !x.includes(e));
    });

    const bevels = [];

    if (r) {
        let R = r.length ? r[0] : r;
        let [xr, yr, zr] = [(-x + R) / 2, (-y + R) / 2, (-z + R) / 2];
        if (R) {
            if (include.includes("nw")) bevels.push(translate([xr, yr, 0], rotateDeg([0, 0, 0], bevel(z, R))));
            if (include.includes("sw")) bevels.push(translate([-xr, yr, 0], rotateDeg([0, 0, 90], bevel(z, R))));
            if (include.includes("se")) bevels.push(translate([-xr, -yr, 0], rotateDeg([0, 0, 180], bevel(z, R))));
            if (include.includes("ne")) bevels.push(translate([xr, -yr, 0], rotateDeg([0, 0, 270], bevel(z, R))));
        }

        R = r.length ? r[1] : r;
        [xr, yr, zr] = [(-x + R) / 2, (-y + R) / 2, (-z + R) / 2];
        if (R) {
            if (include.includes("bw")) bevels.push(translate([0, yr, zr], rotateDeg([0, -90, 0], bevel(x, R))));
            if (include.includes("be")) bevels.push(translate([0, -yr, zr], rotateDeg([0, -90, 180], bevel(x, R))));
            if (include.includes("bs")) bevels.push(translate([-xr, 0, zr], rotateDeg([0, -90, 90], bevel(y, R))));
            if (include.includes("bn")) bevels.push(translate([xr, 0, zr], rotateDeg([0, -90, 270], bevel(y, R))));
        }

        R = r.length ? r[2] : r;
        [xr, yr, zr] = [(-x + R) / 2, (-y + R) / 2, (-z + R) / 2];
        if (R) {
            if (include.includes("tw")) bevels.push(translate([0, yr, -zr], rotateDeg([0, 90, 0], bevel(x, R))));
            if (include.includes("te")) bevels.push(translate([0, -yr, -zr], rotateDeg([0, 90, 180], bevel(x, R))));
            if (include.includes("ts")) bevels.push(translate([-xr, 0, -zr], rotateDeg([0, 90, 90], bevel(y, R))));
            if (include.includes("tn")) bevels.push(translate([xr, 0, -zr], rotateDeg([0, 90, 270], bevel(y, R))));
        }
    }

    const c = subtract(cuboid({ size: [x, y, z] }), ...bevels);

    return getBevels ? { c, bevels } : c;
};

const bevel = (h, r) => {
    return subtract(cuboid({ size: [r, r, h] }), translate([r / 2, r / 2, 0], cylinder({ radius: r, height: h })));
};

const rotateDeg = ([x, y, z], ...rest) => {
    return rotate([degToRad(x), degToRad(y), degToRad(z)], ...rest);
};


module.exports = { main, getParameterDefinitions, bevel, rotateDeg };