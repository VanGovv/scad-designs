function main() {

  const configs = {
    energy: () =>
      bitHolder({
        x: 67.5,
        y: 83, //153,
        z: 30.5,
        magnetD: 5.2,
        magnetH: 1.1,
        innerBevel: 10,
        compartments: [1, 1],
        xRelatives: [3, 2],
        magnetExclude: ["b"],
      }),

    energyCover: () =>
      bitHolder({
        x: 67.5,
        y: 83, //153,
        z: 1.5,
        magnetD: 5.2,
        magnetH: 1.1,
        innerBevel: 1,
        compartments: [1, 1],
        xRelatives: [3, 2],
        magnetExclude: ["b"],
      }),

    szenario: () =>
      difference(
        bitHolder({
          x: 114,
          y: 162, //153,
          z: 22.5,
          magnetD: 5.2,
          magnetH: 1.1,
          innerBevel: 10,
          compartments: [2, 1],
          xRelatives: [52, 48],
          magnetExclude: ["b"],
        }),
        beveledCube([102.5, 154, 8.5], 4, { exclude: ["t", "b"] }).translate([5.75, 4, 15])
      ),

    szenarioCover: () =>
      difference(
        bitHolder({
          x: 114,
          y: 162, //153,
          z: 1.5,
          magnetD: 5.2,
          magnetH: 1.1,
          innerBevel: 1,
          floorStrength: 1,
          compartments: 1,
          magnetExclude: ["b"],
        }),
        beveledCube([83, 133.5, 2.5], 5, { exclude: ["t", "b"] }).translate([15.5, 14.25, 0]),
        beveledCube([103, 153.5, 0.5], 4, { exclude: ["t", "b"] }).translate([5.5, 4.25, 1])
      ),

    special: () =>
      bitHolder({
        x: 114,
        y: 162, //153,
        z: 22.5,
        magnetD: 5.2,
        magnetH: 1.1,
        innerBevel: 5,
        compartments: [1, 1, 1, 1, 1],
        magnetExclude: ["b"],
      }),

    specialCover: () =>
      bitHolder({
        x: 114,
        y: 162, //153,
        z: 1.5,
        magnetD: 5.2,
        magnetH: 1.1,
        innerBevel: 1,
        compartments: [1, 1, 1, 1, 1],
        magnetExclude: ["b"],
      }),

    humans: () =>
      bitHolder({
        x: 162,
        y: 146,
        z: 38.5,
        magnetD: 5.2,
        magnetH: 1.1,
        innerBevel: 12,
        compartments: [
          [1, 1],
          [5, 9],
        ],
        xRelatives: [3, 4],
        magnetExclude: ["b"],
      }),

    humansCover: () =>
      bitHolder({
        x: 162,
        y: 146,
        z: 1.5,
        magnetD: 5.2,
        magnetH: 1.1,
        innerBevel: 1,
        compartments: [
          [1, 1],
          [5, 9],
        ],
        xRelatives: [3, 4],
        magnetExclude: ["b"],
      }),

    fearBlight: () =>
      bitHolder({
        x: 135,
        y: 53,
        z: 39.5,
        magnetD: 5.2,
        magnetH: 1.1,
        innerBevel: 10,
        compartments: [[6, 4]],
        xRelatives: [1],
        magnetExclude: ["b"],
      }),

    fearBlightCover: () =>
      bitHolder({
        x: 135,
        y: 53,
        z: 1.5,
        magnetD: 5.2,
        magnetH: 1.1,
        innerBevel: 1,
        compartments: [[7, 3]],
        xRelatives: [1],
        magnetExclude: ["b"],
      }),
  };

  return configs.specialCover();
}

/*-------------------------------------------------------------------------------------------------
------------------------ From here on: Touch with caution! ----------------------------------------
-------------------------------------------------------------------------------------------------*/

