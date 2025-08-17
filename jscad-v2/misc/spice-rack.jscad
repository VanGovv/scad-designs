const jscad = require("@jscad/modeling");
const { union } = require("@jscad/modeling/src/operations/booleans");

const { main: hatchPanel } = require("../hatchPanel2.jscad");
const { rotateDeg } = require("../utils.jscad");

const { cuboid } = jscad.primitives;
const { translate } = jscad.transforms;
const { subtract } = jscad.booleans;

const { sqrt } = Math;

const getParameterDefinitions = () => {
    return [
        {
            name: "modelName",
            type: "choice",
            caption: "Select element",
            values: ["rackL", "rackR", "floor1", "floor2", "floor3"],
            initial: "rackL",
        },
        { name: "width", type: "float", initial: 133.5, caption: "Width" },
        { name: "wallStrength", type: "float", initial: 2.4, caption: "Wall size" },
        { name: "hexDiameter", type: "float", initial: 21, caption: "Hex diameter" },
        { name: "floorSink", type: "float", initial: 37.5, caption: "Floor sink" },
        { name: "spiceHeight", type: "float", initial: 92, caption: "Spice height" },
        { name: "spiceDepth", type: "float", initial: 48, caption: "spice depth" },
    ];
};

const main = (params) => {
    return spiceRack(params);
};

module.exports = { main, getParameterDefinitions };

