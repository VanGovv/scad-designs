function main() {
  let config = {
    holderHeight: 66,
    holderWidth: 66,
    stackHeight: 5,
  };

  return cardStand(config);
}
/*-------------------------------------------------------------------------------------------------
  ------------------------ From here on: Touch with caution! ----------------------------------------
  -------------------------------------------------------------------------------------------------*/

function cardStand({
  holderHeight,
  holderWidth,
  stackHeight,
  tiltDegree = 10,
  wallSize = 1,
  floorStrenth = 1,
  standPosition = 10,
}) {
  let cardStand = cube({ size: [holderWidth, holderHeight, floorStrenth] });

  cardStand = union(
    cardStand,
    cube({ size: [holderWidth, wallSize, stackHeight] }).translate([
      0,
      0,
      floorStrenth,
    ])
  );

  cardStand = difference(
    cardStand,
    cube({ size: [holderWidth / 2, wallSize, wallSize] }).translate([
      holderWidth / 4,
      holderHeight - standPosition,
      0,
    ])
  );

  const tiltRad = tiltDegree * (Math.PI / 180);
  const standHeight = Math.sin(tiltRad) * (holderHeight - standPosition);

  let stand = cube({
    size: [(3 * holderWidth) / 4, standHeight, wallSize],
  });

  stand = union(
    stand,
    cube({ size: [holderWidth / 2 - 1, wallSize, wallSize - 0.25] }).translate([
      holderWidth / 8 + 1 / 2,
      -wallSize,
      0,
    ])
  );

  stand = difference(
    stand,
    cube({
      size: [(3 * holderWidth) / 4, wallSize * 2, wallSize * 2],
    })
      .rotateX(tiltDegree)
      .translate([0, standHeight, 0])
  );
  stand = stand.translate([0, -standHeight - 5, 0]);

  return [cardStand, stand];
}
