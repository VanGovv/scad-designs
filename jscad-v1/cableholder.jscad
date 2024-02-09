function main() {
  // adjust to your requirements. No value may be 0 or missing. Double check resulting model!
  // Changing setting outside of these is not necessary most of the time
  let config = {
    tableStrength: 15.5,
    cableStrength: 6,
    count: 12,
  };

  return cableHolder(config);
}
/*-------------------------------------------------------------------------------------------------
------------------------ From here on: Touch with caution! ----------------------------------------
-------------------------------------------------------------------------------------------------*/

function cableHolder({
  tableStrength,
  cableStrength,
  count,
  overlap = 15,
  wallStrength = 1,
  holderStrength = 6,
}) {
  let holder = difference(
    cube([
      holderStrength + cableStrength,
      overlap + cableStrength,
      tableStrength + 2 * wallStrength,
    ]),
    cube([holderStrength + cableStrength, overlap, tableStrength]).translate([0, 0, wallStrength]),
    cube([cableStrength, cableStrength, tableStrength + 2 * wallStrength]).translate([
      holderStrength / 2,
      overlap,
      0,
    ])
  ).rotateX(-90).translate([0,0,overlap + cableStrength]);
  let cableHolder = [];
  for (let i = 0; i < count; i++) {
    cableHolder.push(holder.translate([i * (holderStrength+ cableStrength), 0, 0]));
  }

  return cableHolder;
}
