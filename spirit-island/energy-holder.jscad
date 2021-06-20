function main() {
  return energyHolder({});
}

/*-------------------------------------------------------------------------------------------------
    ------------------------ From here on: Touch with caution! ----------------------------------------
    -------------------------------------------------------------------------------------------------*/

function energyHolder({
  totalX = 160,
  totalY = 54.5,
  totalZ = 49,
  energyD = 16.2,
  energyZ = 2.3,
  energyCount = 8,
  reminderD = 20.5,
  wallStrength = 2,
  floorStrength = 2,
  magnetD = 5,
  magnetH = 1
}) {
const x = totalX / 2; 
  const z = (totalZ - (reminderD / 2 + floorStrength) * 2) / 2;

  const block = cube([x, totalY, z]);

  const energyCutout = cylinder({d: energyD, h: energyCount * energyZ}).rotateX(-90).translate([energyD / 2 + wallStrength,wallStrength,z])

  const fingerCutout = cylinder({d: energyD / 3 * 2, h: totalY }).rotateX(-90).translate([energyD / 2 + wallStrength,0,z])

  
  let cutouts = []
  let cutoutDistance = (x - wallStrength * 2 - energyD * 4) / 3
    
  for (let j = 0;  j<energyCount / 2; j++ ) {
    for (let i = 0;  i<2; i++ ) {
      cutouts.push(energyCutout.translate([j * (energyD + cutoutDistance), i * (totalY - 2 * wallStrength - energyCount * energyZ), 0]))
    }
    cutouts.push(fingerCutout.translate([j * (energyD + cutoutDistance), 0, 0]))
  }
  
  const magnetCutout = cylinder({d: magnetD + .2, h: magnetH + .1}).translate([x / 4, totalY / 2, z - magnetH - .1])

  for (let i = 0;  i<3; i++ ) {
    cutouts.push(magnetCutout.translate([x / 4 * i,0,0]))
  }


  return difference(block, union(cutouts));
}
