function main() {
  // adjust to your requirements. No value may be 0 or missing. Double check resulting model!
  // Changing setting outside of these is not necessary most of the time
  let config = {
    cardHeight: 91.5,
    cardWidth: 60.5,
    holderLength: 205, // Total 286, 205, 81
    holderHeight: 51.5,
    cutFloor: false,
  };

  return cardHolder2(config);
  // return seperator(config);
  // return cardHolder(config);
}
/*-------------------------------------------------------------------------------------------------
  ------------------------ From here on: Touch with caution! ----------------------------------------
  -------------------------------------------------------------------------------------------------*/

function cardHolder({
  cardHeight,
  cardWidth,
  holderLength,
  holderHeight,
  wallSize = 1,
  floorStrenth = 1.5,
  cutoutDistance = 15,
  cutFloor = false,
}) {
  // probably no need to change

  let cutoutTiltDegree = Math.acos(holderHeight / cardWidth) * (180 / Math.PI);

  const cutout = (pos) =>
    cube([wallSize, cardHeight + wallSize * 2, -holderHeight * 0.5 + floorStrenth])
      .rotateY(-cutoutTiltDegree)
      .translate([pos, 0, holderHeight + floorStrenth]);

  const floor = () => {
    let floor = cube([holderLength - wallSize * 2, cardHeight, floorStrenth]);
    floorCutouts = [];
    if (cutFloor) {
      for (let i = 0; i < holderLength - wallSize * 2; i++) {
        floorCutouts.push(
          cube([floorStrenth / 2, cardHeight, floorStrenth / 2])
            .rotateY(45)
            .translate([i, 0, floorStrenth])
        );
      }
    }
    return difference(floor, ...floorCutouts).translate([wallSize, wallSize, 0]);
  };

  let holder = union(
    difference(
      cube([holderLength, cardHeight + wallSize * 2, holderHeight + floorStrenth]),
      cube([holderLength - wallSize * 2, cardHeight, holderHeight + floorStrenth]).translate([
        wallSize,
        wallSize,
      ])
    ),
    floor()
  );

  let cutouts = [];

  for (let i = wallSize; i < holderLength - cutoutDistance; i = i + cutoutDistance) {
    cutouts.push(cutout(i));
  }

  return difference(holder, ...cutouts).translate([-holderLength / 2, -cardHeight / 2, 0]);
}

function seperator({ cardHeight, cardWidth, wallSize = 1, clearance = 0.25, offset = 12 }) {
  let seperator = difference(
    cube([cardWidth, cardHeight + 2 * wallSize, wallSize - clearance]),
    cube([cardWidth * 0.4, wallSize + clearance, wallSize - clearance]),
    cube([cardWidth * 0.4, wallSize + clearance, wallSize - clearance]).translate([
      0,
      cardHeight + wallSize - clearance,
      0,
    ]),
    linear_extrude(
      { height: wallSize },
      polygon([
        [offset, offset],
        [cardWidth - offset, offset],
        [cardWidth / 2, (cardHeight - offset) / 2],
      ])
    ),
    linear_extrude(
      { height: wallSize },
      polygon([
        [cardWidth - offset, cardHeight - offset],
        [offset, cardHeight - offset],
        [cardWidth / 2, (cardHeight + offset) / 2],
      ])
    ),
    linear_extrude(
      { height: wallSize },
      polygon([
        [offset, 2 * offset],
        [offset, cardHeight - 2 * offset],
        [(cardWidth - offset) / 2, cardHeight / 2],
      ])
    ),
    linear_extrude(
      { height: wallSize },
      polygon([
        [cardWidth - offset, cardHeight - 2 * offset],
        [cardWidth - offset, 2 * offset],
        [(cardWidth + offset) / 2, cardHeight / 2],
      ])
    )
  );

  return seperator;
}