const spiceRack = (config) => {
    const { width, wallStrength, hexDiameter, floorSink, spiceHeight, spiceDepth } = config;

    const objects = {};

    const sidePanelL0 = {
        x: floorSink,
        y: spiceDepth + 2 * wallStrength,
        z: wallStrength,
        borderStrength: wallStrength,
        strength: wallStrength,
        hexDiameter,
    };

    const sidePanelL1 = {
        x: spiceHeight + wallStrength,
        y: spiceDepth + 2 * wallStrength,
        z: wallStrength,
        borderStrength: wallStrength,
        strength: wallStrength,
        hexDiameter,
    };

    const sidePanelL2 = {
        x: spiceHeight * 2 - floorSink + wallStrength,
        y: spiceDepth + 2 * wallStrength,
        z: wallStrength,
        borderStrength: wallStrength,
        strength: wallStrength,
        hexDiameter,
    };

    const sidePanelL3L = {
        x: spiceHeight * 2 - floorSink + wallStrength,
        y: 90 + 2 * wallStrength,
        z: wallStrength,
        borderStrength: wallStrength,
        strength: wallStrength,
        hexDiameter,
    };

    const sidePanelL3R = { ...sidePanelL3L, x: sidePanelL3L.x - floorSink };

    const sideL = rotateDeg(
        [0, 90, 0],
        union(
            translate(
                [-sidePanelL0.x / 2, -sidePanelL0.y / 2 - sidePanelL0.y + wallStrength, 0],
                hatchPanel(sidePanelL0)
            ),
            translate([-sidePanelL1.x / 2, -sidePanelL1.y / 2, 0], hatchPanel(sidePanelL1)),
            translate(
                [-sidePanelL2.x / 2, -sidePanelL2.y / 2 + sidePanelL1.y - wallStrength, 0],
                hatchPanel(sidePanelL2)
            ),
            translate(
                [-sidePanelL3L.x / 2, -sidePanelL3L.y / 2 + sidePanelL1.y + sidePanelL3L.y - wallStrength * 2, 0],
                hatchPanel(sidePanelL3L)
            )
        )
    );

    const sideR = rotateDeg(
        [0, 90, 0],
        union(
            translate(
                [-sidePanelL0.x / 2, -sidePanelL0.y / 2 - sidePanelL0.y + wallStrength, 0],
                hatchPanel(sidePanelL0)
            ),
            translate([-sidePanelL1.x / 2, -sidePanelL1.y / 2, 0], hatchPanel(sidePanelL1)),
            translate(
                [-sidePanelL2.x / 2, -sidePanelL2.y / 2 + sidePanelL1.y - wallStrength, 0],
                hatchPanel(sidePanelL2)
            ),
            translate(
                [-sidePanelL3R.x / 2, -sidePanelL3R.y / 2 + sidePanelL1.y + sidePanelL3R.y - wallStrength * 2, 0],
                hatchPanel(sidePanelL3R)
            )
        )
    );

    const sides = union(
        translate([-width / 2 + wallStrength / 2, sidePanelL1.y - wallStrength / 2, 0], sideL),
        translate([width / 2 - wallStrength / 2, sidePanelL1.y - wallStrength / 2, 0], sideR)
    );

    const frontPanel0Config = {
        x: width,
        y: sidePanelL0.x,
        z: wallStrength,
        borderStrength: wallStrength,
        strength: wallStrength,
        hexDiameter,
    };

    const front0 = translate(
        [0, -sidePanelL0.y + wallStrength, frontPanel0Config.y / 2],
        rotateDeg([90, 0, 0], hatchPanel(frontPanel0Config))
    );

    const frontPanel1Config = {
        x: width,
        y: sidePanelL1.x,
        z: wallStrength,
        borderStrength: wallStrength,
        strength: wallStrength,
        hexDiameter,
    };

    const front1 = translate([0, 0, frontPanel1Config.y / 2], rotateDeg([90, 0, 0], hatchPanel(frontPanel1Config)));

    const frontPanel2Config = {
        x: width,
        y: sidePanelL2.x,
        z: wallStrength,
        borderStrength: wallStrength,
        strength: wallStrength,
        hexDiameter,
    };

    const front2 = translate(
        [0, sidePanelL1.y - wallStrength, frontPanel2Config.y / 2],
        rotateDeg([90, 0, 0], hatchPanel(frontPanel2Config))
    );

    const frontPanel3Config = {
        x: width,
        y: sidePanelL3R.x,
        z: wallStrength,
        borderStrength: wallStrength,
        strength: wallStrength,
        hexDiameter,
    };

    const front3 = translate(
        [0, sidePanelL1.y + sidePanelL2.y - wallStrength * 2, frontPanel3Config.y / 2],
        rotateDeg([90, 0, 0], hatchPanel(frontPanel3Config))
    );

    const backPanelConfig = {
        x: width,
        y: sidePanelL3L.x,
        z: wallStrength,
        borderStrength: wallStrength,
        strength: wallStrength,
        hexDiameter,
    };

    const back = translate(
        [0, sidePanelL1.y + sidePanelL2.y + sidePanelL3L.y - wallStrength * 3, backPanelConfig.y / 2],
        rotateDeg([90, 0, 0], hatchPanel(backPanelConfig))
    );

    const floorHolder = ({ x, y, z }) => {
        const floor = translate(
            [0, 0, z / 2],
            cuboid({
                size: [x, y, z],
            })
        );

        const cutout1 = rotateDeg(
            [45, 0, 0],
            cuboid({
                size: [x - 2 * z, sqrt((y - 2 * z) ** 2 / 2), sqrt((y - 2 * z) ** 2 / 2)],
            })
        );

        const cutout2 = rotateDeg(
            [0, 45, 0],
            cuboid({
                size: [sqrt((x - 2 * z) ** 2 / 2), y - 2 * z, sqrt((x - 2 * z) ** 2 / 2)],
            })
        );

        return union(subtract(floor, cutout1), subtract(floor, cutout2));
    };

    const floorHolder1 = translate(
        [0, sidePanelL1.y / 2 - wallStrength / 2, sidePanelL1.x - floorSink - wallStrength],
        floorHolder({ x: width, y: sidePanelL1.y, z: wallStrength })
    );

    const floorHolder2 = translate(
        [
            0,
            sidePanelL2.y / 2 - wallStrength / 2 + sidePanelL1.y - wallStrength,
            sidePanelL2.x - floorSink - wallStrength,
        ],
        floorHolder({ x: width, y: sidePanelL2.y, z: wallStrength })
    );

    const floorHolder3 = translate(
        [
            0,
            sidePanelL3L.y / 2 - wallStrength / 2 + sidePanelL1.y + sidePanelL2.y - wallStrength * 2,
            sidePanelL3L.x - floorSink - wallStrength,
        ],
        floorHolder({ x: width, y: sidePanelL3L.y, z: wallStrength })
    );

    const floor0 = translate(
        [0, -(sidePanelL0.y - 2 * wallStrength) / 2, wallStrength / 2],
        hatchPanel({
            x: width,
            y: sidePanelL0.y,
            z: wallStrength,
            borderStrength: 2,
            strength: 2,
            hexDiameter: 8,
        })
    );

    objects.rackL = [sides, front0, front1, front2, front3, back, floorHolder1, floorHolder2, floorHolder3, floor0];
    objects.rackR = [sides, front0, front1, front2, front3, back, floorHolder1, floorHolder2, floorHolder3, floor0];

    objects.floor1 = hatchPanel({
        x: sidePanelL1.y - 2 * wallStrength - 0.1,
        y: width - 2 * wallStrength - 0.1,
        z: wallStrength,
        borderStrength: 2,
        strength: 2,
        hexDiameter: 8,
    });
    objects.floor2 = hatchPanel({
        x: sidePanelL2.y - 2 * wallStrength - 0.1,
        y: width - 2 * wallStrength - 0.1,
        z: wallStrength,
        borderStrength: 2,
        strength: 2,
        hexDiameter: 8,
    });
    objects.floor3 = hatchPanel({
        x: sidePanelL3L.y - 2 * wallStrength - 0.1,
        y: width - wallStrength - 0.1,
        z: wallStrength,
        borderStrength: 2,
        strength: 2,
        hexDiameter: 8,
    });

    return objects[config.modelName];
};