function bitHolder({
  x,
  y,
  z,
  magnetD = 0,
  magnetH = 0,
  wallStrength = 1,
  floorStrength = 1,
  innerBevel = 0,
  outerBevel = 0,
  compartments = [1, 1],
  xRelatives,
  magnetExclude = [],
}) {
  outerBevel = Math.min(outerBevel, innerBevel, magnetD / 2 + wallStrength);

  let { c, bevels } = beveledCube([x, y, z], outerBevel, { exclude: ["t"], getBevels: true });

  const cutouts = [];

  const sum = (accumulator, currentValue) => accumulator + currentValue;
  const xCompCount = compartments.length;
  const xRelativeSum = xRelatives ? xRelatives.reduce(sum) : compartments.length;
  for (let xi = 0; xi < xCompCount; xi++) {
    const yCompCount = compartments[xi].length || compartments[xi];
    const yRelativeSum = compartments[xi].length ? compartments[xi].reduce(sum) : compartments[xi];
    for (let yi = 0; yi < yCompCount; yi++) {
      const xCurrentRelative = xRelatives ? xRelatives[xi] : 1;
      const yCurrentRelative = compartments[xi].length ? compartments[xi][yi] : 1;

      const xTrans = xRelatives ? (xi > 0 ? xRelatives.slice(0, xi).reduce(sum) : 0) : xi;
      const yTrans = compartments[xi].length ? (yi > 0 ? compartments[xi].slice(0, yi).reduce(sum) : 0) : yi;

      const xBase = (y - wallStrength * (1 + xCompCount)) / xRelativeSum;
      const yBase = (x - wallStrength * (1 + yCompCount)) / yRelativeSum;
      const xSize = ((y - wallStrength * (1 + xCompCount)) * xCurrentRelative) / xRelativeSum;
      const ySize = ((x - wallStrength * (1 + yCompCount)) * yCurrentRelative) / yRelativeSum;
      const cutoutSize = [ySize, xSize, z - floorStrength];
      cutouts.push(
        beveledCube(cutoutSize, innerBevel.length ? innerBevel[xi][yi] : innerBevel, { exclude: ["t"] }).translate([
          wallStrength + yBase * yTrans + wallStrength * yi,
          wallStrength + xBase * xTrans + wallStrength * xi,
          floorStrength,
        ])
      );
    }
  }

  c = difference(c, ...cutouts);

  const magnetCutouts = [];
  const magnetColumns = [];

  if (magnetD) {
    const magnetCutout = cylinder({ d: magnetD, h: magnetH });

    const magnetOffset = wallStrength + magnetD;
    if (!magnetExclude.includes("t")) {
      magnetCutouts.push(magnetCutout.translate([magnetOffset / 2, magnetOffset / 2, z - magnetH]));
      magnetCutouts.push(magnetCutout.translate([x - magnetOffset / 2, magnetOffset / 2, z - magnetH]));
      magnetCutouts.push(magnetCutout.translate([magnetOffset / 2, y - magnetOffset / 2, z - magnetH]));
      magnetCutouts.push(magnetCutout.translate([x - magnetOffset / 2, y - magnetOffset / 2, z - magnetH]));
    }
    if (!magnetExclude.includes("b")) {
      magnetCutouts.push(magnetCutout.translate([magnetOffset / 2, magnetOffset / 2, 0]));
      magnetCutouts.push(magnetCutout.translate([x - magnetOffset / 2, magnetOffset / 2, 0]));
      magnetCutouts.push(magnetCutout.translate([magnetOffset / 2, y - magnetOffset / 2, 0]));
      magnetCutouts.push(magnetCutout.translate([x - magnetOffset / 2, y - magnetOffset / 2, 0]));
    }
    const columnSize = magnetD + wallStrength * 2;
    const magnetColumn = (include) => beveledCube([columnSize, columnSize, z], magnetD / 2 + wallStrength, { include });

    magnetColumns.push(magnetColumn("nw"));
    magnetColumns.push(magnetColumn("sw").translate([x - magnetD - 2 * wallStrength, 0, 0]));
    magnetColumns.push(magnetColumn("se").translate([x - magnetD - 2 * wallStrength, y - magnetD - 2 * wallStrength, 0]));
    magnetColumns.push(magnetColumn("ne").translate([0, y - magnetD - 2 * wallStrength, 0]));
  }

  const holder = difference(union(c, ...magnetColumns), ...magnetCutouts, ...bevels);

  return union(holder);
}

function beveledCube(
  dimensions,
  r,
  { exclude = [], include = ["tw", "tn", "ts", "te", "bw", "bn", "bs", "be", "nw", "ne", "sw", "se"], getBevels = false } = {}
) {
  const [x, y, z] = dimensions;

  exclude.forEach((e) => {
    include = include.filter((x) => !x.includes(e));
  });

  const bevels = [];

  if (r) {
    if (include.includes("nw"))
      bevels.push(
        bevel(z, r)
          .rotateZ(0)
          .translate([x - r, y - r, 0])
      );
    if (include.includes("sw"))
      bevels.push(
        bevel(z, r)
          .rotateZ(90)
          .translate([r, y - r, 0])
      );
    if (include.includes("se")) bevels.push(bevel(z, r).rotateZ(180).translate([r, r, 0]));
    if (include.includes("ne"))
      bevels.push(
        bevel(z, r)
          .rotateZ(270)
          .translate([x - r, r, 0])
      );

    if (include.includes("bs")) bevels.push(bevel(y, r).rotateX(0).rotateY(90).rotateZ(90).translate([r, 0, r]));
    if (include.includes("bn"))
      bevels.push(
        bevel(y, r)
          .rotateX(0)
          .rotateY(90)
          .rotateZ(270)
          .translate([x - r, y, r])
      );
    if (include.includes("be")) bevels.push(bevel(x, r).rotateX(0).rotateY(90).rotateZ(180).translate([x, r, r]));
    if (include.includes("bw"))
      bevels.push(
        bevel(x, r)
          .rotateX(0)
          .rotateY(90)
          .rotateZ(0)
          .translate([0, y - r, r])
      );

    if (include.includes("tw"))
      bevels.push(
        bevel(x, r)
          .rotateX(0)
          .rotateY(-90)
          .rotateZ(0)
          .translate([x, y - r, z - r])
      );
    if (include.includes("tn"))
      bevels.push(
        bevel(y, r)
          .rotateX(90)
          .rotateY(0)
          .rotateZ(0)
          .translate([x - r, y, z - r])
      );
    if (include.includes("te"))
      bevels.push(
        bevel(x, r)
          .rotateX(90)
          .rotateY(0)
          .rotateZ(-90)
          .translate([x, r, z - r])
      );
    if (include.includes("ts"))
      bevels.push(
        bevel(y, r)
          .rotateX(0)
          .rotateY(-90)
          .rotateZ(90)
          .translate([r, y, z - r])
      );
  }

  const c = difference(cube([x, y, z]), ...bevels);

  return getBevels ? { c, bevels } : c;
}

function bevel(h, r) {
  return difference(cube([r, r, h]), cylinder({ r, h }));
}
