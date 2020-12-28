function main() {
  // adjust to your requirements. No value may be 0 or missing. Double check resulting model!
  // Changing setting outside of these is not necessary most of the time
  let config = {
    height: 100,
    width: 90,
    depth: 25,
    wallStrength: 1.5,
    floorStrength: 3,
  };

  return scissorHolder(config);
}
/*-------------------------------------------------------------------------------------------------
------------------------ From here on: Touch with caution! ----------------------------------------
-------------------------------------------------------------------------------------------------*/

/**
 * Returns a complete marker holder object. can be exported immediately.
 *
 */
function scissorHolder({ height, width, depth, wallStrength, floorStrength }) {
  return difference(
    roundedCube(height, width, depth),
    intersection(
      roundedCube(
        height - floorStrength,
        width - 2 * wallStrength,
        depth - 2 * wallStrength
      ),
      cube({ size: [width * 0.5 - wallStrength * 0.5, depth, height] })
    ).translate([wallStrength, wallStrength, floorStrength]),
    intersection(
      roundedCube(
        height - floorStrength,
        width - 2 * wallStrength,
        depth - 2 * wallStrength
      ),
      cube({ size: [(width - wallStrength) * 0.5, depth, height] }).translate([
        (width + wallStrength) * 0.5,
        0,
        0,
      ])
    ).translate([wallStrength, wallStrength, floorStrength])
  );
}

function roundedCube(height, width, depth) {
  return union(
    intersection(
      cylinder({ r: depth, h: height }).translate([depth, depth, 0]),
      cube({ size: [depth, depth, height] })
    ),
    intersection(
      cylinder({ r: depth, h: height }).translate([depth, depth, 0]),
      cube({ size: [depth, depth, height] }).translate([depth, 0, 0])
    ).translate([width - 2 * depth, 0, 0]),
    cube({ size: [width - 2 * depth, depth, height] }).translate([depth, 0, 0])
  );
}
