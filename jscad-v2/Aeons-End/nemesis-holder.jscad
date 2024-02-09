const jscad = require("@jscad/modeling");

const beveledCube = require("../beveledCube.jscad").main;

const { subtract, union } = jscad.booleans;
const { cuboid, cylinder } = jscad.primitives;
const { translate, rotate } = jscad.transforms;
const { hull } = jscad.hulls;

const getParameterDefinitions = () => {
  return [
    { name: "showHolder", type: "checkbox", checked: true, caption: "Show holder" },
    { name: "showCover", type: "checkbox", checked: false, caption: "Show cover" },
    { name: "wallSize", type: "float", initial: 1.2, caption: "Wall size" },
    { name: "floorStrength", type: "float", initial: 0.6, caption: "floorStrength" },
  ];
};

const main = ({ wallSize, floorStrength, showHolder, showCover }) => {
  const holderSize = [112.8, 121, 10 + floorStrength];
  const coverSize = [112.8, 121, 10 + floorStrength];

  const holder = translate([0, 0, -holderSize[2] / 2], cuboid({ size: holderSize }));
  const cover = translate([0, 0, coverSize[2] / 2], cuboid({ size: coverSize }));

  const sizes = {
    th: [103, 16, 20],
    rdv: [47.5, 47.5, 20], // 8 + floor
    ldv: [25, 25, 6], // 2 + floor
    wb: [25, 25, 6],
    maid2: [40, 32, 20],
    st: [20, 16.5, 20],
    m: [20, 24, 20],
    hg: [20, 24, 20],
    cara: [20, 32, 20],
    prophet: [20, 32, 20],
    fury: [20, 32, 20],
    maid: [20, 34, 20],
    magnet: { radius: 5.5, height: 2.1 },
    rdvFinger: { radius: 10, height: holderSize[2] - floorStrength },
  };

  const col1distance = (holderSize[0] - (sizes.rdv[0] + sizes.maid2[0] + sizes.maid[0] + 2 * wallSize)) / 2;
  const col2distance = (holderSize[0] - (sizes.ldv[0] + sizes.cara[0] + sizes.fury[0] + sizes.prophet[0] + 2 * wallSize)) / 3;

  const row1distance = (holderSize[1] - (sizes.th[1] + sizes.rdv[1] + sizes.ldv[1] + sizes.wb[1] + 2 * wallSize)) / 3;
  const row2distance = (holderSize[1] - (sizes.th[1] + sizes.rdv[1] + sizes.st[1] + sizes.cara[1] + 2 * wallSize + row1distance)) / 2;
  const row4distance = (holderSize[1] - (sizes.th[1] + sizes.maid[1] + sizes.hg[1] + sizes.prophet[1] + 2 * wallSize + row1distance)) / 2;

  const cutouts = {
    th: translate([0, holderSize[1] / 2 - sizes.th[1] / 2 - wallSize, 0], cuboid({ size: sizes.th })),
    rdv: translate(
      [(holderSize[0] - sizes.rdv[0]) / 2 - wallSize, holderSize[1] / 2 - sizes.th[1] - sizes.rdv[1] / 2 - wallSize - row1distance, 0],
      subtract(
        cuboid({ size: sizes.rdv }),
        subtract(
          hull(
            translate([0, 0, -sizes.rdv[2] / 2 + 0.00005], cuboid({ size: [sizes.rdv[0], sizes.rdv[1], 0.0001] })),
            translate([sizes.rdv[0] / 2 - 0.00005, 0, 0], cuboid({ size: [0.0001, sizes.rdv[1], holderSize[2] / 2 - wallSize] }))
          )
        )
      )
    ),
    ldv: translate(
      [
        (holderSize[0] - sizes.ldv[0]) / 2 - wallSize,
        holderSize[1] / 2 - sizes.th[1] - sizes.rdv[1] - sizes.ldv[1] / 2 - wallSize - row1distance * 2,
        -sizes.ldv[2] / 2,
      ],
      subtract(
        cuboid({ size: sizes.ldv }),
        translate(
          [0, 0, -sizes.ldv[2] / 2 + (sizes.ldv[2] - 2) / 2],
          beveledCube({ x: sizes.ldv[0] / 2, y: sizes.ldv[1] / 2, z: sizes.ldv[2] - 2, r: sizes.ldv[0] / 16, exclude: ["b"] })
        )
      )
    ),
    wb: translate(
      [
        (holderSize[0] - sizes.wb[0]) / 2 - wallSize,
        holderSize[1] / 2 - sizes.th[1] - sizes.rdv[1] - sizes.ldv[1] - sizes.wb[1] / 2 - wallSize - row1distance * 3,
        -sizes.wb[2] / 2,
      ],
      subtract(
        cuboid({ size: sizes.wb }),
        translate(
          [0, 0, -sizes.wb[2] / 2 + (sizes.wb[2] - 2) / 2],
          beveledCube({ x: sizes.wb[0] / 2, y: sizes.wb[1] / 2, z: sizes.wb[2] - 2, r: sizes.wb[0] / 16, exclude: ["b"] })
        )
      )
    ),
    maid2: translate(
      [
        (holderSize[0] - sizes.maid2[0]) / 2 - sizes.rdv[0] - wallSize - col1distance,
        holderSize[1] / 2 - sizes.th[1] - sizes.maid2[1] / 2 - wallSize - row1distance,
        0,
      ],
      subtract(
        cuboid({ size: sizes.maid2 }),
        hull(
          translate([sizes.maid2[0] / 2 - (sizes.maid2[0] * 0.625) / 2, 0, -holderSize[2]], cuboid({ size: [sizes.maid2[0] * 0.625, sizes.maid2[1], 0.0001] })),
          translate([sizes.maid2[0] / 2 - (sizes.maid2[0] * 0.25) / 2, 0, -0.00005], cuboid({ size: [sizes.maid2[0] * 0.25, sizes.maid2[1], 0.0001] })),
          translate([sizes.maid2[0] / 4, 0, -holderSize[2] / 2], cuboid({ size: [0.0001, sizes.maid2[1], holderSize[2] - wallSize] }))
        )
      )
    ),
    maid: translate(
      [
        -holderSize[0] / 2 + sizes.maid[0] / 2 + wallSize,
        holderSize[1] / 2 - sizes.th[1] - sizes.maid[1] / 2 - wallSize - row1distance,
        0, // TODO
      ],
      cuboid({ size: sizes.maid })
    ),
    hg: translate(
      [
        -holderSize[0] / 2 + sizes.maid[0] / 2 + wallSize,
        holderSize[1] / 2 - sizes.th[1] - sizes.maid[1] - sizes.hg[1] / 2 - wallSize - row1distance - row4distance,
        0,
      ],
      cuboid({ size: sizes.hg })
    ),
    prophet: translate(
      [-holderSize[0] / 2 + sizes.prophet[0] / 2 + wallSize, -holderSize[1] / 2 + sizes.prophet[1] / 2 + wallSize, 0],
      cuboid({ size: sizes.prophet })
    ),
    m: translate(
      [
        -holderSize[0] / 2 + sizes.prophet[0] + sizes.fury[0] / 2 + wallSize + col2distance,
        holderSize[1] / 2 - sizes.th[1] - sizes.maid[1] - sizes.m[1] / 2 - wallSize - row1distance - row4distance,
        0,
      ],
      cuboid({ size: sizes.hg })
    ),
    fury: translate(
      [-holderSize[0] / 2 + sizes.prophet[0] + sizes.fury[0] / 2 + wallSize + col2distance, -holderSize[1] / 2 + sizes.fury[1] / 2 + wallSize, 0],
      cuboid({ size: sizes.prophet })
    ),
    cara: translate(
      [
        -holderSize[0] / 2 + sizes.prophet[0] + sizes.fury[0] + sizes.cara[0] / 2 + wallSize + col2distance * 2,
        -holderSize[1] / 2 + sizes.fury[1] / 2 + wallSize,
        0,
      ],
      cuboid({ size: sizes.prophet })
    ),
    st: translate(
      [
        -holderSize[0] / 2 + sizes.hg[0] + sizes.m[0] + sizes.st[0] / 2 + wallSize + col2distance * 2,
        -holderSize[1] / 2 + sizes.st[1] / 2 + sizes.cara[1] + wallSize + row2distance,
        0,
      ],
      cuboid({ size: sizes.st })
    ),
    magnet1: translate([0, 0, -sizes.magnet.height / 2], cylinder({ radius: sizes.magnet.radius, height: sizes.magnet.height })),
    magnet2: translate([0, 0, +sizes.magnet.height / 2], cylinder({ radius: sizes.magnet.radius, height: sizes.magnet.height })),
  };

  if (showHolder && showCover) {
    return subtract(union(holder, cover), union(Object.values(cutouts)));
  }

  if (showHolder) {
    return subtract(holder, union(Object.values(cutouts)));
  }

  if (showCover) {
    return rotate([0,0,0], subtract(cover, union(Object.values(cutouts))));
  }

  return union(Object.values(cutouts));
};

module.exports = { main, getParameterDefinitions };
