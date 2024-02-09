function main() {
  // adjust to your requirements. No value may be 0 or missing. Double check resulting model!
  // Changing setting outside of these is not necessary most of the time
  let bigCards = {
    cardHeight: 93.5,
    cardWidth: 66.5,
    holderLength: 32,
    count: 1,
    floorStrength: 1,
  };
  let smallCards = {
    cardHeight: 72,
    cardWidth: 47,
    holderLength: 32,
    count: 1,
    floorStrength: 1,
  };

  return cardHolder2(smallCards)
}
/*-------------------------------------------------------------------------------------------------
  ------------------------ From here on: Touch with caution! ----------------------------------------
  -------------------------------------------------------------------------------------------------*/

function cardHolder2({
  cardHeight,
  cardWidth,
  holderLength,
  wallStrength = 1.5,
  floorStrength = 1.5,
}) {

  const holder = cube([holderLength, cardHeight + 2 * wallStrength, cardWidth + floorStrength])

  const cutouts = [];

  cutouts.push(
    cube([holderLength - 2 * wallStrength, cardHeight, cardWidth])
      .translate([wallStrength, wallStrength, floorStrength])
  )

  cutouts.push(
    fingerCutout(cardHeight, holderLength)
      .translate([0, cardHeight / 6 * 4 + wallStrength, cardWidth + 2 * wallStrength])
  )

  return difference(holder, ...cutouts)
  }

function fingerCutout(cardWidth, holderLength) {
  return union(
    cube([cardWidth / 3, cardWidth / 6, holderLength]),
    cylinder({ d: cardWidth / 3, h: holderLength }).translate([cardWidth / 6, cardWidth / 6, 0]),
    difference(
      cube([cardWidth / 6, cardWidth / 6, holderLength]),
      cylinder({ r: cardWidth / 6, h: holderLength }).translate([0, cardWidth / 6, 0])
    ).translate([-cardWidth / 6, 0, 0]),
    difference(
      cube([cardWidth / 6, cardWidth / 6, holderLength]),
      cylinder({ r: cardWidth / 6, h: holderLength }).translate([cardWidth / 6, cardWidth / 6, 0])
    ).translate([cardWidth / 3, 0, 0])
  ).rotateZ(-90).rotateY(90);
}