function main() {
  // adjust to your requirements. No value may be 0 or missing. Double check resulting model!
  // Changing setting outside of these is not necessary most of the time
  let config = {
    cardHeight: 93.5,
    cardWidth: 67,
    holderHeight: 52,
    count: 2,
    wallSize: 1.5
  };
  let coverConfig = {
    cardHeight: 94.5,
    cardWidth: 67.75,
    holderHeight: 52,
    count: 2,
    coverOverhang: 5,
  };
  let miniConfig = {
    cardHeight: 72,
    cardWidth: 47,
    holderHeight: 20,
    count: 1,
  };

  // return cardHolder(miniConfig)
  return cardHolderCover(miniConfig)


  // return union(cardHolder(config), cardHolderCover(coverConfig).translate([-1.25, -1.25, -1]));
}
/*-------------------------------------------------------------------------------------------------
  ------------------------ From here on: Touch with caution! ----------------------------------------
  -------------------------------------------------------------------------------------------------*/

function cardHolder({
  cardHeight,
  cardWidth,
  holderHeight,
  wallSize = 1,
  floorStrength = 1.5,
  count = 2,
  coverOverhang = 5,
}) {
  let upperCutout = difference(
    cube([
      holderHeight - coverOverhang,
      holderHeight - coverOverhang,
      cardWidth + 2 * wallSize,
    ]),
    cylinder({ r: holderHeight - coverOverhang, h: cardWidth + 2 * wallSize })
  )
    .rotateZ(180)
    .rotateY(90)
    .translate([0, holderHeight - coverOverhang, coverOverhang]);

  let single = difference(
    cube([cardWidth + wallSize * 2, cardHeight + wallSize * 2, holderHeight]),
    cube([
      cardWidth,
      cardHeight + wallSize,
      holderHeight - floorStrength,
    ]).translate([wallSize, 0, floorStrength]),
    fingerCutout(cardWidth, floorStrength).translate([cardWidth / 3, 0, 0]),
    upperCutout
  );

  let holder = [];

  for (let i = 0; i < count; i++) {
    holder.push(single.translate([(cardWidth + wallSize) * i, 0, 0]));
  }

  return union(...holder);
}

function cardHolderCover({
  cardHeight,
  cardWidth,
  holderHeight,
  wallSize = 1,
  floorStrength = 1.5,
  count = 2,
  coverOverhang = 5,
  clearance = 0.5,
}) {
  let coverWidth = (cardWidth + wallSize) * count + 3 * wallSize + clearance;

  let base = difference(
    cube([
      coverWidth,
      cardHeight + wallSize * 3 + clearance,
      holderHeight + wallSize,
    ]),
    cube([
      coverWidth - 2 * wallSize,
      cardHeight + wallSize * 2 + clearance,
      holderHeight,
    ]).translate([wallSize, 0, wallSize])
  ).translate([0, wallSize, 0]);

  base = union(
    base,
    cube([coverWidth, wallSize, coverOverhang + wallSize])
  );

  let cutouts = [];

  cutouts.push(
    upperCutout(holderHeight, coverWidth, coverOverhang).translate([
      0,
      wallSize,
      wallSize,
    ])
  );

  for (let i = 0; i < count; i++) {
    cutouts.push(
      fingerCutout(cardWidth, floorStrength).translate([
        cardWidth / 3 + i * (cardWidth + wallSize) + wallSize + clearance / 2,
        wallSize,
        0,
      ])
    );
    cutouts.push(
      cube([
        (2 * cardWidth) / 3,
        wallSize,
        coverOverhang + wallSize,
      ]).translate([
        cardWidth / 6 + wallSize + clearance / 2 + i * (cardWidth + wallSize),
        0,
        0,
      ])
    );
  }

  return difference(base, ...cutouts);
}

function fingerCutout(cardWidth, floorStrength) {
  return union(
    cube([cardWidth / 3, cardWidth / 6, floorStrength]),
    cylinder({ d: cardWidth / 3, h: floorStrength }).translate([
      cardWidth / 6,
      cardWidth / 6,
      0,
    ]),
    difference(
      cube([cardWidth / 6, cardWidth / 6, floorStrength]),
      cylinder({ r: cardWidth / 6, h: floorStrength }).translate([
        0,
        cardWidth / 6,
        0,
      ])
    ).translate([-cardWidth / 6, 0, 0]),
    difference(
      cube([cardWidth / 6, cardWidth / 6, floorStrength]),
      cylinder({ r: cardWidth / 6, h: floorStrength }).translate([
        cardWidth / 6,
        cardWidth / 6,
        0,
      ])
    ).translate([cardWidth / 3, 0, 0])
  );
}

function upperCutout(holderHeight, coverWidth, coverOverhang) {
  return difference(
    cube([
      holderHeight - coverOverhang,
      holderHeight - coverOverhang,
      coverWidth,
    ]),
    cylinder({ r: holderHeight - coverOverhang, h: coverWidth })
  )
    .rotateZ(180)
    .rotateY(90)
    .translate([0, holderHeight - coverOverhang, coverOverhang]);
}
