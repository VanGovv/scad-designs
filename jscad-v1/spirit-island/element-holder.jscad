function main() {
  return elementHolder({});
}

/*-------------------------------------------------------------------------------------------------
    ------------------------ From here on: Touch with caution! ----------------------------------------
    -------------------------------------------------------------------------------------------------*/

function elementHolder({
  totalX = 67.5, // 6 * 11.25
  totalY = 53,
  totalZ = 49,
  energyD = 16.5,
  energyZ = 2.3,
  energyCount = 8,
  wallStrength = 1,
  floorStrength = 0.5,
  magnetD = 5.2,
  magnetH = 1.2,
}) {
  const x = totalX;
  const z = energyD / 2 + floorStrength;

  const block = cube([x, totalY, z]);

  const energyCutout = cylinder({ d: energyD, h: energyCount * energyZ })
    .rotateX(-90)
    .translate([energyD / 2 + wallStrength, wallStrength, z]);

  const fingerCutout = cylinder({ d: (energyD / 3) * 2, h: totalY })
    .rotateX(-90)
    .translate([energyD / 2 + wallStrength, 0, z]);

  let cutouts = [];
  let cutoutDistance = (x - wallStrength * 2 - energyD * 4) / 3;

  for (let j = 0; j < energyCount / 2; j++) {
    for (let i = 0; i < 2; i++) {
      cutouts.push(
        energyCutout.translate([
          j * (energyD + cutoutDistance),
          i * (totalY - 2 * wallStrength - energyCount * energyZ),
          0,
        ])
      );
    }
    cutouts.push(fingerCutout.translate([j * (energyD + cutoutDistance), 0, 0]));
  }

  const magnetCutout = cylinder({ d: magnetD, h: magnetH }).translate([0, totalY / 2, z - magnetH]);

  cutouts.push(magnetCutout.translate([energyD + cutoutDistance /2 + wallStrength, 0, 0]));
  cutouts.push(magnetCutout.translate([x - (energyD + cutoutDistance /2 + wallStrength), 0, 0]));

  return difference(block, union(cutouts));
}
