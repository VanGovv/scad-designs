function main() {
  // adjust to your requirements. No value may be 0 or missing. Double check resulting model!
  // Changing setting outside of these is not necessary most of the time
  let config = {
    markerRadius: 9,
    markerHeight: 140,
    magnetRadius: 5,
    magnetHeight: 2,
    count: 6,
  };

  return markerHolder(config);
}
/*-------------------------------------------------------------------------------------------------
------------------------ From here on: Touch with caution! ----------------------------------------
-------------------------------------------------------------------------------------------------*/

/**
 * Returns a complete marker holder object. can be exported immediately.
 *
 * @param config Configuration for the marker holder
 * @param config.markerRadius radius of the marker in mm
 * @param config.markerHeight height/length of the marker in mm
 * @param config.magnetRadius radius of the magnet you intent to use in mm
 * @param config.magnetHeight height/thickness of the magnet you intent to use
 * @param config.count number of marker slots
 * @param config.tiltDegree `[default: 5]`  tilt between whiteboard and markers in degree (not radians)
 * @param config.floorStrenth `[default: 1]`  thickness of the holders floor in mm
 * @param config.wallSize `[default: 1]`  Thickness of the holder walls in mm
 * @param config.markerClearance `[default: 0.25]`  Additional space to ease inserting markers
 * @param config.magnetClearance`[default: 0.1]`  Additional space for inserting magnets (default results in a very tight fit -> no glue required)
 * @param config.holderHeight`[default: markerHeight/3]`  Height of the holder. Default should be a good fit for most applications.
 */
function markerHolder({
  markerRadius,
  markerHeight,
  magnetRadius,
  magnetHeight,
  count,
  tiltDegree = 5,
  wallSize = 1,
  floorStrenth = 1,
  markerClearance = 0.25,
  magnetClearance = 0.1,
  holderHeight = markerHeight / 3,
}) {
  // probably no need to change

  // calculated variables - don't touch
  markerRadius = markerRadius + markerClearance;
  magnetRadius = magnetRadius + magnetClearance;
  const holderRadius = markerRadius + wallSize;

  let allHolders = [];

  let markerHolder;

  // outer cylinder
  markerHolder = cylinder({ r: holderRadius, h: holderHeight });

  // cutout for inserting markers
  markerHolder = difference(
    markerHolder,
    cylinder({
      r: holderRadius * Math.sqrt(1),
      h: holderRadius * 2,
    })
      .scale([1.4, 1.2, 1])
      .rotateY(90)
      .translate([-holderRadius, -holderRadius, holderHeight])
  );

  // magnet holder / wall mount
  const rad = tiltDegree * (Math.PI / 180);
  const z = magnetHeight / Math.sin(rad) + magnetRadius * 2 + wallSize;
  const y = z * Math.tan(rad);
  const h = z / Math.cos(rad);

  const wallMount = difference(
    cube({ size: [holderRadius * 2, -y, z] }),
    cylinder({ r: magnetRadius, h: magnetHeight })
      .rotateX(90)
      .translate([holderRadius, 0, z - magnetRadius - wallSize])
  )
    .rotateX(-tiltDegree)
    .translate([-holderRadius, holderRadius, 0]);

  markerHolder = union(markerHolder, wallMount);

  // straight part of the cylinder for attaching the magnet holder
  markerHolder = union(
    markerHolder,
    cube({ size: [holderRadius * 2, holderRadius, h] }).translate([-holderRadius, 0, 0])
  );

  // remove inner cylinder
  markerHolder = difference(
    markerHolder,
    cylinder({ r: markerRadius, h: markerHeight })
      .translate([0, 0, floorStrenth])
      .setColor([1, 1, 1])
  );

  // multiply according to parameter *count*
  for (let i = 0; i < count; i++) {
    allHolders.push(markerHolder.translate([i * (holderRadius - wallSize / 2) * 2, 0, 0]));
  }

  return allHolders;
}
