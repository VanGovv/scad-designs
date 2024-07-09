const jscad = require("@jscad/modeling");

const { degToRad } = jscad.utils;
const { rotate } = jscad.transforms;

const rotateDeg = ([x, y, z], ...rest) => {
    return rotate([degToRad(x), degToRad(y), degToRad(z)], ...rest);
};


module.exports = { rotateDeg };