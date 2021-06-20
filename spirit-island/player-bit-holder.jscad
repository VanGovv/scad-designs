function main() {
  return playerBitHolder({});
}

/*-------------------------------------------------------------------------------------------------
  ------------------------ From here on: Touch with caution! ----------------------------------------
  -------------------------------------------------------------------------------------------------*/

function playerBitHolder({
  totalX = 160,
  totalY = 54.5,
  totalZ = 49,
  influenceD = 15,
  influenceZ = 2.9,
  influenceCount = 14,
  influenceRecess = 1.5,
  reminderD = 21.5,
  reminderZ = 2.4,
  remindercount = 6,
  wallStrength = 1,
  floorStrength = 2,
  magnetD = 2,
  magnetH = 1
}) {
  const x = totalX / 6;
  const y = totalY;
  const z = reminderD / 2 + floorStrength;

  const box = cube([x, y, z]);

  const influenceCutout = cylinder({ d: influenceD, h: x - 2 * wallStrength })
    .rotateY(90)
    .translate([wallStrength, 0, influenceD - floorStrength-influenceRecess]);

  const influenceCutout1 = influenceCutout.translate([0, influenceD / 2 + wallStrength, 0]);

  const influenceCutout2 = influenceCutout1.translate([0, influenceD, 0]);

  const influenceCutoutConnection = cube([x - 2 * wallStrength, 2 * influenceD, influenceRecess*2]).translate([
    wallStrength,
    wallStrength,
    z - influenceRecess*2,
  ]);

  const reminderCutout = cylinder({ d: reminderD, h: 3 * reminderZ })
    .rotateY(90)
    .translate([wallStrength, y - wallStrength - reminderD / 2, influenceD - floorStrength]);

  const reminderFingerCutout = cylinder({ d: reminderD / 3 * 2, h: x })
  .rotateY(90)
  .translate([0, 0, reminderD /3 * 2 - wallStrength]);

  const finalReminderCutout = union(
    reminderCutout.translate([(x - 2 * wallStrength - 6 * reminderZ) / 4 ,0,0]),
    reminderCutout.translate([(x - 2 * wallStrength - 6 * reminderZ) / 4 * 3 + 3 *reminderZ ,0,0]),
    reminderFingerCutout.translate([0, y - wallStrength - reminderD / 2, 0])
  );

  const magnetCutout = cylinder({ d: magnetD + .2, h: magnetH + .1 }).translate([x/2,0, z - (magnetH + .1)])

  const magnetCutout1 = magnetCutout.translate([0, y - wallStrength - magnetD/2, 0])
  const magnetCutout2 = magnetCutout.translate([0, y - reminderD , 0])

  // return magnetCutout2

  return difference(
    box,
    influenceCutout1,
    influenceCutout2,
    influenceCutoutConnection,
    finalReminderCutout,
    magnetCutout1,
    magnetCutout2
  );
}
