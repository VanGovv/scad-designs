const jscad = require("@jscad/modeling");

const { union } = jscad.booleans;
const { extrudeLinear } = jscad.extrusions;
const { hullChain } = jscad.hulls;
const { cuboid, circle, cylinder } = jscad.primitives;
const { vectorText } = jscad.text;
const { translate, align } = jscad.transforms;
const { subtract } = jscad.booleans;

const main = () => {
    const innerD = 17.5,
        outerD = 30,
        cutoutWidth = 20,
        cutoutOffset = 5,
        height = 50,
        innerheight = 10,
        floorStrength = 1.6,
        wallStrength = 1.6;


    return union(
        subtract(
            union(
                cylinder({ height, radius: outerD / 2 + wallStrength }),
                translate([outerD/2 + wallStrength, 0, -height/2 + cutoutOffset /2], subtract(
                    cylinder({ height: cutoutOffset, radius: 5 }),
                    cylinder({ height: cutoutOffset, radius: 2 }),
                ))
            ),
            cylinder({
                height: height - floorStrength,
                radius: outerD / 2,
                center: [0, 0, floorStrength / 2],
            }),
            cuboid({ size: [cutoutWidth, cutoutWidth, height - cutoutOffset], center: [outerD / 2, 0, cutoutOffset / 2] }),
        ),
        translate([0,0,-height/2 + innerheight/2 + floorStrength], cylinder({
                height: innerheight,
                radius: innerD /2 ,
            }))
    );
};

module.exports = { main };
