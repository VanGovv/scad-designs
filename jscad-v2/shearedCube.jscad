const jscad = require("@jscad/modeling");
const { translate, transform } = jscad.transforms;
const { union } = jscad.booleans;

const { main: beveledCube } = require("./beveledCube.jscad");

const getParameterDefinitions = () => {
    return [
        { name: "x", type: "int", initial: 30, caption: "X" },
        { name: "y", type: "int", initial: 20, caption: "Y" },
        { name: "z", type: "int", initial: 10, caption: "Z" },
        { name: "r", type: "int", initial: 3, caption: "R" },
    ];
};

const main = (params) => {
    return shearedCube(params);
};

// buggy when topsize < fullsize and floorSize = floorsize
const shearedCube = ({
    x,
    y,
    z,
    size,
    r = 0,
    exclude = [],
    include = ["tw", "tn", "ts", "te", "bw", "bn", "bs", "be", "nw", "ne", "sw", "se"],
    fullSizeX,
    fullSizeY,
    floorSizeX,
    floorSizeY,
    topSizeX,
    topSizeY,
} = {}) => {
    if (size) {
        [x, y, z] = size;
    }

    fullSizeX = fullSizeX || x
    fullSizeY = fullSizeY || y
    floorSizeX = floorSizeX || x
    floorSizeY = floorSizeY || y
    topSizeX = topSizeX || x
    topSizeY = topSizeY || y

    console.log(z)

    const skew = (fullSizeX - floorSizeX) / z;
    const skewY = (fullSizeY - floorSizeY) / z;

    const topSkew = (fullSizeX - topSizeX) / z;
    const topSkewY = (fullSizeY - topSizeY) / z;

    return union(
        transform(
            // prettier-ignore
            [
                  1, 0, 0, 0,
                  0, 1, 0, 0,
                  skew, skewY, 1, 0,
                  0, 0, 0, 1],
            beveledCube({ size: [floorSizeX, floorSizeY, z], r, exclude, include })
        ),
        translate(
            [-(fullSizeX - floorSizeX) / 2 + (fullSizeX - topSizeX) / 2, 0, 0],
            transform(
                // prettier-ignore
                [
                  1, 0, 0, 0,
                  0, 1, 0, 0,
                  topSkew, skewY, 1, 0,
                  0, 0, 0, 1],
                beveledCube({ size: [floorSizeX, floorSizeY, z], r, exclude, include })
            )
        ),
        translate(
            [0, -(fullSizeY - floorSizeY) / 2 + (fullSizeY - topSizeY) / 2, 0],
            transform(
                // prettier-ignore
                [
                  1, 0, 0, 0,
                  0, 1, 0, 0,
                  skew, topSkewY, 1, 0,
                  0, 0, 0, 1],
                beveledCube({ size: [floorSizeX, floorSizeY, z], r, exclude, include })
            )
        ),
        translate(
            [
                -(fullSizeX - floorSizeX) / 2 + (fullSizeX - topSizeX) / 2,
                -(fullSizeY - floorSizeY) / 2 + (fullSizeY - topSizeY) / 2,
                0,
            ],
            transform(
                // prettier-ignore
                [
                      1, 0, 0, 0,
                      0, 1, 0, 0,
                      topSkew, topSkewY, 1, 0,
                      0, 0, 0, 1
                  ],
                beveledCube({ size: [floorSizeX, floorSizeY, z], r, exclude, include })
            )
        )
    );
};

module.exports = { main, getParameterDefinitions, shearedCube: shearedCube };
